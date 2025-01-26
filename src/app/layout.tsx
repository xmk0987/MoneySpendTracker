import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";

// Import the fonts
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CashTrail",
  description:
    "A web application that allows you to upload your bank statement csv so you can view your spending on a dashboard how you wish",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${inter.variable} antialiased`}
        style={{ fontFamily: "var(--font-manrope, sans-serif)" }}
      >
        {children}
      </body>
    </html>
  );
}
