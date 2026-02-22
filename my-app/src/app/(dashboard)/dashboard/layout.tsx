import AppFooter from "@/components/app-footer";
import AppNavbar from "@/components/app-navbar";
import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <div className="min-h-screen">
      <SidebarProvider defaultOpen={defaultOpen}>
        <Toaster
          position="top-right"
          richColors
          theme="dark"
          closeButton
          toastOptions={{
            style: {
              background: '#111827',
              color: '#fff',
            },
          }}
        />
        <AppSidebar />
        <main className="w-full">
          <AppNavbar />
          <div className="px-4">{children}</div>
          <AppFooter/>   
        </main>
      </SidebarProvider>
    </div>
  );
}
