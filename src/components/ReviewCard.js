"use client";
import Image from 'next/image';

export default function ReviewCard({ Username, Profile, Date, Stars, Review }) {
    return(
        <div className="bg-white rounded-[15px] p-6 shadow-md transition-all duration-300 ease w-[300px] flex flex-col flex-none hover:-translate-y-[5px] hover:shadow-lg will-change-transform">
            <div className="flex items-center mb-2 gap-2">
                <img src={Profile} alt="Review" className="w-[50px] h-[50px] rounded-[50%] object-cover flex-shrink-0"/>
                <div className="flex flex-col items-start flex-1">
                    <div className="text-[1.1rem] font-semibold text-[#2c3e50] mb-[0.2rem]">{Username}</div>
                    <div className="text-[0.9rem] text-[#95a5a6]">{Date}</div>
                </div>
            </div>
            <div className="flex gap-[0.2rem] mb-[1rem] justify-center">
                {[...Array(Stars)].map((_, index) => (
                    <Image key={index} src="/Icons/Star.png" alt="Star" width={20} height={20} className="w-5 h-5 object-contain"/>
                ))}
            </div>
            <div className="text-[#666666] text-[0.95rem] leading-[1.6] text-center flex-1 overflow-y-auto p-2 font-sans-serif">{Review}</div>
        </div>
    )
}