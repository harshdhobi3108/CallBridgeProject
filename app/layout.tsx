// app/layout.tsx

import { ReactNode } from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import StreamClientProvider from "@/providers/StreamClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Call-Bridge",
  description: "Video calling App",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark-2`}>
        <ClerkProvider
          appearance={{
            layout: { socialButtonsVariant: "iconButton" },
            variables: {
              colorText: "#fff",
              colorPrimary: "#0E78F9",
              colorBackground: "#1C1F2E",
              colorInputBackground: "#252A41",
              colorInputText: "#fff",
            },
          }}
        >
          <Toaster />

          <StreamClientProvider>
            {children}
          </StreamClientProvider>

        </ClerkProvider>
      </body>
    </html>
  );
}

