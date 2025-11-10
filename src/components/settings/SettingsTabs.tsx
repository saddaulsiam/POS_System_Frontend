import React from "react";

interface SettingsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const baseTabList = [
  { key: "features", label: "🎯 POS Features" },
  { key: "receipt", label: "🧾 Receipts" },
  { key: "finance", label: "💰 Tax & Currency" },
  { key: "alerts", label: "🔔 Alerts" },
  { key: "profile", label: "🙍 Profile" },
  { key: "system", label: "⚙️ System" },
];

const SettingsTabs: React.FC<SettingsTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  // Check if running in Electron (desktop app)
  const isElectron = typeof window !== "undefined" && window.electron;

  // Add Updates tab only for Electron app
  const tabList = isElectron
    ? [...baseTabList, { key: "updates", label: "🔄 Updates" }]
    : baseTabList;

  return (
    <div className="sticky top-0 z-20 mb-6 rounded-b-lg bg-white/90 shadow-sm backdrop-blur">
      <div className="border-b border-gray-200 px-2">
        <nav
          className="-mb-px flex gap-2 overflow-x-auto py-2"
          aria-label="Tabs"
        >
          {tabList.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "border border-blue-600 bg-blue-600 text-white shadow"
                  : "border border-transparent bg-gray-100 text-gray-700 hover:bg-blue-50"
              } `}
              aria-current={activeTab === tab.key ? "page" : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SettingsTabs;
