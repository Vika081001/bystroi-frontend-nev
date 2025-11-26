import Footer from "@/widgets/footer";
import { Header } from "@/widgets/header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import { Providers } from "./providers";
import "./styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Магазин",
  description: "Темплейт",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`bg-white text-gray-800 ${inter.className}`}>
      <body className="h-screen relative z-10">
        <Header />
        <main>
          <Providers>{children}</Providers>
        </main>
        <Footer />
        <Toaster closeButton />
      </body>
    </html>
  );
}
