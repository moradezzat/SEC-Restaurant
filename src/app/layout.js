import { config } from "@fortawesome/fontawesome-svg-core";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import localFont from 'next/font/local';
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { LanguageProvider } from '../context/LanguageContext';
import { DEFAULT_THEME } from '../config';
config.autoAddCss = false;

const ruqaa = localFont({
  src: '../../public/Fonts/ArefRuqaa-Regular-1.ttf',
  variable: '--font-ruqaa'
});

const rubik = localFont({
  src: [
    { path: '../../public/Fonts/Rubik/Rubik-Light.ttf', weight: '300', style: 'normal' },
    { path: '../../public/Fonts/Rubik/Rubik-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/Fonts/Rubik/Rubik-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../public/Fonts/Rubik/Rubik-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../../public/Fonts/Rubik/Rubik-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../../public/Fonts/Rubik/Rubik-ExtraBold.ttf', weight: '800', style: 'normal' },
    { path: '../../public/Fonts/Rubik/Rubik-Black.ttf', weight: '900', style: 'normal' },
    { path: '../../public/Fonts/Rubik/Rubik-LightItalic.ttf', weight: '300', style: 'italic' },
    { path: '../../public/Fonts/Rubik/Rubik-Italic.ttf', weight: '400', style: 'italic' },
    { path: '../../public/Fonts/Rubik/Rubik-MediumItalic.ttf', weight: '500', style: 'italic' },
    { path: '../../public/Fonts/Rubik/Rubik-SemiBoldItalic.ttf', weight: '600', style: 'italic' },
    { path: '../../public/Fonts/Rubik/Rubik-BoldItalic.ttf', weight: '700', style: 'italic' },
    { path: '../../public/Fonts/Rubik/Rubik-ExtraBoldItalic.ttf', weight: '800', style: 'italic' },
    { path: '../../public/Fonts/Rubik/Rubik-BlackItalic.ttf', weight: '900', style: 'italic' }
  ],
  variable: '--font-rubik'
});

export const metadata = {
  title: "SEC Restaurant",
  description: "Experience the best Egyptian food restaurant in Egypt. Enjoy traditional dishes like hawawshi, molokhia, tajin pasta, and grilled kofta made with fresh ingredients.",
  keywords: "Egyptian restaurant, Egyptian food, hawawshi, molokhia, tajin pasta, kofta, authentic Egyptian cuisine, Cairo restaurant, Bab el shaarya restaurant, Bab el sharia restaurant, Egyptian crepe, Crepe, Food, Kitchen, Cuisine, اكل شعبي, اكل مصري, كريب, كفته, محشي, كفتة, كبدة, كبده, قوانص, بانيه, بانية, فراخ, لحمة, لحمه, مطعم مصري, مطعم, مطبخ مصري, مطبخ, كريب مصري, مطعم ست الكل, ست الكل, مطبخ ست الكل",
  metadataBase: new URL('https://ssec.vercel.app'),
  openGraph: {
    title: "SEC Restaurant",
    description: "Experience the best Egyptian food restaurant in Egypt. Enjoy traditional dishes made with fresh ingredients.",
    type: "website",
    siteName: "SEC Restaurant",
    locale: "ar_EG",
    images: [
      {
        url: "assets/Banner.webp",
        alt: "SEC Restaurant - Authentic Egyptian Cuisine"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "SEC Restaurant",
    description: "Experience the best Egyptian food restaurant in Egypt. Enjoy traditional dishes made with fresh ingredients.",
    images: ["assets/Banner.webp"]
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
                const theme = localStorage.getItem('theme') || '${DEFAULT_THEME}';
                if (theme === 'dark') {
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
              "image": "assets/Banner.webp",
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
        <link
          rel="preload"
          href="https://ssec.vercel.app/_vercel/speed-insights/script.js"
          as="script"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://ssec.vercel.app/_vercel/insights/script.js"
          as="script"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${ruqaa.variable} ${rubik.variable} antialiased dark:bg-[#121212]`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <SpeedInsights />
        <Analytics/>
      </body>
    </html>
  );
}