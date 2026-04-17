import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@rocketmind/ui";

import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { PageLoader } from "@/components/ui/PageLoader";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

const robotoMono = Roboto_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Rocketmind | Стратегия и бизнес-модели",
  description:
    "Помогаем командам искать, проверять и усиливать бизнес-модели, связывать стратегию с операционными действиями.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning className={robotoMono.variable}>
      <body className="antialiased">
        <ScrollToTop />
        <PageLoader />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="dark flex min-h-screen flex-col bg-background font-body text-foreground">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
