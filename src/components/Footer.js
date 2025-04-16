import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faInstagram, faTiktok, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
    return (
        <div className="bg-[#2c3e50] text-white pt-8 pr-4 pb-4 pl-4 mt-16">
            <div className="max-w-[1200px] m-auto grid grid-cols-2 gap-8 px-8">
                <div className="grid grid-cols-2 gap-[1.5rem]">
                    <div className="footer-section">
                        <h3 className="text-[#e74c3c] text-[1.1rem] mb-4 text-center font-semibold cursor-default">Contact</h3>
                        <ul className="text-center list-none">
                            <li className="mb-[0.5rem]"><a href="mailto:official.sec@outlook.com" className="text-white no-underline transition-colors duration-300 ease inline-block hover:text-[#e74c3c]">official.sec@outlook.com</a></li>
                            <li className="mb-[0.5rem]"><a href="tel:+201028154813" className="text-white no-underline transition-colors duration-300 ease inline-block hover:text-[#e74c3c]">+20 10 28154813</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3 className="text-[#e74c3c] text-[1.1rem] mb-4 text-center font-semibold cursor-default">Location</h3>
                        <ul className="text-center list-none">
                            <li className="mb-[0.5rem]"><a href="https://maps.google.com" target="_blank" className="text-white no-underline transition-colors duration-300 ease inline-block hover:text-[#e74c3c]"><FontAwesomeIcon icon={faMapMarkerAlt}/> Google maps location</a></li>
                            <li className="mb-[0.5rem]">Port Said St. Bab El-Shaareya Sq. Cairo, EG</li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col items-center text-center pl-80 will-change-transform">
                    <img src="/Logo.png" alt="SEC Restaurant Logo" className="w-[100px] h-[100px] mb-[0.5rem] object-contain"/>
                    <h2 className="text-[1.5rem] text-[#e74c3c] mb-4 font-semibold cursor-default">SEC Restaurant</h2>
                    <div className="flex gap-[0.8rem] justify-center">
                        <a href="https://www.tiktok.com/@maryemahmed00" target="_blank" className="w-[35px] h-[35px] rounded-[50%] bg-[#34495e] flex items-center justify-center text-white no-underline transition-all duration-300 ease hover:bg-[#e74c3c] hover:scale-[1.1]">
                            <FontAwesomeIcon icon={faTiktok} size="lg"/>
                        </a>
                        <a href="https://www.facebook.com/marium8485" target="_blank" className="w-[35px] h-[35px] rounded-[50%] bg-[#34495e] flex items-center justify-center text-white no-underline transition-all duration-300 ease hover:bg-[#e74c3c] hover:scale-[1.1]">
                            <FontAwesomeIcon icon={faFacebookF} size="lg"/> 
                        </a>
                        <a href="https://instagram.com/sett.el.kol?igsh=MWJuZzdmNGU3NWhzMA==" target="_blank" className="w-[35px] h-[35px] rounded-[50%] bg-[#34495e] flex items-center justify-center text-white no-underline transition-all duration-300 ease hover:bg-[#e74c3c] hover:scale-[1.1]">
                            <FontAwesomeIcon icon={faInstagram} size="lg"/>
                        </a>
                        <a href="https://chat.whatsapp.com/Hnh0Ueh42eJLnKrhlcAEQs" target="_blank" className="w-[35px] h-[35px] rounded-[50%] bg-[#34495e] flex items-center justify-center text-white no-underline transition-all duration-300 ease hover:bg-[#e74c3c] hover:scale-[1.1]">
                            <FontAwesomeIcon icon={faWhatsapp} size="lg"/>
                        </a>
                    </div>
                </div>
            </div>
            <div className="text-center pt-4 mt-4 border-t border-t-[#ffffff1a] text-[#95a5a6] text-[0.8rem]">
                © 2025 SEC Restaurant. All rights reserved.
            </div>
        </div>
    )
}