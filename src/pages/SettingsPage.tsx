import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BackButton } from "../components/common";
import {
  AlertsTab,
  FeaturesTab,
  FinanceTab,
  ProfileTab,
  ReceiptTab,
  SettingsPageSkeleton,
  SettingsTabs,
  SubscriptionTab,
  SystemSettingsTab,
  UpdatesTab,
} from "../components/settings";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services";
import { usePOSSettings, useUpdatePOSSettings } from "../services/queries";
import type { POSSettings } from "../types/POSSettings";

const SettingsPage: React.FC = () => {
  // Use React Query for settings
  const { data: settings, isLoading, error, refetch } = usePOSSettings();
  const updateSettingsMutation = useUpdatePOSSettings();

  const [saving, setSaving] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("features");
  // Profile management state
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [pinMsg, setPinMsg] = useState("");
  const [pinSaving, setPinSaving] = useState(false);

  // Sync profile state with user object when it changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg("");
    try {
      const updated = await authAPI.updateProfile({ name, username, email });

      // Update user in context
      if (setUser) {
        setUser(updated);
        // Also update localStorage so it persists on reload
        localStorage.setItem("user", JSON.stringify(updated));
      }

      setProfileMsg("Profile updated successfully.");
      toast.success("Profile updated successfully");
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || "Failed to update profile";
      setProfileMsg(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePinChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinSaving(true);
    setPinMsg("");
    try {
      await authAPI.changePin({ currentPin, newPin });
      setPinMsg("");
      setCurrentPin("");
      setNewPin("");
      toast.success("PIN changed successfully.");
    } catch (err: any) {
      setPinMsg(err?.response?.data?.error || "Failed to change PIN");
    } finally {
      setPinSaving(false);
    }
  };

  const handleToggle = async (field: keyof POSSettings, value: boolean) => {
    if (!settings) return;

    try {
      setSaving(true);
      await updateSettingsMutation.mutateAsync({ [field]: value });
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleTextFieldChange = async (
    field: keyof POSSettings,
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!settings) return;

    const value = e.target.value.trim();

    try {
      setSaving(true);
      await updateSettingsMutation.mutateAsync({
        [field]: value || undefined,
      });
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleNumberFieldChange = async (
    field: keyof POSSettings,
    e: React.FocusEvent<HTMLInputElement>,
    min?: number,
    max?: number,
  ) => {
    if (!settings) return;

    const value = parseFloat(e.target.value);
    if (
      isNaN(value) ||
      (min !== undefined && value < min) ||
      (max !== undefined && value > max)
    ) {
      toast.error(
        `Value must be between ${min || 0} and ${max || "unlimited"}`,
      );
      return;
    }

    try {
      setSaving(true);
      await updateSettingsMutation.mutateAsync({ [field]: value });
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSelectChange = async (
    field: keyof POSSettings,
    value: string,
  ) => {
    if (!settings) return;

    try {
      setSaving(true);
      await updateSettingsMutation.mutateAsync({ [field]: value });
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  // Handler adapters for tab components
  const handleToggleString = (field: string, value: boolean) => {
    handleToggle(field as keyof POSSettings, value);
  };
  const handleTextFieldChangeString = (
    field: string,
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    handleTextFieldChange(field as keyof POSSettings, e);
  };
  const handleNumberFieldChangeString = (
    field: string,
    e: React.FocusEvent<HTMLInputElement>,
    min?: number,
    max?: number,
  ) => {
    handleNumberFieldChange(field as keyof POSSettings, e, min, max);
  };
  const handleSelectChangeString = (field: string, value: string) => {
    handleSelectChange(field as keyof POSSettings, value);
  };

  if (isLoading) {
    return <SettingsPageSkeleton />;
  }

  if (!settings || error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Failed to load settings</p>
          <button
            onClick={() => refetch()}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <BackButton to="/admin" />
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ⚙️ POS Settings
              </h1>
              <p className="mt-1 text-gray-600">
                Configure point of sale system features and preferences
              </p>
            </div>
            {settings.updatedByEmployee && (
              <div className="text-right text-sm text-gray-500">
                <p>
                  Last updated by:{" "}
                  <span className="font-medium">
                    {settings.updatedByEmployee.name}
                  </span>
                </p>
                <p>{new Date(settings.updatedAt).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        {activeTab === "features" && (
          <FeaturesTab
            settings={settings}
            saving={saving}
            handleToggle={handleToggleString}
            setSelectedFeature={setSelectedFeature}
            setShowInfoModal={setShowInfoModal}
            showInfoModal={showInfoModal}
            selectedFeature={selectedFeature}
          />
        )}
        {/* StoreTab removed; store info now in System tab */}
        {activeTab === "receipt" && (
          <ReceiptTab
            settings={settings}
            saving={saving}
            handleToggle={handleToggleString}
            handleTextFieldChange={handleTextFieldChangeString}
          />
        )}
        {activeTab === "finance" && (
          <FinanceTab
            settings={settings}
            saving={saving}
            handleNumberFieldChange={handleNumberFieldChangeString}
            handleSelectChange={handleSelectChangeString}
          />
        )}
        {activeTab === "alerts" && (
          <AlertsTab
            settings={settings}
            saving={saving}
            handleSwitchChange={handleToggleString}
            handleNumberFieldChange={handleNumberFieldChangeString}
            handleSelectChange={handleSelectChangeString}
          />
        )}
        {activeTab === "profile" && (
          <ProfileTab
            user={user}
            name={name}
            setName={setName}
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            savingProfile={savingProfile}
            profileMsg={profileMsg}
            handleProfileSave={handleProfileSave}
            currentPin={currentPin}
            setCurrentPin={setCurrentPin}
            newPin={newPin}
            setNewPin={setNewPin}
            pinMsg={pinMsg}
            pinSaving={pinSaving}
            handlePinChange={handlePinChange}
          />
        )}
        {activeTab === "subscription" && <SubscriptionTab />}
        {activeTab === "system" && (
          <SystemSettingsTab
            settings={settings}
            saving={saving}
            handleTextFieldChangeString={handleTextFieldChangeString}
          />
        )}
        {activeTab === "updates" && <UpdatesTab />}
      </div>
    </div>
  );
};

export default SettingsPage;
