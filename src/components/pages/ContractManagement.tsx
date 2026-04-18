import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { StatusBadge, StatusType } from '../ui/StatusBadge';
import { CheckCircle2, CircleDashed, ArrowLeft, Loader2, DollarSign, ListChecks, Landmark } from 'lucide-react';
import { useRole } from '../../hooks/use-wallet';
import { api } from '../../api';
import { toast } from 'sonner@2.0.3';

interface ContractManagementProps {
  tenderId: string;
  onBack: () => void;
}

export const ContractManagement: React.FC<ContractManagementProps> = ({ tenderId, onBack }) => {
  const { role } = useRole();
  const [tender, setTender] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      const data = await api.getTenderDetails(tenderId);
      setTender(data);
    } catch (err: any) {
      toast.error(err.message || 'Error fetching contract');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [tenderId]);

  const handleVerify = async (milestoneId: string) => {
    setActionLoading(milestoneId);
    try {
      await api.verifyMilestone({ milestoneId, auditorId: 'currentUser', status: 'VERIFIED' });
      toast.success('Milestone verified successfully!');
      fetchDetails();
    } catch (err: any) {
      toast.error(err.message || 'Verification failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePay = async (milestoneId: string) => {
    setActionLoading(milestoneId);
    try {
      await api.releasePayment(tenderId, milestoneId);
      toast.success('Funds released via smart contract!');
      fetchDetails();
    } catch (err: any) {
      toast.error(err.message || 'Payment failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-slate-500">
        <Loader2 className="animate-spin w-8 h-8 mr-3 text-blue-600" />
        Loading blockchain contract...
      </div>
    );
  }

  if (!tender) return <div>Failed to load contract.</div>;

  const totalFunded = tender.budget ? `${tender.budget} USDC` : 'TBD';
  const milestones = tender.milestonesData || [];
  
  // Calculate Progress
  const paidMilestones = milestones.filter((m: any) => m.status === 'PAID');
  const paidTotal = paidMilestones.reduce((acc: number, m: any) => acc + (m.amount || 0), 0);
  const progressPercent = tender.budget ? Math.round((paidTotal / parseFloat(tender.budget)) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <button 
        onClick={onBack}
        className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </button>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 outline outline-4 outline-slate-50 flex items-start space-x-4 shadow-xl shadow-slate-100">
        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
          <Landmark className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{tender.title || 'Awarded Contract'}</h2>
            <StatusBadge status={tender.status as StatusType} />
          </div>
          <p className="text-slate-500 font-medium mt-1">Contractor ID: {tender.awardedTo}</p>
          
          {/* Progress Bar */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex justify-between text-sm font-bold mb-2">
              <span className="text-slate-500 uppercase tracking-wider text-xs">Contract Progress</span>
              <span className="text-blue-600">{progressPercent}% Disbursed</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
              <span>0 USDC</span>
              <span>{paidTotal} / {totalFunded}</span>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-slate-100 overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between p-6">
          <div>
            <CardTitle className="text-lg font-black tracking-tight text-slate-800 flex items-center">
              <ListChecks className="w-5 h-5 mr-2 text-blue-500" /> Milestone Tracking
            </CardTitle>
            <CardDescription className="font-medium mt-1">Smart Contract execution phases</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {milestones.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-medium bg-slate-50 border-b border-slate-100">
              No active milestones for this contract.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {milestones.map((ms: any, index: number) => (
                <div key={ms.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="pt-1">
                      {ms.status === 'PAID' ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      ) : ms.status === 'VERIFIED' ? (
                        <CheckCircle2 className="w-6 h-6 text-blue-500" />
                      ) : (
                        <CircleDashed className="w-6 h-6 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{ms.description}</h4>
                      <div className="flex items-center space-x-3 mt-1 text-sm font-medium">
                        <span className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <DollarSign className="w-3 h-3 mr-1" /> {ms.amount} USDC
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-xs uppercase tracking-wider ${
                          ms.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                          ms.status === 'VERIFIED' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {ms.status}
                        </span>
                      </div>
                      {ms.verifiedBy && (
                        <p className="text-xs text-slate-400 mt-2 font-mono">Verified by: {ms.verifiedBy}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Role Based Actions */}
                  <div className="flex shrink-0">
                    {role === 'auditor' && ms.status === 'PENDING' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleVerify(ms.id)}
                        disabled={actionLoading === ms.id}
                        className="bg-slate-900 shadow-md"
                      >
                        {actionLoading === ms.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Approve Compliance
                      </Button>
                    )}

                    {role === 'issuer' && ms.status === 'VERIFIED' && (
                      <Button 
                        size="sm" 
                        onClick={() => handlePay(ms.id)}
                        disabled={actionLoading === ms.id}
                        className="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200"
                      >
                        {actionLoading === ms.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Release Funds
                      </Button>
                    )}

                    {ms.status === 'PAID' && (
                      <div className="text-sm font-bold text-emerald-500 flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Funds Settled
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
