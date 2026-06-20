'use client';

import React, { useState } from 'react';
import { 
  Coins, 
  TrendingUp, 
  Percent, 
  Target, 
  UserCheck 
} from 'lucide-react';

import DashboardHeader from '@/components/DashboardHeader';
import KPICard from '@/components/KPICard';
import PerformanceCharts from '@/components/PerformanceCharts';
import UploadZone from '@/components/UploadZone';
import { 
  AIInsightsCard, 
  BudgetOptimizationCard, 
  WastedSpendCard, 
  TopCampaignsCard, 
  RecommendedActionsPanel,
  MarketingBrainstormCard
} from '@/components/AISuggestions';

// API Base URL (FastAPI)
const API_URL = 'http://localhost:8000/api';

export default function Dashboard() {
  // App States
  const [activeSection, setActiveSection] = useState('dashboard');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<string>('');

  // Preview data state
  const [previewData, setPreviewData] = useState<{
    rowCount: number;
    colCount: number;
    columns: string[];
    mappedColumns: Record<string, string>;
    previewRows: Record<string, any>[];
  } | null>(null);

  // Analysis result state
  const [analysisResult, setAnalysisResult] = useState<{
    kpis: {
      totalSpend: number;
      totalRevenue: number;
      roi: number;
      conversions: number;
      avgCpa: number;
    };
    charts: {
      campaignTimeData: any[];
      channelData: any[];
    };
    budgetOptimization: {
      recommendation: string;
      expectedImprovement: number;
      fromChannel: string;
      toChannel: string;
      shiftAmount: number;
    };
    wastedSpend: {
      totalWasted: number;
      wastedCount: number;
      wastedCampaigns: any[];
    };
    topCampaigns: any[];
    aiInsights: {
      executiveSummary: {
        wins: string[];
        problems: string[];
        opportunities: string[];
      };
      consultantAnswers: { question: string; answer: string }[];
      coach: { situation: string; meaning: string; action: string };
      recommendations: any[];
      nextBestAction: { action: string; improvement: string; confidence: 'High' | 'Medium' | 'Low' };
    };
  } | null>(null);



  // Upload file and generate preview
  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsUploading(true);
    setError(null);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.message || errData.detail || 'Failed to parse file on backend.');
        setFile(null);
        setPreviewData(null);
        setIsUploading(false);
        return;
      }

      const data = await response.json();
      setPreviewData(data);
      if (data.dateRange) {
        setDateRange(data.dateRange);
      } else {
        setDateRange('Active Dataset');
      }
    } catch (err: any) {
      console.error(err);
      const isConnectionError = err.message?.toLowerCase().includes('fetch') || err.message?.toLowerCase().includes('connection') || err.message?.toLowerCase().includes('network');
      if (isConnectionError) {
        setError('Cannot connect to backend server. Is the backend running at port 8000? If not, please try Demo Mode below.');
      } else {
        setError(err.message);
      }
      setFile(null);
      setPreviewData(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Perform full analysis
  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.message || errData.detail || 'Failed to analyze data on backend.');
        setIsAnalyzing(false);
        return;
      }

      const data = await response.json();
      setAnalysisResult(data);
      setActiveSection('dashboard');
    } catch (err: any) {
      console.error(err);
      const isConnectionError = err.message?.toLowerCase().includes('fetch') || err.message?.toLowerCase().includes('connection') || err.message?.toLowerCase().includes('network');
      if (isConnectionError) {
        setError('Cannot connect to backend server. Please verify that your API status is active on port 8000.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Load Demo Mock Data
  // Load Demo Marketing Dataset (1000+ rows) from Backend
  const handleLoadDemo = async () => {
    setError(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch(`${API_URL}/demo`);

      if (!response.ok) {
        setError('Failed to fetch demo data from backend.');
        setIsAnalyzing(false);
        return;
      }

      const data = await response.json();
      setFile(new File([''], 'demo_marketing_data_1000.csv'));
      setPreviewData(data.preview);
      setAnalysisResult(data);
      if (data.preview.dateRange) {
        setDateRange(data.preview.dateRange);
      } else {
        setDateRange('May 01, 2026 - Jun 14, 2026');
      }
      setActiveSection('dashboard');
    } catch (err: any) {
      console.warn("Backend demo generation failed or offline. Running local client-side fallback simulation...");
      // Client-side fallback simulation in case backend is offline
      setFile(new File([''], 'sample_marketing_campaigns.csv'));
      setDateRange('Jan 1, 2026 - Jan 31, 2026');
      
      setPreviewData({
        rowCount: 1050,
        colCount: 8,
        columns: ['Date', 'Campaign', 'Channel', 'Spend', 'Impressions', 'Clicks', 'Conversions', 'Revenue'],
        mappedColumns: {
          'Spend': 'Spend',
          'Revenue': 'Revenue',
          'Conversions': 'Conversions',
          'Clicks': 'Clicks',
          'Impressions': 'Impressions',
          'Campaign': 'Campaign',
          'Channel': 'Channel'
        },
        previewRows: [
          { Date: '2026-01-01', Campaign: 'Google Search - Brand', Channel: 'Google Ads', Spend: 1200, Impressions: 12000, Clicks: 980, Conversions: 48, Revenue: 5800 },
          { Date: '2026-01-02', Campaign: 'FB Prospecting - Lookalike', Channel: 'Facebook Ads', Spend: 800, Impressions: 24000, Clicks: 520, Conversions: 12, Revenue: 950 },
          { Date: '2026-01-03', Campaign: 'LinkedIn Direct Message', Channel: 'LinkedIn', Spend: 2500, Impressions: 15000, Clicks: 150, Conversions: 6, Revenue: 4800 },
          { Date: '2026-01-04', Campaign: 'Instagram Stories - Retargeting', Channel: 'Instagram', Spend: 600, Impressions: 30000, Clicks: 890, Conversions: 42, Revenue: 3100 },
          { Date: '2026-01-05', Campaign: 'Google Search - Competitor', Channel: 'Google Ads', Spend: 1500, Impressions: 8500, Clicks: 320, Conversions: 8, Revenue: 620 },
          { Date: '2026-01-06', Campaign: 'FB Dynamic Product Catalog', Channel: 'Facebook Ads', Spend: 900, Impressions: 18000, Clicks: 450, Conversions: 15, Revenue: 2100 },
          { Date: '2026-01-07', Campaign: 'YouTube Bumper - Awareness', Channel: 'YouTube', Spend: 1800, Impressions: 98000, Clicks: 210, Conversions: 2, Revenue: 180 },
          { Date: '2026-01-08', Campaign: 'Google Search - NonBrand', Channel: 'Google Ads', Spend: 2100, Impressions: 19500, Clicks: 780, Conversions: 22, Revenue: 3400 },
          { Date: '2026-01-09', Campaign: 'LinkedIn Lead Gen Form', Channel: 'LinkedIn', Spend: 3200, Impressions: 18500, Clicks: 220, Conversions: 14, Revenue: 9600 },
          { Date: '2026-01-10', Campaign: 'Instagram Reels Video', Channel: 'Instagram', Spend: 1100, Impressions: 45000, Clicks: 1200, Conversions: 18, Revenue: 1450 }
        ]
      });

      setAnalysisResult({
        kpis: {
          totalSpend: 15600,
          totalRevenue: 31400,
          roi: 2.01,
          conversions: 187,
          avgCpa: 83.42
        },
        charts: {
          campaignTimeData: [
            { date: 'Jan 01', spend: 1200, revenue: 5800, conversions: 48, clicks: 980, roi: 4.8, cpa: 25 },
            { date: 'Jan 02', spend: 800, revenue: 950, conversions: 12, clicks: 520, roi: 1.2, cpa: 66.7 },
            { date: 'Jan 03', spend: 2500, revenue: 4800, conversions: 6, clicks: 150, roi: 1.9, cpa: 416.7 },
            { date: 'Jan 04', spend: 600, revenue: 3100, conversions: 42, clicks: 890, roi: 5.2, cpa: 14.3 },
            { date: 'Jan 05', spend: 1500, revenue: 620, conversions: 8, clicks: 320, roi: 0.4, cpa: 187.5 },
            { date: 'Jan 06', spend: 900, revenue: 2100, conversions: 15, clicks: 450, roi: 2.3, cpa: 60 },
            { date: 'Jan 07', spend: 1800, revenue: 180, conversions: 2, clicks: 210, roi: 0.1, cpa: 900 }
          ],
          channelData: [
            { channel: 'Google Ads', spend: 4800, revenue: 9820, conversions: 78, clicks: 2080, roi: 2.05, cpa: 61.54 },
            { channel: 'Facebook Ads', spend: 1700, revenue: 3050, conversions: 27, clicks: 970, roi: 1.79, cpa: 62.96 },
            { channel: 'Instagram', spend: 1700, revenue: 4550, conversions: 60, clicks: 2090, roi: 2.68, cpa: 28.33 },
            { channel: 'LinkedIn', spend: 5700, revenue: 14400, conversions: 20, clicks: 370, roi: 2.53, cpa: 285 },
            { channel: 'YouTube', spend: 1800, revenue: 180, conversions: 2, clicks: 210, roi: 0.10, cpa: 900 }
          ]
        },
        budgetOptimization: {
          recommendation: 'Move budget from YouTube Ads to Instagram Ads',
          expectedImprovement: 18.4,
          fromChannel: 'YouTube',
          toChannel: 'Instagram',
          shiftAmount: 1800
        },
        wastedSpend: {
          totalWasted: 3300,
          wastedCount: 2,
          wastedCampaigns: [
            { campaign: 'YouTube Bumper - Awareness', channel: 'YouTube', spend: 1800, roi: 0.1, conversions: 2, reason: 'Lowest conversions and near-zero ROI. Pause immediate spend.' },
            { campaign: 'Google Search - Competitor', channel: 'Google Ads', spend: 1500, roi: 0.4, conversions: 8, reason: 'High CPA of ₹187.5 compared to avg ₹61.5. Refine search keywords.' }
          ]
        },
        topCampaigns: [
          { campaign: 'Instagram Stories - Retargeting', channel: 'Instagram', spend: 600, revenue: 3100, roi: 5.2, conversions: 42, cpa: 14.3 },
          { campaign: 'Google Search - Brand', channel: 'Google Ads', spend: 1200, revenue: 5800, roi: 4.8, conversions: 48, cpa: 25 },
          { campaign: 'LinkedIn Lead Gen Form', channel: 'LinkedIn', spend: 3200, revenue: 9600, roi: 3.0, conversions: 14, cpa: 228.6 },
          { campaign: 'FB Dynamic Product Catalog', channel: 'Facebook Ads', spend: 900, revenue: 2100, roi: 2.3, conversions: 15, cpa: 60 }
        ],
        aiInsights: {
          executiveSummary: {
            wins: [
              'Instagram Stories Retargeting achieved highest ROI of 5.2x with very low CPA of ₹14.3.',
              'Google Search Brand campaign remains highly efficient at 4.8x ROI generating 48 conversions.'
            ],
            problems: [
              'YouTube Bumper campaign shows high wasted spend of ₹1,800 with negligible conversions (CPA = ₹900).',
              'Competitor search keyword campaigns are underperforming at 0.4x ROI due to heavy bidding wars.'
            ],
            opportunities: [
              'Scale budget for Instagram Retargeting by 20% to exploit high conversions.',
              'Revise LinkedIn Lead Gen form messaging; despite high CPA (₹228), it drives premium enterprise revenue (₹9,600).'
            ]
          },
          consultantAnswers: [
            { question: 'What is working?', answer: 'Instagram Retargeting and Google Brand Search are driving high-converting, cost-effective sales.' },
            { question: 'What is not working?', answer: 'YouTube brand awareness spend is generating high impressions but failing to drive actual purchases.' },
            { question: 'What should be stopped?', answer: 'Pause the YouTube Bumper campaign and stop bidding on expensive competitor search terms immediately.' },
            { question: 'What should be scaled?', answer: 'Increase Instagram retargeting budget and extend target audience list.' },
            { question: 'Where should more budget be invested?', answer: 'Shift budget to Instagram stories and LinkedIn premium lead forms.' },
            { question: 'Which campaigns need attention?', answer: 'Google Competitor campaign needs keyword match adjustments and bidding cap.' },
            { question: 'What is the biggest growth opportunity?', answer: 'Leveraging organic newsletter placements or optimizing the high-ticket LinkedIn enterprise flows.' }
          ],
          coach: {
            situation: 'Your LinkedIn campaign has high spend but very high CPA (₹285) despite strong revenue (₹14,400).',
            meaning: 'You are acquiring high-value enterprise leads, but the acquisition cost is high. Individual customers are valuable enough to justify the CPA.',
            action: 'Calculate Customer Lifetime Value (LTV). If LTV is > ₹1,000, keep scaling. Otherwise, optimize LinkedIn form fields to pre-qualify leads and lower waste.'
          },
          recommendations: [
            { priority: 'High', recommendation: 'Pause YouTube Bumper Campaign', reason: 'Near-zero conversions and heavy leak of ₹1,800.', benefit: 'Save ₹1,800 spend instantly' },
            { priority: 'High', recommendation: 'Boost Instagram Retargeting by 25%', reason: 'Highly profitable channel running at 5.2x ROI.', benefit: 'Increase conversions by ~10%' },
            { priority: 'Medium', recommendation: 'Refine Google Search Keywords', reason: 'Competitor bidding is bleeding cash at 0.4x ROI.', benefit: 'Reduce wasted spend by ₹800' }
          ],
          nextBestAction: {
            action: 'Move ₹1,800 budget from YouTube Bumper to Instagram Retargeting Campaign.',
            improvement: '+18.4%',
            confidence: 'High'
          }
        }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset state to empty
  const handleReset = () => {
    setFile(null);
    setPreviewData(null);
    setAnalysisResult(null);
    setDateRange('');
    setError(null);
  };

  const hasData = analysisResult !== null;

  return (
    <div className="min-h-screen bg-dashboard-bg flex flex-col">
      {/* Top Header Navigation */}
      <DashboardHeader />

      {/* Main Content Area */}
      <main className="flex-grow min-w-0 flex flex-col">
        <div className="p-8 flex-grow space-y-6 max-w-[1400px] mx-auto w-full">
          {/* 1. Upload Dataset Section (Primary focus at top) */}
          <div className="pt-2">
            <UploadZone
              onFileSelect={handleFileSelect}
              onAnalyze={handleAnalyze}
              onReset={handleReset}
              file={file}
              previewData={previewData}
              isUploading={isUploading}
              isAnalyzing={isAnalyzing}
              error={error}
            />
            
            {/* Instant Demo Trigger helper */}
            {!file && !isUploading && !isAnalyzing && (
              <div className="flex justify-center mt-3">
                <button
                  onClick={handleLoadDemo}
                  className="text-xs text-brand-purple hover:text-brand-purple-hover font-semibold flex items-center space-x-1 underline bg-transparent border-0 cursor-pointer"
                >
                  <span>Or try MarketMind AI instantly with sample campaign data (Demo Mode)</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. KPI Cards Grid (Row 1) */}
          <div id="dashboard-kpi" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <KPICard
              title="Total Spend"
              value={`₹${analysisResult?.kpis.totalSpend.toLocaleString('en-IN')}`}
              icon={Coins}
              hasData={hasData}
              explanation="The total amount of money spent on advertising, campaigns, and placements during this date range."
              example="If you spent ₹10,000 on Facebook and ₹5,000 on Google, your Total Spend is ₹15,000."
              iconColorClass="text-brand-purple"
              iconBgClass="bg-indigo-50"
            />
            <KPICard
              title="Total Revenue"
              value={`₹${analysisResult?.kpis.totalRevenue.toLocaleString('en-IN')}`}
              icon={TrendingUp}
              hasData={hasData}
              explanation="The total sales or value generated from conversions attributed to your marketing campaigns."
              example="If visitors who clicked your ads went on to purchase ₹50,000 worth of products, your Revenue is ₹50,000."
              iconColorClass="text-green-600"
              iconBgClass="bg-green-50"
            />
            <KPICard
              title="ROI"
              value={`${analysisResult?.kpis.roi.toFixed(2)}x`}
              icon={Percent}
              hasData={hasData}
              explanation="Return on Investment. Measures how many rupees of revenue are returned for every single rupee spent."
              example="An ROI of 2.0x means that for every ₹1.00 you spent, you generated ₹2.00 in revenue."
              iconColorClass="text-yellow-600"
              iconBgClass="bg-yellow-50"
            />
            <KPICard
              title="Conversions"
              value={analysisResult?.kpis.conversions.toLocaleString('en-IN') || 0}
              icon={Target}
              hasData={hasData}
              explanation="The total number of times visitors completed a desired action (e.g. signup, purchase, download) after clicking your ads."
              example="If 100 people clicked your ad and 5 of them made a purchase, you have 5 Conversions."
              iconColorClass="text-blue-600"
              iconBgClass="bg-blue-50"
            />
            <KPICard
              title="Avg. CPA"
              value={`₹${Math.round(analysisResult?.kpis.avgCpa || 0)}`}
              icon={UserCheck}
              hasData={hasData}
              explanation="Cost Per Acquisition. The average amount of ad spend required to acquire a single conversion."
              example="If you spend ₹1,000 on ads and get 10 conversions, your CPA is ₹100."
              iconColorClass="text-pink-600"
              iconBgClass="bg-pink-50"
            />
          </div>

          {/* 4. Charts & AI Insights Grid (Row 2) */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3">
              <PerformanceCharts
                hasData={hasData}
                campaignTimeData={analysisResult?.charts.campaignTimeData || []}
                channelData={analysisResult?.charts.channelData || []}
              />
            </div>
            <div className="xl:col-span-1">
              <AIInsightsCard 
                hasData={hasData} 
                insightsData={analysisResult?.aiInsights || null} 
              />
            </div>
          </div>

          {/* 5. Optimizations Grid (Row 3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <BudgetOptimizationCard
              hasData={hasData}
              budgetOptimization={analysisResult?.budgetOptimization || null}
              insightsData={analysisResult?.aiInsights || null}
            />
            <WastedSpendCard
              hasData={hasData}
              wastedSpend={analysisResult?.wastedSpend || null}
            />
            <TopCampaignsCard
              hasData={hasData}
              topCampaigns={analysisResult?.topCampaigns || []}
            />
          </div>

          {/* 6. Smart Suggestions Panel (Full Width Row 4) */}
          <RecommendedActionsPanel 
            hasData={hasData} 
            insightsData={analysisResult?.aiInsights || null} 
            analysisResult={analysisResult}
          />

          {/* 7. Marketing Brainstorm Section (Bottom Full Width Action) */}
          <MarketingBrainstormCard 
            hasData={hasData}
            file={file}
            analysisResult={analysisResult}
          />

        </div>

        {/* Footer */}
        <footer className="py-6 text-center text-xs text-text-muted border-t border-slate-200 bg-white">
          <p>© 2026 MarketMind AI - AI-Powered Marketing Intelligence Platform. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
