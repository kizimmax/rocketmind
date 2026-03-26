import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@rocketmind/ui";

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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
