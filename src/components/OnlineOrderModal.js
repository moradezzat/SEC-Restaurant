export default function OnlineOrderModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div onClick={onClose} className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center z-[50] opacity-100 transition-opacity duration-300 ease-in-out">
            <div onClick={(e) => e.stopPropagation()} className="bg-white p-8 rounded-2xl w-[90%] max-w-[400px] relative animate-slideUp">
                <div className="flex items-center justify-center gap-2 -mt-4 mb-4">
                    <h2 className="text-[#2c3e50] text-[1.8rem] font-semibold">Oops!</h2>
                    <img src="/Icons/Grinning.png" className="w-9 h-9" alt="grinning emoji" />
                </div>
                <div className="flex flex-col gap-4 mt-8">
                    <p>Sorry, but online ordering is not available at this time.</p>
                    <div className="flex justify-center mt-2 -mb-4">
                        <button onClick={onClose} className="py-[0.5rem] px-10 text-white border-none rounded-[5px] transition-all duration-300 bg-[#e74c3c] hover:bg-[#c0392b]">
                            I understand.
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}