export type VariantOption = {
  type: string;
  name: string;
  options: string[];
};

export type ProductVariant = {
  type: "color" | "size" | "material" | "text";
  name: string;
  options: string[];
};

export type SiteSettings = {
  brandName: string;
  tagline: string;
  logo: string;
  favicon: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutTitle: string;
  aboutContent: string;
  aboutImage: string;
  aboutFeatures: { icon: string; title: string; description: string }[];
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  contactMapUrl: string;
  whatsappNumber: string;
  whatsappMessage: string;
  operatingHours: string;
  socialMedia: SocialMediaItem[];
  footerDescription: string;
  footerEmail: string;
  footerPhone: string;
  footerAddress: string;
  footerOperatingHours: string;
};

export type SocialMediaItem = {
  platform: string;
  url: string;
  active: boolean;
};

export type CategoryWithProductCount = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
  _count: { products: number };
};

export type ProductWithCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  images: string[];
  categoryId: string;
  isActive: boolean;
  sortOrder: number;
  variants: ProductVariant[];
  category: { name: string; slug: string };
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

export type DashboardStats = {
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  inactiveProducts: number;
};