"use client";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReviewCard from '../components/Review';
import OfferCard from '@/components/Offer';
import MenuModal from '@/components/MenuModal';
import { useState } from 'react';

// IsActive: Display/Hide the Offer
// IsLimitedTime: Display/Hide Limited Time Badge
// Countdown: Display/Hide Countdown, Format Example: 2022-05-15T23:59:59 YYYY-MM-DD T HH:MM:SS
// Discount: Applies Discount

const Offers = [
  { id: 1, Name: 'Weekend Special Burger', Content: 'Our signaturese and special sauce. Limited time offer!', Price: '15.00', Image: '/assets/Pizza.png', IsActive: true },
  { id: 2, Name: 'Family Combo Deal', Content: 'Perfect for the families! Includes 4 burgers, 4 fries, and 4 drinks.', Price: '50.00', Image: '/assets/Pizza.png', IsActive: true },
  { id: 3, Name: 'Student Meal', Content: 'Get your student meal now with low price!', Price: '90.00', Image: '/assets/Pizza.png', IsActive: true },
]

const Reviews = [
  { id: 1, Username: "Unknown", Profile: "/Icons/download.png", Date: "2025/03/01", Stars: 5, Review: "دي اول مره اجرب الأكل عندكم وبجد عاوز اشكر حضرتك عالأكل, حاجه في منتهي الروعه ماشاء الله, إن شاء الله مش هتبقي اخر مره اجي عندكم." },
  { id: 2, Username: "Sarah Ahmed", Profile: "/Icons/User.png", Date: "2024/03/14", Stars: 4, Review: "Best fast food restaurant in the area. The prices are reasonable and the quality is outstanding." },
  { id: 3, Username: "Mohamed Ali", Profile: "/Icons/User.png", Date: "2024/03/13", Stars: 5, Review: "Great atmosphere and friendly staff. The food is always fresh and served hot." }
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
    <main className='bg-[#f5f5f5] text-[#333333] overflow-x-hidden'>
      <Navbar/>
      <MenuModal 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
      <main className='max-w-[1200px] mx-auto mb-8 px-8 text-center w-full'>

        {/* Hero Section */}
        <section className='hero-section overflow-hidden flex flex-col justify-center items-center text-center pt-[13rem] pb-0 pl-0 pr-0 mt-0 cursor-default'>
          <h1 className='title text-[2.5rem] text-[#2c3e50] mb-6 font-semibold'>Welcome to SEC Restaurant</h1>
          <p className='text-[1.1rem] text-[#666666] max-w-[800px] mx-auto mb-8 leading-[1.6]'>
            Taste the heart of Egypt with our traditional dishes like tender hawawshi,
            flavorful molokhia, rich tajin pasta, and perfectly grilled kofta.
            Every meal is made with fresh ingredients and served with warm baladi bread.
            At SEC Restaurant, we bring authentic Egyptian flavors with quality and care in every bite.
          </p>

          <div className='btnContainer flex gap-6 justify-center mb-8'>
            <button className='btn primary' onClick={displayMenuModal}>View Our Menu</button>
            <button className='btn secondary' onClick={scrollToOffers}>Special Offers</button>
          </div>
        </section>

        {/* Offers Section */}
        <section id="offers" className='mt-40 py-8'>
          <h2 className='text-[2rem] text-left text-[#2c3e50] mb-4 cursor-default font-semibold flex items-center'>Special Offers <img src='/Icons/Star2.png' className='w-8 h-8 ml-[0.3rem]'/></h2>
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
          <h2 className='text-[2rem] text-left text-[#2c3e50] mb-4 cursor-default font-semibold flex items-center'>Customers Reviews <img src='/Icons/Star.png' className='w-8 h-8 -mt-[0.2rem] ml-[0.3rem]'/></h2>
          <div className='flex flex-wrap gap-8 px-4 justify-start max-w-[1200px] mx-auto cursor-default'>
            {Reviews.map((item) => (
              <ReviewCard key={item.id} Username={item.Username} Profile={item.Profile} Date={item.Date} Stars={item.Stars} Review={item.Review} />
            ))}
          </div>
        </section>
      </main>
      <Footer/>
    </main>
  );
}