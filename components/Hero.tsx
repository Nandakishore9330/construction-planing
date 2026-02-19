import React from 'react';
import { ArrowRight, Activity, ShieldCheck, Cpu } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 animate-fade-in-down">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
          <span className="text-cyan-300 text-sm font-medium tracking-wide">AI-POWERED CONSTRUCTION INTELLIGENCE</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
          Build Smarter with <br />
          <span className="gradient-text">Generative AI</span>
        </h1>
        
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Transform your construction planning with BuildWise. Optimize costs, 
          predict risks, and analyze blueprints instantly using advanced AI models.
        </p>
        
        <button 
          onClick={onStart}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full text-white font-semibold text-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
        >
          Start Planning
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 mt-20 w-full">
        {[
          { icon: Activity, title: 'Cost Estimation', desc: 'Real-time budget forecasting & optimization' },
          { icon: Cpu, title: 'Generative Scheduling', desc: 'Automated timeline creation & resource allocation' },
          { icon: ShieldCheck, title: 'Risk Analysis', desc: 'AI-driven blueprint scanning & safety checks' },
        ].map((feature, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center hover:translate-y-[-5px] transition-transform duration-300">
            <div className="p-3 bg-white/5 rounded-xl mb-4 text-cyan-400">
              <feature.icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-slate-400">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};