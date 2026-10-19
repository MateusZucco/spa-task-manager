import type { Metadata } from "next";
import { AppLayout } from "../components/AppLayout";

export const metadata: Metadata = {
  title: "TASK MANAGER",
  description: "A simple task management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppLayout>{children}</AppLayout>;
}
