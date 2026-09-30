import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { Toaster } from "sonner";
import LoadingBar from "@/components/LoadingBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TourGuide - Connect with Local Experts",
    template: "%s | TourGuide",
  },
  description:
    "Discover authentic travel experiences with verified local guides. Book tours, explore hidden gems, and travel like a local with TourGuide.",
  keywords: [
    "tour guide",
    "local guide",
    "travel",
    "tours",
    "booking",
    "authentic experiences",
    "local experts",
  ],
  authors: [{ name: "TourGuide" }],
  creator: "TourGuide",
  publisher: "TourGuide",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://local-tour-guide-frontend-kjnh.vercel.app",
    title: "TourGuide - Connect with Local Experts",
    description:
      "Discover authentic travel experiences with verified local guides.",
    siteName: "TourGuide",
  },
  twitter: {
    card: "summary_large_image",
    title: "TourGuide - Connect with Local Experts",
    description:
      "Discover authentic travel experiences with verified local guides.",
  },
};

// Pinch-zoom stays enabled for accessibility
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <LoadingBar />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors position="top-right" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
