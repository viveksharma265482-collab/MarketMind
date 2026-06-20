'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Info, X } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  hasData: boolean;
  explanation: string;
  example: string;
  iconColorClass: string;
  iconBgClass: string;
}

export default function KPICard({
  title,
  value,
  icon: Icon,
  hasData,
  explanation,
  example,
  iconColorClass,
  iconBgClass
}: KPICardProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Close explanation when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowExplanation(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={cardRef} className="premium-card p-6 bg-white flex flex-col relative select-none">
      {/* Top row with icon & title */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${iconBgClass}`}>
          <Icon className={`h-5 w-5 ${iconColorClass}`} />
        </div>
        <button 
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-text-muted hover:text-brand-purple transition-all p-1 hover:bg-gray-100 rounded-md"
          title="What does this mean?"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      {/* Main Metric Value */}
      <div className="flex-grow">
        <span className="text-[11px] text-text-secondary uppercase font-semibold tracking-wider">{title}</span>
        <h3 className={`text-2xl font-bold mt-1 text-text-primary ${!hasData ? 'text-text-muted' : ''}`}>
          {hasData ? value : '--'}
        </h3>
      </div>

      {/* Muted Sub-text */}
      <div className="mt-2 text-xs text-text-muted font-medium">
        {hasData ? 'Active analysis' : 'No data yet'}
      </div>

      {/* Popover Explanation Box */}
      {showExplanation && (
        <div className="absolute top-2 left-2 right-2 bg-slate-900 text-white rounded-xl p-4 shadow-xl z-10 animate-fade-in text-xs border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-brand-purple-light flex items-center space-x-1.5">
              <Info className="h-3.5 w-3.5" />
              <span>What does this mean?</span>
            </span>
            <button 
              onClick={() => setShowExplanation(false)}
              className="text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="leading-relaxed text-gray-300 mb-2 font-medium">{explanation}</p>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 text-[11px]">
            <span className="font-semibold text-gray-200 block mb-0.5">Example:</span>
            <span className="text-gray-400 font-medium italic">{example}</span>
          </div>
        </div>
      )}
    </div>
  );
}
