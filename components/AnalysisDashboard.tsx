import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { AIAnalysisResult } from '../types';
import { Check, AlertTriangle, TrendingUp, Calendar, DollarSign, Package } from 'lucide-react';

interface AnalysisDashboardProps {
  data: AIAnalysisResult;
}

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data }) => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-12">
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-cyan-500">
           <div className="flex items-center justify-between mb-2">
             <h3 className="text-slate-400 text-sm font-medium">Total Estimated Cost</h3>
             <DollarSign className="w-5 h-5 text-cyan-400" />
           </div>
           <p className="text-3xl font-bold text-white">${data.totalEstimatedCost.toLocaleString()}</p>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-purple-500">
           <div className="flex items-center justify-between mb-2">
             <h3 className="text-slate-400 text-sm font-medium">Project Duration</h3>
             <Calendar className="w-5 h-5 text-purple-400" />
           </div>
           <p className="text-3xl font-bold text-white">
             {data.schedule.reduce((acc, curr) => acc + curr.durationWeeks, 0)} <span className="text-lg font-normal text-slate-500">Weeks</span>
           </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-l-4 border-orange-500">
           <div className="flex items-center justify-between mb-2">
             <h3 className="text-slate-400 text-sm font-medium">Risk Score</h3>
             <AlertTriangle className="w-5 h-5 text-orange-400" />
           </div>
           <div className="flex items-end gap-2">
              <p className={`text-3xl font-bold ${data.riskScore > 50 ? 'text-orange-400' : 'text-green-400'}`}>
                {data.riskScore}/100
              </p>
              <span className="text-xs text-slate-500 mb-1">
                {data.riskScore > 50 ? 'High Risk' : 'Low Risk'}
              </span>
           </div>
        </div>

         <div className="glass-panel p-6 rounded-2xl border-l-4 border-blue-500">
           <div className="flex items-center justify-between mb-2">
             <h3 className="text-slate-400 text-sm font-medium">Total Resources</h3>
             <Package className="w-5 h-5 text-blue-400" />
           </div>
           <p className="text-3xl font-bold text-white">{data.resources.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cost Breakdown Chart */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-xl font-semibold mb-6">Cost Breakdown</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.costBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="estimatedCost"
                  nameKey="category"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Schedule Timeline Chart */}
        <div className="glass-panel p-6 rounded-2xl">
           <h3 className="text-xl font-semibold mb-6">Project Schedule (Weeks)</h3>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data.schedule} layout="vertical">
                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                 <XAxis type="number" stroke="#94a3b8" />
                 <YAxis dataKey="phase" type="category" width={100} stroke="#94a3b8" tick={{fontSize: 12}} />
                 <Tooltip 
                   cursor={{fill: 'rgba(255,255,255,0.05)'}}
                   contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                 />
                 <Bar dataKey="durationWeeks" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={20} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resource Plan */}
        <div className="glass-panel p-6 rounded-2xl max-h-[400px] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4 sticky top-0 bg-[#0f172a] pb-2 z-10 border-b border-white/10">Resource Plan</h3>
          <table className="w-full text-left">
            <thead className="text-slate-400 text-sm">
              <tr>
                <th className="pb-3">Resource</th>
                <th className="pb-3">Quantity</th>
                <th className="pb-3 text-right">Est. Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data.resources.map((res, idx) => (
                <tr key={idx} className="group hover:bg-white/5 transition-colors">
                  <td className="py-3 text-slate-200">{res.resourceName}</td>
                  <td className="py-3 text-slate-400">{res.quantity} {res.unit}</td>
                  <td className="py-3 text-right font-mono text-cyan-300">${res.estimatedCost.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Optimizations */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="text-green-400" />
            AI Optimization Suggestions
          </h3>
          <div className="space-y-4">
            {data.optimizationSuggestions.map((suggestion, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-green-900/10 to-transparent border border-green-900/30">
                <div className="shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold">
                  {idx + 1}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};