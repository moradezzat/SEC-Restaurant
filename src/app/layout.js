import { config } from "@fortawesome/fontawesome-svg-core";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from '../context/LanguageContext';
import { DEFAULT_THEME } from '../config';
import localFont from 'next/font/local';
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
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
  title: "مطعم ست الكل",
  description: "جرب أفضل واشهي الأكلات من مطعم ست الكل في مصر. استمتع بالأكلات التقليدية زي الحواوشي, والملوخية, وطاجن المكرونة, والكفتة المشوية الي معمولة من مكونات طازجة",
  keywords: "مطعم ست الكل, اكل مصري, مطعم مصري, set el kol restaurant, egyptian restaurant, egyptian food",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="a1FcVANdkoJgNPh7BLNeCNFOxd3Dr07S1pFGLNeQsuA" />
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
        {/* Organization Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "url": "https://ssec.vercel.app/",
          "sameAs": ["https://www.facebook.com/marium8485", "https://www.instagram.com/sett.el.kol?igsh=MWJuZzdmNGU3NWhzMA%3D%3D", "https://chat.whatsapp.com/Hnh0Ueh42eJLnKrhlcAEQs", "https://www.tiktok.com/@maryemahmed00"],
          "logo": "https://i.ibb.co/ym6LV7yJ/Logo.png",
          "name": "مطعم ست الكل",
          "alternateName": "Set El-Kol Restaurant",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "شارع بورسعيد امام شركة وي",
            "addressLocality": "باب الشعرية",
            "addressRegion": "القاهرة",
            "addressCountry": "EG",
            "postalCode": "4333001"
          },
          "email": "official.sec@outlook.com",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+201028154813",
            "email": "official.sec@outlook.com"
          },
          "description": "مطعم مصري يقدم أشهى الأكلات المصرية التقليدية في قلب القاهرة.",
          "foundingDate": "2024-10-18T16:00:00.000Z",
          "numberOfEmployees": {
            "@type": "QuantitativeValue",
            "minValue": 5,
            "maxValue": 10
          }
        }) }} />

        {/* Local Business Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          "name": "مطعم ست الكل",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "شارع بورسعيد امام شركة وي",
            "addressLocality": "باب الشعرية",
            "addressRegion": "القاهرة",
            "addressCountry": "EG",
            "postalCode": "4333001"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 30.0566703,
            "longitude": 31.2586887
          },
          "url": "https://ssec.vercel.app/",
          "image": "https://i.ibb.co/hJXLcW9d/IMG-9862.jpg",
          "priceRange": "$$",
          "telephone": "+201028154813",
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
              ],
              "opens": "00:00",
              "closes": "23:59"
            }
          ],
          "servesCuisine": "Egyptian",
          "menu": "https://ssec.vercel.app/menu",
          "logo": "https://i.ibb.co/ym6LV7yJ/Logo.png",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "reviewCount": "3"
          }
        }) }} />

        {/* Review Snippet Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          "name": "مطعم ست الكل",
          "url": "https://ssec.vercel.app/",
          "image": "https://i.ibb.co/hJXLcW9d/IMG-9862.jpg",
          "servesCuisine": "Egyptian",
          "priceRange": "$$",
          "telephone": "+201028154813",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "reviewCount": 3
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "شارع بورسعيد امام شركة وي",
            "addressLocality": "باب الشعرية",
            "addressRegion": "القاهرة",
            "addressCountry": "EG",
            "postalCode": "4333001"
          },
          "review": [
            {
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": "Stratis Adalis"
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": 5,
                "bestRating": 5
              },
              "reviewBody": "Amazing food and service. True Egyptian cuisine! Highly recommended it.",
              "datePublished": "2025-05-03"
            },
            {
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": "Noor Aden"
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": 5,
                "bestRating": 5
              },
              "reviewBody": "Excellent food, excellent service, and success after success.",
              "datePublished": "2025-06-22"
            },
            {
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": "Unknown"
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": 5,
                "bestRating": 5
              },
              "reviewBody": "دي اول مره اجرب الأكل عندكم وبجد عاوز اشكر حضرتك عالأكل، حاجه في منتهي الروعه ما شاء الله، إن شاء الله مش هتبقي اخر مره اجي عندكم.",
              "datePublished": "2025-03-01"
            }
          ]
        }) }} />

        {/* Breadcrumb List Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://ssec.vercel.app/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Menu",
              "item": "https://ssec.vercel.app/menu"
            }
          ]
        }) }} />

        {/* OpenGraph */}
        <meta property="og:title" content="مطعم ست الكل" />
        <meta property="og:description" content="جرب أفضل واشهي الأكلات من مطعم ست الكل في مصر. استمتع بالأكلات التقليدية زي الحواوشي, والملوخية, وطاجن المكرونة, والكفتة المشوية الي معمولة من مكونات طازجة" />
        <meta property="og:url" content="https://ssec.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ar_EG" />
        <meta property="og:site_name" content="مطعم ست الكل" />
        <meta property="og:image" content="/assets/openGraph image.png" />
        <meta property="og:image:secure_url" content="/assets/openGraph image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="صورة مطعم ست الكل" />

        {/* Vercel Analytics & Insights Related Links */}
        <link rel="preload" href="https://ssec.vercel.app/_vercel/speed-insights/script.js" as="script" crossOrigin="anonymous" />
        <link rel="preload" href="https://ssec.vercel.app/_vercel/insights/script.js" as="script" crossOrigin="anonymous" />
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