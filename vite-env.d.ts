/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  // add more env vars here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  electron?: {
    appVersion: string;
    checkForUpdates: () => Promise<{
      available: boolean;
      version?: string;
      message?: string;
    }>;
    onUpdateAvailable: (callback: (info: any) => void) => void;
    onUpdateDownloaded: (callback: (info: any) => void) => void;
    installUpdate: () => void;
  };
}
