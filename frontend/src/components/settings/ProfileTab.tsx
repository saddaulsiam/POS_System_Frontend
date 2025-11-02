import React from "react";
import { Button, Input } from "../common";

interface ProfileTabProps {
  user: any;
  name: string;
  setName: (v: string) => void;
  username: string;
  setUsername: (v: string) => void;
  savingProfile: boolean;
  profileMsg: string;
  handleProfileSave: (e: React.FormEvent) => void;
  currentPin: string;
  setCurrentPin: (v: string) => void;
  newPin: string;
  setNewPin: (v: string) => void;
  pinMsg: string;
  pinSaving: boolean;
  handlePinChange: (e: React.FormEvent) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  name,
  setName,
  username,
  setUsername,
  savingProfile,
  profileMsg,
  handleProfileSave,
  currentPin,
  setCurrentPin,
  newPin,
  setNewPin,
  pinMsg,
  pinSaving,
  handlePinChange,
}) => (
  <div className="rounded-lg bg-white shadow">
    <div className="border-b border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900">🙍 Profile</h2>
      <p className="mt-1 text-sm text-gray-600">
        Configure system alerts and notification preferences
      </p>
    </div>
    <form className="w-full space-y-6 p-6">
      {/* Profile Info Section */}
      <div className="mb-2 rounded-xl border border-gray-100 bg-gray-50 p-6">
        <div className="mb-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Personal Information
          </h3>
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Input
                label="Full Name"
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={savingProfile}
                fullWidth
                error={name === "" ? "Name is required" : undefined}
              />
            </div>
            <div>
              <Input
                label="Username"
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={savingProfile}
                fullWidth
                error={username === "" ? "Username is required" : undefined}
              />
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-end gap-4">
          <Button onClick={handleProfileSave} disabled={savingProfile}>
            Save Profile
          </Button>
          {profileMsg && (
            <span className="pt-2 text-sm text-gray-600">{profileMsg}</span>
          )}
        </div>
      </div>
      {/* PIN Section */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
        <div className="mb-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Change PIN
          </h3>
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Input
                label="Current PIN"
                type="password"
                id="currentPin"
                placeholder="Enter current PIN"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
                disabled={pinSaving}
                fullWidth
                error={
                  currentPin === "" && !pinSaving && pinMsg
                    ? "Current PIN is required"
                    : undefined
                }
              />
            </div>
            <div>
              <Input
                label="New PIN"
                type="password"
                id="newPin"
                placeholder="Enter 4 digits pin"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                disabled={pinSaving}
                fullWidth
                error={
                  newPin === "" && !pinSaving && pinMsg
                    ? "New PIN is required"
                    : undefined
                }
              />
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-end gap-4">
          <Button onClick={handlePinChange} disabled={pinSaving}>
            Change PIN
          </Button>
          {pinMsg && (
            <span className="pt-2 text-sm text-gray-600">{pinMsg}</span>
          )}
        </div>
      </div>
    </form>
  </div>
);

export default ProfileTab;
