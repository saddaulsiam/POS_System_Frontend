import { useEffect, useState } from "react";

const UpdatesTab: React.FC = () => {
  const [appVersion, setAppVersion] = useState<string>("Loading...");
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<{
    available: boolean;
    version?: string;
    message?: string;
  } | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<{
    percent: number;
    transferred: number;
    total: number;
    bytesPerSecond: number;
  } | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);

  useEffect(() => {
    // Get app version
    const getVersion = async () => {
      if (window.electron?.getVersion) {
        try {
          const version = await window.electron.getVersion();
          setAppVersion(version);
        } catch (error) {
          setAppVersion("Error loading version");
        }
      } else {
        setAppVersion("Web Version");
      }
    };

    getVersion();

    // Listen for update status from main process
    if (window.electron?.onUpdateAvailable) {
      window.electron.onUpdateAvailable((info) => {
        setUpdateInfo({
          available: true,
          version: info.version,
          message: "Update is being downloaded in the background...",
        });
        setUpdateStatus("downloading");
      });
    }

    if (window.electron?.onUpdateDownloaded) {
      window.electron.onUpdateDownloaded((info) => {
        setUpdateInfo({
          available: true,
          version: info.version,
          message: "Update downloaded and ready to install!",
        });
        setUpdateStatus("downloaded");
        setDownloadProgress(null);
      });
    }

    // Listen for download progress
    if (window.electronAPI?.on) {
      window.electronAPI.on("update-status", (data: any) => {
        if (data.status === "downloading" && data.progress) {
          setDownloadProgress({
            percent: data.progress.percent,
            transferred: data.progress.transferred,
            total: data.progress.total,
            bytesPerSecond: data.progress.bytesPerSecond,
          });
        } else if (data.status === "downloaded") {
          setUpdateStatus("downloaded");
          setDownloadProgress(null);
        } else if (data.status === "available") {
          setUpdateStatus("available");
        } else if (data.status === "not-available") {
          setUpdateStatus("not-available");
        }
      });
    }
  }, []);

  const handleCheckForUpdates = async () => {
    setCheckingUpdate(true);
    setUpdateInfo(null);
    setDownloadProgress(null);

    try {
      // Call the Electron IPC to check for updates
      if (window.electron?.checkForUpdates) {
        const result = await window.electron.checkForUpdates();
        setUpdateInfo(result);
      } else {
        setUpdateInfo({
          available: false,
          message: "Update check not available in browser mode",
        });
      }
    } catch (error) {
      setUpdateInfo({
        available: false,
        message: "Failed to check for updates",
      });
    } finally {
      setCheckingUpdate(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleInstallUpdate = () => {
    if (window.electron?.installUpdate) {
      window.electron.installUpdate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Application Updates */}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 p-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            🔄 Application Updates
          </h2>
          <p className="mt-1 text-gray-500">
            Keep your POS system up to date with the latest features and
            security improvements.
          </p>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">
                Current Version
              </h3>
              <p className="mt-1 text-sm text-gray-500">Version {appVersion}</p>
              {updateInfo && (
                <div
                  className={`mt-3 rounded-md p-3 ${
                    updateInfo.available
                      ? "bg-blue-50 text-blue-800"
                      : "bg-green-50 text-green-800"
                  }`}
                >
                  <p className="text-sm font-medium">
                    {updateInfo.available
                      ? `🎉 New version ${updateInfo.version} is available!`
                      : "✓ You're running the latest version"}
                  </p>
                  {updateInfo.message && (
                    <p className="mt-1 text-xs">{updateInfo.message}</p>
                  )}
                </div>
              )}

              {/* Download Progress */}
              {downloadProgress && (
                <div className="mt-3 rounded-md bg-indigo-50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-900">
                      Downloading Update...
                    </p>
                    <p className="text-sm font-bold text-indigo-900">
                      {downloadProgress.percent.toFixed(1)}%
                    </p>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-indigo-200">
                    <div
                      className="h-2.5 rounded-full bg-indigo-600 transition-all duration-300"
                      style={{ width: `${downloadProgress.percent}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-indigo-700">
                    <span>
                      {formatBytes(downloadProgress.transferred)} /{" "}
                      {formatBytes(downloadProgress.total)}
                    </span>
                    <span>
                      {formatBytes(downloadProgress.bytesPerSecond)}/s
                    </span>
                  </div>
                </div>
              )}

              {/* Update Downloaded - Install Button */}
              {updateStatus === "downloaded" && (
                <div className="mt-3">
                  <button
                    onClick={handleInstallUpdate}
                    className="inline-flex w-full items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Restart and Install Update
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleCheckForUpdates}
              disabled={checkingUpdate}
              className="ml-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {checkingUpdate ? (
                <>
                  <svg
                    className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                  Checking...
                </>
              ) : (
                <>
                  <svg
                    className="-ml-1 mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Check for Updates
                </>
              )}
            </button>
          </div>

          {/* Auto-Update Information */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h4 className="text-sm font-medium text-gray-900">
              Auto-Update Settings
            </h4>
            <p className="mt-2 text-sm text-gray-500">
              Updates are downloaded and installed automatically when available.
              The application will notify you when an update is ready to
              install.
            </p>
            <div className="mt-4 rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-blue-700">
                    <strong>How it works:</strong> When you launch the app, it
                    automatically checks for updates. If a new version is found,
                    it will be downloaded in the background. You'll receive a
                    notification when the update is ready, and you can choose to
                    restart and install it.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Release Information */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h4 className="text-sm font-medium text-gray-900">Release Notes</h4>
            <p className="mt-2 text-sm text-gray-500">
              View the latest changes and improvements in each version.
            </p>
            <a
              href="https://github.com/saddaulsiam/POS_System_Frontend/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View Release History
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatesTab;
