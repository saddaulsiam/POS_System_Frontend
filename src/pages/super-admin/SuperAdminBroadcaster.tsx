import React, { useState } from "react";
import { useBroadcastAnnouncements, useAdminStats } from "../../services/queries/adminQueries";
import toast from "react-hot-toast";
import { 
  Mail, 
  Users, 
  Send, 
  AlertTriangle, 
  Eye, 
  Edit3, 
  Clock, 
  Award, 
  XCircle, 
  Sparkles, 
  FileText 
} from "lucide-react";

// Preconfigured template drafts
const TEMPLATES = [
  {
    id: "maintenance",
    label: "🚧 System Maintenance",
    subject: "Scheduled System Maintenance and Upgrades Notice",
    body: `<p>Dear Store Owner,</p>\n<p>Please be advised that we will be carrying out scheduled system maintenance and security updates on <strong>Sunday at 2:00 AM UTC</strong>.</p>\n<p>During this window, the platform dashboard may be briefly inaccessible for up to 10 minutes. Your local POS registers will continue tracking transactions offline and synchronize automatically once connection is restored.</p>\n<p>Thank you for your patience and understanding as we work to keep your platform fast and secure.</p>`,
  },
  {
    id: "promo",
    label: "⚡ Renewal Offer",
    subject: "Special Renewal Discount: Get 25% Off Your Next Year!",
    body: `<p>Dear Valued Partner,</p>\n<p>As a thank you for growing your business with us, we are offering an exclusive limited-time subscription renewal discount.</p>\n<p>Apply the coupon code <strong>RENEW25</strong> during checkout to receive <strong>25% off</strong> your yearly subscription renewal.</p>\n<p>To redeem this, visit the subscription tab in your dashboard and choose the yearly plan before this offer expires.</p>\n<div style="text-align: center; margin: 25px 0;">\n  <a href="#" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Renew With 25% Discount</a>\n</div>`,
  },
  {
    id: "feature",
    label: "🚀 Feature Release",
    subject: "New Feature Launch: Advanced Discount Rules & Custom Coupons!",
    body: `<p>Dear Store Owner,</p>\n<p>We are excited to announce the release of our latest feature: <strong>Advanced Store Coupons & Promo Codes Manager!</strong></p>\n<p>You can now create complex retail configurations, stackable vouchers, and tiered discounts to drive customer loyalty and increase checkouts.</p>\n<p>Log in to your store administration dashboard under the <strong>Marketing & Loyalty</strong> section to check it out today!</p>`,
  },
];

