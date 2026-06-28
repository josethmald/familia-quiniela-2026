import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Quiniela Mundial 2026 | ⚽ Tabla de Posiciones",
  description:
    "Quiniela privada del Mundial de Fútbol FIFA 2026. Consulta el ranking general, reportes diarios y pronósticos de cada participante.",
  keywords: ["quiniela", "mundial", "2026", "fifa", "pronósticos", "fútbol"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main className="container-app" style={{ paddingTop: '80px', paddingBottom: '40px', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
