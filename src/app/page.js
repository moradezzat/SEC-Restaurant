"use client";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReviewCard from '@/components/ReviewCard';
import OfferCard from '@/components/OfferCard';
import MenuModal from '@/components/MenuModal';
import { useState } from 'react';

// IsActive: Display/Hide the Offer
// IsLimitedTime: Display/Hide Limited Time Badge
// Countdown: Display/Hide Countdown, Format Example: 2022-05-15T23:59:59 YYYY-MM-DD T HH:MM:SS
// Discount: Applies Discount

const Offers = [
  { id: 1, Name: 'No Offers', Content: 'Unfortunately there is no available offers at the time.', Price: '0.00', Image: '/assets/No_Offers.png', IsActive: true, Countdown: "2000-01-01T23:59:59" }
]

const Reviews = [
  { id: 1, Username: "Unknown", Profile: "/Icons/User.png", Date: "2025/03/01", Stars: 5, Review: "دي اول مره اجرب الأكل عندكم وبجد عاوز اشكر حضرتك عالأكل, حاجه في منتهي الروعه ماشاء الله, إن شاء الله مش هتبقي اخر مره اجي عندكم.", Nationality: "/Icons/EgyptianFlag.png" },
  { id: 2, Username: "Unknown", Profile: "/Icons/User.png", Date: "2025/05/03", Stars: 5, Review: "I really like the restaurant and this egyptian cuisine. You have to try it!", Nationality: "/Icons/GermanFlag.png" }
]

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const displayMenuModal = () => {
    setIsMenuOpen(true);
  };
  
  const scrollToOffers = () => {
    requestAnimationFrame(() => {
      const offersSection = document.getElementById('offers');
      if (!offersSection) return;

      const sectionTop = offersSection.getBoundingClientRect().top + window.scrollY;
      const scrollPosition = sectionTop - 50;
      
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    });
  };

  return (
    <div className='bg-[#f5f5f5] text-[#333333] overflow-x-hidden dark:bg-[#0f0f0f] min-h-screen flex flex-col transition-colors duration-300 ease'>
      <Navbar/>
      <MenuModal 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
      <main className='max-w-[1200px] mx-auto mb-8 px-8 text-center w-full flex-1'>

        {/* Hero Section */}
        <section className='hero-section overflow-hidden flex flex-col justify-center items-center text-center pt-[13rem] pb-0 pl-0 pr-0 mt-0 cursor-default'>
          <h1 className='title text-[2.5rem] text-[#2c3e50] mb-6 font-semibold dark:text-[#dddddd] transition-colors duration-300 ease'>Welcome to SEC Restaurant</h1>
          <p className='text-[1.1rem] text-[#666666] max-w-[800px] mx-auto mb-8 leading-[1.6] dark:text-[#b8b8b8] transition-colors duration-300 ease'>
            Taste the heart of Egypt with our traditional dishes like tender hawawshi,
            flavorful molokhia, rich tajin pasta, and perfectly grilled kofta.
            Every meal is made with fresh ingredients and served with warm baladi bread.
            At SEC Restaurant, we bring authentic Egyptian flavors with quality and care in every bite.
          </p>

          <div className='btnContainer flex gap-6 justify-center mb-8'>
            <button className='btn primary' onClick={displayMenuModal}>View our menu</button>
            <button className='btn secondary' onClick={scrollToOffers}>Special offers</button>
          </div>
        </section>

        {/* Offers Section */}
        <section id="offers" className='mt-40 py-8'>
          <h2 className='section-title text-[2rem] text-left text-[#2c3e50] mb-4 cursor-default font-semibold flex items-center dark:text-[#d3d3d3] transition-colors duration-300 ease'>Special Offers <img src='/Icons/Star2.png' className='w-8 h-8 ml-[0.3rem]'/></h2>
          <div className='flex flex-wrap gap-8 px-4 justify-start max-w-[1200px] mx-auto'>
            {Offers.map((item) => (
              <OfferCard
                key={item.id}
                Image={item.Image}
                Name={item.Name}
                Content={item.Content}
                Price={item.Price}
                IsActive={item.IsActive}
                Discount={item.Discount}
                countdown={item.Countdown}
                IsLimitedTime={item.IsLimitedTime}
              />
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className='mt-16 py-8'>
          <h2 className='section-title text-[2rem] text-left text-[#2c3e50] mb-4 cursor-default font-semibold flex items-center dark:text-[#d3d3d3] transition-colors duration-300 ease'>Customers Reviews <img src='/Icons/Star.png' className='w-8 h-8 -mt-[0.2rem] ml-[0.3rem]'/></h2>
          <div className='flex flex-wrap gap-8 px-4 justify-start max-w-[1200px] mx-auto cursor-default'>
            {Reviews.map((item) => (
              <ReviewCard
                key={item.id}
                Username={item.Username}
                Profile={item.Profile}
                Date={item.Date}
                Stars={item.Stars}
                Review={item.Review}
                Flag={item.Nationality}
              />
            ))}
          </div>
        </section>
        
      </main>
      <Footer/>
    </div>
  );
}