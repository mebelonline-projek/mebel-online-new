"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Truck, Shield, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  Star: <Star className="w-6 h-6" />,
  Truck: <Truck className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
  Award: <Award className="w-6 h-6" />,
};

type AboutSectionProps = {
  title: string;
  content: string;
  image?: string;
  features: { icon: string; title: string; description: string }[];
};

export default function AboutSection({
  title,
  content,
  image,
  features,
}: AboutSectionProps) {
  return (
    <section id="tentang" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              {image ? (
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-maroon/10 to-orange/10 flex items-center justify-center">
                  <Truck className="w-16 h-16 text-maroon/30" />
                </div>
              )}
            </div>
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="absolute -bottom-4 -right-4 bg-maroon text-white px-6 py-3 rounded-xl shadow-lg"
            >
              <p className="text-2xl font-bold">4+</p>
              <p className="text-xs">Tahun Pengalaman</p>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-text-primary mb-6">
              {title}
            </h2>
            <p className="text-text-secondary leading-relaxed mb-8">
              {content}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-3 p-4 rounded-xl bg-cream hover:bg-cream-dark transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-maroon/10 text-maroon flex items-center justify-center shrink-0">
                    {iconMap[feature.icon] || <Star className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-text-primary">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-text-muted mt-1">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}