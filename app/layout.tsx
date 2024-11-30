import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/provider";
import ConditionalWrapper from "@/components/ConditionalWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const robotoMono = localFont({
  src: "./fonts/RobotoMono-Regular.woff",
  variable: "--font-roboto-mono",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SnapRealm",
  description: "Generated your own next Memories",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    console.log("user couldn't be found");
  }

  return (
    <html lang="en">
      <body
        className={`${robotoMono.variable} ${geistSans.variable} ${geistMono.variable} antialiased dark text-white m-0`}
      >
        <Providers>
          <ConditionalWrapper
            username={session?.user?.username as string}
            image={session?.user?.image as string}
          >
            {children}
          </ConditionalWrapper>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
