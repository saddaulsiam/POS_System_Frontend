import { salesAPI } from "../services";
import toast from "react-hot-toast";

const QUEUE_KEY = "pos_offline_sales_queue";

export interface QueuedSale {
  localId: string;
  saleData: any;
  timestamp: number;
}

export const getOfflineQueue = (): QueuedSale[] => {
  try {
    const queueStr = localStorage.getItem(QUEUE_KEY);
    return queueStr ? JSON.parse(queueStr) : [];
  } catch (e) {
    console.error("Failed to parse offline queue", e);
    return [];
  }
};

export const saveOfflineQueue = (queue: QueuedSale[]) => {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error("Failed to save offline queue", e);
  }
};

export const addToOfflineQueue = (saleData: any, localId: string) => {
  const queue = getOfflineQueue();
  queue.push({
    localId,
    saleData,
    timestamp: Date.now(),
  });
  saveOfflineQueue(queue);
};

export const syncOfflineSales = async (
  onProgress?: (pendingCount: number) => void
): Promise<void> => {
  const queue = getOfflineQueue();
  if (queue.length === 0) return;

  console.log(`Starting sync of ${queue.length} offline sales...`);
  const remaining: QueuedSale[] = [];

  for (const item of queue) {
    try {
      await salesAPI.create(item.saleData);
      toast.success(`Offline sale ${item.localId} successfully synced!`, {
        duration: 4000,
        icon: "🔄",
      });
    } catch (error: any) {
      const apiError = error.response?.data;
      const isDuplicate =
        apiError?.details?.code === "P2002" &&
        (apiError?.details?.meta?.target?.includes("receiptId") ||
          apiError?.error?.includes("receiptId"));

      if (isDuplicate) {
        // The sale is already saved in the database! Consider this a successful sync.
        console.log(`Sale ${item.localId} was already synced in a previous attempt.`);
        toast.success(`Offline sale ${item.localId} already synced!`, {
          duration: 4000,
          icon: "✅",
        });
      } else {
        console.error(`Failed to sync offline sale ${item.localId}`, error);
        remaining.push(item);
      }
    }
  }

  saveOfflineQueue(remaining);
  if (onProgress) {
    onProgress(remaining.length);
  }
};
