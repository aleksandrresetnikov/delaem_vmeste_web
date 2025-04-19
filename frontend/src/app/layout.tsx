import type {Metadata} from "next";
import {Montserrat} from "next/font/google";
import "../styles/globals.css";
import "../styles/fonts.css"
import PagePreloader from "@/components/shared/PagePreloader/PagePreloader";
import {Providers} from "@/providers";
import Modals from "@/modals/index";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Вместе Лучше",
  description: "",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="ru">
      <body
          className={`${montserrat.variable} antialiased`}
      >
      <Providers>
        <Modals/>
        {children}
      </Providers>
      <PagePreloader/>
      </body>
      </html>
  );
}
