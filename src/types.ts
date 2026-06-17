export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string; // e.g. "45 mins" or "2 hours"
  category: "Maintenance" | "Diagnostics" | "Repairs" | "Tyres & Brakes";
  icon: string; // Lucide icon name
}

export interface PartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Engine" | "Brakes" | "Suspension" | "Electrical" | "Maintenance";
  partNumber: string;
  rating: number;
  stock: number;
  compatibility: string[]; // List of makes, e.g. ["BMW", "Toyota", "Ford", "All Makes"]
  imageUrl: string;
}

export interface CartItem {
  part: PartItem;
  quantity: number;
}

export interface Appointment {
  id: string;
  service: ServiceOption;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  carMake: string;
  carModel: string;
  carYear: string;
  notes?: string;
  status: "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  date: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: "Card" | "PayPal" | "Pay on Pickup";
  status: "Processing" | "Ready for Pickup" | "Shipped" | "Completed";
}
