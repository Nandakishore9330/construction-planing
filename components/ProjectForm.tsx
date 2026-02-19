import React, { useState } from 'react';
import { ProjectDetails } from '../types';
import { Loader2, Briefcase, MapPin, DollarSign, Calendar, FileText } from 'lucide-react';

interface ProjectFormProps {
  onSubmit: (details: ProjectDetails) => void;
  isLoading: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ProjectDetails>({
    projectName: 'Skyline Plaza',
    location: 'Austin, TX',
    projectType: 'Commercial High-Rise',
    budget: 5000000,
    durationMonths: 18,
    description: 'A 20-story mixed-use building with retail on ground floor and offices above. Eco-friendly materials preferred.',
    areaSqFt: 125000
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budget' || name === 'durationMonths' || name === 'areaSqFt' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
      <div className="glass-panel rounded-2xl p-8 md:p-12">
        <div className="mb-8 border-b border-white/10 pb-6">
           <h2 className="text-3xl font-bold mb-2">Project Details</h2>
           <p className="text-slate-400">Enter your project specifications to generate an AI-optimized plan.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Project Name</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                required
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                placeholder="e.g. Skyline Plaza"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                placeholder="e.g. Austin, TX"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Project Type</label>
            <select
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all appearance-none"
            >
              <option value="Residential">Residential</option>
              <option value="Commercial High-Rise">Commercial High-Rise</option>
              <option value="Industrial">Industrial</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Renovation">Renovation</option>
            </select>
          </div>

           <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Total Area (sq ft)</label>
            <div className="relative">
              <input
                type="number"
                name="areaSqFt"
                value={formData.areaSqFt}
                onChange={handleChange}
                required
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Budget ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Duration (Months)</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="number"
                name="durationMonths"
                value={formData.durationMonths}
                onChange={handleChange}
                required
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <label className="block text-sm font-medium text-slate-300">Description & Special Requirements</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all resize-none"
                placeholder="Describe specific needs, constraints, or goals..."
              />
            </div>
          </div>

          <div className="md:col-span-2 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex justify-center items-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                'Generate AI Project Plan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};