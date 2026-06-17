import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import BreadcrumbBanner from "./components/BreadcrumbBanner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#070A13]">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block sticky top-0 h-screen">
          <Sidebar user={user} />
        </div>

        {/* Main area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <Header user={user} />

          {/* Breadcrumb */}
          <BreadcrumbBanner />

          {/* Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-[1200px] mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
