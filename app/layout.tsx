import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rajput Gensets & Solar",
  description: "Rajput Gensets & Solar since 2005",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
