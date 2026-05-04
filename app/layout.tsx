import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/ThemeProvider";
import BottomNav from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "Lumina — Where Ideas Ignite",
  description: "A futuristic AI-augmented blogging platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}