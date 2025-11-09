import { useQuery } from "@tanstack/react-query";
import { receiptsAPI } from "../index";

export const receiptsQueryKeys = {
  detail: (id: number) => ["receipt", id] as const,
};

export function useReceiptHTML(id?: number) {
  return useQuery({
    queryKey: receiptsQueryKeys.detail(id ?? -1),
    queryFn: () => receiptsAPI.getHTML(id as number),
    enabled: typeof id === "number" && id > 0,
  });
}

export function useReceiptThermal(id?: number) {
  return useQuery({
    queryKey: ["receipt-thermal", id ?? -1],
    queryFn: () => receiptsAPI.getThermal(id as number),
    enabled: typeof id === "number" && id > 0,
  });
}
