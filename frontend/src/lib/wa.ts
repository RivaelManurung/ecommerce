// Build a WhatsApp click-to-chat link from a stored number + a message.
// Normalises Indonesian formats: strips spaces/symbols and leading 0 → 62.
export function waLink(whatsapp: string | undefined, message: string): string {
  const digits = (whatsapp ?? "").replace(/\D/g, "");
  const num = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  const base = num ? `https://wa.me/${num}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}
