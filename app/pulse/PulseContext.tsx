"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Customer, CUSTOMERS } from "./data";
import { useLiveWire } from "@/hooks/useLiveWire";
import { updateCustomer } from "@/app/actions/pulse";

export type SimulationEvent =
  | { type: 'DEAL_CLOSE'; customerId: string; amount: string }
  | { type: 'RISK_ALERT'; customerId: string; risk: 'Low' | 'Medium' | 'High'; reason: string }
  | { type: 'USAGE_SPIKE'; customerId: string; amount: number };

interface PulseContextType {
  customers: Customer[];
  simulateRealtimeUpdate: (event: SimulationEvent) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const PulseContext = createContext<PulseContextType | undefined>(undefined);

export function PulseProvider({ children }: { children: React.ReactNode }) {
  const { customers: liveCustomers, loading, error } = useLiveWire();

  // Local state for optimistic updates if needed, but for now we'll rely on onSnapshot
  const customers = liveCustomers.length > 0 ? liveCustomers : CUSTOMERS;

  const simulateRealtimeUpdate = async (event: SimulationEvent) => {
    // Find the current customer data
    const customer = customers.find(c => c.id === event.customerId);
    if (!customer) return;

    let updates: Partial<Customer> = {};

    switch (event.type) {
      case 'DEAL_CLOSE':
        updates = {
          milestone: 'Closed Won',
          velocity: 'Increasing',
          blocker: undefined
        };
        break;
      case 'RISK_ALERT':
        updates = {
          risk: event.risk,
          blocker: event.reason
        };
        break;
      case 'USAGE_SPIKE':
        updates = {
          consumption: Math.min((customer.consumption || 0) + event.amount, 100),
          velocity: 'Increasing'
        };
        break;
    }

    // Call server action to update Firestore
    // This will trigger the onSnapshot in useLiveWire, which updates the UI
    await updateCustomer(event.customerId, updates);
  };

  return (
    <PulseContext.Provider value={{ customers, simulateRealtimeUpdate, loading, error }}>
      {children}
    </PulseContext.Provider>
  );
}

export function usePulse() {
  const context = useContext(PulseContext);
  if (context === undefined) {
    throw new Error("usePulse must be used within a PulseProvider");
  }
  return context;
}
