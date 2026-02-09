import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Live Formation Feedback",
  description: "Plateforme de questionnaires diagnostiques avec recommandations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <main>
          <div className="container">{children}</div>
        </main>
      </body>
    </html>
  );
}
