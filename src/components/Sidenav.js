"use client";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import ContactModal from './ContactModal';

export default function Sidenav({ isOpen, onClose }) {
    const [selectedMode, setSelectedMode] = useState('light'); // Default = Light Mode
    const [language, setLanguage] = useState('en'); // Default = English
    const [isContactOpen, setIsContactOpen] = useState(false);

    const selectMode = (option) => {
        setSelectedMode(option);
        localStorage.setItem('theme', option);
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
        }

        if (savedLanguage) {
            setLanguage(savedLanguage);
        }
    }, []);

    if (!isOpen) return null;

    return (
        <>
            <ContactModal 
                isOpen={isContactOpen} 
                onClose={() => setIsContactOpen(false)} 
            />
            <div className="fixed top-0 left-0 w-full h-full bg-black/70 flex z-[48] transition-all duration-300 ease" onClick={onClose} />
                <div className="Sidenav fixed top-[68px] right-[0%] w-[300px] h-full bg-white z-[49] transition-all duration-300 ease shadow-md flex flex-col animate-slideLeft">
                    <div className="flex justify-between items-center p-6 border-b border-b-[#eeeeee] bg-white sticky top-0 z-50">
                        <h2 className="m-0 text-[#2c3e50] text-[1.5rem] font-semibold">Settings</h2>
                        <button 
                            className="bg-none border-none text-[2rem] text-[#95a5a6] cursor-pointer p-0 leading-none w-[40px] h-[40px] flex items-center justify-center rounded-[50%] transition-all duration-300 ease hover:text-[#e74c3c] hover:bg-[#e74c3c1a] font-mono"
                            onClick={onClose}>
                            <FontAwesomeIcon icon={faX} size='2xs'/>
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto flex-1">
                        <div className="mb-8">
                            <h3 className="m-0 mb-4 text-[#2c3e50] text-[1.1rem]">Language</h3>
                            <select
                                className="w-full p-[0.8rem] border-[1px] border-b-[#dddddd] rounded-[5px] text-[1rem] text-[#2c3e50] bg-white"
                                value={language} 
                                onChange={(e) => selectLanguage(e.target.value)}
                            >
                                <option value="en">English</option>
                                <option value="ar">العربية</option>
                            </select>
                        </div>
                        <div className="mb-8">
                            <h3 className="m-0 mb-4 text-[#2c3e50] text-[1.1rem]">Theme</h3>
                            <div className="flex gap-4 mt-4">
                                <button
                                    className={`flex-1 p-[0.8rem] border-[1px] border-b-[#dddddd] rounded-[5px] text-[1rem] text-[#2c3e50] cursor-pointer transition-all duration-300 ease hover:border-[#e74c3c] hover:text-[#e74c3c] ${selectedMode === 'light' ? 'bg-[#e74c3c] text-white border-b hover:text-white' : 'bg-white text-[#2c3e50] border-[#dddddd]'}`}
                                    onClick={() => selectMode('light')}>
                                    Light
                                </button>
                                <button 
                                    className={`flex-1 p-[0.8rem] border-[1px] border-b-[#dddddd] rounded-[5px] text-[1rem] text-[#2c3e50] cursor-pointer transition-all duration-300 ease hover:border-[#e74c3c] hover:text-[#e74c3c] ${selectedMode === 'dark' ? 'bg-[#e74c3c] text-white border-b hover:text-white' : 'bg-white text-[#2c3e50] border-[#dddddd]'}`}
                                    onClick={() => selectMode('dark')}>
                                    Dark
                                </button>
                            </div>
                        </div>
                        <div className='mb-8'>
                            <div className="flex gap-4 mt-4">
                                <button onClick={displayContactModal} className='flex-1 p-[0.8rem] border-[1px] border-b-[#dddddd] rounded-[5px] text-[1rem] text-[#2c3e50] cursor-pointer transition-all duration-300 ease hover:border-[#e74c3c] hover:text-[#e74c3c]'>
                                    Contact Us
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    )
}
