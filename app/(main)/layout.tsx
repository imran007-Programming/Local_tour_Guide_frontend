import Footer from "@/components/home/Footer";
import Navbar from "@/components/navbar/navbar";
import SmoothScroll from "@/components/SmoothScroll";

// No cookies are read here, so public pages can be statically generated and
// cached. The navbar loads the signed-in user in the browser.
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <Navbar />
      {children}
      <Footer />
    </SmoothScroll>
  );
}
