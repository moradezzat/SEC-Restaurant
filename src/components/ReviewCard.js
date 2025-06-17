"use client";
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';

export default function ReviewCard({ Username, Profile, Date, Stars, Review, Flag }) {
    const { language } = useLanguage();

    // Convert numbers to Arabic if Arabic language is selected
    const convertToArabicNumbers = (text) => {
        if (language !== 'ar') return text;
        const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', 'و', '٩'];
        return text.toString().replace(/[0-9]/g, (digit) => arabicNumbers[digit]);
    };

    const formattedDate = convertToArabicNumbers(Date);
    const isRTL = language === 'ar';

    return(
        <div className={`ReviewCard bg-white rounded-xl p-6 shadow-md transition-all duration-300 ease w-[300px] flex flex-col flex-none hover:-translate-y-[5px] hover:shadow-lg will-change-transform dark:bg-[#1e1e1e] ${isRTL ? 'rtl' : 'ltr'}`}>
            <div className={`flex items-center mb-2 gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Image 
                    src={Profile}
                    alt={`${Username}'s profile picture`}
                    className="w-[50px] h-[50px] rounded-[50%] object-cover flex-shrink-0"
                    width={50}
                    height={50}
                />
                <div className={`flex flex-col flex-1 ${isRTL ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`text-[1.1rem] font-semibold text-[#2c3e50] mb-[0.2rem] dark:text-[#f0f0f0] transition-colors duration-300 ease ${isRTL ? 'text-right' : 'text-left'}`}>{Username}</div>
                        {Flag && <Image src={Flag} alt={`${Username}'s nationality flag`} width={28} height={28} className="w-7 h-7 object-contain"/>}
                    </div>
                    <div className={`text-[0.9rem] text-[#95a5a6] dark:text-[#888888] transition-colors duration-300 ease ${isRTL ? 'text-right' : 'text-left'}`}>{formattedDate}</div>
                </div>
            </div>
            <div className="flex gap-[0.2rem] mb-[1rem] justify-center">
                {[...Array(Stars)].map((_, index) => (
                    <Image key={index} src="/Icons/Star.webp" alt="Star" width={20} height={20} className="w-5 h-5 object-contain"/>
                ))}
            </div>
            <div className={`text-[#666666] text-[0.95rem] leading-[1.6] flex-1 overflow-y-auto p-2 font-sans-serif dark:text-[#919191] transition-colors duration-300 ease text-center`}>{Review}</div>
        </div>
    )
}