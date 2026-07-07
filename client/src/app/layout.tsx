import type { Metadata } from "next";
import "./globals.css";

import AppProvider from "@/providers/AppProvider";
import RootLayout from "@/components/layout/RootLayout";
import Experience from "@/experience/core/Experience";
export const metadata: Metadata = {
  title: "SyncHub",
  description: "Creative Technology Studio",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <Experience />
          <RootLayout>{children}</RootLayout>
        </AppProvider>
      </body>
    </html>
  );
}
