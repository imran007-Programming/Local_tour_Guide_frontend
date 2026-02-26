import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import BreadcrumbBanner from "./components/BreadcrumbBanner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // if (!user) {
  //   redirect("/");
  // }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-[#070A13]">
      {/* Full Width Header */}
      <Header user={user} />

      {/* Full Width Breadcrumb */}
      <BreadcrumbBanner />

      {/* Centered Dashboard Area */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:block hidden">
            <Sidebar user={user} />
          </div>

          {/* Main Content */}
          <main
            className="flex-1 bg-white dark:bg-[#0B0F19]
                       border border-zinc-200 dark:border-zinc-800
                       rounded-2xl p-4 sm:p-6 shadow-sm"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
