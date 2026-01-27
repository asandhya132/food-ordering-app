export interface Food {
  id: number;
  name: string;
  category: string;
  description?: string | null;
  price: number; // backend returns number for JSON numeric
  availableQuantity: number;
  imageUrl?: string | null;
}

