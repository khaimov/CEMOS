"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { Customer, CUSTOMERS } from '@/app/pulse/data';

/**
 * useLiveWire
 * 
 * Provides a real-time stream of customer data from Firestore.
 * Falls back to local CUSTOMERS data if database access fails.
 */
export function useLiveWire() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. First, set local data so we have something to show immediately
    setCustomers(CUSTOMERS);

    // 2. Try to subscribe to Firestore
    try {
      const customersQuery = query(collection(db, "customers"), limit(500));
      
      const unsubscribe = onSnapshot(customersQuery, (snapshot) => {
        if (snapshot.empty) {
          console.warn("No customers found in Firestore, using local data.");
          setCustomers(CUSTOMERS);
        } else {
          const loadedCustomers = snapshot.docs.map(doc => ({
            ...doc.data()
          })) as Customer[];
          
          // Merge or Replace? 
          // For Pulse dashboard, we likely want the single source of truth from DB.
          setCustomers(loadedCustomers);
        }
        setLoading(false);
        setError(null);
      }, (err) => {
        console.error("Live Wire subscription error:", err);
        setError("Uplink unstable. Using local cache.");
        setLoading(false);
        // Keep using the local CUSTOMERS already set
      });

      return () => unsubscribe();
    } catch (err: any) {
      console.error("Failed to initialize Live Wire:", err);
      setError("Uplink failed.");
      setLoading(false);
    }
  }, []);

  return { customers, loading, error };
}
