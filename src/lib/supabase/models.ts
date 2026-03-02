import { supabase } from "./client";
import type { Model } from "./types";

export async function getModels(): Promise<Model[]> {
  const { data, error } = await supabase
    .from("models")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

