"use client";
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

function updateCountdowns() {
    const countdownElements = document.querySelectorAll('.countdown');
    countdownElements.forEach(element => {
        const endDate = element.dataset.endDate;
        if (!endDate) {
            element.textContent = "Limited Time";
        } else {
            element.textContent = formatTimeRemaining(endDate);
        }
    });
}

export default function OfferBadge({ discount, isLimitedTime, countdown }) {
    const { language, translations } = useLanguage();
    const [timeRemaining, setTimeRemaining] = useState(null);

    function formatTimeRemaining(endDate) {
        if (!endDate) return translations.offers_badge.limitedTime;
        
        const now = new Date();
        const end = new Date(endDate);
        const diff = end - now;

        if (diff <= 0) return translations.offers_badge.expired;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Convert numbers to Arabic if Arabic language is selected
        const convertToArabicNumbers = (num) => {
            if (language !== 'ar') return num;
            const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
            return num.toString().replace(/[0-9]/g, (digit) => arabicNumbers[digit]);
        };

        // Use Arabic time units if Arabic language is selected
        const timeUnits = language === 'ar' 
            ? { d: 'ي', h: 'س', m: 'د', s: 'ث' }
            : { d: 'd', h: 'h', m: 'm', s: 's' };

        const formattedDays = convertToArabicNumbers(days);
        const formattedHours = convertToArabicNumbers(hours);
        const formattedMinutes = convertToArabicNumbers(minutes);
        const formattedSeconds = convertToArabicNumbers(seconds);

        return `${formattedDays}${timeUnits.d} ${formattedHours}${timeUnits.h} ${formattedMinutes}${timeUnits.m} ${formattedSeconds}${timeUnits.s}`;
    }

    useEffect(() => {
        if (countdown) {
            // Set initial value immediately
            setTimeRemaining(formatTimeRemaining(countdown));
            
            const timer = setInterval(() => {
                setTimeRemaining(formatTimeRemaining(countdown));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [countdown, language]); // Add language as dependency

    let rightPosition = 1; // Start from rightmost position
    const badges = [];

    // Integrate Discount Badge
    if (discount !== null && discount !== undefined) {
        badges.push(
            <div className="discount-badge" style={{ right: `${rightPosition}rem` }} key="discount">
                %{discount} {translations.offers_badge.off}
            </div>
        );
        rightPosition += language === 'ar' ? 5.6 : 5.2; // Move the next badge 4.5rem to the left
    }

    // Integrate Limited Time Badge
    if (isLimitedTime && !countdown) {
        badges.push(
            <div className="offer-badge" style={{ right: `${rightPosition}rem` }} key="limited-time">
                {translations.offers_badge.limitedTime}
            </div>
        );
    }

    if (countdown) {
        badges.push(
            <div className="offer-badge" style={{ right: `${rightPosition}rem` }} key="countdown">
                <span className="countdown" data-end-date={countdown}>
                    {timeRemaining || translations.offers_badge.limitedTime}
                </span>
            </div>
        );
    }

    return (
        <div className="offer-badges">
            {badges}
        </div>
    );
}