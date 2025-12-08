import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Owner info (Step 1)
    ownerName: "",
    ownerUsername: "",
    ownerPin: "",
    confirmPin: "",
    // Store info (Step 2)
    storeName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    // Validate Step 1 (Owner Info)
    if (!formData.ownerName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!formData.ownerUsername.trim() || formData.ownerUsername.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    if (formData.ownerPin.length < 4 || formData.ownerPin.length > 6) {
      toast.error("PIN must be 4-6 digits");
      return;
    }
    if (formData.ownerPin !== formData.confirmPin) {
      toast.error("PINs do not match");
      return;
    }
    setStep(2);
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Step 2 (Store Info)
    if (!formData.storeName.trim()) {
      toast.error("Please enter your store name");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        storeName: formData.storeName,
        ownerName: formData.ownerName,
        ownerUsername: formData.ownerUsername,
        ownerPin: formData.ownerPin,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        country: formData.country || undefined,
      });

      const { token, user, store } = response.data.data;

      // Auto-login after registration
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(`Welcome to ${store.name}! Your account has been created.`);

      // Reload to trigger auth context initialization
      window.location.href = "/";
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to POS System
          </h1>
          <p className="mt-2 text-gray-600">
            {step === 1
              ? "Step 1: Create your owner account"
              : "Step 2: Set up your store information"}
          </p>

          {/* Progress Indicator */}
          <div className="mx-auto mt-6 flex max-w-md items-center">
            <div className="flex flex-1 items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                1
              </div>
              <div className="flex-1 border-t-2 border-blue-600"></div>
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                step === 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
          </div>
        </div>

        {step === 1 ? (
          /* Step 1: Owner Account */
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Owner Account Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="ownerUsername"
                    value={formData.ownerUsername}
                    onChange={handleChange}
                    required
                    minLength={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="johndoe"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum 3 characters. You'll use this to login.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      PIN (4-6 digits) *
                    </label>
                    <input
                      type="password"
                      name="ownerPin"
                      value={formData.ownerPin}
                      onChange={handleChange}
                      required
                      minLength={4}
                      maxLength={6}
                      pattern="[0-9]*"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="****"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Confirm PIN *
                    </label>
                    <input
                      type="password"
                      name="confirmPin"
                      value={formData.confirmPin}
                      onChange={handleChange}
                      required
                      minLength={4}
                      maxLength={6}
                      pattern="[0-9]*"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="****"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1 Navigation */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Already have an account? Login
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Next: Store Info →
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Store Information */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Store Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g., My Retail Store"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="store@example.com"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="USA"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 Navigation */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="text-sm text-gray-600 hover:text-gray-700"
              >
                ← Back to Owner Info
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Store"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
