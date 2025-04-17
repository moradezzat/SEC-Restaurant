"use client";
import { useState, useEffect } from 'react';
import OfferBadge from "./OfferBadge";

export default function OfferCard({ Image, Name, Content, Price, IsActive, Discount, countdown, IsLimitedTime }) {
    const [showOffer, setShowOffer] = useState(true);
    const [isExpired, setIsExpired] = useState(false);

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
        <div className="offer-card relative">
            <img src={Image} alt={Name} className="offer-image" />
            <OfferBadge 
                discount={Discount} 
                isLimitedTime={IsLimitedTime} 
                countdown={countdown}
            />
            <div className="offer-content">
                <h3 className="offer-title">{Name}</h3>
                <p className="offer-description">{Content}</p>
                <div className="offer-price-container">
                    {showDiscount ? (
                        <>
                            <span className="original-price">${originalPrice.toFixed(2)}</span>
                            <span className="discounted-price">${discountedPrice}</span>
                        </>
                    ) : (
                        <span className='discounted-price'>${originalPrice.toFixed(2)}</span>
                    )}
                </div>
                <button className="offer-btn" disabled={isExpired}>
                    {isExpired ? 'Offer Expired' : 'Order Now'}
                </button>
            </div>
        </div>
    );
}