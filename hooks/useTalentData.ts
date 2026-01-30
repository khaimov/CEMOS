"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, writeBatch, doc } from 'firebase/firestore';
import { seedTalentData, resetTalentData } from "@/app/actions/talent";
import { INITIAL_SKILLS, INITIAL_TEAM, Skill, TeamMember } from "@/lib/talent-data";
import { useAuth } from "@/contexts/AuthContext";

export function useTalentData() {
  const { user, loading: authLoading } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loading = authLoading || dataLoading;

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      // If not logged in, we shouldn't even try to fetch because rules will deny it.
      // AuthProvider will likely redirect anyway.
      setDataLoading(false);
      return;
    }

    // Subscribe to Skills
    const skillsQuery = query(collection(db, "skills"), orderBy("demand", "desc"));
    const unsubscribeSkills = onSnapshot(skillsQuery, (snapshot) => {
      const loadedSkills = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Skill[];
      setSkills(loadedSkills);
      // If we got real data, clear any previous error
      setError(null);
    }, (err) => {
      console.error("Skills subscription error:", err);
      if (err.code === 'permission-denied') {
        console.warn("Falling back to local data due to permissions.");
        setError("Offline Mode: Database access denied. Showing local preview.");

        // Fallback: Use INITIAL_SKILLS with generated IDs
        const localSkills = INITIAL_SKILLS.map(s => ({ ...s, id: s.name }));
        setSkills(localSkills as Skill[]);
      }
    });

    // Subscribe to Team
    const teamQuery = query(collection(db, "team_members"), orderBy("name"));
    const unsubscribeTeam = onSnapshot(teamQuery, (snapshot) => {
      const loadedTeam = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TeamMember[];
      setTeam(loadedTeam);
      setDataLoading(false);
    }, (err) => {
      console.error("Team subscription error:", err);
      if (err.code === 'permission-denied') {
        // Fallback: Use INITIAL_TEAM mapped to local IDs
        const localSkills = INITIAL_SKILLS.map(s => ({ ...s, id: s.name }));

        const localTeam = INITIAL_TEAM.map((member, idx) => {
          const skillsWithIds: Record<string, number> = {};
          // Auto-assign default levels based on domains
          member.domains.forEach(domain => {
            const matchedSkill = localSkills.find(s => s.name === domain || s.category === domain);
            if (matchedSkill) {
              skillsWithIds[matchedSkill.id] = 3;
            }
          });

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { domains, ...rest } = member;
          return {
            ...rest,
            id: `local-${idx}`,
            skills: skillsWithIds
          };
        });

        setTeam(localTeam as unknown as TeamMember[]);
        setDataLoading(false);
      }
    });

    return () => {
      unsubscribeSkills();
      unsubscribeTeam();
    };
  }, [user, authLoading]);

  const resetData = async () => {
    try {
      setDataLoading(true);

      // Use Server Action
      const result = await resetTalentData();

      if (result.success) {
        console.log(result.message);
        // Force refresh or let onSnapshot handle it
      } else {
        console.error(result.error);
        setError(`Admin Action Failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Error resetting database:", error);
      setError("Failed to call server action");
    } finally {
      setDataLoading(false);
    }
  };

  const seedData = async () => {
    try {
      setDataLoading(true);
      const result = await seedTalentData();
      if (result.success) {
        console.log(result.message);
      } else {
        console.error(result.error);
        setError(`Admin Action Failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Error seeding database:", error);
      setError("Failed to call server action");
    } finally {
      setDataLoading(false);
    }
  };

  return { skills, team, loading, seedData, resetData, error };
}
