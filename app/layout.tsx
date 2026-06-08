import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Relatório Mensal — Meta Ads",
  description:
    "Acompanhe métricas mensais de campanhas Meta Ads e vendas com comparativos mês a mês.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📊</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body className="antialiased bg-stone-50 dark:bg-[#0D0D0F] transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
