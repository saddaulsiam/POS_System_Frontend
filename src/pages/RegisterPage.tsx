import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Input } from "../components/common/Input";
import { Button } from "../components/common";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Owner info (Step 1)
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    ownerUsername: "",
    ownerPin: "",
    confirmPin: "",
    // Store info (Step 2)
    storeName: "",
    storeEmail: "",
    storePhone: "",
    storeAddress: "",
    storeCity: "",
    storeCountry: "",
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
    if (
      formData.ownerEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail)
    ) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!formData.ownerUsername.trim() || formData.ownerUsername.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.ownerUsername)) {
      toast.error(
        "Username can only contain letters, numbers, and underscores",
      );
      return;
    }
    if (!/^\d{4,6}$/.test(formData.ownerPin)) {
      toast.error("PIN must be 4-6 digits only");
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
        ownerEmail: formData.ownerEmail || undefined,
        ownerPhone: formData.ownerPhone || undefined,
        ownerUsername: formData.ownerUsername,
        ownerPin: formData.ownerPin,
        email: formData.storeEmail || undefined,
        phone: formData.storePhone || undefined,
        address: formData.storeAddress || undefined,
        city: formData.storeCity || undefined,
        country: formData.storeCountry || undefined,
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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create Your POS Account
          </h1>
          <p className="mt-2 text-gray-600">
            {step === 1
              ? "Let's start with your personal information"
              : "Now, tell us about your business"}
          </p>

          {/* Progress Indicator */}
          <div className="mx-auto mt-6 flex max-w-md items-center">
            <div className="flex flex-1 items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white shadow-md">
                1
              </div>
              <div
                className={`flex-1 border-t-2 transition-colors ${step === 2 ? "border-blue-600" : "border-gray-300"}`}
              ></div>
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold shadow-md transition-colors ${
                step === 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
          </div>
          <div className="mx-auto mt-2 flex max-w-md items-center justify-between text-xs text-gray-600">
            <span className="font-medium">Personal Info</span>
            <span className={step === 2 ? "font-medium" : ""}>
              Business Info
            </span>
          </div>
        </div>

        {step === 1 ? (
          /* Step 1: Owner Account */
          <div className="space-y-6">
            <div>
              <h2 className="mb-1 text-xl font-semibold text-gray-800">
                Your Personal Information
              </h2>
              <p className="mb-4 text-sm text-gray-600">
                This information will be used for your owner account
              </p>
              <div className="space-y-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
                <Input
                  label="Full Name"
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                  fullWidth
                  placeholder="e.g., Abdul Karim"
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="Email Address"
                    type="email"
                    name="ownerEmail"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    required
                    fullWidth
                    placeholder="karim@example.com"
                    helperText="Your personal email"
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    name="ownerPhone"
                    value={formData.ownerPhone}
                    onChange={handleChange}
                    fullWidth
                    placeholder="+880 1712-345678"
                    helperText="Your personal phone"
                  />
                </div>

                <Input
                  label="Username"
                  type="text"
                  name="ownerUsername"
                  value={formData.ownerUsername}
                  onChange={handleChange}
                  required
                  fullWidth
                  minLength={3}
                  placeholder="karim123"
                  helperText="Minimum 3 characters. Letters, numbers, and underscores only."
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="Security PIN (4-6 digits)"
                    type="password"
                    name="ownerPin"
                    value={formData.ownerPin}
                    onChange={handleChange}
                    required
                    fullWidth
                    minLength={4}
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="••••"
                  />

                  <Input
                    label="Confirm PIN"
                    type="password"
                    name="confirmPin"
                    value={formData.confirmPin}
                    onChange={handleChange}
                    required
                    fullWidth
                    minLength={4}
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="••••"
                  />
                </div>
                <p className="text-xs text-gray-600">
                  💡 Choose a PIN you'll remember - you'll use it to login
                  quickly
                </p>
              </div>
            </div>

            {/* Step 1 Navigation */}
            <div className="flex items-center justify-between border-t pt-6">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Already have an account? Login
              </button>
              <Button
                type="button"
                onClick={handleNextStep}
                className="flex items-center gap-2 rounded-md px-8 py-3 font-semibold"
              >
                Continue
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </div>
          </div>
        ) : (
          /* Step 2: Store Information */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="mb-1 text-xl font-semibold text-gray-800">
                Business Information
              </h2>
              <p className="mb-4 text-sm text-gray-600">
                Tell us about your store - you can update this later
              </p>
              <div className="space-y-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
                <Input
                  label="Business/Store Name"
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  required
                  fullWidth
                  placeholder="e.g., Karim Electronics"
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="Store Email"
                    type="email"
                    name="storeEmail"
                    value={formData.storeEmail}
                    onChange={handleChange}
                    fullWidth
                    placeholder="info@karimtraders.com"
                    helperText="Business contact email"
                  />

                  <Input
                    label="Store Phone"
                    type="tel"
                    name="storePhone"
                    value={formData.storePhone}
                    onChange={handleChange}
                    fullWidth
                    placeholder="+880 1712-345678"
                    helperText="Business contact number"
                  />
                </div>

                <Input
                  label="Store Address"
                  type="text"
                  name="storeAddress"
                  value={formData.storeAddress}
                  onChange={handleChange}
                  fullWidth
                  placeholder="House 12, Road 5, Dhanmondi"
                  helperText="Full business address"
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="City"
                    type="text"
                    name="storeCity"
                    value={formData.storeCity}
                    onChange={handleChange}
                    fullWidth
                    placeholder="Dhaka"
                    helperText="Store location city"
                  />

                  <Input
                    label="Country"
                    type="text"
                    name="storeCountry"
                    value={formData.storeCountry}
                    onChange={handleChange}
                    fullWidth
                    placeholder="Bangladesh"
                    helperText="Store location country"
                  />
                </div>

                <p className="text-xs text-gray-600">
                  💡 This information will appear on receipts and invoices
                </p>
              </div>
            </div>

            {/* Step 2 Navigation */}
            <div className="flex items-center justify-between border-t pt-6">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back To Personal Info
              </button>
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-md px-8 py-3 font-semibold"
              >
                {loading ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Your Store...
                  </>
                ) : (
                  <>
                    Create My Store
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
