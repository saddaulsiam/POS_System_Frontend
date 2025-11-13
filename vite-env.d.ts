/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  // add more env vars here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  electronAPI?: {
    send: (channel: string, data?: any) => void;
    on: (channel: string, listener: (...args: any[]) => void) => void;
    removeListener: (
      channel: string,
      listener: (...args: any[]) => void,
    ) => void;
  };
  electron?: {
    getVersion: () => Promise<string>;
    checkForUpdates: () => Promise<{
      available: boolean;
      version?: string;
      message?: string;
    }>;
    onUpdateStatus: (callback: (data: any) => void) => () => void;
    installUpdate: () => void;
    quitAndInstall: () => void;
  };
}
