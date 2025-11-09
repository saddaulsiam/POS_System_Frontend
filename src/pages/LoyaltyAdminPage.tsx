import React, { useState } from "react";
import { Input } from "../components/common/Input";
import { LoyaltyAdminPageSkeleton } from "../components/loyalty/LoyaltyAdminPageSkeleton";
import {
  Gift,
  Trophy,
  Star,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  Users,
  Award,
  Target,
} from "lucide-react";
import {
  useLoyaltyOffers,
  useTierConfig,
  useLoyaltyStatistics,
  useCreateOffer,
  useUpdateOffer,
  useDeleteOffer,
  useUpdateTierConfig,
} from "../services/queries/loyaltyQueries";

interface TierConfig {
  id?: number;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  minimumPoints: number;
  pointsMultiplier: number;
  discountPercentage: number;
  birthdayBonus: number;
  description?: string;
}

interface LoyaltyOffer {
  id: number;
  title: string;
  description?: string;
  offerType: string;
  discountValue?: number;
  minimumPurchase?: number;
  requiredTier?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

const LoyaltyAdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "tiers" | "offers">(
    "overview",
  );
  const [showTierModal, setShowTierModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [editingTier, setEditingTier] = useState<TierConfig | null>(null);
  const [editingOffer, setEditingOffer] = useState<LoyaltyOffer | null>(null);

  // React Query hooks
  const { data: tiers = [], isLoading: tiersLoading } = useTierConfig();
  const { data: offers = [], isLoading: offersLoading } = useLoyaltyOffers();
  const { data: stats, isLoading: statsLoading } = useLoyaltyStatistics();

  const createOffer = useCreateOffer();
  const updateOffer = useUpdateOffer();
  const deleteOffer = useDeleteOffer();
  const updateTierConfig = useUpdateTierConfig();

  const loading = tiersLoading || offersLoading || statsLoading;

  const handleSaveTier = async (tierData: TierConfig) => {
    try {
      await updateTierConfig.mutateAsync(tierData);
      setShowTierModal(false);
      setEditingTier(null);
    } catch (error: any) {
      // Error handled by mutation
    }
  };

  const handleSaveOffer = async (offerData: any) => {
    try {
      if (editingOffer) {
        await updateOffer.mutateAsync({ id: editingOffer.id, data: offerData });
      } else {
        await createOffer.mutateAsync(offerData);
      }
      setShowOfferModal(false);
      setEditingOffer(null);
    } catch (error: any) {
      // Error handled by mutation
    }
  };

  const handleDeleteOffer = async (offerId: number) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;

    try {
      await deleteOffer.mutateAsync(offerId);
    } catch (error: any) {
      // Error handled by mutation
    }
  };

  const getTierColor = (tier: string) => {
    const colors = {
      BRONZE: "bg-orange-100 text-orange-800 border-orange-300",
      SILVER: "bg-gray-100 text-gray-800 border-gray-300",
      GOLD: "bg-yellow-100 text-yellow-800 border-yellow-300",
      PLATINUM: "bg-purple-100 text-purple-800 border-purple-300",
    };
    return colors[tier as keyof typeof colors] || colors.BRONZE;
  };

  const getTierIcon = (tier: string) => {
    const icons = {
      BRONZE: "🥉",
      SILVER: "🥈",
      GOLD: "🥇",
      PLATINUM: "💎",
    };
    return icons[tier as keyof typeof icons] || "🏆";
  };

