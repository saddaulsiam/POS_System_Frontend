import api from "./api";

export interface SubscriptionStatus {
  status: "TRIAL" | "ACTIVE" | "EXPIRED" | "CANCELLED";
  trialStartDate: string;
  trialEndDate: string;
  subscriptionEndDate: string | null;
  plan: string | null;
  daysRemaining: number | null;
  showWarning: boolean;
  warningShown: boolean;
  isExpired: boolean;
  isActive: boolean;
}

export interface ActivateSubscriptionRequest {
  plan: "MONTHLY" | "YEARLY" | "LIFETIME";
  paymentMethod: string;
  duration?: number;
}

export interface InitiatePaymentRequest {
  plan: "MONTHLY" | "YEARLY";
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  platform?: "web" | "electron";
}

export interface InitiatePaymentResponse {
  gatewayUrl: string;
  transactionId: string;
  paymentId: number;
}

export const subscriptionAPI = {
  getStatus: async (): Promise<SubscriptionStatus> => {
    const response = await api.get("/subscription/status");
    return response.data.subscription;
  },

  initiatePayment: async (
    data: InitiatePaymentRequest,
  ): Promise<InitiatePaymentResponse> => {
    const response = await api.post("/payment/sslcommerz/initiate", data);
    return response.data;
  },

  activate: async (data: ActivateSubscriptionRequest) => {
    const response = await api.post("/subscription/activate", data);
    return response.data.subscription;
  },

  renew: async (data: Omit<ActivateSubscriptionRequest, "duration">) => {
    const response = await api.post("/subscription/renew", data);
    return response.data.subscription;
  },

  markWarningShown: async () => {
    const response = await api.post("/subscription/warning-shown");
    return response.data.subscription;
  },

  cancel: async () => {
    const response = await api.post("/subscription/cancel");
    return response.data.subscription;
  },
};
