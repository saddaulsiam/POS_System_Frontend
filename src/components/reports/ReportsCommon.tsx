export const PaymentBadge = ({ method }: { method: string }) => {
  const m = (method || '').toUpperCase();
  let color = 'bg-gray-100 text-gray-700';
  let icon = '💰';
  if (m.includes('CASH')) { color = 'bg-emerald-50 text-emerald-700 border border-emerald-200'; icon = '💵'; }
  else if (m.includes('CARD')) { color = 'bg-blue-50 text-blue-700 border border-blue-200'; icon = '💳'; }
  else if (m.includes('MOBILE') || m.includes('MPESA') || m.includes('BKASH')) { color = 'bg-purple-50 text-purple-700 border border-purple-200'; icon = '📱'; }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {icon} {method || 'Unknown'}
    </span>
  );
};

export const SortableHeader = ({ 
  label, 
  sortKey, 
  sortConfig, 
  handleSort, 
  align = 'left' 
}: { 
  label: string; 
  sortKey: string; 
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  handleSort: (key: string) => void;
  align?: 'left' | 'right' | 'center';
}) => (
  <th
    onClick={() => handleSort(sortKey)}
    className={`px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none`}
  >
    <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'}`}>
      {label}
      {sortConfig?.key === sortKey ? (
        <span className="text-blue-600 font-bold ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
      ) : (
        <span className="text-gray-300 ml-1 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">↕</span>
      )}
    </div>
  </th>
);

export const PaginationControls = ({ 
  totalItems, 
  pageSize, 
  currentPage, 
  setCurrentPage 
}: { 
  totalItems: number; 
  pageSize: number;
  currentPage: number;
  setCurrentPage: (updater: (p: number) => number) => void;
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white print:hidden">
      <span className="text-sm text-gray-500">
        Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-100 font-medium text-gray-700 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-100 font-medium text-gray-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const InsightCallout = ({ icon, label, value, color }: { icon: string, label: string, value: string, color: 'green' | 'amber' | 'red' | 'blue' }) => {
  const bgColors = { green: 'bg-emerald-50 border-emerald-200 text-emerald-800', amber: 'bg-amber-50 border-amber-200 text-amber-800', red: 'bg-red-50 border-red-200 text-red-800', blue: 'bg-blue-50 border-blue-200 text-blue-800' };
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${bgColors[color]}`}>
      <span>{icon}</span>
      <span>{label}: <strong>{value}</strong></span>
    </div>
  );
};
