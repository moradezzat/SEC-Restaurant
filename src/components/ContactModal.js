"use client";
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../context/LanguageContext';

export default function ContactModal({ isOpen, onClose }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const { language, translations } = useLanguage();

  if (!isOpen) return null;

  const selectContactOption = (option) => {
    setSelectedOption(option);
  };

  const confirmContact = () => {
    let RedirectURL;
    if (selectedOption) {
      if (selectedOption === 'phone') {
        RedirectURL = 'tel:+201028154813'
      } else if (selectedOption === 'email') {
        RedirectURL = 'mailto:official.sec@outlook.com'
      }
      window.location.href = RedirectURL
      onClose();
      setSelectedOption(null);
    }
  };

  const Hide = () => {
    onClose();
    setSelectedOption(null);
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center z-[50] opacity-100 transition-opacity duration-300 ease-in-out" onClick={Hide}>
      <div className={`bg-white p-8 rounded-xl w-[90%] max-w-[400px] relative animate-slideUp dark:bg-[#1e1e1e] ${language === 'ar' ? 'text-right' : 'text-left'}`} onClick={(e) => e.stopPropagation()}>
        <h2 className={`-mt-4 mb-4 text-[#2c3e50] text-[1.8rem] font-semibold dark:text-[#cecece] ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          {translations.contact_form.title}
        </h2>
        
        <div className="flex flex-col gap-4 mb-8">
          <div
            onClick={() => selectContactOption('phone')}
            className={`w-full p-4 border rounded-lg flex items-center gap-4 cursor-pointer transition-all duration-300 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} ${
              selectedOption === 'phone' ? 'border-[#e74c3c] bg-[#e74d3c11] dark:bg-[#e74d3c1f]' : 'border-gray-200 dark:border-[#5c5c5c] hover:border-[#e74c3c] dark:hover:border-[#e74c3c]'
            }`}
          >
            <FontAwesomeIcon icon={faPhone} className="text-xl text-[#e74c3c]" />
            <span className={`text-gray-700 dark:text-gray-400 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {translations.contact_form.phone}
            </span>
          </div>

          <div onClick={() => selectContactOption('email')}
            className={`w-full p-4 border rounded-lg flex items-center gap-4 cursor-pointer transition-all duration-300 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} ${
              selectedOption === 'email' ? 'border-[#e74c3c] bg-[#e74d3c11] dark:bg-[#e74d3c1f]' : 'border-gray-200 dark:border-[#5c5c5c] hover:border-[#e74c3c] dark:hover:border-[#e74c3c]'}
            `}
          >
            <FontAwesomeIcon icon={faEnvelope} className="text-xl text-[#e74c3c]" />
            <span className={`text-gray-700 dark:text-gray-400 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {translations.contact_form.email}
            </span>
          </div>
        </div>

        <button onClick={confirmContact} disabled={!selectedOption}
          className={`absolute bottom-3 py-[0.5rem] px-6 text-white border-none rounded-lg transition-all duration-300 ${language === 'ar' ? 'left-3' : 'right-3'} ${
            selectedOption ? 'bg-[#e74c3c] hover:bg-[#c0392b]' : 'bg-gray-300 cursor-not-allowed dark:bg-[#4e4e4e] dark:text-[#80848a]'}`}>
          {translations.contact_form.confirm}
        </button>
      </div>
    </div>
  );
}