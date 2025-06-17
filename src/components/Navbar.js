"use client";
import { useState } from 'react';
import MenuModal from './MenuModal';
import ContactModal from './ContactModal';
import Sidenav from './Sidenav';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isSidenavOpen, setIsSidenavOpen] = useState(false);
    const { language, translations } = useLanguage();

    const displayMenuModal = () => {
        setIsMenuOpen(true);
    };

    const displayContactModal = () => {
        setIsContactOpen(true);
    };

    const displaySidenav = () => {
        setIsSidenavOpen(true);
    };

    const scrollToAbout = () => {
        requestAnimationFrame(() => {
          const aboutSection = document.querySelector('.about');
          if (!aboutSection) return;
    
          const sectionTop = aboutSection.getBoundingClientRect().top + window.scrollY;
          const scrollPosition = sectionTop - 50;
          
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
        });
    };

    const handleNavClick = (e) => {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        if (href === '/') {
            window.location.href = href;
        }
    };

    return (
        <>
            <nav className={`navContainer bg-white px-8 py-4 shadow-md flex justify-between items-center fixed w-full top-0 z-50 dark:bg-[#121212] dark:shadow-2xl transition-all duration-300 ease ${language === 'ar' ? 'rtl' : 'ltr'}`}>
                {language === 'ar' ? (
                    <>
                        <div className={`flex flex-col justify-between w-[30px] h-[21px] cursor-pointer ${language === 'ar' ? 'mr-8' : 'ml-8'}`} onClick={displaySidenav}> 
                            <span className={`block mr-auto w-full h-[3px] bg-[#e74c3c] rounded-[3px] transition-all duration-300 ease`}></span>
                            <span className={`block mr-auto w-[75%] h-[3px] bg-[#e74c3c] rounded-[3px] transition-all duration-300 ease`}></span>
                            <span className={`block mr-auto w-[50%] h-[3px] bg-[#e74c3c] rounded-[3px] transition-all duration-300 ease`}></span>
                        </div>
                        <div className="aContainer flex gap-8 items-center flex-row-reverse">
                            <a href="/" onClick={handleNavClick} className="no-underline text-[#333333] font-medium transition-all duration-300 ease hover:text-[#e74c3c] dark:text-[#e1e1e1] dark:hover:text-[#e74c3c]">{translations.navbar.home}</a>
                            <a onClick={displayMenuModal} className="cursor-pointer no-underline text-[#333333] font-medium transition-all duration-300 ease hover:text-[#e74c3c] dark:text-[#e1e1e1] dark:hover:text-[#e74c3c]">{translations.navbar.menu}</a>
                            <a onClick={displayContactModal} className="cursor-pointer no-underline text-[#333333] font-medium transition-all duration-300 ease hover:text-[#e74c3c] dark:text-[#e1e1e1] dark:hover:text-[#e74c3c]">{translations.navbar.contact}</a>
                            <a onClick={scrollToAbout} className='cursor-pointer no-underline text-[#333333] font-medium transition-all duration-300 ease hover:text-[#e74c3c] dark:text-[#e1e1e1] dark:hover:text-[#e74c3c]'>{translations.navbar.about}</a>
                        </div>
                        <div className="text-[1.5rem] font-ruqaa text-[#e74c3c] cursor-default">{translations.navbar.brand}</div>
                    </>
                ) : (
                    <>
                        <div className="text-[1.5rem] font-semibold text-[#e74c3c] cursor-default">{translations.navbar.brand}</div>
                        <div className="aContainer flex gap-8 items-center">
                            <a href="/" onClick={handleNavClick} className="no-underline text-[#333333] font-medium transition-all duration-300 ease hover:text-[#e74c3c] dark:text-[#e1e1e1] dark:hover:text-[#e74c3c]">{translations.navbar.home}</a>
                            <a onClick={displayMenuModal} className="cursor-pointer no-underline text-[#333333] font-medium transition-all duration-300 ease hover:text-[#e74c3c] dark:text-[#e1e1e1] dark:hover:text-[#e74c3c]">{translations.navbar.menu}</a>
                            <a onClick={displayContactModal} className="cursor-pointer no-underline text-[#333333] font-medium transition-all duration-300 ease hover:text-[#e74c3c] dark:text-[#e1e1e1] dark:hover:text-[#e74c3c]">{translations.navbar.contact}</a>
                            <a onClick={scrollToAbout} className='cursor-pointer no-underline text-[#333333] font-medium transition-all duration-300 ease hover:text-[#e74c3c] dark:text-[#e1e1e1] dark:hover:text-[#e74c3c]'>{translations.navbar.about}</a>
                        </div>
                        <div className={`flex flex-col justify-between w-[30px] h-[21px] cursor-pointer ${language === 'ar' ? 'mr-8' : 'ml-8'}`} onClick={displaySidenav}> 
                            <span className={`block ml-auto w-full h-[3px] bg-[#e74c3c] rounded-[3px] transition-all duration-300 ease`}></span>
                            <span className={`block ml-auto w-[75%] h-[3px] bg-[#e74c3c] rounded-[3px] transition-all duration-300 ease`}></span>
                            <span className={`block ml-auto w-[50%] h-[3px] bg-[#e74c3c] rounded-[3px] transition-all duration-300 ease`}></span>
                        </div>
                    </>
                )}
            </nav>

            <MenuModal 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
            />
            
            <ContactModal 
                isOpen={isContactOpen} 
                onClose={() => setIsContactOpen(false)} 
            />

            <Sidenav 
                isOpen={isSidenavOpen} 
                onClose={() => setIsSidenavOpen(false)} 
            />
        </>
    )
}