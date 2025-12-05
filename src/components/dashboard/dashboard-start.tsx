"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Package, FileText, Users } from "lucide-react";
// import { useSales, useInventory, useCustomers } from "@/hooks/use-api";
// import type { Sale, Product } from "@/types"

export default function DashboardStats() {
  //   const { data: sales, loading: salesLoading } = useSales();
  //   const { data: inventory, loading: inventoryLoading } = useInventory();
  //   const { data: customers, loading: customersLoading } = useCustomers();

  //   if (salesLoading || inventoryLoading || customersLoading) {
  //     return (
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  //         {[...Array(4)].map((_, i) => (
  //           <Card key={i}>
  //             <CardContent className="p-6">
  //               <div className="animate-pulse">
  //                 <div className="h-4 bg-muted rounded mb-2"></div>
  //                 <div className="h-8 bg-muted rounded mb-2"></div>
  //                 <div className="h-3 bg-muted rounded"></div>
  //               </div>
  //             </CardContent>
  //           </Card>
  //         ))}
  //       </div>
  //     );
  //   }

  // const todaySales = sales
  //   .filter((sale: Sale) => sale.fecha === new Date().toISOString().split("T")[0])
  //   .reduce((sum: number, sale: Sale) => sum + sale.monto_total, 0)

  // const pendingInvoices = sales.filter((sale: Sale) => sale.estado === "Pendiente").length
  // const lowStockCount = inventory.filter((item: Product) => item.stock_actual <= item.stock_minimo).length

  const stats = [
    {
      title: "Ventas del Día",
      value: `Bs. `,
      change: "+12%",
      icon: DollarSign,
      color: "text-chart-2",
    },
    {
      title: "Productos en Stock",
      value: "inventario",
      change: "-3%",
      icon: Package,
      color: "text-chart-1",
    },
    {
      title: "Facturas Pendientes",
      value: "pendientes",
      change: "+5%",
      icon: FileText,
      color: "text-chart-3",
    },
    {
      title: "Clientes Activos",
      value: " clientes",
      change: "+8%",
      icon: Users,
      color: "text-chart-4",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-manrope font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-geist font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-manrope">
                    <span
                      className={
                        stat.change.startsWith("+")
                          ? "text-chart-2"
                          : "text-destructive"
                      }
                    >
                      {stat.change}
                    </span>{" "}
                    desde ayer
                  </p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
