import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider, Toaster, TooltipProvider } from "@rocketmind/ui";

export const metadata: Metadata = {
  title: "Rocketmind Internal",
  description: "Internal tools and experiments",
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
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
          </TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
