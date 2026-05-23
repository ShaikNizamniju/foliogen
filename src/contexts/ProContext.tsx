import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from '@/lib/supabase_v2';
import { useAuth } from "./AuthContext";

interface ProContextType {
  isPro: boolean;
  isBasicOrAbove: boolean;
  loading: boolean;
  subscriptionId: string | null;
  proSince: Date | null;
  planType: string;
  subscriptionStatus: string;
  nextRenewalDate: Date | null;
  refreshProStatus: () => Promise<void>;
}

const ProContext = createContext<ProContextType | undefined>(undefined);


export function ProProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [proSince, setProSince] = useState<Date | null>(null);
  const [nextRenewalDate, setNextRenewalDate] = useState<Date | null>(null);

  // Everything is free — all users have Pro access.
  const isPro = true;
  const isBasicOrAbove = true;
  const loading = false;
  const planType = "pro";
  const subscriptionStatus = "active";

  const fetchProStatus = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("subscription_id, pro_since, next_renewal_date")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) {
      setSubscriptionId((data as any).subscription_id || null);
      setProSince((data as any).pro_since ? new Date((data as any).pro_since) : null);
      setNextRenewalDate((data as any).next_renewal_date ? new Date((data as any).next_renewal_date) : null);
    }
  }, [user]);

  useEffect(() => {
    fetchProStatus();
  }, [fetchProStatus]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        fetchProStatus();
      }
    });
    return () => subscription.unsubscribe();
  }, [fetchProStatus]);

  const refreshProStatus = async () => {
    await fetchProStatus();
  };

  return (
    <ProContext.Provider value={{ isPro, isBasicOrAbove, loading, subscriptionId, proSince, planType, subscriptionStatus, nextRenewalDate, refreshProStatus }}>
      {children}
    </ProContext.Provider>
  );
}

export function usePro() {
  const context = useContext(ProContext);
  if (context === undefined) {
    throw new Error("usePro must be used within a ProProvider");
  }
  return context;
}
