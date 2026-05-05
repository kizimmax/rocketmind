import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider, Toaster } from "@rocketmind/ui";
import { AuthProvider } from "@/lib/auth-context";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "CMS — Rocketmind",
  description: "Админка маркетингового сайта Rocketmind",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="antialiased">
        <NextTopLoader color="var(--foreground)" showSpinner={false} height={2} />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
