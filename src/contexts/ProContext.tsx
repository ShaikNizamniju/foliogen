import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

interface ProContextType {
  isPro: boolean;
  loading: boolean;
  subscriptionId: string | null;
  proSince: Date | null;
  refreshProStatus: () => Promise<void>;
}

const ProContext = createContext<ProContextType | undefined>(undefined);

export function ProProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [proSince, setProSince] = useState<Date | null>(null);

  const fetchProStatus = useCallback(async () => {
    if (!user) {
      setIsPro(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("is_pro, subscription_id, pro_since")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data && !error) {
      setIsPro((data as any).is_pro || false);
      setSubscriptionId((data as any).subscription_id || null);
      setProSince((data as any).pro_since ? new Date((data as any).pro_since) : null);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProStatus();
  }, [fetchProStatus]);

  const refreshProStatus = async () => {
    await fetchProStatus();
  };

  return (
    <ProContext.Provider value={{ isPro, loading, subscriptionId, proSince, refreshProStatus }}>
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
