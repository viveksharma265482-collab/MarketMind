'use client';

import React from 'react';
import { Brain } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <header id="dashboard-header" className="flex items-center justify-between py-4 px-6 border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm w-full select-none">
      {/* Brand logo & title */}
      <div className="flex items-center space-x-3">
        <div className="bg-brand-purple p-2 rounded-lg">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-wide text-text-primary">
            MarketMind <span className="text-brand-purple">AI</span>
          </h1>
          <p className="text-[10px] text-text-secondary font-semibold leading-none">
            AI-Powered Marketing Intelligence Platform
          </p>
        </div>
      </div>
    </header>
  );
}
