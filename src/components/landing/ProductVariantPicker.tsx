"use client";

import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/types";

type ProductVariantPickerProps = {
  variants: ProductVariant[];
  selectedVariants: Record<string, string>;
  onSelect: (type: string, value: string) => void;
};

export default function ProductVariantPicker({
  variants,
  selectedVariants,
  onSelect,
}: ProductVariantPickerProps) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-3">
      {variants.map((variant) => (
        <div key={variant.type + variant.name}>
          <p className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">
            {variant.name}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {variant.options.map((option) => {
              const isSelected =
                selectedVariants[variant.type] === option;

              if (variant.type === "color") {
                const isHexColor = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(
                  option
                );
                const colorName = isHexColor ? option : undefined;
                const bgColor = isHexColor
                  ? option
                  : undefined;

                if (isHexColor) {
                  return (
                    <button
                      key={option}
                      onClick={() => onSelect(variant.type, option)}
                      className={cn(
                        "w-7 h-7 rounded-full border-2 transition-all duration-200",
                        isSelected
                          ? "border-maroon scale-110 ring-2 ring-maroon/20"
                          : "border-gray-200 hover:border-maroon/50"
                      )}
                      style={{ backgroundColor: option }}
                      title={option}
                      aria-label={`Warna ${option}`}
                    />
                  );
                }

                return (
                  <button
                    key={option}
                    onClick={() => onSelect(variant.type, option)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs border transition-all",
                      isSelected
                        ? "bg-maroon text-white border-maroon"
                        : "bg-white text-text-secondary border-border hover:border-maroon/50"
                    )}
                  >
                    {option}
                  </button>
                );
              }

              return (
                <button
                  key={option}
                  onClick={() => onSelect(variant.type, option)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs border transition-all",
                    isSelected
                      ? "bg-maroon text-white border-maroon"
                      : "bg-white text-text-secondary border-border hover:border-maroon/50"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}