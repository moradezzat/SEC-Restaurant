import Image from "next/image";

export default function OfferCard({ Name, Description, Price, Discount, Image, IsActive, IsLimitedTime, Countdown }) {
// Remaining Time Format
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

// Discounted Price Calculation
function calculateDiscountedPrice(price, discount) {
    if (!discount) return price;
    const numericPrice = parseFloat(price.replace('$', ''));
    const discountedPrice = numericPrice - (numericPrice * (discount / 100));
    return `${discountedPrice.toFixed(2)} L.E`;
}

// Expired Offer Check
function isOfferExpired(countdown) {
    if (!countdown) return false;
    const now = new Date();
    const end = new Date(countdown);
    return end - now <= 0;
}

// Offers Rendering
function renderOffers() {
    const offersContainer = document.getElementById('offers-container');
    
    // Filter Active Offers
    const activeOffers = offers.filter(offer => offer.isActive);
    
    // Generate HTML for each offer
    const offersHTML = activeOffers.map(offer => {
        let badgeHTML = '';
        let rightPosition = 1; // Start from rightmost position
        const isExpired = isOfferExpired(offer.countdown);
        
        // Integrate Discount Badge
        if (offer.discount) {
            badgeHTML += `
                <div class="discount-badge" style="right: ${rightPosition}rem">%${offer.discount} Discount</div>
            `;
            rightPosition += 4.5;
        }
        
        // Integrate Limited Time Badge
        if (offer.isLimitedTime) {
            badgeHTML += `
                <div class="offer-badge" style="right: ${rightPosition}rem">
                    <span class="countdown" data-end-date="${offer.countdown || ''}">${offer.countdown ? formatTimeRemaining(offer.countdown) : "Limited Time"}</span>
                </div>
            `;
        }
        
        return `
            <div class="offer-card" 
                 data-has-discount="${offer.discount ? 'true' : 'false'}"
                 data-has-limited-time="${offer.isLimitedTime ? 'true' : 'false'}">
                <img src="${offer.image}" alt="${offer.title}" class="offer-image">
                ${badgeHTML}
                <div class="offer-content">
                    <h3 class="offer-title">${offer.title}</h3>
                    <p class="offer-description">${offer.description}</p>
                    <div class="offer-price-container">
                        ${offer.discount ? `
                            <span class="original-price">${offer.price}</span>
                            <span class="discounted-price">${calculateDiscountedPrice(offer.price, offer.discount)}</span>
                        ` : `
                            <span class="discounted-price">${offer.price}</span>
                        `}
                    </div>
                    <button class="offer-btn" ${isExpired ? 'disabled' : ''}>${isExpired ? 'Offer Expired' : 'Order Now'}</button>
                </div>
            </div>
        `;
    }).join('');
    
    // Insert The Offers Into The Container
    offersContainer.innerHTML = offersHTML;
    
    // Start Countdown Updates
    if (activeOffers.some(offer => offer.isLimitedTime)) {
        setInterval(updateCountdowns, 1000);
    }
}

// Offers Rendering when Page Loads
document.addEventListener('DOMContentLoaded', renderOffers);
}