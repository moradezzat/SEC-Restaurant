import { config } from "@fortawesome/fontawesome-svg-core";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import localFont from 'next/font/local';
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

const poppins = localFont({
  src: [
    { path: '../../public/Fonts/Poppins/Poppins-Light.ttf', weight: '300', style: 'normal' },
    { path: '../../public/Fonts/Poppins/Poppins-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/Fonts/Poppins/Poppins-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../public/Fonts/Poppins/Poppins-SemiBold.ttf', weight: '600', style: 'normal' }
  ],
  variable: '--font-poppins'
});

const cairo = localFont({
  src: [
    { path: '../../public/Fonts/Cairo/Cairo-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/Fonts/Cairo/Cairo-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../public/Fonts/Cairo/Cairo-SemiBold.ttf', weight: '600', style: 'normal' }
  ],
  variable: '--font-cairo'
});

export const metadata = {
  title: "SEC Restaurant",
  description: "Experience the best Egyptian food restaurant in Egypt. Enjoy traditional dishes like hawawshi, molokhia, tajin pasta, and grilled kofta made with fresh ingredients.",
  keywords: "Egyptian restaurant, Egyptian food, hawawshi, molokhia, tajin pasta, kofta, authentic Egyptian cuisine, Cairo restaurant, Bab el shaarya restaurant, Bab el sharia restaurant, Egyptian crepe, Crepe, Food, Kitchen, Cuisine, اكل شعبي, اكل مصري, كريب, كفته, محشي, كفتة, كبدة, كبده, قوانص, بانيه, بانية, فراخ, لحمة, لحمه, مطعم مصري, مطعم, مطبخ مصري, مطبخ, كريب مصري, مطعم ست الكل, ست الكل, مطبخ ست الكل",
  openGraph: {
    title: "SEC Restaurant",
    description: "Experience the best Egyptian food restaurant in Egypt. Enjoy traditional dishes made with fresh ingredients.",
    type: "website",
    siteName: "SEC Restaurant",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="">
      <body className={`${poppins.variable} ${cairo.variable} font-poppins antialiased dark:bg-[#121212] transition-colors duration-300 ease`}>
        {children}
        <SpeedInsights />
        <Analytics/>
      </body>
    </html>
  );
}