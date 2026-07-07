import React, { useEffect, useState } from "react";
import { useAdminSettings, useUpdateAdminSettings, useTestSmtpConnection } from "../../services/queries/adminQueries";
import toast from "react-hot-toast";
import { Save, RefreshCw, Server, Shield } from "lucide-react";

const SuperAdminSettings: React.FC = () => {
  const { data: settings, isLoading, isError } = useAdminSettings();
  const updateSettingsMutation = useUpdateAdminSettings();
  const testConnectionMutation = useTestSmtpConnection();

  // Form State
  const [defaultTrialDays, setDefaultTrialDays] = useState(10);
  const [monthlyPrice, setMonthlyPrice] = useState(79.0);
  const [yearlyPrice, setYearlyPrice] = useState(59.0);
  const [supportEmail, setSupportEmail] = useState("support@pos-platform.com");
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");

  const [activeTab, setActiveTab] = useState<"general" | "smtp">("general");

  // Populate state when settings load
  useEffect(() => {
    if (settings) {
      setDefaultTrialDays(settings.defaultTrialDays);
      setMonthlyPrice(settings.monthlyPrice);
      setYearlyPrice(settings.yearlyPrice);
      setSupportEmail(settings.supportEmail);
      setSmtpHost(settings.smtpHost || "");
      setSmtpPort(settings.smtpPort || 587);
      setSmtpUser(settings.smtpUser || "");
      setSmtpPass(settings.smtpPass || "");
    }
  }, [settings]);

  const handleTestConnection = async () => {
    if (!smtpHost.trim() || !smtpUser.trim() || !smtpPass.trim()) {
      toast.error("Please fill in SMTP Host, Username, and Password first!");
      return;
    }

    try {
      await testConnectionMutation.mutateAsync({
        smtpHost: smtpHost.trim(),
        smtpPort: smtpPort ? parseInt(smtpPort.toString()) : 587,
        smtpUser: smtpUser.trim(),
        smtpPass,
      });
      toast.success("SMTP connection established successfully! Credentials are valid.");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "SMTP connection failed. Check your parameters.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateSettingsMutation.mutateAsync({
        defaultTrialDays,
        monthlyPrice,
        yearlyPrice,
        supportEmail,
        smtpHost: smtpHost.trim() || null,
        smtpPort: smtpPort ? parseInt(smtpPort.toString()) : null,
        smtpUser: smtpUser.trim() || null,
        smtpPass: smtpPass || null,
      });
      toast.success("System configurations updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update settings");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <h3 className="text-lg font-bold">Error</h3>
        <p>Failed to load platform settings. Please check your backend connection.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Global Platform Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure default tenant rules, pricing parameters, support channels, and platform SMTP configurations.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Navigation Tabs (Sidebar style) */}
        <div className="flex flex-row gap-1 lg:w-64 lg:flex-col">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === "general"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-600 hover:bg-slate-50 hover:text-gray-950"
            }`}
          >
            <Shield className="h-4.5 w-4.5" />
            General & Pricing
          </button>
          <button
            onClick={() => setActiveTab("smtp")}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === "smtp"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-600 hover:bg-slate-50 hover:text-gray-950"
            }`}
          >
            <Server className="h-4.5 w-4.5" />
            SMTP Configuration
          </button>
        </div>

        {/* Settings Form Container */}
        <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* General Tab */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-indigo-500" />
                  SaaS Settings & Default Values
                </h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Trial Period */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                      Default Trial Duration (Days)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      className="mt-2 block w-full rounded-lg border border-gray-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                      value={defaultTrialDays}
                      onChange={(e) => setDefaultTrialDays(parseInt(e.target.value))}
                    />
                    <p className="mt-1 text-2xs text-gray-400 font-medium">
                      Trial days allocated automatically to new store signups.
                    </p>
                  </div>

                  {/* Support Email */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                      Support Email Address
                    </label>
                    <input
                      type="email"
                      required
                      className="mt-2 block w-full rounded-lg border border-gray-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                    />
                    <p className="mt-1 text-2xs text-gray-400 font-medium">
                      Source address shown on client alert emails and invoices.
                    </p>
                  </div>

                  {/* Monthly Pricing */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                      Monthly Price Plan ($)
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      min={0}
                      className="mt-2 block w-full rounded-lg border border-gray-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                      value={monthlyPrice}
                      onChange={(e) => setMonthlyPrice(parseFloat(e.target.value))}
                    />
                  </div>

                  {/* Yearly Pricing */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                      Yearly Price Plan ($ / Month equivalent)
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      min={0}
                      className="mt-2 block w-full rounded-lg border border-gray-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                      value={yearlyPrice}
                      onChange={(e) => setYearlyPrice(parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SMTP Tab */}
            {activeTab === "smtp" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Server className="h-5 w-5 text-indigo-500" />
                  SMTP Mail server credentials
                </h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Host */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. smtp.mailgun.org"
                      className="mt-2 block w-full rounded-lg border border-gray-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                    />
                  </div>

                  {/* Port */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      placeholder="587"
                      className="mt-2 block w-full rounded-lg border border-gray-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(parseInt(e.target.value))}
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                      SMTP Username
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. postmaster@yourdomain.com"
                      className="mt-2 block w-full rounded-lg border border-gray-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                      value={smtpUser}
                      onChange={(e) => setSmtpUser(e.target.value)}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                      SMTP Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••••"
                      className="mt-2 block w-full rounded-lg border border-gray-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                      value={smtpPass}
                      onChange={(e) => setSmtpPass(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Block */}
            <div className="border-t border-slate-100 pt-5 flex justify-end gap-3">
              {activeTab === "smtp" && (
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testConnectionMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${testConnectionMutation.isPending ? "animate-spin" : ""}`} />
                  {testConnectionMutation.isPending ? "Verifying..." : "Test SMTP Connection"}
                </button>
              )}
              <button
                type="submit"
                disabled={updateSettingsMutation.isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow transition-all hover:bg-indigo-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {updateSettingsMutation.isPending ? "Saving..." : "Save System Configs"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSettings;
