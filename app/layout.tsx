import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Lock } from "lucide-react";
import Link from "next/link";
import { HelpButton } from "@/components/help-button";
import { GithubButton } from "@/components/github-button";
import { ThemeToggle } from "@/components/theme-toggle";
import localFont from 'next/font/local'
import { cn } from "@/lib/utils";

const allianceNo2 = localFont({
  src: '../public/AllianceNo2.otf',
})

const MAIN_URL = "https://secreteer.com";
const APP_DESCRIPTION = "Share a secret with a link that expires. No account required.";

const description = APP_DESCRIPTION;
const title = "SECRETeer";
const author = "Nabil Mansour";
const keywords = "SECRETeer, SECRETeer, sharing, platform, Nabil Mansour, free";
const imageLink = `${MAIN_URL}/SECRETeer.png`;

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s | " + title,
  },
  description: description,
  alternates: {
    canonical: `${MAIN_URL}`
  },
  keywords: keywords,
  openGraph: {
    title: title,
    description: description,
    url: `${MAIN_URL}`,
    type: "website",
    images: [{ url: imageLink, alt: title, }],
    locale: 'en_US',
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    images: [imageLink],
  },
  authors: { name: author },
  creator: author,
  publisher: author,
  verification: {
    google: "YeO8EKlg14bubpZAMtdqlID8n_248H-GXfSok9VttTY"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${allianceNo2.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <div className="min-h-screen flex flex-col">
              <header className="py-2 px-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                  <Link href="/">
                    <span className="font-bold text-2xl flex gap-0.5" title='Go to homepage'>
                      SECRETeer
                      <Lock className='w-4' />
                    </span>
                  </Link>
                  <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <HelpButton />
                    <GithubButton />
                  </div>
                </div>
              </header>

              <main className="flex-1 flex items-center justify-center p-4">
                {children}
              </main>

              <div
                className={cn(
                  "absolute inset-0 z-[-10]",
                  "[background-size:20px_20px]",
                  "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
                  "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
                )}
              />
              <div className="pointer-events-none z-[-10] absolute inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-background" />

            </div>
            <Toaster position="bottom-center" />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
