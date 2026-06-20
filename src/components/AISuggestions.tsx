'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  Wallet, 
  Trash2, 
  ListOrdered, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Award,
  Lightbulb,
  ShieldCheck,
  Zap,
  X
} from 'lucide-react';

interface AISuggestionsProps {
  hasData: boolean;
  insightsData: {
    executiveSummary: {
      wins: string[];
      problems: string[];
      opportunities: string[];
    };
    consultantAnswers: {
      question: string;
      answer: string;
    }[];
    coach: {
      situation: string;
      meaning: string;
      action: string;
    };
    recommendations: {
      priority: 'High' | 'Medium' | 'Low';
      recommendation: string;
      reason: string;
      benefit: string;
    }[];
    nextBestAction: {
      action: string;
      improvement: string;
      confidence: 'High' | 'Medium' | 'Low';
    };
  } | null;
  budgetOptimization: {
    recommendation: string;
    expectedImprovement: number;
    fromChannel: string;
    toChannel: string;
    shiftAmount: number;
  } | null;
  wastedSpend: {
    totalWasted: number;
    wastedCount: number;
    wastedCampaigns: {
      campaign: string;
      channel: string;
      spend: number;
      roi: number;
      conversions: number;
      reason: string;
    }[];
  } | null;
  topCampaigns: {
    campaign: string;
    channel: string;
    spend: number;
    revenue: number;
    roi: number;
    conversions: number;
    cpa: number;
  }[];
}

