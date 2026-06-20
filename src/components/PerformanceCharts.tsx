'use client';

import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { LineChart as LineIcon, PieChart as PieIcon } from 'lucide-react';

interface PerformanceChartsProps {
  hasData: boolean;
  campaignTimeData: any[];
  channelData: any[];
}

const COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'];

const abbreviateChannel = (channel: string) => {
  if (!channel) return '';
  const clean = channel.trim();
  const lower = clean.toLowerCase();
  if (lower === 'google ads' || lower === 'google search') return 'Google';
  if (lower === 'facebook ads') return 'Facebook';
  if (lower === 'instagram ads') return 'Instagram';
  if (lower === 'linkedin ads') return 'LinkedIn';
  if (lower === 'email marketing') return 'Email';
  if (lower === 'whatsapp marketing') return 'WhatsApp';
  if (lower === 'youtube ads') return 'YouTube';
  if (lower === 'newsletters') return 'Newsletters';
  return clean
    .replace(/\s+ads$/i, '')
    .replace(/\s+marketing$/i, '')
    .replace(/\s+campaign$/i, '');
};

const CustomTimeTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700/30 text-white p-3.5 rounded-xl text-xs space-y-1 shadow-lg font-medium min-w-[150px] select-none">
        <p className="font-bold text-brand-purple border-b border-slate-700/50 pb-1 mb-1.5">{label}</p>
        <p className="flex justify-between space-x-4"><span className="text-slate-400">Spend:</span> <span className="font-semibold">₹{Number(data.spend || 0).toLocaleString('en-IN')}</span></p>
        <p className="flex justify-between space-x-4"><span className="text-slate-400">Revenue:</span> <span className="font-semibold">₹{Number(data.revenue || 0).toLocaleString('en-IN')}</span></p>
        <p className="flex justify-between space-x-4"><span className="text-slate-400">ROI:</span> <span className="font-semibold">{Number(data.roi || 0).toFixed(2)}x</span></p>
        <p className="flex justify-between space-x-4"><span className="text-slate-400">Conversions:</span> <span className="font-semibold">{Number(data.conversions || 0).toLocaleString('en-IN')}</span></p>
        <p className="flex justify-between space-x-4"><span className="text-slate-400">CPA:</span> <span className="font-semibold">₹{Math.round(Number(data.cpa || 0))}</span></p>
      </div>
    );
  }
  return null;
};

const CustomChannelTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700/30 text-white p-3.5 rounded-xl text-xs space-y-1 shadow-lg font-medium min-w-[160px] select-none">
        <p className="font-bold text-brand-purple border-b border-slate-700/50 pb-1 mb-1.5">{data.channel}</p>
        <p className="flex justify-between space-x-4"><span className="text-slate-400">Spend:</span> <span className="font-semibold">₹{Number(data.spend || 0).toLocaleString('en-IN')}</span></p>
        <p className="flex justify-between space-x-4"><span className="text-slate-400">Revenue:</span> <span className="font-semibold">₹{Number(data.revenue || 0).toLocaleString('en-IN')}</span></p>
        <p className="flex justify-between space-x-4"><span className="text-slate-400">ROI:</span> <span className="font-semibold">{Number(data.roi || 0).toFixed(2)}x</span></p>
        <p className="flex justify-between space-x-4"><span className="text-slate-400">Conversions:</span> <span className="font-semibold">{Number(data.conversions || 0).toLocaleString('en-IN')}</span></p>
        <p className="flex justify-between space-x-4"><span className="text-slate-400">CPA:</span> <span className="font-semibold">₹{Math.round(Number(data.cpa || 0))}</span></p>
      </div>
    );
  }
  return null;
};

