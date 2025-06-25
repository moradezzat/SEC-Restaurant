import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function MenuModal({ isOpen, onClose }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!isOpen) return null;

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const handleBack = () => {
    setSelectedImage(null);
  };

  const handleClose = () => {
    setSelectedImage(null);
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center z-[50] opacity-100 transition-opacity duration-300 ease-in-out" onClick={handleClose}>
      <div className="flex flex-row items-center justify-center gap-5 translate-y-[100px] opacity-0 animate-[slideUp_0.5s_ease_forwards] max-h-[90vh] p-5 relative pb-[100px]" onClick={(e) => e.stopPropagation()}>
        
        {/* Show single enlarged image when selected */}
        {selectedImage && (
          <img 
            src={selectedImage} 
            className='max-w-[90%] max-h-[85vh] block rounded-[10px] shadow-md cursor-pointer transition-all duration-300 ease-in-out'
            alt="منيو مطعم ست الكل مكبر"
          />
        )}
        
        {/* Show both images when none is selected */}
        {!selectedImage && (
          <>
            <img 
              src='assets/Menu1.webp' 
              className='max-w-[45%] max-h-[80vh] block rounded-[10px] shadow-md flex-none cursor-pointer hover:scale-[1.01] transition-transform duration-300 ease-in-out'
              onClick={() => handleImageClick('assets/Menu1.webp')}
              alt="المنيو الأول لمطعم ست الكل"
            />
            <img 
              src='assets/Menu2.webp' 
              className='max-w-[45%] max-h-[80vh] block rounded-[10px] shadow-md flex-none cursor-pointer hover:scale-[1.01] transition-transform duration-300 ease-in-out'
              onClick={() => handleImageClick('assets/Menu2.webp')}
              alt="المنيو الثاني لمطعم ست الكل"
            />
          </>
        )}
        
        {/* Button container */}
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 z-[2001]">
          {/* Back button - only show when an image is selected */}
          {selectedImage && (
            <button 
              onClick={handleBack} 
              className='w-[50px] h-[50px] rounded-full bg-[#e74c3c] text-white border-none text-[20px] cursor-pointer flex justify-center items-center shadow-md transition-transform duration-300 ease-in-out hover:scale-110 will-change-transform'
            >
              <FontAwesomeIcon icon={faArrowLeft} size="sm"/>
            </button>
          )}
          
          {/* Close button */}
          <button 
            onClick={handleClose} 
            className='w-[50px] h-[50px] rounded-full bg-[#e74c3c] text-white border-none text-[24px] cursor-pointer flex justify-center items-center shadow-md transition-transform duration-300 ease-in-out opacity-0 animate-[fadeIn_0.5s_ease_0.5s_forwards] hover:scale-110 will-change-transform'
          >
            <FontAwesomeIcon icon={faXmark} size="sm"/>
          </button>
        </div>
      </div>
    </div>
  );
}