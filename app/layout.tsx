/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import Background from "./components/Background"; // Import du fond animé

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stock-Local",
  description: "Application de gestion de stock de Lamat Abdellahi",
  icons: {
    icon: "/logo.svg", // Remplace par le chemin de ton icône
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}>
        <Background /> {/* Ajout du fond animé ici */}

        <div className="min-h-screen flex flex-col relative z-10">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        
        <ToastContainer />
      </body>
    </html>
  );
}
