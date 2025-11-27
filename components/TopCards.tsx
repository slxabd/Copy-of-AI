import React from 'react';
import { AppStep } from '../types';

interface TopCardsProps {
  currentStep: AppStep;
  personImage?: string;
  clothesImage?: string;
  resultImage?: string;
}

const TopCards: React.FC<TopCardsProps> = ({ currentStep, personImage, clothesImage, resultImage }) => {
  
  const getCardStyle = (step: number) => {
    const isActive = currentStep === step;
    const isPast = currentStep > step;
    
    let baseClass = "relative w-24 h-36 md:w-32 md:h-48 rounded-xl shadow-lg border-4 transition-all duration-700 ease-in-out transform overflow-hidden bg-white ";
    
    // Tilt logic
    if (step === 1) baseClass += "-rotate-6 translate-x-4 z-10 ";
    if (step === 2) baseClass += "rotate-0 -translate-y-4 z-20 ";
    if (step === 3) baseClass += "rotate-6 -translate-x-4 z-10 ";

    // Active/Inactive styling
    if (isActive) {
      baseClass += "border-indigo-500 scale-110 shadow-indigo-200/50 ";
    } else if (isPast) {
      baseClass += "border-emerald-400 opacity-80 ";
    } else {
      baseClass += "border-slate-200 opacity-40 grayscale ";
    }

    return baseClass;
  };

  const renderPlaceholder = (icon: string, label: string) => (
    <div className="flex flex-col items-center justify-center h-full bg-slate-100 text-slate-400">
      <span className="text-2xl mb-2">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </div>
  );

  return (
    <div className="flex justify-center items-center py-8 md:py-12 perspective-1000">
      
      {/* Step 1 Card: Person */}
      <div className={getCardStyle(1)}>
        {personImage ? (
          <img src={personImage} alt="Person" className="w-full h-full object-cover" />
        ) : renderPlaceholder("👤", "人物")}
        <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] text-center py-1">Step 1</div>
      </div>

      {/* Step 2 Card: Clothes */}
      <div className={getCardStyle(2)}>
        {clothesImage ? (
          <img src={clothesImage} alt="Clothes" className="w-full h-full object-cover" />
        ) : renderPlaceholder("👕", "衣物")}
        <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] text-center py-1">Step 2</div>
      </div>

      {/* Step 3 Card: Result */}
      <div className={getCardStyle(3)}>
        {resultImage ? (
          <img src={resultImage} alt="Result" className="w-full h-full object-cover" />
        ) : renderPlaceholder("✨", "效果")}
        <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] text-center py-1">Step 3</div>
      </div>

    </div>
  );
};

export default TopCards;