import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" });

export const metadata: Metadata = {
  title: "ClaimGuard",
  description: "Catch insurance claim errors before submission.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fredoka.variable} antialiased min-h-screen flex flex-col relative`}>
        <div className="bg-mesh animate-blob-float" />
        <Nav />
        <main className="flex-grow pt-24 pb-12 px-4 max-w-7xl mx-auto w-full z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
