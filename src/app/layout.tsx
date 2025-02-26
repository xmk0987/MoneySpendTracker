import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { DashboardDataProvider } from "@/context/DashboardDataProvider";

// Import Google Fonts
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Metadata for SEO and Social Sharing
export const metadata: Metadata = {
  title: "Money Spend Tracker - Track Your Expenses & Budget",
  description:
    "Easily upload your bank statements and get a smart dashboard to track your expenses, spending, and budget insights. Improve your financial health today!",
  keywords: [
    "money spend tracker",
    "expense tracker",
    "budget tracker",
    "spending analysis",
    "finance dashboard",
    "bank statement analysis",
  ].join(", "),
  authors: [{ name: "Your Name or Company" }],
  metadataBase: new URL("https://moneyspendtracker.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Viewport for mobile responsiveness */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Structured Data for SEO (Google Rich Snippets) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Money Spend Tracker",
              description:
                "A web application to track and visualize your expenses by uploading bank statements.",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              url: "https://moneyspendtracker.com",
            }),
          }}
        />
      </head>
      <body
        className={`${manrope.variable} ${inter.variable} antialiased`}
        style={{ fontFamily: "var(--font-manrope, sans-serif)" }}
      >
        <DashboardDataProvider>{children}</DashboardDataProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
