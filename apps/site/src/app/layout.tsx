import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@rocketmind/ui";

import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { PageLoader } from "@/components/ui/PageLoader";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { CanonicalLink } from "@/components/seo/CanonicalLink";
import { SiteModalProvider } from "@/components/site-modal-provider";
import { SITE_URL } from "@/lib/site-url";
import { getAllForms } from "@/lib/forms";
import { getSiteNav } from "@/lib/site-nav";

const robotoMono = Roboto_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rocketmind | Стратегия и бизнес-модели",
  description:
    "Помогаем командам искать, проверять и усиливать бизнес-модели, связывать стратегию с операционными действиями.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const forms = getAllForms();
  // Дефолтные ссылки для consent-чекбокса в формах берутся из футера —
  // одна точка правды на весь сайт. Relative paths переживают смену домена.
  const defaultConsentLinks = getSiteNav().legalLinks.map((l, i) => ({
    id: `legal-${i}`,
    label: l.label,
    url: l.href,
  }));
  return (
    <html lang="ru" suppressHydrationWarning className={robotoMono.variable}>
      <body className="antialiased">
        <CanonicalLink />
        <ScrollToTop />
        <PageLoader />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SiteModalProvider
            forms={forms}
            defaultConsentLinks={defaultConsentLinks}
          >
            <div className="dark flex min-h-screen flex-col bg-background font-body text-foreground">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </SiteModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
