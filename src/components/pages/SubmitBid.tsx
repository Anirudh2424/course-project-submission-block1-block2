import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { DollarSign, FileUp, ShieldCheck, Wallet, ArrowLeft, Loader2 } from 'lucide-react';
import { useWallet } from '../../hooks/use-wallet';
import { api } from '../../api';
import { toast } from 'sonner@2.0.3';

interface SubmitBidProps {
  tenderId: string;
  onBack: () => void;
  onSubmit: () => void;
}

export const SubmitBid: React.FC<SubmitBidProps> = ({ tenderId, onBack, onSubmit }) => {
  const { address } = useWallet();
  const [amount, setAmount] = useState('');
  const [proposal, setProposal] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount) {
      toast.error('Please enter a bid amount');
      return;
    }
    
    setIsLoading(true);
    try {
      const salt = Math.random().toString(36).substring(2, 15);
      // Wait for backend transaction
      await api.submitBid({
        tenderId,
        contractorId: address || 'Contractor_X',
        bidAmount: parseFloat(amount),
        salt
      });
      // Important: Contractor should ideally save this salt locally to reveal the bid later
      localStorage.setItem(`bid_salt_${tenderId}`, salt);
      
      onSubmit();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit bid');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <button 
        onClick={onBack}
        className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tender Details
      </button>

      <div className="bg-white p-6 rounded-2xl border border-blue-100 flex items-start space-x-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Project Details: Solar Farm Installation</h2>
          <p className="text-slate-500 mt-1">Budget Range: 2M - 3M USDC • Deadline: 2026-03-28</p>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle>Bid Submission Form</CardTitle>
          <CardDescription>All data will be encrypted and submitted via blockchain.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Your Bid Amount (USDC)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                id="amount" 
                placeholder="0.00" 
                className="pl-10 h-12 text-lg font-semibold" 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposal">Technical Proposal Summary</Label>
            <Textarea 
              id="proposal" 
              placeholder="Outline your approach and timeline..." 
              className="min-h-[150px]"
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Wallet Address (Automatic)</Label>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <Wallet className="w-5 h-5 text-slate-400" />
              <code className="text-sm font-mono text-slate-600 truncate">
                {address || "Please connect your wallet to submit"}
              </code>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Upload Supporting Documents</Label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <FileUp className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600">Compliance & Financial reports</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <Button onClick={handleSubmit} disabled={!address || isLoading} className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
              {isLoading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
              {isLoading ? 'Encrypting & Submitting...' : 'Submit Bid via Blockchain'}
            </Button>
            <p className="text-center text-xs text-slate-400 mt-4">
              Your bid will be encrypted and hidden from the government until the deadline.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
