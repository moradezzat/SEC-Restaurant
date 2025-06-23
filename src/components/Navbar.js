"use client";
import { useState } from 'react';
import MenuModal from './MenuModal';
import ContactModal from './ContactModal';
import Sidenav from './Sidenav';
import { useLanguage } from '../context/LanguageContext';
import WorkingHours from '../context/WorkingHours';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isSidenavOpen, setIsSidenavOpen] = useState(false);
    const { language, translations } = useLanguage();

    // Helper: Determine if restaurant is open based on WorkingHours.js
    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    const todayHours = WorkingHours[dayName];
    let isOpen = false;
    if (todayHours) {
        if (todayHours.open24) {
            isOpen = true;
        } else if (todayHours.open && todayHours.close) {
            const [openHour, openMinute] = todayHours.open.split(':').map(Number);
            const [closeHour, closeMinute] = todayHours.close.split(':').map(Number);
            const openTime = new Date(now);
            openTime.setHours(openHour, openMinute, 0, 0);
            let closeTime = new Date(now);
            closeTime.setHours(closeHour, closeMinute, 0, 0);
            // If close is 00:00, treat as midnight next day
            if (todayHours.close === '00:00') {
                closeTime.setDate(closeTime.getDate() + 1);
            }
            isOpen = now >= openTime && now < closeTime;
        }
    }
    const statusText = isOpen ? translations.navbar.open : translations.navbar.closed;
    const statusColor = isOpen ? 'text-green-600' : 'text-red-600';

    const displayMenuModal = () => {
        setIsMenuOpen(true);
    };

    const displayContactModal = () => {
        setIsContactOpen(true);
    };

    const displaySidenav = () => {
        setIsSidenavOpen(!isSidenavOpen);
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

    const handleNavClick = (e, action) => {
        e.preventDefault();
        if (action === 'home') {
            window.location.href = '/';
        } else if (action === 'menu') {
            displayMenuModal();
        } else if (action === 'contact') {
            displayContactModal();
        } else if (action === 'about') {
            scrollToAbout();
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
                            <a href="/" onClick={(e) => handleNavClick(e, 'home')} className="no-underline text-[#333333] font-medium transition-all duration-300 ease hover:text-[#e74c3c] dark:text-[#e1e1e1] dark:hover:text-[#e74c3c]">{translations.navbar.home}</a>
                            <a href='#' onClick={(e) => handleNavClick(e, 'menu')} className="cursor-pointer no-underline text-[#333333] font-medium transition-all duration-300 ease hover:text-[#e74c3c] dark:text-[#e1e1e1] dark:hover:text-[#e74c3c]">{translations.navbar.menu}</a>
                            <a href='#' onClick={(e) => handleNavClick(e, 'contact')} className="cursor-pointer no-underline text-[#333333] font-medium transition-all duration-300 ease hover:text-[#e74c3c] dark:text-[#e1e1e1] dark:hover:text-[#e74c3c]">{translations.navbar.contact}</a>
                            <a href='#' onClick={(e) => handleNavClick(e, 'about')} className='cursor-pointer no-underline text-[#333333] font-medium transition-all duration-300 ease hover:text-[#e74c3c] dark:text-[#e1e1e1] dark:hover:text-[#e74c3c]'>{translations.navbar.about}</a>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${statusColor}`}>{statusText}</span>
                            <span className="navBranding text-[1.5rem] font-ruqaa text-[#e74c3c] cursor-default">{translations.navbar.brand}</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2">
                            <span className="navBranding text-[1.5rem] font-semibold text-[#e74c3c] cursor-default">{translations.navbar.brand}</span>
                            <span className={`text-sm font-bold ${statusColor}`}>{statusText}</span>
                        </div>
                        <div className="aContainer flex gap-8 items-center">
                            <a href="/" onClick={(e) => handleNavClick(e, 'home')} className="no-underline text-[#333333] font-medium transition-all duration-300 ease hover:text-[#e74c3c] dark:text-[#e1e1e1] dark:hover:text-[#e74c3c]">{translations.navbar.home}</a>
                            <a href='#' onClick={(e) => handleNavClick(e, 'menu')} className="cursor-pointer no-underline text-[#333333] font-medium transition-all duration-300 ease hover:text-[#e74c3c] dark:text-[#e1e1e1] dark:hover:text-[#e74c3c]">{translations.navbar.menu}</a>
                            <a href='#' onClick={(e) => handleNavClick(e, 'contact')} className="cursor-pointer no-underline text-[#333333] font-medium transition-all duration-300 ease hover:text-[#e74c3c] dark:text-[#e1e1e1] dark:hover:text-[#e74c3c]">{translations.navbar.contact}</a>
                            <a href='#' onClick={(e) => handleNavClick(e, 'about')} className='cursor-pointer no-underline text-[#333333] font-medium transition-all duration-300 ease hover:text-[#e74c3c] dark:text-[#e1e1e1] dark:hover:text-[#e74c3c]'>{translations.navbar.about}</a>
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