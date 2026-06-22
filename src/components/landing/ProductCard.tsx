"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductVariantPicker from "./ProductVariantPicker";
import { buildWaLink, generateProductMessage } from "@/lib/wa";
import type { ProductWithCategory } from "@/types";

type ProductCardProps = {
  product: ProductWithCategory;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [showVariants, setShowVariants] = useState(false);

  const displayImage =
    !imgError && product.image
      ? product.image
      : product.images?.[0] || "/placeholder.svg";

  const variantString = Object.entries(selectedVariants)
    .map(([type, val]) => `${type}: ${val}`)
    .join(", ");

  const waLink = buildWaLink(
    "6285234567890",
    generateProductMessage(
      product.name,
      typeof window !== "undefined" ? window.location.href : "",
      variantString || undefined
    )
  );

  const handleVariantSelect = (type: string, value: string) => {
    setSelectedVariants((prev) => ({ ...prev, [type]: value }));
  };

  return (
    <div className="group bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-cream">
        <Image
          src={displayImage}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-110",
            imgError && "object-contain p-4"
          )}
          onError={() => setImgError(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Category Badge */}
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs"
        >
          {product.category.name}
        </Badge>
        {/* Hover Actions Desktop */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg hover:bg-[#20BD5A] transition-colors"
          >
            <ShoppingCart size={16} />
            Pesan via WA
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-text-primary text-sm sm:text-base line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-xs text-text-muted line-clamp-2 mb-3">
            {product.description}
          </p>
        )}

        {/* Variants Trigger */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-3">
            <button
              onClick={() => setShowVariants(!showVariants)}
              className="text-xs text-maroon font-medium hover:underline"
            >
              {showVariants ? "Sembunyikan" : "Pilih"} Varian
            </button>
            {showVariants && (
              <div className="mt-2">
                <ProductVariantPicker
                  variants={product.variants}
                  selectedVariants={selectedVariants}
                  onSelect={handleVariantSelect}
                />
              </div>
            )}
          </div>
        )}

        {/* WA Button Mobile */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="sm:hidden flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-2 rounded-lg text-sm font-medium"
        >
          <ShoppingCart size={16} />
          Pesan via WA
        </a>
      </div>
    </div>
  );
}