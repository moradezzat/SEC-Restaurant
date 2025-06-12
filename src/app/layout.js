import { config } from "@fortawesome/fontawesome-svg-core";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import localFont from 'next/font/local';
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Inter } from 'next/font/google'
import { LanguageProvider } from '../context/LanguageContext'

config.autoAddCss = false;

const ruqaa = localFont({
  src: '../../public/Fonts/ArefRuqaa-Regular-1.ttf',
  variable: '--font-ruqaa'
});

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

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "SEC Restaurant",
  description: "Experience the best Egyptian food restaurant in Egypt. Enjoy traditional dishes like hawawshi, molokhia, tajin pasta, and grilled kofta made with fresh ingredients.",
  keywords: "Egyptian restaurant, Egyptian food, hawawshi, molokhia, tajin pasta, kofta, authentic Egyptian cuisine, Cairo restaurant, Bab el shaarya restaurant, Bab el sharia restaurant, Egyptian crepe, Crepe, Food, Kitchen, Cuisine, اكل شعبي, اكل مصري, كريب, كفته, محشي, كفتة, كبدة, كبده, قوانص, بانيه, بانية, فراخ, لحمة, لحمه, مطعم مصري, مطعم, مطبخ مصري, مطبخ, كريب مصري, مطعم ست الكل, ست الكل, مطبخ ست الكل",
  openGraph: {
    title: "SEC Restaurant",
    description: "Experience the best Egyptian food restaurant in Egypt. Enjoy traditional dishes made with fresh ingredients.",
    type: "website",
    siteName: "SEC Restaurant",
    locale: "ar_EG",
    images: [
      {
        url: "/Banner.jpg",
        alt: "SEC Restaurant - Authentic Egyptian Cuisine"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "SEC Restaurant",
    description: "Experience the best Egyptian food restaurant in Egypt. Enjoy traditional dishes made with fresh ingredients.",
    images: ["/Banner.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' ||
                    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              "name": "SEC Restaurant",
              "image": "/Banner.jpg",
              "description": "Experience the best Egyptian food restaurant in Egypt. Enjoy traditional dishes like hawawshi, molokhia, tajin pasta, and grilled kofta made with fresh ingredients.",
              "servesCuisine": "Egyptian",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "EG",
                "addressLocality": "Cairo",
                "addressRegion": "Cairo"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "reviewCount": "2"
              }
            })
          }}
        />
      </head>
      <body className={`${poppins.variable} ${cairo.variable} ${ruqaa.variable} font-poppins antialiased dark:bg-[#121212] ${inter.className}`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <SpeedInsights />
        <Analytics/>
      </body>
    </html>
  );
}