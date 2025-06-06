import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font"; // Correct import path
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Provider } from "@/library/provider";
import { Theme } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "Sketch Mint",
  description: "Create the Nft of your dreams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <Theme>
          <Provider>{children}</Provider>
        </Theme>
      </body>
    </html>
  );
}
