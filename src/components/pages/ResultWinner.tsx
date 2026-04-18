import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle2, Trophy, ExternalLink, ShieldCheck, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ResultWinnerProps {
  onBackToDashboard: () => void;
}

export const ResultWinner: React.FC<ResultWinnerProps> = ({ onBackToDashboard }) => {
  const bidders = [
    { name: 'EcoPower Solutions', amount: '2,200,000 USDC', score: '98/100', status: 'winner' },
    { name: 'Global Energy Corp', amount: '2,450,000 USDC', score: '85/100', status: 'outbid' },
    { name: 'Nexus Solar Systems', amount: '2,100,000 USDC', score: '72/100', status: 'outbid' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm"
        >
          <Trophy className="w-10 h-10" />
        </motion.div>
        <h1 className="text-4xl font-bold text-slate-900">Project Result</h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          The smart contract has automatically evaluated all submissions based on budget and technical scores.
        </p>
        <div className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-full border border-emerald-100 shadow-sm">
          <CheckCircle2 className="w-4 h-4 mr-2" /> Winner Selected Automatically by Smart Contract
        </div>
      </div>

      <Card className="border-none shadow-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden relative">
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[80%] bg-white/10 rounded-full blur-[80px]"></div>
        <CardContent className="p-10 relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <p className="text-blue-100 uppercase tracking-widest text-xs font-bold">Winning Contractor</p>
            <h2 className="text-3xl font-extrabold tracking-tight">EcoPower Solutions</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
              <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20">
                <p className="text-[10px] text-blue-100 uppercase font-bold mb-1">Winning Amount</p>
                <p className="text-xl font-bold">2,200,000 USDC</p>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20">
                <p className="text-[10px] text-blue-100 uppercase font-bold mb-1">Technical Score</p>
                <p className="text-xl font-bold">98/100</p>
              </div>
            </div>
          </div>
        </CardContent>
        <div className="bg-black/10 px-10 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono text-blue-100">
            <span>TX Hash:</span>
            <span className="truncate max-w-[150px]">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</span>
          </div>
          <button className="text-xs font-bold flex items-center hover:underline">
            View on Explorer <ExternalLink className="ml-1 w-3 h-3" />
          </button>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900">Evaluation Table</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Contractor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Score</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bidders.map((bid, i) => (
                <tr key={i} className={bid.status === 'winner' ? "bg-emerald-50/30" : ""}>
                  <td className="px-6 py-4 font-semibold text-slate-900">{bid.name}</td>
                  <td className="px-6 py-4 font-mono text-slate-500">{bid.amount}</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-700">{bid.score}</td>
                  <td className="px-6 py-4 text-right">
                    {bid.status === 'winner' ? (
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Selected</span>
                    ) : (
                      <span className="text-slate-400 text-xs uppercase font-bold">Outbid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={onBackToDashboard} variant="outline" size="lg" className="px-10 h-14 font-bold border-2">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};
