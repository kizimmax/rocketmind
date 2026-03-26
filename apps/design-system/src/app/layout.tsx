import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider, Toaster, TooltipProvider } from "@rocketmind/ui"

export const metadata: Metadata = {
  title: "Rocketmind Design System",
  description: "Design system documentation for Rocketmind SaaS platform",
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
          <TooltipProvider>
            {children}
          </TooltipProvider>
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
