import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, Tags, CheckCircle, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [totalProducts, totalCategories, activeProducts, inactiveProducts] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: false } }),
    ]);

  const stats = [
    {
      title: "Total Produk",
      value: totalProducts,
      icon: Package,
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "Produk Aktif",
      value: activeProducts,
      icon: CheckCircle,
      color: "text-green-600 bg-green-100",
    },
    {
      title: "Produk Nonaktif",
      value: inactiveProducts,
      icon: XCircle,
      color: "text-red-600 bg-red-100",
    },
    {
      title: "Total Kategori",
      value: totalCategories,
      icon: Tags,
      color: "text-orange-600 bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}