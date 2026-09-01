import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/footer";
import { Montserrat, Inter } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/*
  The site had no metadata at all: no title, so the browser tab and every search
  result showed the bare URL.

  Deliberately no `icons` key. app/favicon.ico, app/icon.png and
  app/apple-icon.png are picked up automatically and get correct rel, type and
  sizes generated from the files themselves. Declaring icons here would OVERRIDE
  those conventions — which is exactly how the app's favicon came to render
  nothing, pointing at one file that browsers could not decode.
*/
export const metadata: Metadata = {
  title: "ZoikoSocial — Animal Welfare Network",
  description:
    "Share moments, build communities, follow verified animal welfare news, and coordinate care safely, globally, and profanity-free.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${inter.variable} font-sans`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}