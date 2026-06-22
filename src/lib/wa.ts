/**
 * WhatsApp Utility untuk integrasi wa.me links
 */

export function normalizeWaNumber(phone: string): string {
  // Hapus semua karakter non-digit
  let clean = phone.replace(/\D/g, "");

  // Konversi 08xx ke 628xx
  if (clean.startsWith("0")) {
    clean = "62" + clean.slice(1);
  }

  // Hapus awalan + jika ada
  if (clean.startsWith("+")) {
    clean = clean.slice(1);
  }

  return clean;
}

export function buildWaLink(phone: string, message?: string): string {
  const number = normalizeWaNumber(phone);
  const base = `https://wa.me/${number}`;

  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }

  return base;
}

export function generateProductMessage(
  productName: string,
  productUrl: string,
  variantInfo?: string
): string {
  let message = `Halo, saya tertarik dengan produk ${productName}`;

  if (variantInfo) {
    message += ` (${variantInfo})`;
  }

  message += `\n\nLink: ${productUrl}`;
  message += `\n\nApakah produk ini masih tersedia?`;

  return message;
}