  if (loading) {
    return <LoyaltyAdminPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
            <Gift className="text-blue-600" />
            Loyalty Program Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage tiers, offers, and track loyalty program performance
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
            >
              <TrendingUp size={18} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("tiers")}
              className={`${
                activeTab === "tiers"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
            >
              <Trophy size={18} />
              Tier Configuration
            </button>
            <button
              onClick={() => setActiveTab("offers")}
              className={`${
                activeTab === "offers"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
            >
              <Star size={18} />
              Special Offers
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && stats && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Points Issued</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {stats.pointsIssued.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-full bg-green-100 p-3">
                    <Award className="text-green-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Points Redeemed</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {stats.pointsRedeemed.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-3">
                    <Gift className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Offers</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {stats.activeOffers}
                    </p>
                  </div>
                  <div className="rounded-full bg-purple-100 p-3">
                    <Star className="text-purple-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Redemption Rate</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {stats.pointsIssued > 0
                        ? (
                            (stats.pointsRedeemed / stats.pointsIssued) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </p>
                  </div>
                  <div className="rounded-full bg-orange-100 p-3">
                    <Target className="text-orange-600" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Customers by Tier */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Users size={20} />
                Customers by Tier
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {["BRONZE", "SILVER", "GOLD", "PLATINUM"].map((tier) => (
                  <div
                    key={tier}
                    className={`rounded-lg border-2 p-4 ${getTierColor(tier)}`}
                  >
                    <div className="mb-2 text-3xl">{getTierIcon(tier)}</div>
                    <p className="font-semibold">{tier}</p>
                    <p className="text-2xl font-bold">
                      {stats.customersByTier[tier] || 0}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Customers */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Trophy size={20} />
                Top Loyalty Customers
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Rank
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Tier
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.topCustomers.map((customer: any, index: number) => (
                      <tr key={customer.id}>
                        <td className="px-4 py-3">
                          <span className="text-lg font-bold text-gray-600">
                            #{index + 1}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {customer.name}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getTierColor(
                              customer.loyaltyTier,
                            )}`}
                          >
                            {getTierIcon(customer.loyaltyTier)}{" "}
                            {customer.loyaltyTier}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          {customer.loyaltyPoints.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tier Configuration Tab */}
        {activeTab === "tiers" && (
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tier Benefits Configuration
                </h3>
              </div>

              <div className="space-y-4">
                {tiers.map((tier: any) => (
                  <div
                    key={tier.tier}
                    className={`rounded-lg border-2 p-6 ${getTierColor(tier.tier)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-3 flex items-center gap-3">
                          <span className="text-4xl">
                            {getTierIcon(tier.tier)}
                          </span>
                          <div>
                            <h4 className="text-xl font-bold">{tier.tier}</h4>
                            <p className="text-sm opacity-75">
                              {tier.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                          <div>
                            <p className="mb-1 text-xs opacity-75">
                              Minimum Points
                            </p>
                            <p className="font-bold">
                              {tier.minimumPoints.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 text-xs opacity-75">
                              Points Multiplier
                            </p>
                            <p className="font-bold">
                              {tier.pointsMultiplier}x
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 text-xs opacity-75">Discount</p>
                            <p className="font-bold">
                              {tier.discountPercentage}%
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 text-xs opacity-75">
                              Birthday Bonus
                            </p>
                            <p className="font-bold">
                              {tier.birthdayBonus} pts
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setEditingTier(tier);
                          setShowTierModal(true);
                        }}
                        className="ml-4 rounded-lg p-2 text-gray-600 transition-colors hover:bg-white/50 hover:text-blue-600"
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === "offers" && (
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Special Offers
                </h3>
                <button
                  onClick={() => {
                    setEditingOffer(null);
                    setShowOfferModal(true);
                  }}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  <Plus size={18} />
                  Create Offer
                </button>
              </div>

              <div className="space-y-4">
                {offers.length === 0 ? (
                  <div className="py-12 text-center text-gray-500">
                    <Star size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No special offers created yet</p>
                    <p className="mt-2 text-sm">
                      Click "Create Offer" to add your first offer
                    </p>
                  </div>
                ) : (
                  offers.map((offer: any) => (
                    <div
                      key={offer.id}
                      className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-start gap-3">
                            <Star
                              className={
                                offer.isActive
                                  ? "text-yellow-500"
                                  : "text-gray-400"
                              }
                              size={24}
                            />
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">
                                {offer.title}
                              </h4>
                              <p className="mt-1 text-sm text-gray-600">
                                {offer.description}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Type:</span>
                              <span className="ml-2 font-medium">
                                {offer.offerType}
                              </span>
                            </div>
                            {offer.discountValue && (
                              <div>
                                <span className="text-gray-500">Value:</span>
                                <span className="ml-2 font-medium">
                                  ${offer.discountValue}
                                </span>
                              </div>
                            )}
                            {offer.minimumPurchase && (
                              <div>
                                <span className="text-gray-500">
                                  Min. Purchase:
                                </span>
                                <span className="ml-2 font-medium">
                                  ${offer.minimumPurchase}
                                </span>
                              </div>
                            )}
                            {offer.requiredTier && (
                              <div>
                                <span className="text-gray-500">Tier:</span>
                                <span
                                  className={`ml-2 rounded px-2 py-1 text-xs font-semibold ${getTierColor(
                                    offer.requiredTier,
                                  )}`}
                                >
                                  {offer.requiredTier}
                                </span>
                              </div>
                            )}
                            <div>
                              <span className="text-gray-500">Period:</span>
                              <span className="ml-2 font-medium">
                                {new Date(offer.startDate).toLocaleDateString()}{" "}
                                - {new Date(offer.endDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Status:</span>
                              <span
                                className={`ml-2 rounded px-2 py-1 text-xs font-semibold ${
                                  offer.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {offer.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="ml-4 flex gap-2">
                          <button
                            onClick={() => {
                              setEditingOffer(offer);
                              setShowOfferModal(true);
                            }}
                            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteOffer(offer.id)}
                            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tier Edit Modal */}
        {showTierModal && editingTier && (
          <TierEditModal
            tier={editingTier}
            onClose={() => setShowTierModal(false)}
            onSave={handleSaveTier}
          />
        )}

        {/* Offer Modal */}
        {showOfferModal && (
          <OfferModal
            offer={editingOffer}
            onClose={() => setShowOfferModal(false)}
            onSave={handleSaveOffer}
          />
        )}
      </div>
    </div>
  );
};

// Tier Edit Modal Component
const TierEditModal: React.FC<{
  tier: TierConfig;
  onClose: () => void;
  onSave: (tier: TierConfig) => void;
}> = ({ tier, onClose, onSave }) => {
  const [formData, setFormData] = useState(tier);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900">
            Edit {tier.tier} Tier Configuration
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Minimum Points
            </label>
            <Input
              type="number"
              value={formData.minimumPoints}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minimumPoints: parseInt(e.target.value),
                })
              }
              min={0}
              required
              fullWidth
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Points Multiplier
            </label>
            <Input
              type="number"
              step={0.1}
              value={formData.pointsMultiplier}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pointsMultiplier: parseFloat(e.target.value),
                })
              }
              min={1.0}
              required
              fullWidth
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Discount Percentage
            </label>
            <Input
              type="number"
              value={formData.discountPercentage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discountPercentage: parseFloat(e.target.value),
                })
              }
              min={0}
              max={100}
              required
              fullWidth
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Birthday Bonus (Points)
            </label>
            <Input
              type="number"
              value={formData.birthdayBonus}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  birthdayBonus: parseInt(e.target.value),
                })
              }
              min={0}
              required
              fullWidth
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Offer Modal Component
const OfferModal: React.FC<{
  offer: LoyaltyOffer | null;
  onClose: () => void;
  onSave: (offer: any) => void;
}> = ({ offer, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: offer?.title || "",
    description: offer?.description || "",
    offerType: offer?.offerType || "DISCOUNT_PERCENTAGE",
    discountValue: offer?.discountValue || 0,
    minimumPurchase: offer?.minimumPurchase || 0,
    requiredTier: offer?.requiredTier || "BRONZE",
    startDate: offer?.startDate
      ? offer.startDate.split("T")[0]
      : new Date().toISOString().split("T")[0],
    endDate: offer?.endDate
      ? offer.endDate.split("T")[0]
      : new Date().toISOString().split("T")[0],
    isActive: offer?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900">
            {offer ? "Edit" : "Create"} Special Offer
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Offer Title *
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              fullWidth
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Offer Type *
              </label>
              <select
                value={formData.offerType}
                onChange={(e) =>
                  setFormData({ ...formData, offerType: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="DISCOUNT_PERCENTAGE">Percentage Discount</option>
                <option value="DISCOUNT_FIXED">Fixed Amount Discount</option>
                <option value="BUY_X_GET_Y">Buy X Get Y</option>
                <option value="POINTS_MULTIPLIER">Points Multiplier</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Discount Value
              </label>
              <Input
                type="number"
                step={0.01}
                value={formData.discountValue}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountValue: parseFloat(e.target.value),
                  })
                }
                min={0}
                fullWidth
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Minimum Purchase
              </label>
              <Input
                type="number"
                step={0.01}
                value={formData.minimumPurchase}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minimumPurchase: parseFloat(e.target.value),
                  })
                }
                min={0}
                fullWidth
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Required Tier
              </label>
              <select
                value={formData.requiredTier}
                onChange={(e) =>
                  setFormData({ ...formData, requiredTier: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="BRONZE">Bronze</option>
                <option value="SILVER">Silver</option>
                <option value="GOLD">Gold</option>
                <option value="PLATINUM">Platinum</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Start Date *
              </label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
                fullWidth
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                End Date *
              </label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                required
                fullWidth
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700"
            >
              Active
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              {offer ? "Update" : "Create"} Offer
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoyaltyAdminPage;
