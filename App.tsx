import React, { useState } from 'react';
import TopCards from './components/TopCards';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import HistoryGallery from './components/HistoryGallery';
import { AppStep, HistoryItem } from './types';

// Mock Data for Presets
const INITIAL_PERSON_PRESETS = [
  "https://picsum.photos/id/64/432/576", // Girl
  "https://picsum.photos/id/91/432/576", // Girl with camera (crop)
  "https://picsum.photos/id/338/432/576", // Woman
  "https://picsum.photos/id/669/432/576", // Man
];

const INITIAL_CLOTHES_PRESETS = [
  "https://picsum.photos/id/447/400/500", // Generic texture
  "https://picsum.photos/id/103/400/500", // Shoes/Feet? Just placeholders
  "https://picsum.photos/id/250/400/500", // Camera?
  "https://picsum.photos/id/30/400/500", // Mug?
];

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.SELECT_PERSON);
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [clothesImage, setClothesImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // State for presets to allow adding generated clothes
  const [clothesPresets, setClothesPresets] = useState<string[]>(INITIAL_CLOTHES_PRESETS);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [personPresets, setPersonPresets] = useState<string[]>(INITIAL_PERSON_PRESETS);

  const handlePersonSelect = (img: string) => {
    setPersonImage(img);
    setStep(AppStep.SELECT_CLOTHES);
    // Clear subsequent steps if going back
    setClothesImage(null);
    setResultImage(null);
  };

  const handleClothesSelect = (img: string) => {
    setClothesImage(img);
    setStep(AppStep.RESULT);
    setResultImage(null); // Clear previous result if any
  };

  const handleGenerationSuccess = (resultImg: string) => {
    setResultImage(resultImg);
    // Add to history
    if (personImage && clothesImage) {
        const newItem: HistoryItem = {
            id: Date.now().toString(),
            personImage,
            clothesImage,
            resultImage: resultImg,
            timestamp: Date.now(),
        };
        setHistory(prev => [newItem, ...prev]);
    }
  };

  const handleReset = () => {
    setStep(AppStep.SELECT_PERSON);
    setPersonImage(null);
    setClothesImage(null);
    setResultImage(null);
  };

  const addClothesPreset = (img: string) => {
      setClothesPresets(prev => [img, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50 text-slate-900 pb-12">
      
      {/* Header / Title */}
      <header className="w-full py-6 px-8 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg"></div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">AI 换装大师 <span className="text-xs font-normal text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-full border border-indigo-100">Beta</span></h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl px-4 flex-1 flex flex-col">
        
        {/* Dynamic Cards Visualization */}
        <TopCards 
            currentStep={step} 
            personImage={personImage || undefined}
            clothesImage={clothesImage || undefined}
            resultImage={resultImage || undefined}
        />

        {/* Operational Area */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-6 md:p-8 min-h-[400px] transition-all duration-300 relative overflow-hidden border border-white">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

            {step === AppStep.SELECT_PERSON && (
                <StepOne 
                    onSelect={handlePersonSelect} 
                    presets={personPresets}
                />
            )}

            {step === AppStep.SELECT_CLOTHES && personImage && (
                <StepTwo 
                    personImage={personImage}
                    onSelect={handleClothesSelect}
                    onBack={() => setStep(AppStep.SELECT_PERSON)}
                    presets={clothesPresets}
                    addPreset={addClothesPreset}
                />
            )}

            {step === AppStep.RESULT && personImage && clothesImage && (
                <StepThree 
                    personImage={personImage}
                    clothesImage={clothesImage}
                    onSuccess={handleGenerationSuccess}
                    onReset={handleReset}
                    onBack={() => setStep(AppStep.SELECT_CLOTHES)}
                />
            )}
        </div>
      </main>

      {/* Footer / Gallery */}
      <HistoryGallery history={history} />

    </div>
  );
};

export default App;