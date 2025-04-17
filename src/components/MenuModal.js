import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function MenuModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center z-[50] opacity-100 transition-opacity duration-300 ease-in-out" onClick={onClose}>
      <div className="flex flex-row items-center justify-center gap-5 translate-y-[100px] opacity-0 animate-[slideUp_0.5s_ease_forwards] max-h-[90vh] overflow-x-auto p-5 relative pb-[100px]" onClick={(e) => e.stopPropagation()}>
        <img src='/Menu1.jpg' className='max-w-[45%] max-h-[80vh] block rounded-[10px] shadow-md flex-none'></img>
        <img src='/Menu2.jpg' className='max-w-[45%] max-h-[80vh] block rounded-[10px] shadow-md flex-none'></img>
        <button onClick={onClose} className='fixed bottom-5 left-1/2 -translate-x-1/2 w-[50px] h-[50px] rounded-full bg-[#e74c3c] text-white border-none text-[24px] cursor-pointer flex justify-center items-center shadow-md transition-transform duration-300 ease-in-out opacity-0 animate-[fadeIn_0.5s_ease_0.5s_forwards] z-[2001] hover:scale-110 will-change-transform'><FontAwesomeIcon icon={faXmark} size="sm"/></button>
      </div>
    </div>
  );
}