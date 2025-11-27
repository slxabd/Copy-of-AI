import React, { useEffect, useState } from 'react';
import { generateTryOn } from '../services/geminiService';

interface StepThreeProps {
  personImage: string;
  clothesImage: string;
  onSuccess: (resultImage: string) => void;
  onReset: () => void;
  onBack: () => void;
}

const StepThree: React.FC<StepThreeProps> = ({ personImage, clothesImage, onSuccess, onReset, onBack }) => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const doGeneration = async () => {
      try {
        setLoading(true);
        setError(null);
        // Artificial delay for UI UX if response is too fast, but usually API takes time
        const imageUrl = await generateTryOn(personImage, clothesImage);
        
        if (isMounted) {
            setResult(imageUrl);
            onSuccess(imageUrl);
            setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
            setError("生成失败。请确保 API Key 配置正确，且网络畅通。");
            setLoading(false);
        }
      }
    };

    doGeneration();

    return () => { isMounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return (
    <div className="animate-fade-in-up flex flex-col items-center">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 self-start">
        <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
        生成效果
      </h2>

      <div className="relative w-full max-w-sm aspect-[3/4] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50">
                 <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                 <p className="text-indigo-600 font-medium animate-pulse">正在为您试穿中...</p>
                 <p className="text-slate-400 text-xs mt-2">使用 Nano Banana 模型处理全身细节</p>
            </div>
        ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 p-6 text-center">
                <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-3">
                    !
                </div>
                <p className="text-red-600 mb-4">{error}</p>
                <button onClick={onBack} className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50">返回重试</button>
            </div>
        ) : (
            <>
                <img src={result!} alt="Final Result" className="w-full h-full object-cover" />
                <div className="absolute bottom-4 right-4 flex gap-2">
                    <a href={result!} download="ai-tryon-result.png" className="bg-white/90 hover:bg-white text-slate-800 p-2 rounded-full shadow-lg backdrop-blur-sm transition-all" title="下载图片">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M12 9.75V1.5m0 0L8.25 5.25M12 1.5 15.75 5.25" />
                        </svg>
                    </a>
                </div>
            </>
        )}
      </div>

      {!loading && !error && (
        <div className="mt-8 flex gap-4">
             <button 
                onClick={onReset}
                className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 transition-all font-medium"
            >
                开始新的换装
            </button>
             <button 
                onClick={onBack}
                className="px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-full shadow hover:bg-slate-50 transition-all font-medium"
            >
                更换衣物
            </button>
        </div>
      )}
    </div>
  );
};

export default StepThree;