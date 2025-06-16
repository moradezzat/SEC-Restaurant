"use client";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReviewCard from '@/components/ReviewCard';
import OfferCard from '@/components/OfferCard';
import MenuModal from '@/components/MenuModal';
import { useLanguage } from '../context/LanguageContext';
import { useState } from 'react';

// IsActive: Display/Hide the Offer
// IsLimitedTime: Display/Hide Limited Time Badge
// Countdown: Display/Hide Countdown, Format Example: 2022-05-15T23:59:59 YYYY-MM-DD T HH:MM:SS
// Discount: Applies Discount

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, translations } = useLanguage();

  const displayMenuModal = () => {
    setIsMenuOpen(true);
  };

  const Offers = [
    { id: 1, Name: `${translations.offers_section.noOffers}`, Content: `${translations.offers_section.noOffersContent}`, Price: '0', Image: '/assets/No_Offers.png', IsActive: true, Countdown: "2000-01-01T23:59:59" }
  ]
  
  const Reviews = [
    { id: 1, Username: `${translations.reviews_section.unknown}`, Profile: "/Icons/User.png", Date: "2025/03/01", Stars: 5, Review: "دي اول مره اجرب الأكل عندكم وبجد عاوز اشكر حضرتك عالأكل, حاجه في منتهي الروعه ماشاء الله, إن شاء الله مش هتبقي اخر مره اجي عندكم.", Nationality: "/Icons/EgyptianFlag.png" },
    { id: 2, Username: `${translations.reviews_section.unknown}`, Profile: "/Icons/User.png", Date: "2025/05/03", Stars: 5, Review: "I really like the restaurant and this egyptian cuisine. You have to try it!", Nationality: "/Icons/GermanFlag.png" }
  ]

  return (
    <div className='bg-[#f5f5f5] text-[#333333] overflow-x-hidden dark:bg-[#0f0f0f] min-h-screen flex flex-col transition-colors duration-300 ease'>
      <Navbar/>
      <MenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}/>

      <main className='max-w-[1200px] mx-auto mb-8 px-8 w-full flex-1'>
        {/* Hero Section */}
        <section className={`hero-section flex flex-col justify-center pt-[13rem] pb-0 pl-0 pr-0 mt-0 cursor-default relative overflow-visible ${language === 'ar' ? 'items-end text-right' : 'items-start text-left'}`}>
          {/* Transparent Container with Image */}
          <div className={`absolute top-0 w-[300px] transition-colors duration-300 ease overflow-visible ${language === 'ar' ? 'left-0' : 'right-0'}`}>
            <div className="w-[85%] h-[400px] bg-[#2c3e50] shadow-2xl transition-colors duration-300 ease flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            </div>
            <img 
              src='/hero-shot.png' 
              alt='Mahshi Dish' 
              className='w-[350px] h-[350px] object-contain absolute top-[200px] left-1/2 transform -translate-x-1/2'
            />
          </div>
          
          <h1 className='title text-[2.5rem] text-[#2c3e50] mb-6 font-semibold dark:text-[#dddddd] transition-colors duration-300 ease'>{translations.hero_section.title}</h1>
          <p className='text-[1.1rem] text-[#666666] max-w-[750px] mb-8 leading-[1.6] dark:text-[#b8b8b8] transition-colors duration-300 ease'>{translations.hero_section.description}</p>

          <div className='btnContainer flex gap-6 mb-8'>
            <button className='btn primary' onClick={displayMenuModal}>{translations.hero_section.viewMenu}</button>
          </div>
        </section>

        {/* About Us Section */}
        <section className='about mt-40 py-8 cursor-default'>
          <div className="relative mb-12">
            {/* Decorative line */}
            <div className="absolute top-1/2 w-full h-[2px] bg-[#e74c3c] transform -translate-y-1/2"></div>
            
            {/* Title container */}
            <div className="relative flex justify-center">
              <div className="bg-[#f5f5f5] dark:bg-[#0f0f0f] px-8 py-4 transition-colors duration-300 ease">
                {/* Desktop Title */}
                <h2 className={`hidden lg:flex text-[2.5rem] text-[#2c3e50] cursor-default font-semibold items-center gap-4 dark:text-[#d3d3d3] transition-colors duration-300 ease ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <>
                    <img src='/Icons/Star2.png' alt="Star icon" className="w-8 h-8"/>
                    {translations.about_section.title}
                    <img src='/Icons/Star2.png' alt="Star icon" className="w-8 h-8"/>
                  </>
                </h2>

                {/* Tablet Title */}
                <h2 className={`hidden sm:flex lg:hidden text-[2rem] text-[#2c3e50] cursor-default font-semibold items-center gap-3 dark:text-[#d3d3d3] transition-colors duration-300 ease ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <>
                    <img src='/Icons/Star2.png' alt="Star icon" className="w-6 h-6"/>
                    {translations.about_section.title}
                    <img src='/Icons/Star2.png' alt="Star icon" className="w-6 h-6"/>
                  </>
                </h2>

                {/* Mobile Title */}
                <h2 className={`flex sm:hidden text-[1.5rem] text-[#2c3e50] cursor-default font-semibold items-center gap-2 dark:text-[#d3d3d3] transition-colors duration-300 ease ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <>
                    <img src='/Icons/Star2.png' alt="Star icon" className="w-5 h-5"/>
                    {translations.about_section.title}
                    <img src='/Icons/Star2.png' alt="Star icon" className="w-5 h-5"/>
                  </>
                </h2>
              </div>
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className={`hidden lg:flex flex-col lg:flex-row gap-12 items-stretch ${language === 'ar' ? 'lg:flex-row-reverse' : ''}`}>
            {/* Image Container */}
            <div className="w-full lg:w-1/2 relative">
              <div className="w-full h-[400px] bg-[#2c3e50] shadow-2xl transition-colors duration-300 ease rounded-lg overflow-hidden">
                <img 
                  src='/Banner.jpg' 
                  alt='Restaurant Interior' 
                  className='w-full h-full object-cover'
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="w-full lg:w-1/2 flex flex-col h-[400px]">
              <p className={`text-[1.1rem] text-[#666666] ${language === 'ar' ? 'leading-[1.8]' : 'leading-[1.6]'} dark:text-[#b8b8b8] transition-colors duration-300 ease ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                {translations.about_section.description}
              </p>
              <div className="mt-auto flex gap-4">
                <div className={`flex-1 p-6 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg transition-colors duration-300 ease ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-[#e74c3c] text-xl font-semibold mb-2">{translations.about_section.mission.title}</h3>
                  <p className="text-[#666666] dark:text-[#b8b8b8] transition-colors duration-300 ease">{translations.about_section.mission.description}</p>
                </div>
                <div className={`flex-1 p-6 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg transition-colors duration-300 ease ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-[#e74c3c] text-xl font-semibold mb-2">{translations.about_section.vision.title}</h3>
                  <p className="text-[#666666] dark:text-[#b8b8b8] transition-colors duration-300 ease">{translations.about_section.vision.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tablet Layout */}
          <div className="hidden sm:block lg:hidden">
            <div className={`flex flex-col gap-8 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {/* Image Container */}
              <div className="w-full relative">
                <div className="w-full h-[350px] bg-[#2c3e50] shadow-2xl transition-colors duration-300 ease rounded-lg overflow-hidden">
                  <img 
                    src='/Banner.jpg' 
                    alt='Restaurant Interior' 
                    className='w-full h-full object-cover'
                  />
                </div>
              </div>

              {/* Text Content */}
              <div className="w-full">
                <p className={`text-[1rem] text-[#666666] ${language === 'ar' ? 'leading-[1.8]' : 'leading-[1.6]'} dark:text-[#b8b8b8] transition-colors duration-300 ease mb-6`}>
                  {translations.about_section.description}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg transition-colors duration-300 ease`}>
                    <h3 className="text-[#e74c3c] text-lg font-semibold mb-2">{translations.about_section.mission.title}</h3>
                    <p className="text-[#666666] dark:text-[#b8b8b8] transition-colors duration-300 ease text-sm">{translations.about_section.mission.description}</p>
                  </div>
                  <div className={`p-4 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg transition-colors duration-300 ease`}>
                    <h3 className="text-[#e74c3c] text-lg font-semibold mb-2">{translations.about_section.vision.title}</h3>
                    <p className="text-[#666666] dark:text-[#b8b8b8] transition-colors duration-300 ease text-sm">{translations.about_section.vision.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="block sm:hidden">
            <div className={`flex flex-col gap-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {/* Image Container */}
              <div className="w-full relative">
                <div className="w-full h-[250px] bg-[#2c3e50] shadow-2xl transition-colors duration-300 ease rounded-lg overflow-hidden">
                  <img 
                    src='/Banner.jpg' 
                    alt='Restaurant Interior' 
                    className='w-full h-full object-cover'
                  />
                </div>
              </div>

              {/* Text Content */}
              <div className="w-full">
                <p className={`text-[0.95rem] text-[#666666] ${language === 'ar' ? 'leading-[1.8]' : 'leading-[1.6]'} dark:text-[#b8b8b8] transition-colors duration-300 ease mb-4`}>
                  {translations.about_section.description}
                </p>
                <div className="flex flex-col gap-4">
                  <div className={`p-4 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg transition-colors duration-300 ease`}>
                    <h3 className="text-[#e74c3c] text-base font-semibold mb-2">{translations.about_section.mission.title}</h3>
                    <p className="text-[#666666] dark:text-[#b8b8b8] transition-colors duration-300 ease text-sm">{translations.about_section.mission.description}</p>
                  </div>
                  <div className={`p-4 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg transition-colors duration-300 ease`}>
                    <h3 className="text-[#e74c3c] text-base font-semibold mb-2">{translations.about_section.vision.title}</h3>
                    <p className="text-[#666666] dark:text-[#b8b8b8] transition-colors duration-300 ease text-sm">{translations.about_section.vision.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Offers Section */}
        <section id="offers" className='mt-24 py-8'>
          <h2 className={`section-title text-[2rem] ${language === 'ar' ? 'text-right' : 'text-left'} text-[#2c3e50] mb-4 cursor-default font-semibold flex items-center dark:text-[#d3d3d3] transition-colors duration-300 ease ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            {translations.offers_section.title} 
            <img src='/Icons/Star2.png' alt="Star icon" className={`w-8 h-8 ${language === 'ar' ? 'mr-[0.3rem]' : 'ml-[0.3rem]'}`}/>
          </h2>
          <div className={`flex flex-wrap gap-8 px-4 justify-start max-w-[1200px] mx-auto ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
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
          <h2 className={`section-title text-[2rem] ${language === 'ar' ? 'text-right' : 'text-left'} text-[#2c3e50] mb-4 cursor-default font-semibold flex items-center dark:text-[#d3d3d3] transition-colors duration-300 ease ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            {translations.reviews_section.title} 
            <img src='/Icons/Star.png' alt="Star icon" className={`w-8 h-8 -mt-[0.2rem] ${language === 'ar' ? 'mr-[0.3rem]' : 'ml-[0.3rem]'}`}/>
          </h2>
          <div className={`flex flex-wrap gap-8 px-4 justify-start max-w-[1200px] mx-auto cursor-default ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
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
