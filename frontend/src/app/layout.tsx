import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import React, { Suspense } from "react";
import "./globals.css";
import DashboardShell from "../components/DashboardShell";
import { PermissionProvider } from "@/context/PermissionContext";
import { ToastProvider } from "@/components/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: 'Mamun Automobiles ERP',
  description: 'Enterprise Workshop ERP System',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased flex h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100`}>
        <PermissionProvider>
          <ToastProvider>
            <Suspense fallback={<div className="p-4 text-xs text-slate-400">Loading workspace...</div>}>
              <DashboardShell>
                {children}
              </DashboardShell>
            </Suspense>
          </ToastProvider>
        </PermissionProvider>
      </body>
    </html>
  );
}
