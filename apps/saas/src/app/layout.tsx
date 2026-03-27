import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@rocketmind/ui";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Rocketmind",
  description: "AI-агенты для ведения кейсов",
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
        </ThemeProvider>
      </body>
    </html>
  );
}
