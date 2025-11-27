import React from 'react';
import { HistoryItem } from '../types';

interface HistoryGalleryProps {
  history: HistoryItem[];
}

const HistoryGallery: React.FC<HistoryGalleryProps> = ({ history }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 mb-8">
      <h3 className="text-lg font-bold text-slate-700 mb-4 px-4">历史生成记录</h3>
      <div className="flex gap-4 overflow-x-auto pb-6 px-4 snap-x">
        {history.map((item) => (
          <div key={item.id} className="snap-start shrink-0 w-32 md:w-40 flex flex-col gap-2">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-md group">
                <img src={item.resultImage} alt="History" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-white text-xs truncate w-full">
                        {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                </div>
            </div>
            <div className="flex gap-1 h-8">
                <img src={item.personImage} alt="Source Person" className="w-8 h-8 rounded object-cover opacity-60" />
                <span className="text-slate-300 self-center">+</span>
                <img src={item.clothesImage} alt="Source Cloth" className="w-8 h-8 rounded object-cover opacity-60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryGallery;