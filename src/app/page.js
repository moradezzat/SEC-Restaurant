import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReviewCard from '../components/Review';
import { SpeedInsights } from "@vercel/speed-insights/next"

const Offers = [
  { id: 1, Title: 'مكرونة بالكبدة', Content: 'طاجن مكرونة بالكبدة', Price: '45.00', ImgSrc: '/assets/drinks.png', ImgAlt: 'مكرونة بالكبدة' },
  { id: 2, Title: 'مكرونة بشاميل', Content: 'طاجن مكرونة بشاميل', Price: '50.00', ImgSrc: '/assets/drinks.png', ImgAlt: 'مكرونة بالكبدة' },
  { id: 3, Title: 'طاجن الملوخية', Content: 'طاجن ملوخية + ٣ أرغفة عيش + مخلل', Price: '35.00', ImgSrc: '/assets/drinks.png', ImgAlt: 'طاجن الملوخية' },
]

const Reviews = [
  { id: 1, Username: "Unknown", Profile: "/Icons/download.png", Date: "2025/03/01", Stars: 5, Review: "دي اول مره اجرب الأكل عندكم وبجد عاوز اشكر حضرتك عالأكل, حاجه في منتهي الروعه ماشاء الله, إن شاء الله مش هتبقي اخر مره اجي عندكم." },
  { id: 2, Username: "Sarah Ahmed", Profile: "/Icons/User.png", Date: "2024/03/14", Stars: 4, Review: "Best fast food restaurant in the area. The prices are reasonable and the quality is outstanding." },
  { id: 3, Username: "Mohamed Ali", Profile: "/Icons/User.png", Date: "2024/03/13", Stars: 5, Review: "Great atmosphere and friendly staff. The food is always fresh and served hot." }
]

export default function Home() {
  return (
    <main className='bg-[#f5f5f5] text-[#333333] overflow-x-hidden'>
      <Navbar/>
      <main className='max-w-[1200px] mx-auto mb-8 px-8 text-center w-full'>

        {/* Hero Section */}
        <section className='overflow-hidden flex flex-col justify-center items-center text-center pt-[13rem] pb-0 pl-0 pr-0 mt-0 cursor-default'>
          <h1 className='title text-[2.5rem] text-[#2c3e50] mb-6 font-semibold'>Welcome to SEC Restaurant</h1>
          <p className='text-[1.1rem] text-[#666666] max-w-[800px] mx-auto mb-8 leading-[1.6]'>
            Experience the best fast food in town! We serve delicious burgers, crispy fries, and refreshing drinks.
            Our commitment to quality and speed ensures you get the perfect meal every time.
          </p>

          <div className='btnContainer flex gap-6 justify-center mb-8'>
            <button className='btn primary'>View Our Menu</button>
            <button className='btn secondary'>Special Offers</button>
          </div>
        </section>

        {/* Offers Section */}
        <section className='mt-40 py-8'>
          <h2 className='text-[2rem] text-left text-[#2c3e50] mb-4 cursor-default font-semibold flex items-center'>Special Offers <img src='/Icons/Star2.png' className='w-8 h-8 ml-[0.3rem]'/></h2>
          <div className='flex flex-wrap gap-8 px-4 justify-start max-w-[1200px] mx-auto'>
            {/* {Offers.map((item) => (
              <OfferCard key={item.id} Title={item.Title} Content={item.Content} Price={item.Price} ImgSrc={item.ImgSrc} ImgAlt={item.ImgAlt} />
            ))} */}
            
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