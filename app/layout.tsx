import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import FollowCursor from "@/components/magneticmouse/MagnaticMouse";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { Toaster } from "sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "TourGuide - Connect with Local Experts",
    template: "%s | TourGuide"
  },
  description: "Discover authentic travel experiences with verified local guides. Book tours, explore hidden gems, and travel like a local with TourGuide.",
  keywords: ["tour guide", "local guide", "travel", "tours", "booking", "authentic experiences", "local experts"],
  authors: [{ name: "TourGuide" }],
  creator: "TourGuide",
  publisher: "TourGuide",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://local-tour-guide-frontend-kjnh.vercel.app",
    title: "TourGuide - Connect with Local Experts",
    description: "Discover authentic travel experiences with verified local guides.",
    siteName: "TourGuide",
  },
  twitter: {
    card: "summary_large_image",
    title: "TourGuide - Connect with Local Experts",
    description: "Discover authentic travel experiences with verified local guides.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${poppins.variable} antialiased`}
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        <FollowCursor />
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
