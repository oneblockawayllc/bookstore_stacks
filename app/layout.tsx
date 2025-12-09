import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bookstore Discover - AI-Powered Book Search",
  description: "Find your next favorite book with AI-powered natural language search",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
