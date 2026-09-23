import { Cinzel, Noto_Serif_Gujarati, Outfit } from "next/font/google";
import "./globals.css";
import { getDb } from "@/lib/db";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const gujarati = Noto_Serif_Gujarati({
  variable: "--font-gujarati",
  subsets: ["gujarati"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateMetadata() {
  const db = await getDb();
  return {
    title: db.settings.seo_title || "Aarav & Diya's Wedding Invitation | આરવ અને દિયા",
    description: db.settings.seo_description || "Traditional Gujarati Wedding Invitation.",
    openGraph: {
      title: db.settings.seo_title,
      description: db.settings.seo_description,
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${gujarati.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="font-outfit min-h-full flex flex-col antialiased bg-[#FDFBF7]">
        {children}
      </body>
    </html>
  );
}
