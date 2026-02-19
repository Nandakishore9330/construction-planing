import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, Loader2, Image as ImageIcon } from 'lucide-react';
import { analyzeBlueprintImage, fileToGenerativePart } from '../services/geminiService';
import { BlueprintAnalysis } from '../types';

export const BlueprintUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BlueprintAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const base64Data = await fileToGenerativePart(file);
      const analysis = await analyzeBlueprintImage(base64Data, file.type);
      setResult(analysis);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze blueprint');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upload Section */}
        <div className="glass-panel rounded-2xl p-8 flex flex-col h-full">
           <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <ImageIcon className="text-cyan-400" /> 
            Blueprint Analysis
           </h2>
           
           <div 
             className="flex-1 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center p-8 bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer min-h-[300px]"
             onClick={() => fileInputRef.current?.click()}
           >
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-[300px] object-contain rounded-lg shadow-lg" />
              ) : (
                <div className="text-center">
                  <UploadCloud className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 font-medium">Click to upload blueprint (PDF/Image)</p>
                  <p className="text-slate-500 text-sm mt-2">Supports JPG, PNG</p>
                </div>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
           </div>

           {file && (
             <div className="mt-6">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 rounded-xl transition-all flex justify-center items-center gap-2"
                >
                  {isAnalyzing ? <Loader2 className="animate-spin" /> : <CheckCircle />}
                  {isAnalyzing ? 'Analyzing with Gemini Vision...' : 'Analyze Blueprint'}
                </button>
             </div>
           )}
        </div>

        {/* Results Section */}
        <div className="glass-panel rounded-2xl p-8 h-full overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">AI Insights</h2>
          
          {!result && !isAnalyzing && (
            <div className="flex flex-col items-center justify-center h-[300px] text-slate-500">
               <AlertTriangle className="w-12 h-12 mb-4 opacity-50" />
               <p>Upload and analyze a blueprint to see insights.</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
              <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
              <p className="text-cyan-300 animate-pulse">Scanning structural elements...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-semibold text-cyan-300 mb-3">Identified Elements</h3>
                <div className="flex flex-wrap gap-2">
                  {result.identifiedObjects.map((item, idx) => (
                    <span key={idx} className="bg-slate-700 px-3 py-1 rounded-full text-sm">{item}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-orange-400 mb-3">Safety Risks</h3>
                <ul className="space-y-2">
                  {result.safetyRisks.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-orange-900/20 p-3 rounded-lg border border-orange-900/50">
                      <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                      <span className="text-slate-200 text-sm">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-3">Design Suggestions</h3>
                 <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
                  {result.designSuggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-900/50">
                <h3 className="font-semibold text-blue-300 mb-1">Compliance Check</h3>
                <p className="text-sm text-slate-300">{result.complianceCheck}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};