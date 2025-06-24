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
  title: "SEC Restaurant",
  description: "Experience the best Egyptian food restaurant in Egypt. Enjoy traditional dishes like hawawshi, molokhia, tajin pasta, and grilled kofta made with fresh ingredients.",
  keywords: "مطعم ست الكل, اكل مصري, مطعم مصري, sec restaurant, egyptian restaurant, egyptian food",
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
        {/* Vercel Analytics & Insights Related Links */}
        <link rel="preload" href="https://ssec.vercel.app/_vercel/speed-insights/script.js" as="script" crossOrigin="anonymous" />
        <link rel="preload" href="https://ssec.vercel.app/_vercel/insights/script.js" as="script" crossOrigin="anonymous" />      </head>
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