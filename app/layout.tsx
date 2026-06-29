import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Design Checker — Imagina",
  description: "Evaluate work against Imagina's Coherent Creation framework.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
