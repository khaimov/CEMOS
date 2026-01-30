"use server";

import { adminDb } from "@/lib/firebase-admin";
import { INITIAL_SKILLS, INITIAL_TEAM, TeamMember } from "@/lib/talent-data";
import { FieldValue } from "firebase-admin/firestore";

// Re-defining interface here to avoid client imports in server file if needed, 
// but we can import constants if they are pure data. 
// Ideally INITIAL_SKILLS should be in a shared 'lib/constants' file.
// For now I'll trust the import works or duplicate simpler versions.

export async function seedTalentData() {
  try {
    const batch = adminDb.batch();

    // 1. Seed Skills
    const skillIdMap: Record<string, string> = {};
    for (const skill of INITIAL_SKILLS) {
      // Auto-generate ID or use name-based for consistency
      const docRef = adminDb.collection("skills").doc();
      skillIdMap[skill.name] = docRef.id;
      batch.set(docRef, skill);
    }

    // 2. Seed Team
    for (const member of INITIAL_TEAM) {
      // We need to map domain names to the new Skill IDs
      const skillsWithIds: Record<string, number> = {};

      member.domains.forEach(domain => {
        // Find skill def
        const matchedSkill = INITIAL_SKILLS.find(s => s.name === domain || s.category === domain);
        if (matchedSkill && skillIdMap[matchedSkill.name]) {
          skillsWithIds[skillIdMap[matchedSkill.name]] = 3; // Default level
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { domains, ...rest } = member;
      const memberRef = adminDb.collection("team_members").doc();

      batch.set(memberRef, {
        ...rest,
        skills: skillsWithIds
      });
    }

    await batch.commit();
    return { success: true, message: "Seeded successfully via Admin SDK" };
  } catch (error: any) {
    console.error("Admin Seed Error:", error);
    return { success: false, error: error.message };
  }
}

export async function resetTalentData() {
  try {
    const batch = adminDb.batch();

    // Delete all skills
    const skills = await adminDb.collection("skills").listDocuments();
    skills.forEach(doc => batch.delete(doc));

    // Delete all team members
    const team = await adminDb.collection("team_members").listDocuments();
    team.forEach(doc => batch.delete(doc));

    await batch.commit();

    // Auto-seed after reset
    return await seedTalentData();
  } catch (error: any) {
    console.error("Admin Reset Error:", error);
    return { success: false, error: error.message };
  }
}

export async function addToTeam(data: any) {
  try {
    const batch = adminDb.batch();
    const skillsCollection = adminDb.collection("skills");
    const membersCollection = adminDb.collection("team_members");

    // 1. Get existing skills to map IDs
    const existingSkillsSnap = await skillsCollection.get();
    const skillMap = new Map<string, string>(); // Name -> ID

    existingSkillsSnap.docs.forEach(doc => {
      const s = doc.data();
      skillMap.set(s.name.toLowerCase(), doc.id);
    });

    const finalSkills: Record<string, number> = {};

    // 2. Process incoming skills
    if (data.skills) {
      for (const [skillName, level] of Object.entries(data.skills)) {
        const normalizedName = skillName.trim();
        const lowerName = normalizedName.toLowerCase();

        let skillId = skillMap.get(lowerName);

        if (!skillId) {
          // Create new skill
          const newSkillRef = skillsCollection.doc();
          skillId = newSkillRef.id;

          // Infer category/icon (AI fallback)
          const isAI = /ai|gpt|llm|neural|vision/i.test(normalizedName);
          const isData = /data|sql|database|analytics/i.test(normalizedName);
          const isCloud = /cloud|aws|gcp|azure/i.test(normalizedName);

          batch.set(newSkillRef, {
            id: skillId,
            name: normalizedName,
            category: isAI ? "AI" : isData ? "Data" : isCloud ? "Infra" : "Other",
            iconName: isAI ? "Brain" : isData ? "Database" : "Code",
            demand: 0.5, // Default demand
          });

          skillMap.set(lowerName, skillId);
        }

        finalSkills[skillId] = Number(level) || 1;
      }
    }

    // 3. Check for existing Team Member
    let memberRef;
    let existingData: any = {};
    let isMerge = false;

    // A. Try explicit ID match first (if provided)
    if (data.id) {
      const docSnap = await membersCollection.doc(data.id).get();
      if (docSnap.exists) {
        memberRef = docSnap.ref;
        existingData = docSnap.data();
        isMerge = true;
        console.log(`Updating profile by ID: ${data.id}`);
      }
    }

    // B. Fallback to Name Search if no ID or ID not found
    if (!memberRef) {
      const normalizedName = data.name?.trim() || "Unknown Agent";
      const existingMemberSnap = await membersCollection.where("name", "==", normalizedName).limit(1).get();

      if (!existingMemberSnap.empty) {
        // Merge
        const doc = existingMemberSnap.docs[0];
        memberRef = doc.ref;
        existingData = doc.data();
        isMerge = true;
        console.log(`Merging profile data for: ${normalizedName}`);
      } else {
        // Create New
        memberRef = membersCollection.doc();
        console.log(`Creating new profile for: ${normalizedName}`);
      }
    }

    const normalizedName = data.name?.trim() || existingData.name || "Unknown Agent";

    // Merge Arrays (Deduplicate)
    const mergeArrays = (arr1: string[] = [], arr2: string[] = []) => {
      return Array.from(new Set([...arr1, ...arr2]));
    };

    // Merge Skills (Max Level)
    const mergedSkills = { ...(existingData.skills || {}) };
    for (const [sId, lvl] of Object.entries(finalSkills)) {
      if (!mergedSkills[sId] || (lvl as number) > mergedSkills[sId]) {
        mergedSkills[sId] = lvl;
      }
    }

    const newMember: TeamMember = {
      id: memberRef.id, // Keep existing ID if merge
      name: normalizedName,
      role: data.role || existingData.role || "Specialist",
      location: existingData.location || "Remote",
      ldap: existingData.ldap || (normalizedName.toLowerCase().replace(/\s/g, '') || "unknown").substring(0, 8),
      skills: mergedSkills,
      domains: mergeArrays(existingData.domains || [], Object.keys(data.skills || {})),
      languages: mergeArrays(existingData.languages || [], data.languages || []),
      education: mergeArrays(existingData.education || [], data.education || []),
      experience: mergeArrays(existingData.experience || [], data.experience || []),
      certifications: mergeArrays(existingData.certifications || [], data.certifications || []),
      outsideInterests: mergeArrays(existingData.outsideInterests || [], data.outsideInterests || []),
      linkedInUrl: data.linkedInUrl || existingData.linkedInUrl || "",
      imageUrl: data.imageUrl || existingData.imageUrl || "",
      startDate: data.startDate || existingData.startDate || "",
    };

    batch.set(memberRef, newMember, { merge: true });

    await batch.commit();
    return { success: true, message: isMerge ? "Profile merged successfully" : "Member added successfully" };

  } catch (error: any) {
    console.error("Add/Merge Team Member Error:", error);
    return { success: false, error: error.message };
  }
}

// New: Deduplication Utility
export async function deduplicateTeam() {
  try {
    const snapshot = await adminDb.collection("team_members").get();
    const members = snapshot.docs.map(doc => doc.data());
    const batch = adminDb.batch();

    const seenNames = new Map<string, any>();
    let removedCount = 0;

    for (const member of members) {
      const name = member.name.trim();
      if (seenNames.has(name)) {
        // Duplicate found!
        // We keep the first one seen (arbitrary, or could keep 'most complete').
        // Ideally we'd merge them, but 'clean up' usually implies just deleting extras 
        // if they are truly identical, or fast merge.
        // For safety, let's just delete the subsequent duplicates.
        const docRef = adminDb.collection("team_members").doc(member.id);
        batch.delete(docRef);
        removedCount++;
      } else {
        seenNames.set(name, member);
      }
    }

    if (removedCount > 0) {
      await batch.commit();
    }

    return { success: true, message: `Removed ${removedCount} duplicates.` };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteTeamMember(memberId: string) {
  try {
    await adminDb.collection("team_members").doc(memberId).delete();
    return { success: true };
  } catch (error: any) {
    console.error("Delete Member Error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTeamMember(memberId: string, data: any) {
  try {
    // Only update allowed fields to prevent overwriting critical structure if passed incorrectly
    // But for flexibility, we'll strip undefineds.
    const updates = JSON.parse(JSON.stringify(data)); // Simple strip undefined
    delete updates.id; // Don't update ID

    await adminDb.collection("team_members").doc(memberId).update(updates);
    return { success: true };
  } catch (error: any) {
    console.error("Update Member Error:", error);
    return { success: false, error: error.message };
  }
}
