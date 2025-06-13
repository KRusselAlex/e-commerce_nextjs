export type Order = {
    id: string;
    userId: string;
    total: number;
    status: "placed" | "shipped" | "delivered" | "cancelled";
    date: string;
  };