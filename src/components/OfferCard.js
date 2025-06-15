"use client";
import { useState, useEffect } from 'react';
import OfferBadge from "./OfferBadge";
import OnlineOrderModal from './OnlineOrderModal';
import { useLanguage } from '../context/LanguageContext';

export default function OfferCard({ Image, Name, Content, Price, IsActive, Discount, countdown, IsLimitedTime }) {
    const [showOffer, setShowOffer] = useState(true);
    const [isExpired, setIsExpired] = useState(false);
    const [isOnlineOrderModalOpen, setIsOnlineOrderModalOpen] = useState(false);
    const { language, translations } = useLanguage();

    const displayOnlineOrderModal = () => {
        setIsOnlineOrderModalOpen(true)
    }

    // Convert numbers to Arabic if Arabic language is selected
    const convertToArabicNumbers = (num) => {
        if (language !== 'ar') return num;
        const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return num.toString().replace(/[0-9]/g, (digit) => arabicNumbers[digit]);
    };

    useEffect(() => {
        // Check if offer is active
        setShowOffer(IsActive);
    }, [IsActive]);

    useEffect(() => {
        // Reset expired state when countdown changes
        setIsExpired(false);

        // Check if countdown exists and if the offer has expired
        if (countdown) {
            const interval = setInterval(() => {
                const now = new Date();
                const end = new Date(countdown);
                if (now > end) {
                    setIsExpired(true);
                    clearInterval(interval);  // Stop the interval once expired
                }
            }, 1000);
            return () => clearInterval(interval); // Clean up the interval when component unmounts or countdown changes
        }
    }, [countdown]); // Re-run when countdown changes

    if (!showOffer) return null;

    const showDiscount = Discount !== null && Discount !== undefined;
    const originalPrice = parseFloat(Price);
    const discountedPrice = showDiscount
        ? (originalPrice - originalPrice * (Discount / 100)).toFixed(2)
        : null;
    
    const currency = language === 'ar' 
        ? 'ج.م' 
        : 'L.E';

    // Convert prices to Arabic numbers if Arabic language is selected
    const formattedOriginalPrice = convertToArabicNumbers(originalPrice.toFixed(2));
    const formattedDiscountedPrice = discountedPrice ? convertToArabicNumbers(discountedPrice) : null;

    return (
        <>
            <OnlineOrderModal 
                isOpen={isOnlineOrderModalOpen} 
                onClose={() => setIsOnlineOrderModalOpen(false)} 
            />
            <div className="dark:bg-[#212121] offer-card transition-colors duration-300 ease">
                <img src={Image} alt={Name} className="w-full h-[200px] object-cover relative z-[1]" />
                <OfferBadge 
                    discount={Discount} 
                    isLimitedTime={IsLimitedTime} 
                    countdown={countdown}
                />
                <div className="p-6 flex flex-1 flex-col justify-between cursor-default">
                    <h3 className="dark:text-[#f5f5f5] text-[1.25rem] text-[#2c3e50] text-center mb-2 font-semibold transition-colors duration-300 ease">{Name}</h3>
                    <p className="dark:text-[#b8b8b8] text-[#666] text-[0.9rem] text-center leading-6 mb-4 flex-1 transition-colors duration-300 ease">{Content}</p>
                    <div className="flex flex-row items-center justify-center gap-[0.1rem] mb-4 relative">
                        {showDiscount ? (
                            <>
                                <span className="text-[#95a5a6] line-through text-[1rem]">{formattedOriginalPrice} {currency}</span>
                                <span className="text-[#e74c3c] text-2xl font-semibold">{formattedDiscountedPrice} {currency}</span>
                            </>
                        ) : (
                            <span className='text-[#e74c3c] text-2xl font-semibold'>{formattedOriginalPrice} {currency}</span>
                        )}
                    </div>
                    <button className="offer-btn" onClick={displayOnlineOrderModal} disabled={isExpired}>
                        {isExpired ? `${translations.offers_section.expired}` : `${translations.offers_section.order}`}
                    </button>
                </div>
            </div>
        </>
    );
}