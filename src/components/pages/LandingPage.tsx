import React from 'react';
import { Button } from '../ui/button';
import { Shield, CheckCircle2, Globe, ArrowRight, Building2, Gavel } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onLoginClick: () => void;
  onPublicClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onPublicClick }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">BlockTender</span>
        </div>
        <div className="flex items-center space-x-6">
          <button 
            onClick={onPublicClick}
            className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            View Public Projects
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
            Transparent Government Tendering <br />
            <span className="text-blue-600">using Blockchain</span>
          </h1>
          <p className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto">
            Fair bidding • Automatic contract selection • Public auditability. 
            Removing corruption through decentralized governance.
          </p>
          <div className="mt-10 flex justify-center">
            <Button size="lg" onClick={onLoginClick} className="w-full sm:w-80 h-14 text-lg bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200">
              Sign In / Sign Up
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Tamper-proof records</h3>
              <p className="text-slate-500">Every bid and project detail is hashed and stored on-chain, making it impossible to alter after submission.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Automated winner selection</h3>
              <p className="text-slate-500">Smart contracts automatically evaluate bids based on pre-defined criteria, eliminating human bias in selection.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Public transparency</h3>
              <p className="text-slate-500">Citizens can track the flow of government funds from tender creation to final payment on the blockchain.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-sm">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center text-slate-500 font-bold text-xs">T</div>
          <span className="font-bold text-slate-900">BlockTender</span>
        </div>
        <p>© 2026 BlockTender. Built for global accountability.</p>
      </footer>
    </div>
  );
};
