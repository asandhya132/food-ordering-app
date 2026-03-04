export interface OrderCreateRequest {
  items: { foodId: number; quantity: number }[];
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  totalAmount?: number;
}

export interface OrderResponse {
  id: number;
  createdAt: string;
  totalAmount: number;
  items: {
    id: number;
    foodId: number;
    foodName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
}

