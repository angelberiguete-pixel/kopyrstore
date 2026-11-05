import type { Metadata } from "next";
import "./styles.css";
export const metadata: Metadata = { title: "KOPYR STORE | Descubre tu próximo hallazgo", description: "Catálogo KOPYR STORE. Disponibilidad sujeta a confirmación." };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>;}