"use client";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import ContactModal from './ContactModal';

export default function Sidenav({ isOpen, onClose }) {
    const [selectedMode, setSelectedMode] = useState('light');
    const [language, setLanguage] = useState('en');
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [showSidebar, setShowSidebar] = useState(isOpen);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowSidebar(true);
            setIsClosing(false);
        } else if (showSidebar) {
            setIsClosing(true);
            setTimeout(() => {
                setShowSidebar(false);
                setIsClosing(false);
            }, 300);
        }
    }, [isOpen]);

    const selectMode = (option) => {
        setSelectedMode(option);
        localStorage.setItem('theme', option);

        if (option === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const selectLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const displayContactModal = () => {
        setIsContactOpen(true);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const savedLanguage = localStorage.getItem('language');

        if (savedTheme) {
            setSelectedMode(savedTheme);
            if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }

        if (savedLanguage) setLanguage(savedLanguage);
    }, []);

    if (!showSidebar) return null;

    return (
        <>
            <ContactModal 
                isOpen={isContactOpen} 
                onClose={() => setIsContactOpen(false)} 
            />
            <div className="fixed top-0 left-0 w-full h-full bg-black/70 flex z-[48] transition-all duration-300 ease" onClick={onClose} />
                <div className={`Sidenav fixed top-[68px] right-[0%] w-[300px] h-full bg-white z-[49] transition-all duration-300 ease shadow-md flex flex-col dark:bg-[#1a1a1a] ${ isClosing ? 'animate-slideOutFromLeft' : 'animate-slideInFromRight' }`}>
                    <div className="flex justify-between items-center p-5 border-b border-b-[#eeeeee] bg-white sticky top-0 z-50 transition-all duration-300 ease dark:bg-[#1a1a1a] dark:border-b-[#474747]">
                        <h2 className="m-0 text-[#2c3e50] text-[1.5rem] font-semibold dark:text-[#ebebeb]">Settings</h2>
                        <button 
                            className="bg-none border-none text-[2rem] text-[#95a5a6] cursor-pointer p-0 leading-none w-[40px] h-[40px] flex items-center justify-center rounded-[50%] transition-all duration-300 ease hover:text-[#e74c3c] hover:bg-[#e74c3c1a] font-mono"
                            onClick={onClose}>
                            <FontAwesomeIcon icon={faXmark} size='2xs'/>
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto flex-1">
                        <div className="mb-8">
                            <h3 className="m-0 mb-4 text-[#2c3e50] text-[1.1rem] dark:text-[#e2e2e2]">Language</h3>
                            <select
                                className="w-full p-[0.8rem] border-[1px] border-[#dddddd] rounded-[5px] text-[1rem] text-[#2c3e50] bg-white dark:bg-[#1a1a1a] dark:border-[#5c5c5c] dark:text-white transition-all duration-300 ease"
                                value={language} 
                                onChange={(e) => selectLanguage(e.target.value)}
                            >
                                <option value="en">English</option>
                                <option value="ar">العربية</option>
                            </select>
                        </div>
                        <div>
                            <h3 className="m-0 mb-4 text-[#2c3e50] text-[1.1rem] dark:text-[#e2e2e2]">Theme</h3>
                            <div className="flex gap-4 mt-4">
                                <button
                                    className={`flex-1 p-[0.8rem] border-[1px] rounded-[5px] text-[1rem] text-[#2c3e50] cursor-pointer transition-all duration-300 ease hover:border-[#e74c3c] hover:text-[#e74c3c] ${selectedMode === 'light' ? 'bg-[#e74c3c] text-white border-[#e74c3c] hover:text-white' : 'bg-white text-[#2c3e50] border-[#dddddd] dark:bg-[#1a1a1a] dark:text-[#dddddd] dark:border-[#5c5c5c] hover:dark:text-[#e73c3c] dark:hover:border-[#e74c3c]'}`}
                                    onClick={() => selectMode('light')}>
                                    Light
                                </button>
                                <button 
                                    className={`flex-1 p-[0.8rem] border-[1px] rounded-[5px] text-[1rem] text-[#2c3e50] cursor-pointer transition-all duration-300 ease hover:border-[#e74c3c] hover:text-[#e74c3c] ${selectedMode === 'dark' ? 'bg-[#e74c3c] text-white border-[#e74c3c] hover:text-white' : 'bg-white text-[#2c3e50] border-[#dddddd]'}`}
                                    onClick={() => selectMode('dark')}>
                                    Dark
                                </button>
                            </div>
                        </div>
                        <div className='mb-8'>
                            <div className="flex gap-4 mt-4">
                                <button onClick={displayContactModal} className='flex-1 p-[0.8rem] border-[1px] rounded-[5px] text-[1rem] text-[#2c3e50] cursor-pointer transition-all duration-300 ease hover:border-[#e74c3c] hover:text-[#e74c3c] dark:text-[#dddddd] dark:border-[#5c5c5c] dark:hover:text-[#e74c3c] dark:hover:border-[#e74c3c]'>
                                    Contact Us
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    )
}