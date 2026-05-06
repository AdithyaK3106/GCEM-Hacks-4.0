import React from 'react';
import { HelpCircle, Book, MessageCircle, Mail, ExternalLink } from 'lucide-react';
import Card from '../components/ui/Card';

const Help = () => {
  return (
    <div className="page-transition max-w-4xl mx-auto py-10 bg-[#F5EFE6]">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#2D1E3E]/5 text-[#2D1E3E] rounded-lg text-xs font-black uppercase tracking-widest mb-6 border border-[#2D1E3E]/10">
          <HelpCircle size={14} fill="currentColor" /> Help Center
        </div>
        <h1 className="text-5xl font-black mb-4 text-[#2D1E3E] tracking-tight">
          How can we <span className="text-[#6D4AFF]">Help?</span>
        </h1>
        <p className="text-[#5A4A6B] text-lg font-medium">Find answers to common questions and learn how to master your learning journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card className="p-8 bg-white border border-gray-100 shadow-md rounded-xl hover:translate-y-[-4px] transition-all">
          <div className="w-12 h-12 rounded-lg bg-[#6D4AFF]/10 text-[#6D4AFF] flex items-center justify-center mb-6 shadow-sm">
            <Book size={24} />
          </div>
          <h3 className="text-2xl font-black text-[#2D1E3E] mb-3">Documentation</h3>
          <p className="text-[#5A4A6B] font-medium mb-6">Comprehensive guides on using the ACT model, uploading lectures, and analyzing results.</p>
          <button className="flex items-center gap-2 text-[#6D4AFF] font-black text-sm uppercase tracking-widest hover:gap-3 transition-all">
            Read Guides <ExternalLink size={16} />
          </button>
        </Card>

        <Card className="p-8 bg-white border border-gray-100 shadow-md rounded-xl hover:translate-y-[-4px] transition-all">
          <div className="w-12 h-12 rounded-lg bg-green-50 text-[#16A34A] flex items-center justify-center mb-6 shadow-sm">
            <MessageCircle size={24} />
          </div>
          <h3 className="text-2xl font-black text-[#2D1E3E] mb-3">Community</h3>
          <p className="text-[#5A4A6B] font-medium mb-6">Join our Discord community to share learning paths and get tips from other top learners.</p>
          <button className="flex items-center gap-2 text-[#16A34A] font-black text-sm uppercase tracking-widest hover:gap-3 transition-all">
            Join Discord <ExternalLink size={16} />
          </button>
        </Card>
      </div>

      <div className="bg-[#2D1E3E] rounded-xl p-12 text-center text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-4">Still have questions?</h3>
          <p className="text-[#8B7CA3] font-medium mb-10 text-lg">Our support team is available 24/7 to help you with any technical issues.</p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <a href="mailto:support@learnai.com" className="px-10 py-4 bg-white text-[#2D1E3E] rounded-lg font-black shadow-md flex items-center justify-center gap-3 hover:scale-105 transition-all">
              <Mail size={20} /> Email Support
            </a>
            <button className="px-10 py-4 bg-[#6D4AFF] text-white rounded-lg font-black shadow-md flex items-center justify-center gap-3 hover:scale-105 transition-all">
              <MessageCircle size={20} /> Live Chat
            </button>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <h3 className="text-[10px] font-black text-[#8B7CA3] uppercase tracking-widest mb-8 text-center">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {[
            { q: "What is the ACT model?", a: "ACT stands for Accuracy, Confidence, and Time. We measure these three metrics to determine your exact cognitive state for every concept." },
            { q: "How accurate is the transcription?", a: "We use state-of-the-art neural models achieving over 98% accuracy in quiet environments." },
            { q: "Can I export my notes?", a: "Yes, you can export your structured notes to PDF or Markdown from the Insights tab." }
          ].map((faq, idx) => (
            <div key={idx} className="p-8 bg-white border border-gray-100 rounded-xl shadow-sm">
              <h4 className="font-black text-[#2D1E3E] text-lg mb-2">{faq.q}</h4>
              <p className="text-[#5A4A6B] font-medium">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Help;
