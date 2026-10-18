import "../globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppHeader } from "@/app/components/AppHeader";
import { AppStateSync } from "@/app/components/AppStateSync";
import { TRPCReactProvider } from '../../trpc/client';

export const metadata: Metadata = {
  title: "TO DO LIST",
  description: "A simple task management app",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppStateSync />
        <AppHeader />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
