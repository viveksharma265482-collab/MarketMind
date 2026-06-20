'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  onAnalyze: () => void;
  onReset: () => void;
  file: File | null;
  previewData: {
    rowCount: number;
    colCount: number;
    columns: string[];
    mappedColumns: Record<string, string>;
    previewRows: Record<string, any>[];
  } | null;
  isUploading: boolean;
  isAnalyzing: boolean;
  error: string | null;
}

export default function UploadZone({
  onFileSelect,
  onAnalyze,
  onReset,
  file,
  previewData,
  isUploading,
  isAnalyzing,
  error
}: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndProcessFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    onFileSelect(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const renderErrorCard = () => {
    if (!error) return null;

    const lowerErr = error.toLowerCase();
    const isEmpty = lowerErr.includes('empty');
    const isMissingCols = lowerErr.includes('missing required columns') || lowerErr.includes('columns') || lowerErr.includes('structure');
    const isUnsupported = lowerErr.includes('unsupported') || lowerErr.includes('format') || lowerErr.includes('type');

    if (isEmpty) {
      return (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-5 py-4 rounded-xl flex items-start space-x-3.5 text-sm">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <span className="font-bold text-red-900 block text-base">⚠ Invalid File</span>
            <p className="text-red-700 font-semibold">This file appears to be empty.</p>
            <p className="text-xs text-red-500 font-medium pt-0.5">
              Please upload a valid CSV or Excel dataset.
            </p>
          </div>
        </div>
      );
    }

    if (isMissingCols) {
      return (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-5 py-4 rounded-xl flex items-start space-x-3.5 text-sm">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <span className="font-bold text-red-900 block text-base">⚠ Invalid Dataset Structure</span>
            <p className="text-red-700 font-semibold">Required marketing columns were not found.</p>
            <div className="text-xs text-red-500 font-semibold pt-1.5 space-y-1">
              <span className="block font-bold text-red-800">Expected columns:</span>
              <div className="pl-2 space-y-0.5 text-red-700">
                <div>• Campaign</div>
                <div>• Channel</div>
                <div>• Spend</div>
                <div>• Revenue</div>
                <div>• Conversions</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isUnsupported) {
      return (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-5 py-4 rounded-xl flex items-start space-x-3.5 text-sm">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <span className="font-bold text-red-900 block text-base">⚠ Unsupported File Type</span>
            <div className="text-xs text-red-500 font-semibold pt-1.5 space-y-1">
              <span className="block font-bold text-red-800">Please upload:</span>
              <div className="pl-2 space-y-0.5 text-red-700">
                <div>• CSV</div>
                <div>• XLSX</div>
                <div>• XLS</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default error fallback
    return (
      <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-5 py-4 rounded-xl flex items-start space-x-3.5 text-sm">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <span className="font-bold text-red-900 block text-base">⚠ Unable to analyze file</span>
          <p className="text-red-700 font-semibold">
            Reason: <span className="font-normal text-red-600">{error}</span>
          </p>
          <p className="text-xs text-red-500 font-medium pt-0.5">
            Please upload a valid CSV or Excel dataset.
          </p>
        </div>
      </div>
    );
  };

  return (
    <section id="upload-dataset-section" className="premium-card p-6 bg-white transition-all select-none">
      {/* 1. Error Message */}
      {renderErrorCard()}

      {/* 2. Before Upload State (Drag & Drop box) */}
      {!file && !isUploading && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-16 px-8 cursor-pointer transition-all ${
            isDragActive 
              ? 'border-brand-purple bg-brand-purple-light/40 scale-[1.01]' 
              : 'border-slate-300 hover:border-brand-purple bg-slate-50/50 hover:bg-brand-purple-light/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".csv, .xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileChange}
          />
          <div className="bg-brand-purple-light p-5 rounded-full mb-4">
            <UploadCloud className="h-10 w-10 text-brand-purple" />
          </div>
          <h4 className="font-bold text-slate-800 text-lg leading-snug">Upload Your Marketing Data</h4>
          <p className="text-xs text-text-secondary mt-1.5 text-center max-w-sm leading-relaxed">
            Drag and drop your file here, or click to browse.<br />
            Supports <strong className="text-slate-700">CSV, Excel (.xlsx)</strong>
          </p>
          <button
            type="button"
            className="mt-6 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold py-2.5 px-8 rounded-lg shadow-md shadow-brand-purple/20 transition-all cursor-pointer"
          >
            Choose File
          </button>
        </div>
      )}

      {/* 3. Uploading / Preview Parsing State */}
      {isUploading && (
        <div className="flex flex-col items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 text-brand-purple animate-spin mb-4" />
          <h4 className="font-bold text-slate-800 text-base leading-snug">Parsing Dataset</h4>
          <p className="text-xs text-text-muted mt-1 font-medium">Reading rows and columns, mapping column names...</p>
        </div>
      )}

      {/* 4. Analyzing State */}
      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="relative">
            <RefreshCw className="h-12 w-12 text-brand-purple animate-spin" />
            <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1.5 -right-1.5 animate-pulse" />
          </div>
          <div className="text-center">
            <h4 className="font-bold text-slate-800 text-base leading-snug">Analyzing Marketing Campaign Data</h4>
            <div className="flex flex-col space-y-1.5 mt-2.5 text-xs text-text-secondary font-medium">
              <span className="flex items-center justify-center space-x-1.5 text-brand-purple animate-pulse">
                <span>●</span> <span>Running rule-based attribution and ROI matching...</span>
              </span>
              <span className="text-text-muted">● Consulting Gemini AI Marketing Consultant...</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Data Preview State */}
      {file && previewData && !isAnalyzing && (
        <div className="animate-slide-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-gray-100 mb-4 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-50 p-2 rounded-lg">
                <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base">{file.name}</h4>
                <div className="flex items-center space-x-3 text-xs text-text-secondary mt-0.5 font-medium">
                  <span>Rows: <strong className="text-slate-800">{previewData.rowCount}</strong></span>
                  <span className="text-slate-300">|</span>
                  <span>Columns: <strong className="text-slate-800">{previewData.colCount}</strong></span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onReset}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-text-secondary text-sm font-semibold rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onAnalyze}
                className="px-5 py-2 bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-semibold rounded-lg shadow-md shadow-brand-purple/20 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>Analyze Data</span>
              </button>
            </div>
          </div>

          {/* Mapped Columns Indicator */}
          <div className="mb-4 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
            <span className="text-xs font-semibold text-indigo-900 block mb-1">Auto-Detected & Mapped Columns:</span>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {Object.entries(previewData.mappedColumns).map(([standardCol, rawCol]) => (
                <div key={standardCol} className="bg-white border border-indigo-200 px-2 py-1 rounded text-[11px] font-medium text-indigo-700">
                  <span className="opacity-75">{standardCol}:</span> <strong className="text-indigo-900">{rawCol}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Row Preview Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-80 shadow-inner">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0 uppercase tracking-wider text-[10px]">
                <tr>
                  {previewData.columns.map((col) => (
                    <th key={col} className="px-4 py-3 border-b border-slate-200 whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {previewData.previewRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    {previewData.columns.map((col) => (
                      <td key={col} className="px-4 py-2.5 text-text-secondary whitespace-nowrap font-medium font-mono text-[11px]">
                        {row[col] !== undefined && row[col] !== null ? String(row[col]) : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
