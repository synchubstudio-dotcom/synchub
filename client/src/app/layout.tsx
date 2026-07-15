import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

import AppProvider from "@/providers/AppProvider";
import RootLayout from "@/components/layout/RootLayout";
import Experience from "@/experience/core/Experience";
import Navbar from "@/components/layout/Navbar";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

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
    <html lang="en" className={spaceGrotesk.variable}>
      <body>
        <AppProvider>
          <Navbar />
          <Experience />
          <RootLayout>{children}</RootLayout>
        </AppProvider>
      </body>
    </html>
  );
}
