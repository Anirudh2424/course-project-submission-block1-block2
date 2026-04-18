import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { StatusBadge, StatusType } from '../ui/StatusBadge';
import { Calendar, DollarSign, ArrowRight, Filter, Search, Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import { api } from '../../api';
import { useRole } from '../../hooks/use-wallet';
import { toast } from 'sonner@2.0.3';

interface TenderListProps {
  onViewDetails: (id: string) => void;
  onManageContract: (id: string) => void;
}

export const TenderList: React.FC<TenderListProps> = ({ onViewDetails, onManageContract }) => {
  const { role } = useRole();
  const [tenders, setTenders] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const data = await api.getAllTenders();
        const mappedTenders = (data || []).map((t: any) => ({
          id: t.tenderId || t.id || 'N/A',
          title: t.title || 'Untitled',
          budget: t.budget ? `${t.budget} USDC` : 'TBD',
          deadline: t.deadline ? new Date(parseInt(t.deadline)).toISOString().split('T')[0] : 'N/A',
          status: t.status ? t.status.toLowerCase() : 'active',
          desc: t.description || 'Blockchain secured tender.'
        }));
        setTenders(mappedTenders);
      } catch (err) {
        console.error("Failed to fetch tenders:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTenders();
  }, []);

  const handleEvaluate = async (tenderId: string, deadlineStr: string) => {
    const deadlineDate = new Date(deadlineStr);
    if (new Date() < deadlineDate) {
      toast.error('Cannot evaluate bids before the deadline has passed!');
      return;
    }
    
    setIsProcessing(true);
    toast.info('Triggering smart contract evaluation...');
    try {
       await api.orchestrateAward(tenderId);
       toast.success('Bids evaluated! Lowest bidder awarded and milestones set.');
       window.location.reload();
    } catch (err: any) {
       toast.error(err.message || 'Evaluation failed. Perhaps no bids exist?');
    } finally {
       setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Available Tenders</h1>
          <p className="text-slate-500 mt-1">Browse and bid on active government projects.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" /> Open Tenders
          </Button>
          <Button variant="ghost" size="sm">
            Closed Tenders
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search tenders by keyword or ID..." className="pl-10 h-11 border-none bg-white shadow-sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-2 flex justify-center py-12 text-slate-500">
            <Loader2 className="animate-spin w-8 h-8 mr-3 text-blue-600" />
            Loading blockchain data...
          </div>
        ) : tenders.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
            No active tenders found on the ledger.
          </div>
        ) : tenders.map((tender) => (
          <Card key={tender.id} className="border-none shadow-sm hover:shadow-md transition-all group">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-2">
                <StatusBadge status={tender.status as StatusType} />
                <span className="text-xs font-mono text-slate-400">ID: TX-{tender.id}2F</span>
              </div>
              <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{tender.title}</CardTitle>
              <CardDescription className="line-clamp-2 mt-2">{tender.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 my-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Budget</p>
                  <div className="flex items-center text-slate-900 font-semibold">
                    <DollarSign className="w-4 h-4 mr-1 text-emerald-500" />
                    {tender.budget}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Deadline</p>
                  <div className="flex items-center text-slate-900 font-semibold">
                    <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                    {tender.deadline}
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => {
                  if (tender.status === 'awarded') {
                      onManageContract(tender.id);
                      return;
                  }
                  if (role === 'bidder') {
                    onViewDetails(tender.id);
                  } else {
                    handleEvaluate(tender.id, tender.deadline);
                  }
                }}
                disabled={isProcessing}
                className="w-full bg-slate-100 text-slate-900 hover:bg-blue-600 hover:text-white border-none shadow-none"
              >
                {tender.status === 'awarded' ? 'Manage Contract Tasks' : role === 'bidder' ? 'Submit Bid' : 'Evaluate & Award Winner'} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
