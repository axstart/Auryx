export interface ProductSummary {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  priceCents: number;
  requiresConsultation: boolean;
}

export interface Product extends ProductSummary {
  fullDescription: string;
  benefits: string[];
  dosingInfo: string;
  physicianNote?: string;
}

export interface CartItem {
  product: ProductSummary;
  quantity: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderLineItem {
  slug: string;
  name: string;
  quantity: number;
  priceCents: number;
}

export interface Order {
  id: number;
  customerName: string;
  email: string;
  phone: string | null;
  shippingAddress: ShippingAddress;
  items: OrderLineItem[];
  totalCents: number;
  status: "pending" | "approved" | "shipped";
  stripePaymentIntentId: string | null;
  requiresConsultation: boolean;
  createdAt: string;
  updatedAt: string;
}
