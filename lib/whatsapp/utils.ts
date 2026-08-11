export function normalizeWhatsAppNumber(number: string | null | undefined) {
  return (number ?? "").replace(/\D/g, "");
}

export function buildWhatsAppUrl(number: string | null | undefined, message: string) {
  const normalizedNumber = normalizeWhatsAppNumber(number);
  return normalizedNumber ? `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}` : null;
}
