import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Surbuy",
  description: "Cameroon's Premium Marketplace",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Surbuy",
  },
  icons: [
    { rel: "icon", url: "/surbuy-icon.png" },
    { rel: "apple-touch-icon", url: "/icon-180.png" },
  ],
};

export const viewport = {
  themeColor: "#5e17eb",
};

import { AuthProvider } from "@/components/providers/AuthProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { ProductCacheProvider } from "@/contexts/ProductCacheContext";
import { RequestCacheProvider } from "@/contexts/RequestCacheContext";
import { MarketplaceCacheProvider } from "@/contexts/MarketplaceCacheContext";
import { AppCacheProvider } from "@/contexts/AppCacheContext";
import RegisterServiceWorker from "@/components/pwa/RegisterServiceWorker";
import AppLaunchRedirector from "@/components/pwa/AppLaunchRedirector";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import { I18nProvider } from "@/contexts/I18nContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <I18nProvider>
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
          </I18nProvider>
        </ThemeProvider>
        <AppLaunchRedirector />
        <RegisterServiceWorker />
        <InstallPrompt />
      </body>
    </html>
  );
}