export default function PerformanceCharts({ hasData, campaignTimeData, channelData }: PerformanceChartsProps) {
  const [mounted, setMounted] = useState(false);
  const [lineMetric, setLineMetric] = useState<'spend' | 'revenue' | 'conversions' | 'clicks' | 'roi' | 'cpa'>('revenue');
  const [channelMetric, setChannelMetric] = useState<'roi' | 'spend' | 'revenue' | 'conversions' | 'cpa'>('roi');

  // Prevent Next.js hydration errors with client-only rendering for Recharts
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
        <div className="premium-card p-6 bg-white h-[400px] flex items-center justify-center">
          <span className="text-text-muted text-sm font-medium">Loading charts...</span>
        </div>
        <div className="premium-card p-6 bg-white h-[400px] flex items-center justify-center">
          <span className="text-text-muted text-sm font-medium">Loading charts...</span>
        </div>
      </div>
    );
  }

  // Format Y-axis values for readability
  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
    return `₹${value}`;
  };

  const formatMetricLabel = (val: string) => {
    if (val === 'roi') return 'ROI';
    if (val === 'cpa') return 'CPA';
    return val.charAt(0).toUpperCase() + val.slice(1);
  };

  const getTooltipFormatter = (metric: string) => {
    return (value: any) => {
      const num = Number(value);
      if (metric === 'roi') return [`${num.toFixed(2)}x`, 'ROI'];
      if (metric === 'cpa') return [`₹${num.toFixed(2)}`, 'CPA'];
      if (metric === 'spend' || metric === 'revenue') return [`₹${num.toLocaleString('en-IN')}`, formatMetricLabel(metric)];
      return [num.toLocaleString('en-IN'), formatMetricLabel(metric)];
    };
  };

  return (
    <div id="performance-charts-section" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Campaign Performance Over Time */}
      <div className="premium-card p-6 bg-white flex flex-col h-[400px]">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Campaign Performance Over Time</h4>
            <p className="text-xs text-text-muted mt-0.5 font-medium">Daily trend analysis of campaign metrics</p>
          </div>
          {hasData && (
            <select
              value={lineMetric}
              onChange={(e) => setLineMetric(e.target.value as any)}
              className="text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 font-semibold text-text-secondary focus:outline-none focus:border-brand-purple cursor-pointer shadow-sm"
            >
              <option value="revenue">By Revenue</option>
              <option value="spend">By Spend</option>
              <option value="roi">By ROI</option>
              <option value="conversions">By Conversions</option>
              <option value="clicks">By Clicks</option>
              <option value="cpa">By CPA</option>
            </select>
          )}
        </div>

        <div className="flex-grow flex items-center justify-center relative">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={campaignTimeData} margin={{ top: 15, right: 25, left: 15, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 9, fill: '#64748B' }} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 9, fill: '#64748B' }}
                  tickFormatter={lineMetric === 'roi' ? (v) => `${v}x` : lineMetric === 'conversions' || lineMetric === 'clicks' ? undefined : formatYAxis}
                />
                <Tooltip content={<CustomTimeTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey={lineMetric} 
                  stroke="#7C3AED" 
                  strokeWidth={2.5}
                  dot={{ r: 3, stroke: '#7C3AED', strokeWidth: 1, fill: '#fff' }} 
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="border border-slate-200 bg-slate-50 p-4 rounded-full mb-3">
                <LineIcon className="h-6 w-6 text-text-muted" />
              </div>
              <h5 className="font-bold text-sm text-slate-700">No data to display</h5>
              <p className="text-xs text-text-muted mt-1 max-w-xs">Upload your data to see performance trends over time.</p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Channel Performance */}
      <div id="channel-performance-card" className="premium-card p-6 bg-white flex flex-col h-[400px]">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Channel Performance</h4>
            <p className="text-xs text-text-muted mt-0.5 font-medium">Compare distribution and efficiency across channels</p>
          </div>
          {hasData && (
            <select
              value={channelMetric}
              onChange={(e) => setChannelMetric(e.target.value as any)}
              className="text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 font-semibold text-text-secondary focus:outline-none focus:border-brand-purple cursor-pointer shadow-sm"
            >
              <option value="roi">By ROI</option>
              <option value="spend">By Spend</option>
              <option value="revenue">By Revenue</option>
              <option value="conversions">By Conversions</option>
              <option value="cpa">By CPA</option>
            </select>
          )}
        </div>

        <div className="flex-grow flex items-center justify-center relative">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              {channelMetric === 'spend' || channelMetric === 'revenue' ? (
                // Use PieChart for Spend & Revenue distribution
                <PieChart margin={{ top: 10, right: 50, left: 50, bottom: 10 }}>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey={channelMetric}
                    nameKey="channel"
                    label={({ name, percent }) => `${name} (${typeof percent === 'number' ? (percent * 100).toFixed(0) : '0'}%)`}
                    labelLine={true}
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChannelTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fill: '#64748B' }} />
                </PieChart>
              ) : (
                // Use BarChart for ROI, CPA, Conversions
                <BarChart data={channelData} margin={{ top: 15, right: 25, left: 15, bottom: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="channel" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fontSize: 9, fill: '#64748B' }} 
                    height={30}
                    interval={0}
                    tickFormatter={abbreviateChannel}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fontSize: 9, fill: '#64748B' }}
                    tickFormatter={channelMetric === 'roi' ? (v) => `${v}x` : channelMetric === 'conversions' ? undefined : formatYAxis}
                  />
                  <Tooltip content={<CustomChannelTooltip />} />
                  <Bar dataKey={channelMetric} fill="#3B82F6" radius={[4, 4, 0, 0]}>
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="border border-slate-200 bg-slate-50 p-4 rounded-full mb-3">
                <PieIcon className="h-6 w-6 text-text-muted" />
              </div>
              <h5 className="font-bold text-sm text-slate-700">No data to display</h5>
              <p className="text-xs text-text-muted mt-1 max-w-xs">Upload your data to compare channel performance.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
