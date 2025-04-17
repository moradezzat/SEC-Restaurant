"use client";
import { useState, useEffect } from 'react';

function formatTimeRemaining(endDate) {
    if (!endDate) return "Limited Time";
    
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Countdown Update
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
    const [timeRemaining, setTimeRemaining] = useState(null);

    useEffect(() => {
        if (countdown) {
            const timer = setInterval(() => {
                setTimeRemaining(formatTimeRemaining(countdown));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [countdown]);

    let rightPosition = 1; // Start from rightmost position
    const badges = [];

    // Integrate Discount Badge
    if (discount !== null && discount !== undefined) {
        badges.push(
            <div className="discount-badge" style={{ right: `${rightPosition}rem` }} key="discount">
                %{discount} Off
            </div>
        );
        rightPosition += 5.2; // Move the next badge 4.5rem to the left
    }

    // Integrate Limited Time Badge
    if (isLimitedTime && !countdown) {
        badges.push(
            <div className="offer-badge" style={{ right: `${rightPosition}rem` }} key="limited-time">
                Limited Time
            </div>
        );
    }

    if (countdown) {
        badges.push(
            <div className="offer-badge" style={{ right: `${rightPosition}rem` }} key="countdown">
                <span className="countdown" data-end-date={countdown}>
                    {timeRemaining || "Limited Time"}
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