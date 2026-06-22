"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import type { ProductWithCategory } from "@/types";

type ProductGridProps = {
  categories: { id: string; name: string; slug: string }[];
  initialProducts: ProductWithCategory[];
};

const ITEMS_PER_PAGE = 8;

export default function ProductGrid({
  categories,
  initialProducts,
}: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const filtered = selectedCategory
    ? initialProducts.filter((p) => p.categoryId === selectedCategory)
    : initialProducts;

  const visibleProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <section id="katalog" className="py-16 sm:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-text-primary mb-3">
            Katalog <span className="text-maroon">Produk</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Temukan berbagai pilihan furniture berkualitas untuk rumah impian Anda
          </p>
          <p className="text-sm text-text-muted mt-2">
            Menampilkan {filtered.length} produk
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              !selectedCategory
                ? "bg-maroon text-white shadow-md"
                : "bg-white text-text-secondary hover:bg-maroon/10 border border-border"
            )}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                selectedCategory === cat.id
                  ? "bg-maroon text-white shadow-md"
                  : "bg-white text-text-secondary hover:bg-maroon/10 border border-border"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {visibleProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {visibleProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {hasMore && (
              <div className="text-center mt-10">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
                  }
                >
                  Lihat Lebih Banyak
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-muted text-lg">
              Belum ada produk tersedia
            </p>
          </div>
        )}
      </div>
    </section>
  );
}