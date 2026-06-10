export type CheckoutFormValues = {
  fullName: string;
  phone: string;
  address: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  shippingMethod: "regular" | "express" | "same-day";
  paymentMethod: "bank" | "ewallet" | "card";
  notes?: string;
};
