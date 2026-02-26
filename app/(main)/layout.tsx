import Footer from "@/components/home/Footer";
import Navbar from "@/components/navbar/navbar";
import { getCurrentUser } from "@/lib/auth";
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <>
      <Navbar user={user} />
      {children}
      <Footer />
    </>
  );
}
