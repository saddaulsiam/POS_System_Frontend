import { Input, TextArea } from "../common/Input";

interface SystemSettingsTabProps {
  settings: any;
  saving: boolean;
  handleTextFieldChangeString: (
    field: string,
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

const SystemSettingsTab: React.FC<SystemSettingsTabProps> = ({
  settings,
  saving,
  handleTextFieldChangeString,
}) => (
  <div className="rounded-lg bg-white shadow">
    <div className="border-b border-gray-200 p-6">
      <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
        ⚙️ General Settings
      </h2>
      <p className="mt-1 text-gray-500">
        Manage your store information. Changes are saved automatically.
      </p>
    </div>
    <form className="w-full space-y-8 p-6">
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Input
            label="Store Name"
            type="text"
            id="storeName"
            defaultValue={settings.storeName}
            onBlur={(e) => handleTextFieldChangeString("storeName", e)}
            autoComplete="organization"
            disabled={saving}
            fullWidth
          />
        </div>
        <div>
          <Input
            label="Phone Number"
            type="text"
            id="storePhone"
            defaultValue={settings.storePhone}
            onBlur={(e) => handleTextFieldChangeString("storePhone", e)}
            autoComplete="tel"
            disabled={saving}
            fullWidth
          />
        </div>
        <div>
          <Input
            label="Email Address"
            type="email"
            id="storeEmail"
            defaultValue={settings.storeEmail}
            onBlur={(e) => handleTextFieldChangeString("storeEmail", e)}
            autoComplete="email"
            disabled={saving}
            fullWidth
          />
        </div>
        <div>
          <Input
            label="Tax ID (Optional)"
            type="text"
            id="taxId"
            defaultValue={settings.taxId || ""}
            onBlur={(e) => handleTextFieldChangeString("taxId", e)}
            disabled={saving}
            fullWidth
          />
        </div>
        <div className="md:col-span-2">
          <TextArea
            label="Store Address"
            id="storeAddress"
            rows={2}
            defaultValue={settings.storeAddress}
            onBlur={(e) => handleTextFieldChangeString("storeAddress", e)}
            disabled={saving}
            fullWidth
          />
        </div>
      </div>
    </form>
  </div>
);

export default SystemSettingsTab;
