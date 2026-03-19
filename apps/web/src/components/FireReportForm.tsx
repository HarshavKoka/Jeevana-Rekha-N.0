'use client';

import { useState } from 'react';
import { MapPin, FileText, Camera, Send, CheckCircle2 } from 'lucide-react';

export default function FireReportForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    issue: '',
    briefing: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call to Payload CMS
    await new Promise(r => setTimeout(r, 1000));
    console.log('Submitted Report:', formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 text-center bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-2xl animate-in fade-in zoom-in duration-300">
        <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Report Submitted Excellently!</h2>
        <p className="text-gray-600 dark:text-gray-400">Thank you for your civic responsibility. Our editorial team will review your report shortly.</p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="mt-6 font-bold text-primary hover:underline"
        >
          Submit another report
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-primary p-6 text-white">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <span className="blinking-dot bg-white"></span>
          ఫైర్ రిపోర్ట్ (Citizen Reporter)
        </h2>
        <p className="text-sm opacity-90 mt-1">Submit civic issues, incidents, or breaking news directly to our desk.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
            <FileText className="w-4 h-4" /> Name / పేరు
          </label>
          <input
            type="text"
            placeholder="Your full name"
            required
            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
            <MapPin className="w-4 h-4" /> Issue / సమస్య
          </label>
          <input
            type="text"
            placeholder="Headline of the issue"
            required
            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
            value={formData.issue}
            onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
            <FileText className="w-4 h-4" /> Briefing / వివరాలు
          </label>
          <textarea
            rows={5}
            placeholder="Describe the issue in detail..."
            required
            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
            value={formData.briefing}
            onChange={(e) => setFormData({ ...formData, briefing: e.target.value })}
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center justify-between p-4 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-all">
            <div className="flex items-center gap-3">
              <Camera className="w-6 h-6 text-gray-400" />
              <div>
                <span className="block text-sm font-bold text-gray-700 dark:text-gray-300">Photos / Clippings</span>
                <span className="block text-xs text-gray-500">Attach images or evidence</span>
              </div>
            </div>
            <span className="text-xs bg-gray-200 dark:bg-zinc-700 px-3 py-1 rounded-full font-bold">ATTACH</span>
            <input type="file" className="hidden" multiple accept="image/*" />
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/20 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" /> SUBMIT TO REPORTER
        </button>
      </form>
    </div>
  );
}
