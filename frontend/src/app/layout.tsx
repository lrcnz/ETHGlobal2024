import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/providers/providers";
import Header from "./header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#eaeaea]`}
      >
        <Providers>
          <Header />
          <main className="max-w-[1120px] m-auto">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
