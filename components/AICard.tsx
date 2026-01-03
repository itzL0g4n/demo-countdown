import React, { useState } from 'react';
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { getFuturePrediction } from '../services/geminiService';
import { PredictionType } from '../types';
import { TextScramble } from './TextScramble';

export const AICard: React.FC = () => {
  const [prediction, setPrediction] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState<PredictionType>(PredictionType.MOTIVATION);

  const handlePredict = async () => {
    setLoading(true);
    const result = await getFuturePrediction(activeType);
    setPrediction(result);
    setLoading(false);
  };

  return (
    <div className="w-full">
        <div 
            className="relative glass-card rounded-[2rem] p-6 md:p-8 transition-all duration-200 ease-out overflow-hidden"
        >
            <div className="relative z-10 flex flex-col space-y-6">
            
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-charcoal">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-display font-bold text-sm uppercase tracking-wide">Gemini Oracle</span>
                </div>
                
                <div className="flex space-x-1">
                    {(Object.values(PredictionType) as PredictionType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => setActiveType(type)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                activeType === type ? 'bg-black w-6' : 'bg-black/20 hover:bg-black/40'
                            }`}
                            title={type}
                        />
                    ))}
                </div>
            </div>

            <div className="min-h-[80px] flex items-center">
                {loading ? (
                    <div className="flex items-center space-x-3 text-charcoal/50">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <TextScramble text="Connecting to 2027 timeline..." />
                    </div>
                ) : prediction ? (
                    <p className="text-lg md:text-xl font-serif text-charcoal leading-snug">
                        "<TextScramble text={prediction} trigger={prediction} />"
                    </p>
                ) : (
                    <p className="text-charcoal/40 text-sm font-sans">
                        Select a category point ({activeType}) and tap the arrow to receive your future insight.
                    </p>
                )}
            </div>

            <div className="flex justify-between items-end border-t border-black/5 pt-4">
                <span className="text-xs font-mono text-charcoal/40 uppercase">
                    {activeType}
                </span>
                <button
                    onClick={handlePredict}
                    disabled={loading}
                    className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-charcoal text-white overflow-hidden transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:-rotate-45 transition-transform duration-300" />
                </button>
            </div>

            </div>
        </div>
    </div>
  );
};