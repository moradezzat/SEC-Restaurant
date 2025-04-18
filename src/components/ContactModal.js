"use client";
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function ContactModal({ isOpen, onClose }) {
  const [selectedOption, setSelectedOption] = useState(null);

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
      <div className="bg-white p-8 rounded-2xl w-[90%] max-w-[400px] relative animate-slideUp dark:bg-[#1e1e1e]" onClick={(e) => e.stopPropagation()}>
        <h2 className="-mt-4 mb-4 text-[#2c3e50] text-[1.8rem] font-semibold text-left dark:text-[#cecece]">Contact Us</h2>
        
        <div className="flex flex-col gap-4 mb-8">
          <div
            onClick={() => selectContactOption('phone')}
            className={`w-full p-4 border rounded-lg flex items-center gap-4 cursor-pointer transition-all duration-300 ${
              selectedOption === 'phone' ? 'border-[#e74c3c] bg-[#e74d3c11] dark:bg-[#e74d3c1f]' : 'border-gray-200 dark:border-[#5c5c5c] hover:border-[#e74c3c] dark:hover:border-[#e74c3c]'
            }`}
          >
            <FontAwesomeIcon icon={faPhone} className="text-xl text-[#e74c3c]" />
            <span className="text-gray-700 dark:text-gray-400">Phone number</span>
          </div>

          <div onClick={() => selectContactOption('email')}
            className={`w-full p-4 border rounded-lg flex items-center gap-4 cursor-pointer transition-all duration-300 ${
              selectedOption === 'email' ? 'border-[#e74c3c] bg-[#e74d3c11] dark:bg-[#e74d3c1f]' : 'border-gray-200 dark:border-[#5c5c5c] hover:border-[#e74c3c] dark:hover:border-[#e74c3c]'}
            `}
          >
            <FontAwesomeIcon icon={faEnvelope} className="text-xl text-[#e74c3c]" />
            <span className="text-gray-700 dark:text-gray-400">Email</span>
          </div>
        </div>

        <button onClick={confirmContact} disabled={!selectedOption}
          className={`absolute bottom-4 right-4 py-[0.5rem] px-6 -mb-1 text-white border-none rounded-[5px] transition-all duration-300 ${
            selectedOption ? 'bg-[#e74c3c] hover:bg-[#c0392b]' : 'bg-gray-300 cursor-not-allowed dark:bg-[#4e4e4e] dark:text-[#80848a]'}`}>
          Confirm
        </button>
      </div>
    </div>
  );
}