import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider, Toaster } from "@rocketmind/ui";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Rocketmind",
  description: "AI-агенты для ведения кейсов",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
