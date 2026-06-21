import { api } from "@/lib/api-client";

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled";

export interface OrderItem {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  variantName: string;
  image: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  notes: string;
}

export interface Shipment {
  courier: string;
  service: string;
  eta: string;
  trackingNumber: string;
}

export interface Payment {
  provider: string;
  status: "unpaid" | "paid" | "failed";
  reference: string;
  paidAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  address: ShippingAddress;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  shipment: Shipment;
  payment: Payment;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutInput {
  address: ShippingAddress;
  courier: string;
  service: string;
  couponCode?: string;
  paymentMethod: "bank" | "ewallet" | "cod";
}

export interface TrackingEvent {
  status: OrderStatus;
  label: string;
  done: boolean;
}

export interface TrackingView {
  orderNumber: string;
  status: OrderStatus;
  courier: string;
  service: string;
  eta: string;
  trackingNumber: string;
  events: TrackingEvent[];
}

export async function getTracking(id: string): Promise<TrackingView> {
  const { data } = await api.get<TrackingView>(`/orders/${id}/tracking`);
  return data;
}

export interface ShippingOption {
  courier: string;
  service: string;
  eta: string;
  cost: number;
}

export async function quoteShipping(province: string, city?: string): Promise<{ options: ShippingOption[]; weight: number }> {
  const { data } = await api.post<{ options: ShippingOption[]; weight: number }>("/shipping/quote", { province, city });
  return data;
}

export async function checkout(input: CheckoutInput): Promise<Order> {
  const { data } = await api.post<Order>("/orders", input);
  return data;
}

export async function getMyOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>("/orders");
  return data;
}

export async function getOrder(id: string): Promise<Order> {
  const { data } = await api.get<Order>(`/orders/${id}`);
  return data;
}
