import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FAISAL AWAD ISAM - Portfolio",
  description: "Computer Technology Engineer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
      style={{
        // @ts-ignore
        "--font-inter": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        "--font-playfair": "'Playfair Display', Georgia, Cambria, 'Times New Roman', serif"
      }}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
