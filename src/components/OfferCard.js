"use client";
import { useState, useEffect } from 'react';
import OfferBadge from "./OfferBadge";
import OnlineOrderModal from './OnlineOrderModal';

export default function OfferCard({ Image, Name, Content, Price, IsActive, Discount, countdown, IsLimitedTime }) {
    const [showOffer, setShowOffer] = useState(true);
    const [isExpired, setIsExpired] = useState(false);
    const [isOnlineOrderModalOpen, setIsOnlineOrderModalOpen] = useState(false);

    const displayOnlineOrderModal = () => {
        setIsOnlineOrderModalOpen(true)
    }

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

    return (
        <>
            <OnlineOrderModal 
                isOpen={isOnlineOrderModalOpen} 
                onClose={() => setIsOnlineOrderModalOpen(false)} 
            />
            <div className="offer-card relative dark:bg-[#212121]">
                <img src={Image} alt={Name} className="offer-image" />
                <OfferBadge 
                    discount={Discount} 
                    isLimitedTime={IsLimitedTime} 
                    countdown={countdown}
                />
                <div className="offer-content">
                    <h3 className="offer-title dark:text-[#f5f5f5]">{Name}</h3>
                    <p className="offer-description dark:text-[#b8b8b8]">{Content}</p>
                    <div className="offer-price-container">
                        {showDiscount ? (
                            <>
                                <span className="original-price">{originalPrice.toFixed(2)} L.E</span>
                                <span className="discounted-price">{discountedPrice} L.E</span>
                            </>
                        ) : (
                            <span className='discounted-price'>{originalPrice.toFixed(2)} L.E</span>
                        )}
                    </div>
                    <button className="offer-btn" onClick={displayOnlineOrderModal} disabled={isExpired}>
                        {isExpired ? 'Expired' : 'Order Now'}
                    </button>
                </div>
            </div>
        </>
    );
}