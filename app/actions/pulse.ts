"use server";

import { adminDb } from "@/lib/firebase-admin";
import { CUSTOMERS } from "@/app/pulse/data";

export async function seedPulseData() {
  try {
    const batch = adminDb.batch();
    const customersCollection = adminDb.collection("customers");

    // Clear existing (optional, but good for seeding)
    const existing = await customersCollection.listDocuments();
    existing.forEach(doc => batch.delete(doc));

    // Seed from static data
    for (const customer of CUSTOMERS) {
      const docRef = customersCollection.doc(customer.id);
      batch.set(docRef, customer);
    }

    await batch.commit();
    return { success: true, message: "Pulse data seeded successfully" };
  } catch (error: any) {
    console.error("Pulse Seed Error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateCustomer(customerId: string, data: any) {
  try {
    await adminDb.collection("customers").doc(customerId).update(data);
    return { success: true };
  } catch (error: any) {
    console.error("Update Customer Error:", error);
    return { success: false, error: error.message };
  }
}
