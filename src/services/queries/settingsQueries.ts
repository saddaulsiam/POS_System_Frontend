import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { posSettingsAPI } from "../index";
import type { POSSettings } from "../../types/POSSettings";

export const settingsQueryKeys = {
  settings: ["pos-settings"] as const,
};

export function usePOSSettings() {
  return useQuery({
    queryKey: settingsQueryKeys.settings,
    queryFn: () => posSettingsAPI.get(),
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - cache time (previously cacheTime)
  });
}

export function useUpdatePOSSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<POSSettings>) => posSettingsAPI.update(data),
    onSuccess: (updatedSettings) => {
      // Update the cache with the new settings
      queryClient.setQueryData(settingsQueryKeys.settings, updatedSettings);
    },
  });
}
