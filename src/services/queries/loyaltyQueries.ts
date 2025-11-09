import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loyaltyAPI } from "../api/loyaltyAPI";
import toast from "react-hot-toast";

// Query Keys
export const loyaltyKeys = {
  all: ["loyalty"] as const,
  offers: () => [...loyaltyKeys.all, "offers"] as const,
  tiers: () => [...loyaltyKeys.all, "tiers"] as const,
  statistics: () => [...loyaltyKeys.all, "statistics"] as const,
  customer: (customerId: number) =>
    [...loyaltyKeys.all, "customer", customerId] as const,
  customerStatus: (customerId: number) =>
    [...loyaltyKeys.customer(customerId), "status"] as const,
  customerTransactions: (customerId: number) =>
    [...loyaltyKeys.customer(customerId), "transactions"] as const,
  customerRewards: (customerId: number) =>
    [...loyaltyKeys.customer(customerId), "rewards"] as const,
};

export const useLoyaltyOffers = () => {
  return useQuery({
    queryKey: loyaltyKeys.offers(),
    queryFn: loyaltyAPI.getAllOffers,
  });
};

export const useTierConfig = () => {
  return useQuery({
    queryKey: loyaltyKeys.tiers(),
    queryFn: loyaltyAPI.getTierConfig,
  });
};

export const useLoyaltyStatistics = () => {
  return useQuery({
    queryKey: loyaltyKeys.statistics(),
    queryFn: loyaltyAPI.getStatistics,
  });
};

export const useCustomerLoyaltyStatus = (customerId: number | null) => {
  return useQuery({
    queryKey: customerId
      ? loyaltyKeys.customerStatus(customerId)
      : ["loyalty", "customer", "none"],
    queryFn: () =>
      customerId ? loyaltyAPI.getLoyaltyStatus(customerId) : null,
    enabled: !!customerId,
  });
};

export const useCustomerLoyalty = (customerId: number | null) => {
  return useQuery({
    queryKey: customerId
      ? loyaltyKeys.customer(customerId)
      : ["loyalty", "customer", "none"],
    queryFn: () =>
      customerId ? loyaltyAPI.getCustomerLoyalty(customerId) : null,
    enabled: !!customerId,
  });
};

export const useCustomerTransactions = (customerId: number | null) => {
  return useQuery({
    queryKey: customerId
      ? loyaltyKeys.customerTransactions(customerId)
      : ["loyalty", "customer", "none", "transactions"],
    queryFn: () => (customerId ? loyaltyAPI.getTransactions(customerId) : []),
    enabled: !!customerId,
  });
};

export const useCustomerRewards = (customerId: number | null) => {
  return useQuery({
    queryKey: customerId
      ? loyaltyKeys.customerRewards(customerId)
      : ["loyalty", "customer", "none", "rewards"],
    queryFn: () => (customerId ? loyaltyAPI.getRewards(customerId) : []),
    enabled: !!customerId,
  });
};

export const useCreateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      title: string;
      description?: string;
      offerType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_ITEM";
      discountValue: number;
      minimumPurchase?: number;
      requiredTier?: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
      startDate: string;
      endDate: string;
    }) => loyaltyAPI.createOffer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loyaltyKeys.offers() });
      toast.success("Offer created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create offer");
    },
  });
};

export const useUpdateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      loyaltyAPI.updateOffer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loyaltyKeys.offers() });
      toast.success("Offer updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update offer");
    },
  });
};

export const useDeleteOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => loyaltyAPI.deleteOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loyaltyKeys.offers() });
      toast.success("Offer deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to delete offer");
    },
  });
};

export const useUpdateTierConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
      minimumPoints: number;
      pointsMultiplier: number;
      discountPercentage: number;
      birthdayBonus: number;
      description?: string;
    }) => loyaltyAPI.updateTierConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loyaltyKeys.tiers() });
      toast.success("Tier configuration updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || "Failed to update tier configuration",
      );
    },
  });
};

export const useAwardPoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      customerId: number;
      saleId: number;
      amount: number;
    }) => loyaltyAPI.awardPoints(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: loyaltyKeys.customer(variables.customerId),
      });
      toast.success("Points awarded successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to award points");
    },
  });
};

export const useRedeemPoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      customerId: number;
      points: number;
      rewardType:
        | "DISCOUNT"
        | "FREE_PRODUCT"
        | "STORE_CREDIT"
        | "SPECIAL_OFFER";
      rewardValue: number;
      description?: string;
    }) => loyaltyAPI.redeemPoints(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: loyaltyKeys.customer(variables.customerId),
      });
      toast.success("Points redeemed successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to redeem points");
    },
  });
};

export const useReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rewardId: number) => loyaltyAPI.useReward(rewardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loyaltyKeys.all });
      toast.success("Reward used successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to use reward");
    },
  });
};
