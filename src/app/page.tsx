import { prisma } from "@/lib/prisma";
import { getAllSettings } from "@/lib/site-config";
import type { ProductVariant } from "@/types";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ProductGrid from "@/components/landing/ProductGrid";
import AboutSection from "@/components/landing/AboutSection";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";
import WhatsAppButton from "@/components/landing/WhatsAppButton";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function HomePage() {
  const [settings, categories, productsData] = await Promise.all([
    getAllSettings(),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      include: {
        Category: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const products = productsData.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    image: p.image,
    images: parseJsonArray(p.images),
    categoryId: p.categoryId,
    isActive: p.isActive,
    sortOrder: p.sortOrder,
    variants: parseVariants(p.variants),
    category: p.Category,
  }));

  const features = Array.isArray(settings.aboutFeatures)
    ? settings.aboutFeatures
    : [];

  return (
    <main>
      <Navbar settings={settings} />
      <Hero
        title={settings.heroTitle}
        subtitle={settings.heroSubtitle}
        image={settings.heroImage || undefined}
      />
      <ProductGrid
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
        }))}
        initialProducts={products}
      />
      <AboutSection
        title={settings.aboutTitle}
        content={settings.aboutContent}
        image={settings.aboutImage || undefined}
        features={features}
      />
      <ContactSection settings={settings} />
      <Footer settings={settings} />
      <WhatsAppButton
        phoneNumber={settings.whatsappNumber}
        message={settings.whatsappMessage}
      />
    </main>
  );
}

function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseVariants(value: string | null): ProductVariant[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}