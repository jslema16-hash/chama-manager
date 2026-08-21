import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chama Manager",
  description: "Manage your chama contributions, loans, and dividends",
  verification: {
    google: "uycCwohHx6-3TN1buTavQTslYcztY7O-JaG9_QIdY-0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
