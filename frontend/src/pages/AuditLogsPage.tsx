import { FC, useEffect, useState } from "react";
import api from "../services/api";
import { Modal } from "../components/common/Modal";

interface AuditLog {
  id: number;
  userId: number;
  action: string;
  entity?: string;
  entityId?: number;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    username: string;
    role: string;
  };
}

const AuditLogsPage: FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [filters, setFilters] = useState({
    userId: "",
    action: "",
    entity: "",
  });
  const [showDetails, setShowDetails] = useState<{
    open: boolean;
    log?: AuditLog;
  }>({ open: false });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (filters.userId) params.userId = filters.userId;
      if (filters.action) params.action = filters.action;
      if (filters.entity) params.entity = filters.entity;
      const res = await api.get("/audit-logs", { params });
      setLogs(res.data.logs);
      setTotal(res.data.total);
    } catch (err) {
      setLogs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, [page, filters]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
          <span className="text-blue-500" aria-label="info">
            <svg
              width="1.2em"
              height="1.2em"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </span>
          Audit Log
        </h2>
        <form className="mb-4 flex flex-wrap gap-2" onSubmit={handleSearch}>
          <input
            className="input input-bordered"
            name="userId"
            placeholder="User ID"
            value={filters.userId}
            onChange={handleFilterChange}
          />
          <input
            className="input input-bordered"
            name="action"
            placeholder="Action"
            value={filters.action}
            onChange={handleFilterChange}
          />
          <input
            className="input input-bordered"
            name="entity"
            placeholder="Entity"
            value={filters.entity}
            onChange={handleFilterChange}
          />
          <button
            className="btn btn-primary btn-sm flex items-center gap-1"
            type="submit"
          >
            <span aria-label="search">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            Search
          </button>
        </form>
        <div className="overflow-x-auto rounded bg-white shadow">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">ID</th>
                <th className="p-2">User</th>
                <th className="p-2">Action</th>
                <th className="p-2">Entity</th>
                <th className="p-2">Entity ID</th>
                <th className="p-2">Details</th>
                <th className="p-2">IP</th>
                <th className="p-2">User Agent</th>
                <th className="p-2">Time</th>
                <th className="p-2">Info</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="p-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-4 text-center">
                    No logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b transition hover:bg-blue-50"
                  >
                    <td className="p-2">{log.id}</td>
                    <td className="p-2">
                      <span className="font-semibold text-blue-700">
                        {log.user?.name}
                      </span>
                      <span className="ml-1 text-xs text-gray-500">
                        ({log.user?.username})
                      </span>
                      <span className="block text-xs text-gray-400">
                        {log.user?.role}
                      </span>
                    </td>
                    <td className="p-2">{log.action}</td>
                    <td className="p-2">{log.entity}</td>
                    <td className="p-2">{log.entityId}</td>
                    <td className="max-w-xs truncate p-2" title={log.details}>
                      {log.details && log.details.length > 40
                        ? log.details.slice(0, 40) + "..."
                        : log.details}
                    </td>
                    <td className="p-2">{log.ipAddress}</td>
                    <td className="max-w-xs truncate p-2" title={log.userAgent}>
                      {log.userAgent && log.userAgent.length > 40
                        ? log.userAgent.slice(0, 40) + "..."
                        : log.userAgent}
                    </td>
                    <td className="p-2">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-2">
                      <button
                        className="btn btn-xs btn-info"
                        onClick={() => setShowDetails({ open: true, log })}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span>
            Showing {logs.length} of {total} logs
          </span>
          <div className="flex gap-2">
            <button
              className="btn btn-sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span>Page {page}</span>
            <button
              className="btn btn-sm"
              disabled={page * limit >= total}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>

        {/* Details Modal */}
        {showDetails.open && showDetails.log && (
          <Modal
            isOpen={showDetails.open}
            onClose={() => setShowDetails({ open: false })}
            title={
              <div className="flex items-center gap-2">
                <span className="text-lg text-blue-500">📜</span>
                <span className="font-semibold">Audit Log Details</span>
                <span className="ml-2 text-xs text-gray-400">
                  #{showDetails.log.id}
                </span>
              </div>
            }
            size="2xl"
          >
            <div className="mb-2 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">User:</span>
                  <span className="ml-2 font-medium text-blue-700">
                    {showDetails.log.user?.name}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {showDetails.log.user?.username}
                  </span>
                  <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs uppercase text-gray-600">
                    {showDetails.log.user?.role}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Action:</span>
                  <span className="ml-2 text-gray-800">
                    {showDetails.log.action}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Entity:</span>
                  <span className="ml-2 text-gray-800">
                    {showDetails.log.entity || (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">
                    Entity ID:
                  </span>
                  <span className="ml-2 text-gray-800">
                    {showDetails.log.entityId ?? (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Time:</span>
                  <span className="ml-2 text-gray-800">
                    {new Date(showDetails.log.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">
                    IP Address:
                  </span>
                  <span className="ml-2 text-gray-800">
                    {showDetails.log.ipAddress || (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">
                    User Agent:
                  </span>
                  <span className="ml-2 break-all text-gray-800">
                    {showDetails.log.userAgent || (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Details:</span>
              <pre className="mt-1 overflow-x-auto rounded border border-gray-200 bg-gray-100 p-3 text-sm">
                {(() => {
                  try {
                    return JSON.stringify(
                      JSON.parse(showDetails.log.details || "{}"),
                      null,
                      2,
                    );
                  } catch {
                    return showDetails.log.details || "-";
                  }
                })()}
              </pre>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default AuditLogsPage;
