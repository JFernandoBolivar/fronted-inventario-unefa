"use client";

import type React from "react";
import { useAuth } from "@/components/auth-context";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import { modules } from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
// import { Package } from "lucide-react";
// import { redirect } from "next/navigation";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const getActiveModule = () => {
    // Quita el primer "/" si existe
    const cleanPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
    // Busca el módulo cuyo id sea prefijo del pathname
    const found = modules.find((m) => cleanPath.startsWith(m.id));
    return found ? found.id : "dashboard";
  };

  const handleModuleChange = (moduleId: string) => {
    if (moduleId === "dashboard") {
      router.push("/dashboard");
    } else {
      router.push(`/${moduleId}`);
    }
  };

  //   if (isLoading) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center bg-background">
  //         <div className="text-center">
  //           <Package className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
  //           <p className="font-manrope text-muted-foreground">
  //             Cargando sistema...
  //           </p>
  //         </div>
  //       </div>
  //     );
  //   }

  //   if (!user) {
  //     redirect("/login");
  //   }
  return (
    <div className="bg-[url(/fondo.png)] w-full  items-center justify-center bg-cover">
      <div className="flex h-screen  ">
        <Sidebar
          activeModule={getActiveModule()}
          onModuleChangeAction={handleModuleChange}
          user={{
            name: user?.name ?? null,
            role: (user?.role as "VENDEDOR" | "ADMIN" | "SUPERVISOR") ?? null,
          }}
          onLogoutAction={logout}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            activeModule={getActiveModule()}
            user={{
              name: user?.name,
              username: user?.username,
            }}
          />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
