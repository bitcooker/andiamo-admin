import "./global.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Andiamo Admin",
  description: "Admin site for Andiamo app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body className="overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-thumb-rounded-full">
        {children}
      </body>
    </html>
  );
}
