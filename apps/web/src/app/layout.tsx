import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Zakaria Auto Group LLC | Quality Cars, Transparent Deals | Marietta, GA",
  description:
    "Explore quality pre-owned vehicles, transparent pricing, and flexible financing at Zakaria Auto Group LLC. Located at 706 Roswell St SE, Marietta, GA.",
  keywords: [
    "Zakaria Auto Group LLC",
    "Used cars Marietta GA",
    "Pre-owned vehicles",
    "Auto dealership Marietta",
    "Car financing Georgia",
  ],
  openGraph: {
    title: "Zakaria Auto Group LLC | Quality Cars, Transparent Deals",
    description: "Quality pre-owned selection, transparent pricing, and trusted service in Marietta, GA.",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
