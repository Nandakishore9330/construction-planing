import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { ProjectForm } from './components/ProjectForm';
import { BlueprintUpload } from './components/BlueprintUpload';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ProjectDetails, AIAnalysisResult, ViewState } from './types';
import { generateProjectPlan } from './services/geminiService';
import { LayoutDashboard, FileText, Image as ImageIcon, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HERO);
  const [analysisData, setAnalysisData] = useState<AIAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => setCurrentView(ViewState.PLANNING);

  const handleProjectSubmit = async (details: ProjectDetails) => {
    setIsLoading(true);
    try {
      const result = await generateProjectPlan(details);
      setAnalysisData(result);
      setCurrentView(ViewState.DASHBOARD);
    } catch (error) {
      console.error(error);
      alert('Failed to generate plan. Please check API Key.');
    } finally {
      setIsLoading(false);
    }
  };

  const NavButton = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        currentView === view 
          ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30' 
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden md:inline font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen pb-10">
      {/* Navigation */}
      {currentView !== ViewState.HERO && (
        <nav className="sticky top-0 z-50 glass-panel border-b border-white/10 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <div 
                  className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent cursor-pointer"
                  onClick={() => setCurrentView(ViewState.HERO)}
                >
                  BuildWise
                </div>
                <div className="hidden md:flex items-center gap-2">
                   <NavButton view={ViewState.PLANNING} icon={FileText} label="Project Input" />
                   {analysisData && <NavButton view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />}
                   <NavButton view={ViewState.BLUEPRINT} icon={ImageIcon} label="Blueprint AI" />
                </div>
              </div>
              <button 
                onClick={() => setCurrentView(ViewState.HERO)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8">
        {currentView === ViewState.HERO && <Hero onStart={handleStart} />}
        
        {currentView === ViewState.PLANNING && (
          <div className="flex flex-col items-center">
            <ProjectForm onSubmit={handleProjectSubmit} isLoading={isLoading} />
          </div>
        )}

        {currentView === ViewState.DASHBOARD && analysisData && (
          <AnalysisDashboard data={analysisData} />
        )}

        {currentView === ViewState.BLUEPRINT && (
          <BlueprintUpload />
        )}
      </main>

      {/* Mobile Nav Warning or Footer */}
      {currentView !== ViewState.HERO && (
        <footer className="mt-20 text-center text-slate-500 text-sm">
          <p>Powered by Google Gemini 2.5 Flash & 3.0 Pro</p>
          <p className="mt-2 text-xs opacity-50">&copy; 2025 BuildWise Inc.</p>
        </footer>
      )}
    </div>
  );
};

export default App;