export type ModelStatus = "enabled" | "disabled" | "sold" | "reserved";

export interface Model {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  price: number;
  image_url: string | null;
  description: string | null;
  status: ModelStatus;
  created_at: string;
  updated_at: string;
}

