import { prisma } from "./prisma";
import type { SiteSettings, SocialMediaItem } from "@/types";

const DEFAULT_SETTINGS: SiteSettings = {
  brandName: "Muara Teweh Furniture",
  tagline: "Mebel Online Terpercaya",
  logo: "",
  favicon: "",
  heroTitle: "Furniture Berkualitas untuk Rumah Impian Anda",
  heroSubtitle:
    "Temukan koleksi furniture terbaik dengan desain elegan dan harga terjangkau",
  heroImage: "",
  aboutTitle: "Tentang Kami",
  aboutContent:
    "Muara Teweh Furniture adalah toko mebel online yang menyediakan berbagai furniture berkualitas dengan desain modern dan tradisional. Kami berkomitmen untuk memberikan produk terbaik dengan harga terjangkau.",
  aboutImage: "",
  aboutFeatures: [
    {
      icon: "Star",
      title: "Kualitas Terbaik",
      description: "Produk berkualitas tinggi dengan material pilihan",
    },
    {
      icon: "Truck",
      title: "Pengiriman Cepat",
      description: "Pengiriman cepat ke seluruh Indonesia",
    },
    {
      icon: "Shield",
      title: "Garansi Kepuasan",
      description: "Garansi 100% kepuasan pelanggan",
    },
    {
      icon: "Award",
      title: "Terpercaya",
      description: "Telah dipercaya ribuan pelanggan",
    },
  ],
  contactEmail: "info@muaratewehfurniture.com",
  contactPhone: "085234567890",
  contactAddress:
    "Jl. A. Yani No. 123, Muara Teweh, Kalimantan Tengah",
  contactMapUrl: "",
  whatsappNumber: "085234567890",
  whatsappMessage:
    "Halo, saya tertarik dengan produk furniture yang ditawarkan.",
  operatingHours: "Senin - Sabtu: 08:00 - 17:00 WIB",
  socialMedia: [
    { platform: "Facebook", url: "", active: false },
    { platform: "Instagram", url: "", active: false },
    { platform: "TikTok", url: "", active: false },
    { platform: "Shopee", url: "", active: false },
    { platform: "Tokopedia", url: "", active: false },
    { platform: "YouTube", url: "", active: false },
  ],
  footerDescription:
    "Toko mebel online terpercaya di Muara Teweh. Menyediakan berbagai furniture berkualitas untuk rumah Anda.",
  footerEmail: "info@muaratewehfurniture.com",
  footerPhone: "085234567890",
  footerAddress:
    "Jl. A. Yani No. 123, Muara Teweh, Kalimantan Tengah",
  footerOperatingHours: "Senin - Sabtu: 08:00 - 17:00 WIB",
};

function parseJsonArray(value: string): SocialMediaItem[] {
  try {
    return JSON.parse(value);
  } catch {
    return DEFAULT_SETTINGS.socialMedia;
  }
}

function parseAboutFeatures(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return DEFAULT_SETTINGS.aboutFeatures;
  }
}

export async function getAllSettings(): Promise<SiteSettings> {
  const dbSettings = await prisma.siteConfig.findMany();

  if (dbSettings.length === 0) {
    return DEFAULT_SETTINGS;
  }

  const map = new Map(dbSettings.map((s) => [s.key, s.value]));

  return {
    brandName: map.get("brandName") || DEFAULT_SETTINGS.brandName,
    tagline: map.get("tagline") || DEFAULT_SETTINGS.tagline,
    logo: map.get("logo") || DEFAULT_SETTINGS.logo,
    favicon: map.get("favicon") || DEFAULT_SETTINGS.favicon,
    heroTitle: map.get("heroTitle") || DEFAULT_SETTINGS.heroTitle,
    heroSubtitle:
      map.get("heroSubtitle") || DEFAULT_SETTINGS.heroSubtitle,
    heroImage: map.get("heroImage") || DEFAULT_SETTINGS.heroImage,
    aboutTitle: map.get("aboutTitle") || DEFAULT_SETTINGS.aboutTitle,
    aboutContent:
      map.get("aboutContent") || DEFAULT_SETTINGS.aboutContent,
    aboutImage: map.get("aboutImage") || DEFAULT_SETTINGS.aboutImage,
    aboutFeatures: map.has("aboutFeatures")
      ? parseAboutFeatures(map.get("aboutFeatures")!)
      : DEFAULT_SETTINGS.aboutFeatures,
    contactEmail:
      map.get("contactEmail") || DEFAULT_SETTINGS.contactEmail,
    contactPhone:
      map.get("contactPhone") || DEFAULT_SETTINGS.contactPhone,
    contactAddress:
      map.get("contactAddress") || DEFAULT_SETTINGS.contactAddress,
    contactMapUrl:
      map.get("contactMapUrl") || DEFAULT_SETTINGS.contactMapUrl,
    whatsappNumber:
      map.get("whatsappNumber") || DEFAULT_SETTINGS.whatsappNumber,
    whatsappMessage:
      map.get("whatsappMessage") || DEFAULT_SETTINGS.whatsappMessage,
    operatingHours:
      map.get("operatingHours") || DEFAULT_SETTINGS.operatingHours,
    socialMedia: map.has("socialMedia")
      ? parseJsonArray(map.get("socialMedia")!)
      : DEFAULT_SETTINGS.socialMedia,
    footerDescription:
      map.get("footerDescription") ||
      DEFAULT_SETTINGS.footerDescription,
    footerEmail:
      map.get("footerEmail") || DEFAULT_SETTINGS.footerEmail,
    footerPhone:
      map.get("footerPhone") || DEFAULT_SETTINGS.footerPhone,
    footerAddress:
      map.get("footerAddress") || DEFAULT_SETTINGS.footerAddress,
    footerOperatingHours:
      map.get("footerOperatingHours") ||
      DEFAULT_SETTINGS.footerOperatingHours,
  };
}

export async function updateSetting(key: string, value: string) {
  return prisma.siteConfig.upsert({
    where: { key },
    update: { value },
    create: { id: crypto.randomUUID(), key, value },
  });
}

export async function updateSettings(
  settings: Partial<SiteSettings>
) {
  const promises = Object.entries(settings).map(([key, value]) => {
    const stringValue =
      typeof value === "object" ? JSON.stringify(value) : String(value);
    return updateSetting(key, stringValue);
  });

  await Promise.all(promises);
  return getAllSettings();
}