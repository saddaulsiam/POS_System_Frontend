import { useQuery } from "@tanstack/react-query";
import React, { createContext, useContext } from "react";
import {
  subscriptionAPI,
  SubscriptionStatus,
} from "../services/subscriptionAPI";
import { useAuth } from "./AuthContext";

interface SubscriptionContextType {
  subscription: SubscriptionStatus | null;
  isLoading: boolean;
  refetch: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within SubscriptionProvider");
  }
  return context;
};

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();

  const {
    data: subscription,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["subscription"],
    queryFn: subscriptionAPI.getStatus,
    enabled: isAuthenticated,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    staleTime: 3 * 60 * 1000,
  });

  const value: SubscriptionContextType = {
    subscription: subscription || null,
    isLoading,
    refetch,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
