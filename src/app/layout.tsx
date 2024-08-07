import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import GlobalContextProvider from "@/helpers/ContextProvider";

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500'] });

export const metadata: Metadata = {
  title: "Middleman",
  description: "This is app to make easier youtube management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <GlobalContextProvider>
      <body className={poppins.className}>{children}</body>
      </GlobalContextProvider>
    </html>
  );
}