// ----------------------------------------------------
// 1. AI INSIGHTS CARD (Row 2, Col 3)
// ----------------------------------------------------
export function AIInsightsCard({ hasData, insightsData }: { hasData: boolean; insightsData: AISuggestionsProps['insightsData'] }) {
  const [activeTab, setActiveTab] = useState<'summary' | 'consultant' | 'coach'>('summary');

  return (
    <div id="ai-insights-section" className="premium-card p-6 bg-white flex flex-col h-[400px]">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-brand-purple" />
          <h4 className="font-bold text-slate-800 text-sm">AI Insights</h4>
        </div>
        {hasData && (
          <div className="flex space-x-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-semibold text-text-secondary">
            <button 
              onClick={() => setActiveTab('summary')}
              className={`px-2 py-1 rounded-md transition-all ${activeTab === 'summary' ? 'bg-white text-brand-purple shadow-sm' : 'hover:text-slate-800'}`}
            >
              Summary
            </button>
            <button 
              onClick={() => setActiveTab('consultant')}
              className={`px-2 py-1 rounded-md transition-all ${activeTab === 'consultant' ? 'bg-white text-brand-purple shadow-sm' : 'hover:text-slate-800'}`}
            >
              Consultant
            </button>
            <button 
              onClick={() => setActiveTab('coach')}
              className={`px-2 py-1 rounded-md transition-all ${activeTab === 'coach' ? 'bg-white text-brand-purple shadow-sm' : 'hover:text-slate-800'}`}
            >
              Coach
            </button>
          </div>
        )}
      </div>

      <div className="flex-grow overflow-y-auto pr-1">
        {!hasData ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="border border-slate-200 bg-slate-50 p-4 rounded-full mb-3">
              <BrainCircuit className="h-6 w-6 text-text-muted" />
            </div>
            <h5 className="font-bold text-sm text-slate-700">No insights yet</h5>
            <p className="text-xs text-text-muted mt-1 max-w-xs leading-relaxed">
              Upload your data to get AI-powered insights and recommendations.
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in text-xs">
            {/* TAB 1: EXECUTIVE SUMMARY */}
            {activeTab === 'summary' && insightsData && (
              <div className="space-y-3 font-medium">
                <div>
                  <span className="font-bold text-green-700 flex items-center space-x-1 mb-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Key Wins</span>
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-text-secondary leading-relaxed">
                    {insightsData.executiveSummary.wins.map((win, idx) => (
                      <li key={idx}>{win}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-bold text-red-700 flex items-center space-x-1 mb-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Underperforming Areas</span>
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-text-secondary leading-relaxed">
                    {insightsData.executiveSummary.problems.map((prob, idx) => (
                      <li key={idx}>{prob}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-bold text-brand-purple flex items-center space-x-1 mb-1">
                    <Lightbulb className="h-3.5 w-3.5" />
                    <span>Growth Opportunities</span>
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-text-secondary leading-relaxed">
                    {insightsData.executiveSummary.opportunities.map((opp, idx) => (
                      <li key={idx}>{opp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 2: CONSULTANT Q&A */}
            {activeTab === 'consultant' && insightsData && (
              <div className="space-y-3.5">
                {insightsData.consultantAnswers.map((qa, idx) => (
                  <div key={idx} className="border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                    <span className="font-bold text-slate-800 text-[11px] flex items-start space-x-1.5 leading-snug">
                      <span className="text-brand-purple font-mono">Q{idx+1}:</span>
                      <span>{qa.question}</span>
                    </span>
                    <p className="text-text-secondary mt-1 pl-4 leading-relaxed font-medium">{qa.answer}</p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: CAMPAIGN COACH */}
            {activeTab === 'coach' && insightsData && (
              <div className="space-y-3.5">
                <div className="bg-brand-purple-light/50 border border-brand-purple-light p-3 rounded-lg">
                  <span className="font-bold text-brand-purple block mb-1">Current Situation:</span>
                  <p className="text-text-secondary leading-relaxed font-medium">{insightsData.coach.situation}</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg">
                  <span className="font-bold text-blue-800 block mb-1">What It Means:</span>
                  <p className="text-text-secondary leading-relaxed font-medium">{insightsData.coach.meaning}</p>
                </div>
                <div className="bg-green-50 border border-green-100 p-3 rounded-lg">
                  <span className="font-bold text-green-800 block mb-1">Suggested Actions:</span>
                  <p className="text-text-secondary leading-relaxed font-medium">{insightsData.coach.action}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. BUDGET OPTIMIZATION CARD (Row 3, Col 1)
// ----------------------------------------------------
export function BudgetOptimizationCard({ hasData, budgetOptimization, insightsData }: { hasData: boolean; budgetOptimization: AISuggestionsProps['budgetOptimization']; insightsData: AISuggestionsProps['insightsData'] }) {
  return (
    <div id="budget-optimization-section" className="premium-card p-6 bg-white flex flex-col min-h-[360px]">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
        <div className="flex items-center space-x-2">
          <Wallet className="h-5 w-5 text-indigo-600" />
          <h4 className="font-bold text-slate-800 text-sm">Budget Optimization</h4>
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-between">
        {!hasData ? (
          <div className="h-full py-8 flex flex-col items-center justify-center text-center">
            <div className="border border-slate-200 bg-slate-50 p-4 rounded-full mb-3">
              <Wallet className="h-6 w-6 text-text-muted" />
            </div>
            <h5 className="font-bold text-sm text-slate-700">No data to display</h5>
            <p className="text-xs text-text-muted mt-1 max-w-xs leading-relaxed">
              Upload your data to get budget optimization recommendations.
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in text-xs">
            {/* Shifting Recommendation Rule */}
            {budgetOptimization && (
              <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Rule-Based Shifting Strategy</span>
                <p className="text-text-primary font-bold mt-1.5 leading-snug">{budgetOptimization.recommendation}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-medium text-text-muted">Estimated Revenue Lift</span>
                    <span className="text-green-600 font-bold text-base block mt-0.5">+{budgetOptimization.expectedImprovement.toFixed(1)}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-medium text-text-muted">Shift Amount</span>
                    <span className="text-slate-800 font-bold text-base block mt-0.5">₹{budgetOptimization.shiftAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Next Best Action Card (from Gemini or structured values) */}
            {insightsData && insightsData.nextBestAction && (
              <div className="bg-brand-purple-light/50 border border-brand-purple/20 p-3.5 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-brand-purple flex items-center space-x-1 text-[11px]">
                    <Zap className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                    <span>Next Best Action</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    insightsData.nextBestAction.confidence === 'High' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {insightsData.nextBestAction.confidence} Confidence
                  </span>
                </div>
                <p className="font-semibold text-slate-800 leading-snug">{insightsData.nextBestAction.action}</p>
                <span className="text-[10px] font-medium text-text-muted mt-2 block">
                  Est. Improvement: <strong className="text-slate-700">{insightsData.nextBestAction.improvement}</strong>
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. WASTED SPEND ANALYSIS CARD (Row 3, Col 2)
// ----------------------------------------------------
export function WastedSpendCard({ hasData, wastedSpend }: { hasData: boolean; wastedSpend: AISuggestionsProps['wastedSpend'] }) {
  return (
    <div id="wasted-spend-section" className="premium-card p-6 bg-white flex flex-col min-h-[360px]">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
        <div className="flex items-center space-x-2">
          <Trash2 className="h-5 w-5 text-red-500" />
          <h4 className="font-bold text-slate-800 text-sm">Wasted Spend Analysis</h4>
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-between">
        {!hasData ? (
          <div className="h-full py-8 flex flex-col items-center justify-center text-center">
            <div className="border border-slate-200 bg-slate-50 p-4 rounded-full mb-3">
              <Trash2 className="h-6 w-6 text-text-muted" />
            </div>
            <h5 className="font-bold text-sm text-slate-700">No data to display</h5>
            <p className="text-xs text-text-muted mt-1 max-w-xs leading-relaxed">
              Upload your data to identify wasted spend opportunities.
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-slide-up text-xs">
            {/* Wasted Summary */}
            {wastedSpend && (
              <div className="bg-red-50/50 p-3.5 border border-red-100 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-red-700 tracking-wider">Estimated Leakage</span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-black text-red-600">₹{wastedSpend.totalWasted.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] font-semibold text-text-secondary">wasted on low ROI campaigns</span>
                </div>
                <p className="text-[10.5px] text-red-700 mt-2 leading-normal font-medium">
                  We found <strong className="text-red-900">{wastedSpend.wastedCount}</strong> campaigns generating below-target return (ROI &lt; 1.0x).
                </p>
              </div>
            )}

            {/* List of Flagged Campaigns */}
            {wastedSpend && wastedSpend.wastedCampaigns.length > 0 ? (
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">Flagged Campaigns:</span>
                <div className="max-h-[140px] overflow-y-auto pr-1 space-y-2">
                  {wastedSpend.wastedCampaigns.map((c, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex flex-col space-y-1">
                      <div className="flex justify-between items-center">
                        <strong className="text-slate-800 text-[11px] truncate max-w-[150px]">{c.campaign}</strong>
                        <span className="bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded text-[9px]">{c.roi === 0 ? '0.0' : c.roi.toFixed(1)}x ROI</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-text-secondary font-medium">
                        <span>Spend: ₹{c.spend.toLocaleString('en-IN')}</span>
                        <span>Conv: {c.conversions}</span>
                      </div>
                      <p className="text-[10px] text-brand-purple leading-snug italic font-medium">↳ Rec: {c.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-green-50 p-4 border border-green-100 rounded-xl text-center">
                <span className="text-green-800 font-bold block text-xs">All Campaigns Performing Strong!</span>
                <p className="text-[10.5px] text-green-600 mt-1">No campaigns are currently spending budget without yielding return.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 4. TOP CAMPAIGNS CARD (Row 3, Col 3)
// ----------------------------------------------------
export function TopCampaignsCard({ hasData, topCampaigns }: { hasData: boolean; topCampaigns: AISuggestionsProps['topCampaigns'] }) {
  return (
    <div id="top-campaigns-section" className="premium-card p-6 bg-white flex flex-col min-h-[360px]">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
        <div className="flex items-center space-x-2">
          <Award className="h-5 w-5 text-yellow-500" />
          <h4 className="font-bold text-slate-800 text-sm">Top Performing Campaigns</h4>
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-between">
        {!hasData ? (
          <div className="h-full py-8 flex flex-col items-center justify-center text-center">
            <div className="border border-slate-200 bg-slate-50 p-4 rounded-full mb-3">
              <ListOrdered className="h-6 w-6 text-text-muted" />
            </div>
            <h5 className="font-bold text-sm text-slate-700">No data to display</h5>
            <p className="text-xs text-text-muted mt-1 max-w-xs leading-relaxed">
              Upload your data to see your top performing campaigns.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5 animate-slide-up text-xs">
            <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">Ranked by ROI:</span>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {topCampaigns.slice(0, 5).map((c, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-lg hover:border-brand-purple/20 transition-all">
                  <div className="flex items-center space-x-3 truncate">
                    <div className="bg-brand-purple/10 text-brand-purple font-bold text-xs h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
                      #{idx + 1}
                    </div>
                    <div className="truncate">
                      <strong className="text-slate-800 font-bold block truncate max-w-[120px]">{c.campaign}</strong>
                      <span className="text-[10px] text-text-muted font-medium uppercase tracking-tight">{c.channel}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-green-600 font-extrabold text-sm block">{(c.roi).toFixed(1)}x</span>
                    <span className="text-[10px] text-text-secondary font-medium">CPA: ₹{Math.round(c.cpa)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 5. SMART SUGGESTIONS PANEL ("Recommended Actions")
// ----------------------------------------------------
export function RecommendedActionsPanel({ 
  hasData, 
  insightsData,
  analysisResult 
}: { 
  hasData: boolean; 
  insightsData: AISuggestionsProps['insightsData'];
  analysisResult: any;
}) {
  const [selectedRec, setSelectedRec] = useState<{ priority: string; recommendation: string; reason: string; benefit: string } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [detailData, setDetailData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Alternative Strategy states
  const [alternativeStrategy, setAlternativeStrategy] = useState<string | null>(null);
  const [isGeneratingAlternative, setIsGeneratingAlternative] = useState(false);
  const [isAlternativeHighlighted, setIsAlternativeHighlighted] = useState(false);
  const alternativeStrategyRef = React.useRef<HTMLDivElement | null>(null);

  const handleRecClick = async (rec: { priority: string; recommendation: string; reason: string; benefit: string }) => {
    setSelectedRec(rec);
    setIsDrawerOpen(true);
    setIsLoading(true);
    setDetailData(null);
    setAlternativeStrategy(null);
    setIsAlternativeHighlighted(false);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/recommendation/detail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          analysisData: analysisResult || {},
          recommendation: rec.recommendation,
          reason: rec.reason,
          benefit: rec.benefit
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate recommendation details.');
      }
      const data = await response.json();
      if (data.success) {
        setDetailData(data.detail);
      } else {
        throw new Error(data.message || 'Failed to get details.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to recommendation detail API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAlternative = async () => {
    if (!selectedRec) return;
    setIsGeneratingAlternative(true);
    setAlternativeStrategy(null);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/recommendation/alternative', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          analysisData: analysisResult || {},
          recommendation: selectedRec.recommendation,
          reason: selectedRec.reason
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate alternative strategy.');
      }
      const data = await response.json();
      if (data.success) {
        setAlternativeStrategy(data.alternative);
      } else {
        throw new Error(data.message || 'Failed to generate alternative.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to alternative strategy API.');
    } finally {
      setIsGeneratingAlternative(false);
    }
  };

  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;
    let highlightTimer: NodeJS.Timeout;
    if (alternativeStrategy) {
      scrollTimer = setTimeout(() => {
        if (alternativeStrategyRef.current) {
          alternativeStrategyRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          setIsAlternativeHighlighted(true);
          highlightTimer = setTimeout(() => {
            setIsAlternativeHighlighted(false);
          }, 2000);
        }
      }, 100);
    }
    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(highlightTimer);
    };
  }, [alternativeStrategy]);

  if (!hasData || !insightsData || !insightsData.recommendations) return null;

  return (
    <section id="smart-suggestions-panel" className="premium-card p-6 bg-white animate-slide-up select-none">
      <div className="flex items-center space-x-2.5 pb-4 border-b border-gray-100 mb-5">
        <div className="bg-brand-purple-light p-2 rounded-lg">
          <Lightbulb className="h-5 w-5 text-brand-purple" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-base">Recommended Actions</h3>
          <p className="text-xs text-text-muted mt-0.5 font-medium">Prioritized AI insights and concrete operational adjustments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {insightsData.recommendations.map((rec, idx) => {
          let priorityColor = 'bg-yellow-50 text-yellow-800 border-yellow-200';
          if (rec.priority === 'High') priorityColor = 'bg-red-50 text-red-800 border-red-200';
          if (rec.priority === 'Low') priorityColor = 'bg-green-50 text-green-800 border-green-200';

          return (
            <div 
              key={idx} 
              onClick={() => handleRecClick(rec)}
              className="border border-slate-200 rounded-xl p-4.5 bg-slate-50/50 flex flex-col justify-between hover:border-brand-purple/20 transition-all hover:bg-white cursor-pointer active:scale-[0.99]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${priorityColor}`}>
                    {rec.priority} Priority
                  </span>
                  <span className="text-[10px] font-bold text-text-muted">Recommendation #{idx + 1}</span>
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 text-sm leading-snug">{rec.recommendation}</h5>
                  <p className="text-xs text-text-secondary mt-1.5 leading-relaxed font-medium">
                    <strong className="text-slate-700">Reason:</strong> {rec.reason}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                <span className="text-text-muted">Expected Benefit:</span>
                <span className="text-brand-purple flex items-center space-x-0.5">
                  <span>{rec.benefit}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-out Drawer Panel */}
      {isDrawerOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                  selectedRec?.priority === 'High' 
                    ? 'bg-red-50 text-red-800 border-red-200' 
                    : selectedRec?.priority === 'Low' 
                      ? 'bg-green-50 text-green-800 border-green-200' 
                      : 'bg-yellow-50 text-yellow-800 border-yellow-200'
                }`}>
                  {selectedRec?.priority} Priority
                </span>
                <h3 className="font-extrabold text-slate-800 text-sm mt-1.5 leading-snug">{selectedRec?.recommendation}</h3>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-grow overflow-y-auto p-5 space-y-6 scrollbar-thin">
              {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center space-y-3">
                  <div className="h-8 w-8 border-3 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-text-muted font-semibold">Consulting AI Consultant for action plan...</span>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-center text-xs text-red-600">
                  <strong>Error:</strong> {error}
                </div>
              ) : detailData ? (
                <div className="space-y-5 text-xs leading-relaxed animate-fade-in font-medium">
                  {/* Badges and Score bar */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl flex flex-col justify-center text-center">
                      <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider block">Risk Level</span>
                      <span className={`text-xs font-extrabold mt-1 block ${
                        detailData.riskLevel === 'Low' 
                          ? 'text-green-600' 
                          : detailData.riskLevel === 'Medium' 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                      }`}>
                        {detailData.riskLevel}
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl flex flex-col justify-center text-center">
                      <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider block">Confidence</span>
                      <span className="text-xs font-extrabold mt-1 text-slate-800 block">
                        {detailData.confidenceScore}%
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl flex flex-col justify-center text-center">
                      <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider block">Timeline</span>
                      <span className="text-xs font-extrabold mt-1 text-brand-purple block">
                        {detailData.timeline}
                      </span>
                    </div>
                  </div>

                  {/* 1. Executive Summary */}
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">1. Executive Summary</h5>
                    <p className="text-text-secondary bg-slate-50 p-3 border border-slate-100 rounded-xl font-semibold">
                      {detailData.executiveSummary}
                    </p>
                  </div>

                  {/* 2. Current Situation */}
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">2. Current Situation</h5>
                    <p className="text-text-secondary bg-slate-50 p-3 border border-slate-100 rounded-xl font-semibold">
                      {detailData.currentSituation}
                    </p>
                  </div>

                  {/* 3. Recommended Action */}
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">3. Recommended Action</h5>
                    <p className="text-brand-purple font-bold bg-brand-purple-light/50 p-3 border border-brand-purple-light rounded-xl leading-normal">
                      {detailData.recommendedAction}
                    </p>
                  </div>

                  {/* 4. Why This Recommendation Was Generated */}
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">4. Why This Recommendation Was Generated</h5>
                    <p className="text-text-secondary bg-slate-50 p-3 border border-slate-100 rounded-xl font-semibold">
                      {detailData.whyGenerated}
                    </p>
                  </div>

                  {/* 5. Expected Business Impact */}
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">5. Expected Business Impact</h5>
                    <div className="grid grid-cols-2 gap-4 bg-green-50/20 border border-green-100 p-3.5 rounded-xl">
                      <div>
                        <span className="text-[9px] text-green-800 font-bold uppercase tracking-wider block">Potential Savings</span>
                        <span className="text-base font-black text-green-600 mt-0.5 block">
                          {detailData.expectedImpact?.potentialSavings || 'None'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-green-800 font-bold uppercase tracking-wider block">Expected ROI Improvement</span>
                        <span className="text-base font-black text-slate-800 mt-0.5 block">
                          {detailData.expectedImpact?.expectedRoiImprovement}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 6. Step-by-Step Action Plan */}
                  <div className="space-y-2.5">
                    <h5 className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">6. Step-by-Step Action Plan</h5>
                    <div className="space-y-2">
                      {detailData.actionPlan?.map((step: string, idx: number) => (
                        <div key={idx} className="flex items-start space-x-2.5 bg-slate-50 p-3 border border-slate-100 rounded-xl">
                          <div className="bg-brand-purple/10 text-brand-purple font-bold text-[10px] h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <p className="text-text-secondary font-semibold leading-relaxed pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions and Alternatives */}
                  <div className="border-t border-slate-100 pt-4 mt-5 space-y-3.5">
                    <button
                      onClick={handleGenerateAlternative}
                      disabled={isGeneratingAlternative}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingAlternative ? (
                        <>
                          <div className="h-3 w-3 border-2 border-slate-700 border-t-transparent rounded-full animate-spin"></div>
                          <span>AI is generating an alternative strategy...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5 text-brand-purple" />
                          <span>Generate Alternative Strategy</span>
                        </>
                      )}
                    </button>

                    {alternativeStrategy && (
                      <div 
                        ref={alternativeStrategyRef}
                        className={`border rounded-xl p-3.5 animate-slide-up space-y-1 transition-all duration-1000 ${
                          isAlternativeHighlighted
                            ? 'bg-brand-purple-light/40 border-brand-purple/20 shadow-[0_0_20px_rgba(124,58,237,0.15)]'
                            : 'bg-brand-purple-light/20 border-brand-purple/10'
                        }`}
                      >
                        <span className="font-bold text-brand-purple text-[10px] uppercase tracking-wider block">Alternative AI Strategy:</span>
                        <p className="text-text-secondary leading-normal font-semibold">
                          {alternativeStrategy}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

// ----------------------------------------------------
// 6. MARKETING BRAINSTORMING AI CARD
// ----------------------------------------------------
export function MarketingBrainstormCard({ hasData, file, analysisResult }: { hasData: boolean; file: File | null; analysisResult: any }) {
  const [ideas, setIdeas] = useState<Array<{ category: string; title: string; reason: string }> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detail Drawer States
  const [selectedIdea, setSelectedIdea] = useState<{ category: string; title: string; reason: string } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [detailData, setDetailData] = useState<any | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  
  // Similar Ideas States
  const [similarIdeas, setSimilarIdeas] = useState<any[] | null>(null);
  const [isSimilarLoading, setIsSimilarLoading] = useState(false);
  const similarIdeasRef = React.useRef<HTMLDivElement | null>(null);

  // New Brainstorm Results Focus & Highlight States
  const [isHighlighted, setIsHighlighted] = useState(false);
  const ideasContainerRef = React.useRef<HTMLDivElement | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setIdeas(null);
    try {
      let response;
      if (file && file.size > 0) {
        const formData = new FormData();
        formData.append('file', file);
        response = await fetch('http://localhost:8000/api/brainstorm', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetch('http://localhost:8000/api/brainstorm', {
          method: 'POST'
        });
      }

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to brainstorm ideas.');
      }
      const data = await response.json();
      setIdeas(data.ideas);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to brainstorm API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIdeas(null);
    setError(null);
    setSelectedIdea(null);
    setIsDrawerOpen(false);
  };

  const handleIdeaClick = async (idea: { category: string; title: string; reason: string }) => {
    setSelectedIdea(idea);
    setIsDrawerOpen(true);
    setIsDetailLoading(true);
    setDetailData(null);
    setSimilarIdeas(null);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/brainstorm/detail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          analysisData: analysisResult || {},
          category: idea.category,
          title: idea.title,
          reason: idea.reason
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate recommendation details.');
      }
      const data = await response.json();
      setDetailData(data.detail);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch recommendation detail.');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleGenerateSimilar = async () => {
    if (!selectedIdea) return;
    setIsSimilarLoading(true);
    setSimilarIdeas(null);
    try {
      const response = await fetch('http://localhost:8000/api/brainstorm/similar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          analysisData: analysisResult || {},
          category: selectedIdea.category,
          title: selectedIdea.title
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate similar ideas.');
      }
      const data = await response.json();
      setSimilarIdeas(data.ideas);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch similar ideas.');
    } finally {
      setIsSimilarLoading(false);
    }
  };

  useEffect(() => {
    if (!hasData) {
      setIdeas(null);
      setError(null);
      setSelectedIdea(null);
      setIsDrawerOpen(false);
    }
  }, [hasData]);

  useEffect(() => {
    if (similarIdeas && similarIdeas.length > 0) {
      const timer = setTimeout(() => {
        similarIdeasRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [similarIdeas]);

  useEffect(() => {
    if (ideas && ideas.length > 0) {
      const timer = setTimeout(() => {
        if (ideasContainerRef.current) {
          ideasContainerRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          setIsHighlighted(true);
          const highlightTimer = setTimeout(() => {
            setIsHighlighted(false);
          }, 2000);
          return () => clearTimeout(highlightTimer);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [ideas]);

  return (
    <div id="marketing-brainstorm-section" className="premium-card p-5 bg-white flex flex-col transition-all duration-300">
      {/* Horizontal Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="bg-brand-purple-light p-2 rounded-lg text-base flex-shrink-0">
            🧠
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-xs">Marketing Brainstorm AI</h4>
            <p className="text-xs text-text-muted mt-0.5 font-medium">
              {!hasData 
                ? "Upload campaign data to unlock brainstorming." 
                : "Generate AI-powered growth opportunities based on your uploaded campaign data."}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 flex-shrink-0">
          {ideas && (
            <button
              onClick={handleReset}
              className="text-[10px] font-semibold text-text-muted hover:text-slate-700 underline cursor-pointer mr-1"
            >
              Reset
            </button>
          )}
          <button
            onClick={handleGenerate}
            disabled={!hasData || isLoading}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm ${
              !hasData
                ? "bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed"
                : "bg-brand-purple hover:bg-brand-purple-hover text-white cursor-pointer shadow-brand-purple/10"
            }`}
          >
            {isLoading ? (
              <>
                <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>AI is generating growth opportunities...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-pulse" />
                <span>Generate Growth Ideas</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && !isDrawerOpen && (
        <p className="text-[10px] text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-lg w-full text-left mt-3">
          <strong>Error:</strong> {error}
        </p>
      )}

      {/* Ideas Grid (rendered only when ideas exist) */}
      {ideas && (
        <div 
          ref={ideasContainerRef}
          className={`mt-4 pt-4 border-t border-slate-100 animate-slide-up transition-all duration-1000 rounded-xl p-2 -mx-2 ${
            isHighlighted 
              ? 'bg-brand-purple-light/40 shadow-[0_0_20px_rgba(124,58,237,0.15)]' 
              : 'bg-transparent'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-brand-purple tracking-wider block mb-3">Brainstorm Results (Click card to inspect details)</span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {ideas.map((idea, idx) => (
              <div 
                key={idx} 
                onClick={() => handleIdeaClick(idea)}
                className="bg-slate-50 hover:bg-brand-purple-light/20 hover:border-brand-purple/20 transition-all p-3.5 border border-slate-200/80 rounded-xl flex flex-col justify-between space-y-1.5 cursor-pointer shadow-sm active:scale-95"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-brand-purple uppercase bg-brand-purple-light px-1.5 py-0.5 rounded">
                      {idea.category}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">#{idx + 1}</span>
                  </div>
                  <h5 className="font-bold text-slate-800 text-xs leading-snug">{idea.title}</h5>
                  <p className="text-[10.5px] text-text-secondary leading-relaxed font-semibold">
                    {idea.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slide-out Drawer Panel (Preferred Option A) */}
      {isDrawerOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <div>
                <span className="text-[10px] font-bold text-brand-purple uppercase bg-brand-purple-light px-2 py-0.5 rounded">
                  {selectedIdea?.category}
                </span>
                <h3 className="font-extrabold text-slate-800 text-sm mt-1.5 leading-snug">{selectedIdea?.title}</h3>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-grow overflow-y-auto p-5 space-y-6 scrollbar-thin">
              {isDetailLoading ? (
                <div className="h-64 flex flex-col items-center justify-center space-y-3">
                  <div className="h-8 w-8 border-3 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-text-muted font-semibold">Generating data-driven business case...</span>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-center text-xs text-red-600">
                  <strong>Error:</strong> {error}
                </div>
              ) : detailData ? (
                <div className="space-y-5 text-xs leading-relaxed animate-fade-in font-medium">
                  {/* Badges and Score bar */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl flex flex-col justify-center">
                      <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider block">Risk Level</span>
                      <span className={`text-xs font-extrabold mt-1 block ${
                        detailData.riskLevel === 'Low' 
                          ? 'text-green-600' 
                          : detailData.riskLevel === 'Medium' 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                      }`}>
                        {detailData.riskLevel} Risk
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl flex flex-col justify-center">
                      <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider block">Confidence Score</span>
                      <span className="text-xs font-extrabold mt-1 text-slate-800 block">
                        Confidence: {detailData.confidenceScore}%
                      </span>
                    </div>
                  </div>

                  {/* 1. Problem */}
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">1. Problem Identification</h5>
                    <p className="text-text-secondary bg-slate-50 p-3 border border-slate-100 rounded-xl font-semibold">
                      {detailData.problem}
                    </p>
                  </div>

                  {/* 2. Current Situation */}
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">2. Current Situation</h5>
                    <p className="text-text-secondary bg-slate-50 p-3 border border-slate-100 rounded-xl font-semibold">
                      {detailData.currentSituation}
                    </p>
                  </div>

                  {/* 3. Recommended Action */}
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">3. Recommended Action</h5>
                    <p className="text-brand-purple font-bold bg-brand-purple-light/50 p-3 border border-brand-purple-light rounded-xl leading-normal">
                      {detailData.recommendedAction}
                    </p>
                  </div>

                  {/* 4. Why This Works */}
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">4. Why This Works</h5>
                    <p className="text-text-secondary bg-slate-50 p-3 border border-slate-100 rounded-xl font-semibold">
                      {detailData.whyThisWorks}
                    </p>
                  </div>

                  {/* 5. Expected Business Impact */}
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">5. Expected Business Impact</h5>
                    <div className="grid grid-cols-2 gap-4 bg-green-50/20 border border-green-100 p-3.5 rounded-xl">
                      <div>
                        <span className="text-[9px] text-green-800 font-bold uppercase tracking-wider block">Potential Revenue Increase</span>
                        <span className="text-base font-black text-green-600 mt-0.5 block">
                          {detailData.expectedImpact?.potentialRevenueIncrease}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-green-800 font-bold uppercase tracking-wider block">Estimated Additional Revenue</span>
                        <span className="text-base font-black text-slate-800 mt-0.5 block">
                          {detailData.expectedImpact?.estimatedAdditionalRevenue}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 6. Implementation Steps */}
                  <div className="space-y-2.5">
                    <h5 className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">6. Implementation Steps</h5>
                    <div className="space-y-2">
                      {detailData.implementationSteps?.map((step: string, idx: number) => (
                        <div key={idx} className="flex items-start space-x-2.5 bg-slate-50 p-3 border border-slate-100 rounded-xl">
                          <div className="bg-brand-purple/10 text-brand-purple font-bold text-[10px] h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <p className="text-text-secondary font-semibold leading-relaxed pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Extra Feature: Generate Similar Ideas */}
                  <div className="border-t border-slate-100 pt-4 mt-5 space-y-3.5">
                    <div className="flex flex-col space-y-0.5">
                      <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Additional Suggestions</span>
                      <p className="text-[10px] text-text-muted font-semibold">
                        Generate 3 more related data-driven recommendations linked to this context.
                      </p>
                    </div>

                    <button
                      onClick={handleGenerateSimilar}
                      disabled={isSimilarLoading}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSimilarLoading ? (
                        <>
                          <div className="h-3 w-3 border-2 border-slate-700 border-t-transparent rounded-full animate-spin"></div>
                          <span>AI is brainstorming...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5 text-brand-purple" />
                          <span>Generate Similar Ideas</span>
                        </>
                      )}
                    </button>

                    {/* Similar Ideas list */}
                    {similarIdeas && (
                      <div 
                        ref={similarIdeasRef}
                        className="space-y-2 animate-slide-up pt-1"
                      >
                        {similarIdeas.map((idea: any, idx: number) => (
                          <div 
                            key={idx} 
                            onClick={() => handleIdeaClick(idea)}
                            className="bg-slate-50 hover:bg-brand-purple-light/20 hover:border-brand-purple/20 transition-all p-3 border border-slate-200/80 rounded-xl space-y-1 cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold text-brand-purple uppercase bg-brand-purple-light px-1.5 py-0.5 rounded">
                                {idea.category}
                              </span>
                              <span className="text-[9px] font-mono text-slate-400">Related #{idx + 1}</span>
                            </div>
                            <h5 className="font-bold text-slate-800 text-[11px] leading-snug">{idea.title}</h5>
                            <p className="text-[10px] text-text-secondary leading-normal font-semibold">
                              {idea.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
