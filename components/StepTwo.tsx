import React, { useRef, useState } from 'react';
import { generateClothingImage } from '../services/geminiService';

interface StepTwoProps {
  personImage: string;
  onSelect: (image: string) => void;
  onBack: () => void;
  presets: string[];
  addPreset: (image: string) => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ personImage, onSelect, onBack, presets, addPreset }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleGenerateClothes = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const generatedImage = await generateClothingImage(prompt);
      addPreset(generatedImage); // Add to presets
      onSelect(generatedImage); // Auto select
    } catch (err) {
      setError("抱歉，生成衣物时遇到问题。可能是网络波动或服务繁忙，请稍后再试。");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Reference to Step 1 */}
      <div className="flex items-center gap-4 p-3 bg-slate-100 rounded-lg mb-6 border border-slate-200">
        <img src={personImage} alt="Selected Person" className="w-10 h-10 rounded-full object-cover border border-white shadow-sm" />
        <span className="text-sm text-slate-600">已选定人物，请为 TA 挑选一件衣服</span>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
        选择或生成衣物
      </h2>

      {/* AI Generation Input */}
      <div className={`mb-6 p-4 rounded-xl border transition-colors duration-300 ${
          error ? 'bg-red-50 border-red-200' : 
          isGenerating ? 'bg-indigo-100 border-indigo-200' : 
          'bg-indigo-50/50 border-indigo-100'
      }`}>
        <label className={`block text-xs font-semibold mb-2 uppercase tracking-wide ${error ? 'text-red-600' : 'text-indigo-800'}`}>
          AI 设计师 (Nano Banana)
        </label>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => {
                setPrompt(e.target.value);
                if (error) setError(null); // Clear error on edit
            }}
            placeholder="输入提示词，例如：红色丝绸晚礼服, 赛博朋克夹克..."
            className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm disabled:opacity-60 disabled:bg-slate-50 transition-all
                ${error 
                    ? 'border-red-300 focus:ring-red-500 text-red-900 placeholder-red-300' 
                    : 'border-indigo-200 focus:ring-indigo-500'
                }`}
            onKeyDown={(e) => e.key === 'Enter' && !isGenerating && handleGenerateClothes()}
            disabled={isGenerating}
          />
          <button
            onClick={handleGenerateClothes}
            disabled={isGenerating || !prompt}
            className={`
                px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-sm whitespace-nowrap
                ${isGenerating 
                    ? 'bg-indigo-400 cursor-wait pl-4 pr-5' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
                }
                text-white disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>设计中...</span>
              </>
            ) : (
              '生成'
            )}
          </button>
        </div>
        
        {/* Enhanced Error Display */}
        {error && (
            <div className="mt-3 flex items-start gap-3 text-sm animate-pulse">
                <div className="shrink-0 mt-0.5 text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="flex-1 text-red-600">
                    <p>{error}</p>
                </div>
                <button 
                    onClick={handleGenerateClothes}
                    className="shrink-0 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline bg-white/50 px-2 py-0.5 rounded border border-indigo-100"
                >
                    重试一下
                </button>
            </div>
        )}
      </div>

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
          <span className="text-sm font-medium text-indigo-700">上传衣物</span>
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
            className="aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-indigo-500 shadow-sm hover:shadow-md transition-all relative group bg-white"
          >
            <img src={src} alt={`Preset Clothes ${index}`} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
          </div>
        ))}
      </div>
      
      <div className="flex justify-start">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-700 text-sm font-medium flex items-center gap-1">
          ← 返回上一步
        </button>
      </div>
    </div>
  );
};

export default StepTwo;