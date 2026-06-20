'use client';

import React from 'react';
import { 
  Brain, 
  LayoutDashboard, 
  Layers, 
  BarChart3, 
  Sparkles, 
  Wallet, 
  Trash2, 
  Users, 
  FileText, 
  Database,
  HelpCircle,
  BookOpen,
  Upload
} from 'lucide-react';

interface SidebarProps {
  onUploadClick: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Sidebar({ onUploadClick, activeSection, setActiveSection }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, targetId: 'dashboard-kpi' },
    { id: 'campaigns', label: 'Campaigns', icon: Layers, targetId: 'top-campaigns-section' },
    { id: 'performance', label: 'Performance', icon: BarChart3, targetId: 'performance-charts-section' },
    { id: 'insights', label: 'AI Insights', icon: Sparkles, targetId: 'ai-insights-section' },
    { id: 'budget', label: 'Budget Optimizer', icon: Wallet, targetId: 'budget-optimization-section' },
    { id: 'wasted', label: 'Wasted Spend', icon: Trash2, targetId: 'wasted-spend-section' },
    { id: 'audiences', label: 'Audiences', icon: Users, targetId: 'channel-performance-card' },
    { id: 'reports', label: 'Reports', icon: FileText, targetId: 'dashboard-header' },
    { id: 'data', label: 'Data Management', icon: Database, targetId: 'upload-dataset-section' },
  ];

  const handleScroll = (targetId: string, itemId: string) => {
    setActiveSection(itemId);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <aside className="w-64 bg-sidebar-bg text-white h-screen fixed left-0 top-0 flex flex-col justify-between z-20 shadow-xl select-none">
      {/* Top Brand Section */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-brand-purple p-2 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wide">MarketMind <span className="text-brand-purple">AI</span></h1>
            <p className="text-[10px] text-text-muted mt-0.5 font-medium leading-none">Marketing Intelligence Platform</p>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="mt-8 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleScroll(item.targetId, item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-sidebar-active text-white shadow-lg shadow-sidebar-active/30' 
                    : 'text-gray-400 hover:bg-sidebar-hover hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Details & Welcome Card */}
      <div className="p-4 space-y-6">
        {/* Welcome Box */}
        <div className="bg-sidebar-hover p-4 rounded-xl border border-gray-800">
          <h3 className="text-xs font-semibold text-white">Welcome to MarketMind AI</h3>
          <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
            Upload your marketing data to unlock powerful insights and grow your business.
          </p>
          <button 
            onClick={onUploadClick}
            className="w-full mt-3 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Upload className="h-3 w-3" />
            <span>Upload Your Data</span>
          </button>
        </div>

        {/* Bottom Help Links */}
        <div className="border-t border-gray-800 pt-4 space-y-2">
          <a href="#" className="flex items-center space-x-3 text-xs text-gray-400 hover:text-white px-2 py-1.5 transition-all">
            <HelpCircle className="h-4 w-4" />
            <span>Need Help?</span>
          </a>
          <a href="#" className="flex items-center justify-between text-xs text-gray-400 hover:text-white px-2 py-1.5 transition-all">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-4 w-4" />
              <span>Documentation</span>
            </div>
            <span className="text-[10px] text-gray-600 font-bold font-mono">&gt;</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
