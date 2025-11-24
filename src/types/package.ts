export interface InternetPackage {
  id: string;
  name: string;
  speed: string; // e.g., "10 Mbps", "20 Mbps"
  price: number;
  description?: string;
  isActive: boolean;
  created_at: Date;
  updated_at: Date;
}
