import React, { useRef } from 'react';

interface StepOneProps {
  onSelect: (image: string) => void;
  presets: string[];
}

const StepOne: React.FC<StepOneProps> = ({ onSelect, presets }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSelect(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
        选择或上传人物照片
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Upload Button */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-[3/4] border-2 border-dashed border-indigo-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <span className="text-sm font-medium text-indigo-700">上传照片</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileUpload}
          />
        </div>

        {/* Presets */}
        {presets.map((src, index) => (
          <div 
            key={index} 
            onClick={() => onSelect(src)}
            className="aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-indigo-500 shadow-sm hover:shadow-md transition-all relative group"
          >
            <img src={src} alt={`Preset Person ${index}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepOne;