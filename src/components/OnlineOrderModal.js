import { useLanguage } from '../context/LanguageContext';

export default function OnlineOrderModal({ isOpen, onClose }) {
    const { language, translations } = useLanguage();
    if (!isOpen) return null;

    return (
        <div onClick={onClose} className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center z-[50] opacity-100 transition-opacity duration-300 ease-in-out">
            <div onClick={(e) => e.stopPropagation()} className={`bg-white p-8 rounded-xl w-[90%] max-w-[400px] relative animate-slideUp dark:bg-[#1e1e1e] ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center justify-center gap-2 -mt-4 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <h2 className={`text-[#2c3e50] text-[1.8rem] font-semibold dark:text-[#cecece]`}>
                        {translations.order_form.title}
                    </h2>
                    <img src="/Icons/Grinning.png" className="w-[2.1rem] h-[2.1rem]" alt="grinning emoji" />
                </div>
                <div className={`flex flex-col gap-4 mt-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <p className={`text-gray-400 ${language === 'ar' ? 'text-right leading-relaxed' : 'text-left'}`}>
                        {translations.order_form.description}
                    </p>
                    <div className="flex justify-center -m-4 mt-4">
                        <button onClick={onClose} className={`py-[0.5rem] w-full text-white border-none rounded-lg transition-all duration-300 bg-[#e74c3c] hover:bg-[#c0392b]`}>
                            {translations.order_form.button}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}