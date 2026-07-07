import React, { useState } from "react";
import { useBroadcastAnnouncements } from "../../services/queries/adminQueries";
import toast from "react-hot-toast";
import { Mail, Users, Send, AlertTriangle, Eye, Edit3 } from "lucide-react";

const SuperAdminBroadcaster: React.FC = () => {
  const broadcastMutation = useBroadcastAnnouncements();

  // Form State
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [targetAudience, setTargetAudience] = useState("ALL");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit");

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
      // Reset form on success
      setSubject("");
      setBody("");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send platform broadcast");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Email Broadcast Console</h2>
        <p className="mt-1 text-sm text-gray-500">
          Dispatch platform announcements, system notifications, or marketing newsletters directly to client store inboxes.
        </p>
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
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                  previewMode === "edit" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" />
                Editor
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("preview")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                  previewMode === "preview" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Live HTML Preview
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

            {/* Target & Form Layout */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Target Audience */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                  Target Audience / Filter
                </label>
                <div className="relative mt-2">
                  <select
                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  >
                    <option value="ALL">All Store Owners (Trials + Active + Expired)</option>
                    <option value="TRIAL">Trial Stores Only</option>
                    <option value="ACTIVE">Paid Subscribers Only</option>
                    <option value="EXPIRED">Expired Subscriptions Only</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                    <Users className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Body Description editor */}
            {previewMode === "edit" ? (
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Email Content Body (HTML Supported)
                  </label>
                  <span className="text-3xs text-gray-400 font-semibold">
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
                <div className="rounded-lg border border-slate-200 p-5 bg-slate-50 min-h-[220px]">
                  <div className="bg-white rounded-lg border border-slate-100 p-6 shadow-sm max-w-xl mx-auto font-sans text-gray-800">
                    <h2 className="text-xl font-bold text-indigo-600 border-b border-slate-100 pb-3 mb-4">
                      Announcement from POS Platform
                    </h2>
                    <p className="text-sm">Dear <strong>[Store Owner Name]</strong>,</p>
                    <div 
                      className="text-sm mt-3 space-y-2 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: body || "<p style='color:#9ca3af;'>No content written yet. Email preview is empty.</p>" }}
                    />
                    <hr className="border-t border-slate-100 my-6" />
                    <p className="text-[10px] text-gray-400 text-center">
                      This is an administrative broadcast from Smart POS Platform.
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
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-indigo-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {broadcastMutation.isPending ? "Sending..." : "Dispatch Broadcast"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Info Sidebar: Best Practices */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
              Broadcasting Guidelines
            </h4>
            <ul className="space-y-3 text-xs text-gray-600 leading-relaxed list-disc pl-4">
              <li>
                <strong>Validate Subject Lines</strong>: Keep subjects clear and informative to avoid spam classification.
              </li>
              <li>
                <strong>Check SMTP configuration</strong>: Make sure your SMTP credentials are saved in the settings panel first.
              </li>
              <li>
                <strong>Design Responsively</strong>: Use clean inline CSS styling if adding complex custom HTML layouts.
              </li>
              <li>
                <strong>Target Wisely</strong>: Filter target audiences to avoid sending unnecessary notifications to paid clients.
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
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">Confirm Broadcast Dispatch</h3>
                <p className="mt-2 text-sm text-gray-500">
                  You are about to broadcast this email to all store owners matching the <strong>{targetAudience}</strong> filter. 
                  This will dispatch real emails and cannot be cancelled once started.
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
