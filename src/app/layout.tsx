import type { Metadata } from "next";
import { Inter, Fredoka, Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Muara Teweh Furniture | Mebel Online",
    template: "%s | Muara Teweh Furniture",
  },
  description:
    "Toko mebel online terpercaya di Muara Teweh. Menyediakan berbagai furniture berkualitas untuk rumah Anda.",
  keywords: [
    "mebel",
    "furniture",
    "Muara Teweh",
    "kursi",
    "meja",
    "lemari",
    "sofa",
    "interior",
  ],
  openGraph: {
    title: "Muara Teweh Furniture",
    description:
      "Toko mebel online terpercaya di Muara Teweh. Furniture berkualitas untuk rumah Anda.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${inter.variable} ${fredoka.variable} ${poppins.variable} font-sans antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </body>
    </html>
  );
}