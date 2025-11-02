import api from "../api";

export const loyaltyAPI = {
  getCustomerLoyalty: async (customerId: number) => {
    const response = await api.get(
      `/loyalty/customers/${customerId}/loyalty-status`,
    );
    return response.data;
  },
  awardPoints: async (data: {
    customerId: number;
    saleId: number;
    amount: number;
  }) => {
    const response = await api.post("/loyalty/award-points", data);
    return response.data;
  },
  redeemPoints: async (data: {
    customerId: number;
    points: number;
    rewardType: "DISCOUNT" | "FREE_PRODUCT" | "STORE_CREDIT" | "SPECIAL_OFFER";
    rewardValue: number;
    description?: string;
  }) => {
    const response = await api.post("/loyalty/redeem-points", data);
    return response.data;
  },
  getTransactions: async (customerId: number) => {
    const response = await api.get(
      `/loyalty/customers/${customerId}/points-history`,
    );
    return response.data;
  },
  getRewards: async (customerId: number) => {
    const response = await api.get(`/loyalty/customers/${customerId}/rewards`);
    return response.data;
  },
  useReward: async (rewardId: number) => {
    const response = await api.put(`/loyalty/rewards/${rewardId}/use`);
    return response.data;
  },
  getAllOffers: async () => {
    const response = await api.get("/loyalty/offers");
    return response.data;
  },
  createOffer: async (data: {
    title: string;
    description?: string;
    offerType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_ITEM";
    discountValue: number;
    minimumPurchase?: number;
    requiredTier?: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
    startDate: string;
    endDate: string;
  }) => {
    const response = await api.post("/loyalty/offers", data);
    return response.data;
  },
  updateOffer: async (id: number, data: any) => {
    const response = await api.put(`/loyalty/offers/${id}`, data);
    return response.data;
  },
  deleteOffer: async (id: number) => {
    await api.delete(`/loyalty/offers/${id}`);
  },
  getTierConfig: async () => {
    const response = await api.get("/loyalty/tiers");
    return response.data;
  },
  updateTierConfig: async (data: {
    tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
    minimumPoints: number;
    pointsMultiplier: number;
    discountPercentage: number;
    birthdayBonus: number;
    description?: string;
  }) => {
    const response = await api.post("/loyalty/tiers/config", data);
    return response.data;
  },
  getLoyaltyStatus: async (customerId: number) => {
    const response = await api.get(
      `/loyalty/customers/${customerId}/loyalty-status`,
    );
    return response.data;
  },
  getStatistics: async () => {
    const response = await api.get("/loyalty/statistics");
    return response.data;
  },
};
