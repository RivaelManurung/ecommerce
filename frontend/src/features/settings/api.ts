import { api } from "@/lib/api-client";
import type { Setting } from "@/lib/admin-types";
import type { SettingValues } from "@/lib/validations";

export async function getSettings() {
  const { data } = await api.get<Setting>("/admin/settings");
  return data;
}

export async function updateSettings(values: SettingValues) {
  const { data } = await api.put<Setting>("/admin/settings", values);
  return data;
}
