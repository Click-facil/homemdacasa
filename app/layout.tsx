import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Homem da Casa - Click Fácil",
  description: "Assistente de reparos domésticos inteligente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}