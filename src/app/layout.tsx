import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Surbuy",
  description: "Cameroon's Premium Marketplace",
  manifest: "/manifest.webmanifest",
  themeColor: "#8b5cf6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Surbuy",
  },
  icons: [
    { rel: "icon", url: "/icon.svg" },
    { rel: "apple-touch-icon", url: "/icon-180.png" },
  ],
};

import { AuthProvider } from "@/components/providers/AuthProvider";
import { ProductCacheProvider } from "@/contexts/ProductCacheContext";
import { RequestCacheProvider } from "@/contexts/RequestCacheContext";
import { MarketplaceCacheProvider } from "@/contexts/MarketplaceCacheContext";
import { AppCacheProvider } from "@/contexts/AppCacheContext";
import RegisterServiceWorker from "@/components/pwa/RegisterServiceWorker";
import AppLaunchRedirector from "@/components/pwa/AppLaunchRedirector";
import InstallPrompt from "@/components/pwa/InstallPrompt";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ProductCacheProvider>
            <MarketplaceCacheProvider>
              <AppCacheProvider>
                <RequestCacheProvider>
                  {children}
                </RequestCacheProvider>
              </AppCacheProvider>
            </MarketplaceCacheProvider>
          </ProductCacheProvider>
        </AuthProvider>
        <AppLaunchRedirector />
        <RegisterServiceWorker />
        <InstallPrompt />
      </body>
    </html>
  );
}
