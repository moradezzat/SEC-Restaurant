import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faInstagram, faTiktok, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { useLanguage } from '../context/LanguageContext';
import Image from "next/image";

export default function Footer() {
    const { language, translations } = useLanguage();
    const Location = "https://www.google.com/maps/place/%D9%85%D8%B7%D8%B9%D9%85+%D8%B3%D8%AA+%D8%A7%D9%84%D9%83%D9%84%E2%80%AD/@30.0565194,31.2586596,19.25z/data=!4m6!3m5!1s0x145841007e126b75:0xb03469607d85e542!8m2!3d30.0566518!4d31.2588589!16s%2Fg%2F11lnhmhq3c?entry=tts&g_ep=EgoyMDI1MDIwOS4wIPu8ASoASAFQAw%3D%3D";

    return (
        <div className="bg-[#2c3e50] text-white pt-8 pr-4 pb-4 pl-4 mt-16 dark:bg-[#1f2327]">
            <div className="max-w-[1200px] m-auto px-8">
                {/* Desktop Layout */}
                <div className={`hidden lg:grid lg:grid-cols-2 lg:gap-8 ${language === 'ar' ? '' : 'lg:grid-flow-col-dense'}`}>
                    {/* Contact & Location Sections */}
                    <div className={`grid grid-cols-2 gap-[1.5rem] max-w-[550px] ${language === 'ar' ? 'mr-auto lg:order-1' : 'ml-auto lg:order-2'}`}>
                        <div className="footer-section max-w-[550px]">
                            <h3 className="text-[#e74c3c] text-[1.1rem] mb-4 text-center font-semibold cursor-default">{translations.footer.contactSection.title}</h3>
                            <ul className="text-center list-none">
                                <li className="mb-[0.5rem]"><a href="mailto:official.sec@outlook.com" className="text-white no-underline transition-colors duration-300 ease inline-block hover:text-[#e74c3c]">official.sec@outlook.com</a></li>
                                <li className="mb-[0.5rem]"><a href="tel:+201028154813" className="text-white no-underline transition-colors duration-300 ease inline-block hover:text-[#e74c3c]">+20 10 28154813</a></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h3 className="text-[#e74c3c] text-[1.1rem] mb-4 text-center font-semibold cursor-default">{translations.footer.locationSection.title}</h3>
                            <ul className="text-center list-none">
                                <li className="mb-[0.5rem]"><a href={Location} target="_blank" className="text-white no-underline transition-colors duration-300 ease inline-block hover:text-[#e74c3c]"><FontAwesomeIcon icon={faMapMarkerAlt}/> {translations.footer.locationSection.googleMaps}</a></li>
                                <li className="mb-[0.5rem]">{translations.footer.locationSection.geoLocation}</li>
                            </ul>
                        </div>
                    </div>
                    
                    {/* Branding Section */}
                    <div className={`flex flex-col items-center text-center justify-center max-w-[320px] ${language === 'ar' ? 'ml-auto mr-8 lg:order-2' : 'mr-auto ml-8 lg:order-1'}`}>
                        <Image
                            src='/assets/Logo.webp'
                            alt="SEC Restaurant Logo"
                            className="w-[100px] h-[100px] mb-[0.5rem] object-contain"
                            width={100}
                            height={100}
                        />
                        <h2 className={`text-2xl text-[#e74c3c] mb-4 font-semibold cursor-default ${language === 'ar' ? 'font-ruqaa' : ''}`}>{translations.footer.branding}</h2>
                        <div className="flex gap-[0.8rem] justify-center">
                            <a href="https://www.tiktok.com/@maryemahmed00" target="_blank" aria-label="Link to TikTok profile" className="w-[35px] h-[35px] rounded-[50%] bg-[#34495e] dark:bg-[#363b41] flex items-center justify-center text-white no-underline transition-all duration-300 ease hover:bg-[#e74c3c] dark:hover:bg-[#e74c3c] hover:scale-[1.1] will-change-transform">
                                <FontAwesomeIcon icon={faTiktok} size="lg" className="hover:text-[#2c3e50]"/>
                            </a>
                            <a href="https://www.facebook.com/marium8485" target="_blank" aria-label="Link to Facebook profile" className="w-[35px] h-[35px] rounded-[50%] bg-[#34495e] dark:bg-[#363b41] flex items-center justify-center text-white no-underline transition-all duration-300 ease hover:bg-[#e74c3c] dark:hover:bg-[#e74c3c] hover:scale-[1.1] will-change-transform">
                            <a href="https://www.facebook.com/marium8485" target="_blank" aria-label="Link to our Facebook page" className="w-[35px] h-[35px] rounded-[50%] bg-[#34495e] dark:bg-[#363b41] flex items-center justify-center text-white no-underline transition-all duration-300 ease hover:bg-[#e74c3c] dark:hover:bg-[#e74c3c] hover:scale-[1.1] will-change-transform">
                                <FontAwesomeIcon icon={faFacebookF} size="lg"/> 
                            </a>
                            <a href="https://instagram.com/sett.el.kol?igsh=MWJuZzdmNGU3NWhzMA==" target="_blank" aria-label="Link to our Instagram page" className="w-[35px] h-[35px] rounded-[50%] bg-[#34495e] dark:bg-[#3d444b] flex items-center justify-center text-white no-underline transition-all duration-300 ease hover:bg-[#e74c3c] dark:hover:bg-[#e74c3c] hover:scale-[1.1] will-change-transform">
                                <FontAwesomeIcon icon={faInstagram} size="lg"/>
                            </a>
                            <a href="https://chat.whatsapp.com/Hnh0Ueh42eJLnKrhlcAEQs" target="_blank" aria-label="Link to our WhatsApp group" className="w-[35px] h-[35px] rounded-[50%] bg-[#34495e] dark:bg-[#363b41] flex items-center justify-center text-white no-underline transition-all duration-300 ease hover:bg-[#e74c3c] dark:hover:bg-[#e74c3c] hover:scale-[1.1] will-change-transform">
                                <FontAwesomeIcon icon={faWhatsapp} size="lg"/>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Tablet Layout */}
                <div className="hidden sm:block lg:hidden">
                    <div className={`grid grid-cols-2 gap-8 ${language === 'ar' ? '' : 'grid-flow-col-dense'}`}>
                        {/* Contact & Location Sections */}
                        <div className={`flex flex-col space-y-6 max-w-[360px] ${language === 'ar' ? 'mr-auto ml-6 order-1' : 'ml-auto mr-6 order-2'}`}>
                            <div className="footer-section">
                                <h3 className="text-[#e74c3c] text-[1rem] mb-3 text-center font-semibold cursor-default">{translations.footer.contactSection.title}</h3>
                                <ul className="text-center list-none text-sm">
                                    <li className="mb-[0.4rem]"><a href="mailto:official.sec@outlook.com" className="text-white no-underline transition-colors duration-300 ease inline-block hover:text-[#e74c3c]">official.sec@outlook.com</a></li>
                                    <li className="mb-[0.4rem]"><a href="tel:+201028154813" className="text-white no-underline transition-colors duration-300 ease inline-block hover:text-[#e74c3c]">+20 10 28154813</a></li>
                                </ul>
                            </div>
                            <div className="footer-section">
                                <h3 className="text-[#e74c3c] text-[1rem] mb-3 text-center font-semibold cursor-default">{translations.footer.locationSection.title}</h3>
                                <ul className="text-center list-none text-sm">
                                    <li className="mb-[0.4rem]"><a href="https://maps.google.com" target="_blank" className="text-white no-underline transition-colors duration-300 ease inline-block hover:text-[#e74c3c]"><FontAwesomeIcon icon={faMapMarkerAlt}/> {translations.footer.locationSection.googleMaps}</a></li>
                                    <li className="mb-[0.4rem]">{translations.footer.locationSection.geoLocation}</li>
                                </ul>
                            </div>
                        </div>
                        
                        {/* Branding Section */}
                        <div className={`flex flex-col items-center text-center justify-center max-w-[280px] ${language === 'ar' ? 'ml-auto mr-6 order-2' : 'mr-auto ml-6 order-1'}`}>
                            <Image
                                src='/assets/Logo.webp'
                                alt="SEC Restaurant Logo"
                                className="w-[100px] h-[100px] mb-[0.5rem] object-contain"
                                width={100}
                                height={100}
                            />
                            <h2 className={`text-2xl text-[#e74c3c] mb-4 font-semibold cursor-default ${language === 'ar' ? 'font-ruqaa' : ''}`}>{translations.footer.branding}</h2>
                            <div className="flex gap-[0.8rem] justify-center">
                                <a href="https://www.tiktok.com/@maryemahmed00" target="_blank" className="w-[35px] h-[35px] rounded-[50%] bg-[#34495e] dark:bg-[#363b41] flex items-center justify-center text-white no-underline transition-all duration-300 ease hover:bg-[#e74c3c] dark:hover:bg-[#e74c3c] hover:scale-[1.1] will-change-transform">
                                    <FontAwesomeIcon icon={faTiktok} size="lg"/>
                                </a>
                                <a href="https://www.facebook.com/marium8485" target="_blank" className="w-[35px] h-[35px] rounded-[50%] bg-[#34495e] dark:bg-[#363b41] flex items-center justify-center text-white no-underline transition-all duration-300 ease hover:bg-[#e74c3c] dark:hover:bg-[#e74c3c] hover:scale-[1.1] will-change-transform">
                                    <FontAwesomeIcon icon={faFacebookF} size="lg"/> 
                                </a>
                                <a href="https://instagram.com/sett.el.kol?igsh=MWJuZzdmNGU3NWhzMA==" target="_blank" className="w-[35px] h-[35px] rounded-[50%] bg-[#34495e] dark:bg-[#363b41] flex items-center justify-center text-white no-underline transition-all duration-300 ease hover:bg-[#e74c3c] dark:hover:bg-[#e74c3c] hover:scale-[1.1] will-change-transform">
                                    <FontAwesomeIcon icon={faInstagram} size="lg"/>
                                </a>
                                <a href="https://chat.whatsapp.com/Hnh0Ueh42eJLnKrhlcAEQs" target="_blank" className="w-[35px] h-[35px] rounded-[50%] bg-[#34495e] dark:bg-[#363b41] flex items-center justify-center text-white no-underline transition-all duration-300 ease hover:bg-[#e74c3c] dark:hover:bg-[#e74c3c] hover:scale-[1.1] will-change-transform">
                                    <FontAwesomeIcon icon={faWhatsapp} size="lg"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Layout - No changes needed as it's stacked vertically */}
                <div className="block sm:hidden">
                    <div className="Branding flex flex-col items-center text-center space-y-4">
                        <Image
                            src='/assets/Logo.webp'
                            alt="SEC Restaurant Logo"
                            className="w-[90px] h-[90px] object-contain"
                            width={90}
                            height={90}
                        />
                        <h2 className={`text-[1.2rem] text-[#e74c3c] font-semibold cursor-default ${language === 'ar' ? 'font-ruqaa' : ''}`}>{translations.footer.branding}</h2>
                        <div className="flex gap-[0.6rem] justify-center">
                            <a href="https://www.tiktok.com/@maryemahmed00" target="_blank" className="w-[32px] h-[32px] rounded-[50%] bg-[#34495e] dark:bg-[#363b41] flex items-center justify-center text-white no-underline transition-all duration-300 ease hover:bg-[#e74c3c] dark:hover:bg-[#e74c3c] hover:scale-[1.1]">
                                <FontAwesomeIcon icon={faTiktok} size="sm"/>
                            </a>
                            <a href="https://www.facebook.com/marium8485" target="_blank" className="w-[32px] h-[32px] rounded-[50%] bg-[#34495e] dark:bg-[#363b41] flex items-center justify-center text-white no-underline transition-all duration-300 ease hover:bg-[#e74c3c] dark:hover:bg-[#e74c3c] hover:scale-[1.1]">
                                <FontAwesomeIcon icon={faFacebookF} size="sm"/> 
                            </a>
                            <a href="https://instagram.com/sett.el.kol?igsh=MWJuZzdmNGU3NWhzMA==" target="_blank" className="w-[32px] h-[32px] rounded-[50%] bg-[#34495e] dark:bg-[#363b41] flex items-center justify-center text-white no-underline transition-all duration-300 ease hover:bg-[#e74c3c] dark:hover:bg-[#e74c3c] hover:scale-[1.1]">
                                <FontAwesomeIcon icon={faInstagram} size="sm"/>
                            </a>
                            <a href="https://chat.whatsapp.com/Hnh0Ueh42eJLnKrhlcAEQs" target="_blank" className="w-[32px] h-[32px] rounded-[50%] bg-[#34495e] dark:bg-[#363b41] flex items-center justify-center text-white no-underline transition-all duration-300 ease hover:bg-[#e74c3c] dark:hover:bg-[#e74c3c] hover:scale-[1.1]">
                                <FontAwesomeIcon icon={faWhatsapp} size="sm"/>
                            </a>
                        </div>
                        <div className="w-full space-y-4">
                            <div className="footer-section">
                                <h3 className="text-[#e74c3c] text-[0.95rem] mb-2 text-center font-semibold cursor-default">{translations.footer.contactSection.title}</h3>
                                <ul className="text-center list-none text-sm">
                                    <li className="mb-[0.3rem]"><a href="mailto:official.sec@outlook.com" className="text-white no-underline transition-colors duration-300 ease inline-block hover:text-[#e74c3c]">official.sec@outlook.com</a></li>
                                    <li className="mb-[0.3rem]"><a href="tel:+201028154813" className="text-white no-underline transition-colors duration-300 ease inline-block hover:text-[#e74c3c]">+20 10 28154813</a></li>
                                </ul>
                            </div>
                            <div className="footer-section">
                                <h3 className="text-[#e74c3c] text-[0.95rem] mb-2 text-center font-semibold cursor-default">{translations.footer.locationSection.title}</h3>
                                <ul className="text-center list-none text-sm">
                                    <li className="mb-[0.3rem]"><a href="https://maps.google.com" target="_blank" className="text-white no-underline transition-colors duration-300 ease inline-block hover:text-[#e74c3c]"><FontAwesomeIcon icon={faMapMarkerAlt}/> {translations.footer.locationSection.googleMaps}</a></li>
                                    <li className="mb-[0.3rem]">{translations.footer.locationSection.geoLocation}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center pt-4 mt-4 border-t border-t-[#ffffff1a] text-[#95a5a6] text-[0.8rem] cursor-default">
                {translations.footer.copyright}
            </div>
        </div>
    )
}