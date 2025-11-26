import { Sale } from "./saleTypes";

export interface Customer {
  id: number;
  name: string;
  phoneNumber?: string;
  email?: string;
  dateOfBirth?: string;
  loyaltyPoints: number;
  address?: string;
  isActive: boolean;
  loyaltyTier?: LoyaltyTier;
  pointsTransactions?: PointsTransaction[];
  rewards?: LoyaltyReward[];
  createdAt: string;
  updatedAt: string;
}

export type LoyaltyTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

export interface PointsTransaction {
  id: number;
  customerId: number;
  saleId?: number;
  type: PointsTransactionType;
  points: number;
  description?: string;
  createdAt: string;
  customer?: Customer;
  sale?: Sale;
}

export type PointsTransactionType =
  | "EARNED"
  | "REDEEMED"
  | "EXPIRED"
  | "ADJUSTED"
  | "BIRTHDAY_BONUS";

export interface LoyaltyReward {
  id: number;
  customerId: number;
  rewardType: RewardType;
  rewardValue: number;
  pointsCost: number;
  description?: string;
  expiresAt?: string;
  redeemedAt?: string;
  createdAt: string;
  customer?: Customer;
}

export type RewardType =
  | "DISCOUNT"
  | "FREE_PRODUCT"
  | "STORE_CREDIT"
  | "SPECIAL_OFFER";

export interface RedeemPointsRequest {
  customerId: number;
  points: number;
  rewardType: RewardType;
  rewardValue: number;
  description?: string;
}

export interface AwardPointsRequest {
  customerId: number;
  saleId: number;
  amount: number;
}
export interface CreateCustomerRequest {
  name: string;
  phoneNumber?: string;
  email?: string;
  dateOfBirth?: string;
  address?: string;
  storeIds: number[];
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  loyaltyPoints?: number;
  isActive?: boolean;
}
