"use client";
import { useState } from 'react';
import MenuModal from './MenuModal';
import ContactModal from './ContactModal';
import Sidenav from './Sidenav';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isSidenavOpen, setIsSidenavOpen] = useState(false);

    const displayMenuModal = () => {
        setIsMenuOpen(true);
    };

    const displayContactModal = () => {
        setIsContactOpen(true);
    };

    const displaySidenav = () => {
        setIsSidenavOpen(true);
    };

    return (
        <>
            <nav className="navContainer bg-white px-8 py-4 shadow-md flex justify-between items-center fixed w-full top-0 z-50 dark:bg-[#121212]">
                <div className="text-[1.5rem] font-semibold text-[#e74c3c] cursor-default">SEC Restaurant</div>
                <div className="aContainer flex gap-8 items-center">
                    <a href="/" className="no-underline text-[#333333] font-medium transition-colors duration-300 ease-in-out hover:text-[#e74c3c] dark:text-[#e1e1e1] dark:hover:text-[#e74c3c]">Home</a>
                    <a onClick={displayMenuModal} className="cursor-pointer no-underline text-[#333333] font-medium transition-colors duration-300 ease-in-out hover:text-[#e74c3c] dark:text-[#e1e1e1] dark:hover:text-[#e74c3c]">Menu</a>
                    <a onClick={displayContactModal} className="cursor-pointer no-underline text-[#333333] font-medium transition-colors duration-300 ease-in-out hover:text-[#e74c3c] dark:text-[#e1e1e1] dark:hover:text-[#e74c3c]">Contact</a>
                </div>
                 <div className="flex flex-col justify-between w-[30px] h-[21px] cursor-pointer ml-8" onClick={displaySidenav}> 
                    <span className='block ml-auto w-full h-[3px] bg-[#e74c3c] rounded-[3px] transition-all duration-300 ease-in-out'></span>
                    <span className='block ml-auto w-[75%] h-[3px] bg-[#e74c3c] rounded-[3px] transition-all duration-300 ease-in-out'></span>
                    <span className='block ml-auto w-[50%] h-[3px] bg-[#e74c3c] rounded-[3px] transition-all duration-300 ease-in-out'></span>
                </div>
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