import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlowSync - The Ultimate Freelancer OS",
  description:
    "Manage clients, projects, invoices, files, emails, and payments in one optimized workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} min-h-full flex flex-col font-sans antialiased`}
      >
        <Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,
    style: {
      borderRadius: "12px",
    },
  }}
/>

{children}
      </body>
    </html>
  );
}