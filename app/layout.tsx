// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "FW Figure Shop",
  description: "E-commerce figure anime untuk simulasi SOC/SIEM.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="primary-dark text-text-light">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