const SuperAdminBroadcaster: React.FC = () => {
  const broadcastMutation = useBroadcastAnnouncements();
  const { data: stats } = useAdminStats();

  // Form State
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [targetAudience, setTargetAudience] = useState("ALL");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit");

  // Get recipient counts based on active stats
  const getAudienceCount = (audience: string) => {
    if (!stats?.stats) return "...";
    switch (audience) {
      case "ALL":
        return stats.stats.totalStores;
      case "TRIAL":
        return stats.stats.trialSubs;
      case "ACTIVE":
        return stats.stats.activeSubs;
      case "EXPIRED":
        return stats.stats.expiredSubs;
      default:
        return 0;
    }
  };

  const applyTemplate = (tpl: typeof TEMPLATES[0]) => {
    setSubject(tpl.subject);
    setBody(tpl.body);
    toast.success(`${tpl.label} template loaded!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      toast.error("Subject and content body are required!");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSend = async () => {
    setShowConfirmModal(false);
    try {
      const response = await broadcastMutation.mutateAsync({
        subject,
        body,
        targetAudience,
      });
      toast.success(
        `Announcements sent to ${response.successCount} store(s) successfully! (${response.failCount} failed)`
      );
      setSubject("");
      setBody("");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send platform broadcast");
    }
  };

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-lg sm:p-8">
        <div className="absolute right-0 top-0 h-40 w-40 -translate-y-10 translate-x-10 rounded-full bg-indigo-500/10 blur-2xl" />
        <div className="absolute left-1/3 bottom-0 h-28 w-28 translate-y-10 rounded-full bg-violet-500/10 blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              Super Admin Console
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Email Broadcast Center</h2>
            <p className="mt-2 text-sm text-slate-300 max-w-xl">
              Design beautiful custom HTML emails and dispatch platform newsletters or reminders to your store owners.
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur shadow-sm">
            <Mail className="h-6 w-6 text-indigo-200" />
          </div>
        </div>
      </div>

      {/* Target Audience Visual Selector Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Card 1: ALL */}
        <button
          type="button"
          onClick={() => setTargetAudience("ALL")}
          className={`relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
            targetAudience === "ALL"
              ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600 shadow-sm"
              : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
            <Users className="h-5 w-5" />
          </div>
          <span className="mt-3 block text-xs font-bold text-gray-500 uppercase tracking-wide">All Store Owners</span>
          <span className="mt-1 block text-2xl font-black text-slate-900">{getAudienceCount("ALL")}</span>
        </button>

        {/* Card 2: TRIAL */}
        <button
          type="button"
          onClick={() => setTargetAudience("TRIAL")}
          className={`relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
            targetAudience === "TRIAL"
              ? "border-amber-600 bg-amber-50/40 ring-1 ring-amber-600 shadow-sm"
              : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600">
            <Clock className="h-5 w-5" />
          </div>
          <span className="mt-3 block text-xs font-bold text-gray-500 uppercase tracking-wide">Trial Period</span>
          <span className="mt-1 block text-2xl font-black text-slate-900">{getAudienceCount("TRIAL")}</span>
        </button>

        {/* Card 3: ACTIVE */}
        <button
          type="button"
          onClick={() => setTargetAudience("ACTIVE")}
          className={`relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
            targetAudience === "ACTIVE"
              ? "border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600 shadow-sm"
              : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
            <Award className="h-5 w-5" />
          </div>
          <span className="mt-3 block text-xs font-bold text-gray-500 uppercase tracking-wide">Active Paid</span>
          <span className="mt-1 block text-2xl font-black text-slate-900">{getAudienceCount("ACTIVE")}</span>
        </button>

        {/* Card 4: EXPIRED */}
        <button
          type="button"
          onClick={() => setTargetAudience("EXPIRED")}
          className={`relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
            targetAudience === "EXPIRED"
              ? "border-rose-600 bg-rose-50/40 ring-1 ring-rose-600 shadow-sm"
              : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="rounded-lg bg-rose-100 p-2 text-rose-600">
            <XCircle className="h-5 w-5" />
          </div>
          <span className="mt-3 block text-xs font-bold text-gray-500 uppercase tracking-wide">Expired</span>
          <span className="mt-1 block text-2xl font-black text-slate-900">{getAudienceCount("EXPIRED")}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Form Panel: Compose Block */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Mail className="h-5 w-5 text-indigo-500" />
              Compose Email Broadcast
            </h3>
            
            {/* Mode Switcher */}
            <div className="flex rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setPreviewMode("edit")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  previewMode === "edit" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" />
                Editor
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("preview")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  previewMode === "preview" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Live Preview
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                Email Subject Line
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Action Required: System Maintenance and Upgrades scheduled"
                className="mt-2 block w-full rounded-lg border border-gray-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Body Description editor */}
            {previewMode === "edit" ? (
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Email Content Body (HTML Supported)
                  </label>
                  <span className="text-[10px] text-gray-400 font-semibold">
                    You can use standard HTML tags (e.g. &lt;strong&gt;, &lt;p&gt;, &lt;a&gt;)
                  </span>
                </div>
                <textarea
                  rows={10}
                  required
                  placeholder="<p>We are excited to announce new updates to the Smart POS system...</p>"
                  className="mt-2 block w-full rounded-lg border border-gray-300 bg-slate-50 px-3 py-2.5 text-sm font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                  Live Email Layout Preview
                </label>
                
                {/* Simulated Email Client Container */}
                <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 min-h-[300px]">
                  {/* Email Header */}
                  <div className="bg-white rounded-t-xl border-b border-slate-100 p-4 font-sans text-xs text-gray-500 space-y-1.5 shadow-sm">
                    <div className="flex items-center gap-1">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    </div>
                    <div>
                      <span className="font-bold text-gray-700">From: </span>
                      <span>Smart POS Support &lt;support@pos-platform.com&gt;</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-700">To: </span>
                      <span className="rounded bg-indigo-50 px-1 py-0.5 text-indigo-700 font-semibold uppercase">
                        {targetAudience} RECIPIENTS ({getAudienceCount(targetAudience)} active stores)
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-700">Subject: </span>
                      <span className="font-semibold text-slate-800">{subject || "(No subject set)"}</span>
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="bg-white rounded-b-xl p-6 font-sans text-gray-800 max-w-xl mx-auto shadow-sm mt-3">
                    <h2 className="text-xl font-black tracking-tight text-indigo-600 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-500" />
                      POS PLATFORM UPDATE
                    </h2>
                    <p className="text-sm">Dear <strong>[Store Owner Name]</strong>,</p>
                    <div 
                      className="text-sm mt-3 space-y-3 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: body || "<p style='color:#9ca3af;'>No content written yet. Compose in the Editor tab.</p>" }}
                    />
                    <hr className="border-t border-slate-100 my-6" />
                    <p className="text-[10px] text-gray-400 text-center">
                      This is an administrative broadcast from Smart POS Platform. 
                      You received this email because of your active subscription.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action block */}
            <div className="flex justify-end border-t border-slate-100 pt-4">
              <button
                type="submit"
                disabled={broadcastMutation.isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-indigo-700 disabled:opacity-50 transition-all hover:scale-[1.02]"
              >
                <Send className="h-4 w-4" />
                {broadcastMutation.isPending ? "Sending..." : "Dispatch Broadcast"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Info Sidebar: Templates & Best Practices */}
        <div className="space-y-6">
          {/* Quick Templates */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
              <FileText className="h-4.5 w-4.5 text-indigo-500" />
              Quick Templates
            </h4>
            <p className="text-xs text-gray-500 mb-4">
              Choose a preset template draft to auto-populate the email console immediately.
            </p>
            <div className="space-y-2.5">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  className="w-full rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-left text-xs font-semibold text-slate-700 transition-all hover:border-indigo-100 hover:bg-indigo-50/30 hover:text-indigo-700 flex items-center justify-between"
                >
                  <span>{tpl.label}</span>
                  <span className="text-[10px] text-slate-400">Apply →</span>
                </button>
              ))}
            </div>
          </div>

          {/* Guidelines */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
              Broadcasting Guidelines
            </h4>
            <ul className="space-y-3 text-xs text-gray-600 leading-relaxed list-disc pl-4">
              <li>
                <strong>Target audience sizes</strong> are updated in real-time based on active merchants.
              </li>
              <li>
                SMTP settings must be verified using the **Test Connection** settings utility before dispatching.
              </li>
              <li>
                Use clean inline styles for any custom HTML markup to ensure proper device rendering.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 animate-pulse">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">Confirm Broadcast Dispatch</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  You are about to broadcast this email to all store owners matching the <strong>{targetAudience}</strong> filter. 
                  This will dispatch real emails to approximately <strong>{getAudienceCount(targetAudience)}</strong> store(s).
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSend}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 shadow"
              >
                Yes, Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminBroadcaster;
