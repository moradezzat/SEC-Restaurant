// import { Poppins } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600"],
//   variable: "--font-poppins",
// });

const poppins = localFont({
  src: [
    {
      path: '../../public/Fonts/Poppins/Poppins-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/Fonts/Poppins/Poppins-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/Fonts/Poppins/Poppins-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/Fonts/Poppins/Poppins-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-poppins',
});

const cairo = localFont({
  src: [
    {
      path: '../../public/Fonts/Cairo/Cairo-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/Fonts/Cairo/Cairo-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/Fonts/Cairo/Cairo-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-cairo',
});

export const metadata = {
  title: "SEC Restaurant",
  description: "Experience the best Egyptian food restaurant Egypt",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${cairo.variable} font-poppins antialiased`}>
        {children}
      </body>
    </html>
  );
}
