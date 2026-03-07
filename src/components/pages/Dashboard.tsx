import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { StatusBadge, StatusType } from '../ui/StatusBadge';
import { GenericTable } from '../ui/GenericTable';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { TransactionModal, TransactionState } from '../features/TransactionModal';
import { mockBlockchainService } from '../../services/blockchain/ethers-service';

import { useWallet, useRole } from '../../hooks/use-wallet';

export const DashboardPage: React.FC = () => {
  const { role } = useRole();
  const [tenders, setTenders] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'my-bids'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [txModal, setTxModal] = useState<{ isOpen: boolean; state: TransactionState }>({ 
    isOpen: false, 
    state: 'idle' 
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await mockBlockchainService.getTenders();
      setTenders(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const stats = [
    { id: 'tenders', label: role === 'issuer' ? 'My Tenders' : 'Active Tenders', value: '12', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'my-bids', label: role === 'bidder' ? 'My Bids' : 'Total Bids', value: '84', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'pending', label: 'Pending Approval', value: '5', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'won', label: role === 'bidder' ? 'Bids Won' : 'Network Uptime', value: role === 'bidder' ? '3' : '99.9%', icon: CheckCircle2, color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  const myBids = [
    { id: 'B-001', title: 'Solar Farm Installation', status: 'awarded', deadline: '2026-03-15', budget: '$2.4M', bidAmount: '$2.1M' },
    { id: 'B-002', title: 'Smart City Infrastructure', status: 'review', deadline: '2026-04-01', budget: '$5.0M', bidAmount: '$4.8M' },
    { id: 'B-003', title: 'Highway Maintenance', status: 'open', deadline: '2026-02-28', budget: '$1.2M', bidAmount: '$1.15M' },
  ];

  const displayData = activeFilter === 'my-bids' ? myBids : tenders;

  const columns = activeFilter === 'my-bids' ? [
    { 
      header: 'Tender Name', 
      accessor: (item: any) => (
        <div className="font-semibold text-slate-900">{item.title}</div>
      )
    },
    { 
      header: 'My Bid Amount', 
      accessor: (item: any) => <span className="font-mono text-emerald-600 font-bold">{item.bidAmount}</span>
    },
    { 
      header: 'Status', 
      accessor: (item: any) => <StatusBadge status={item.status as StatusType} />
    },
    { 
      header: 'Award Date', 
      accessor: 'deadline' as any
    },
    {
      header: '',
      accessor: (item: any) => (
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          View Receipt <ArrowUpRight className="ml-1 w-3 h-3" />
        </Button>
      )
    }
  ] : [
    { 
      header: 'Tender Name', 
      accessor: (item: any) => (
        <div className="font-semibold text-slate-900">{item.title}</div>
      )
    },
    { 
      header: 'Status', 
      accessor: (item: any) => <StatusBadge status={item.status as StatusType} />
    },
    { 
      header: 'Deadline', 
      accessor: 'deadline' as any
    },
    { 
      header: 'Budget', 
      accessor: (item: any) => <span className="font-mono text-slate-600">{item.budget}</span>
    },
    {
      header: '',
      accessor: (item: any) => (
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          Details <ArrowUpRight className="ml-1 w-3 h-3" />
        </Button>
      )
    }
  ];

  const handleAction = () => {
    setTxModal({ isOpen: true, state: 'signing' });
    
    // Simulate flow
    setTimeout(() => {
      setTxModal(prev => ({ ...prev, state: 'pending' }));
      setTimeout(() => {
        setTxModal(prev => ({ ...prev, state: 'confirmed' }));
      }, 3000);
    }, 1500);
  };

  const getRoleTitle = () => {
    switch(role) {
      case 'issuer': return 'Issuer Command Center';
      case 'bidder': return 'Bidder Hub';
      case 'auditor': return 'Transparency Oversight';
      default: return 'Dashboard';
    }
  };

  const getRoleDescription = () => {
    switch(role) {
      case 'issuer': return 'Manage and track your blockchain-secured procurement processes.';
      case 'bidder': return 'Explore opportunities and track your submitted bids on-chain.';
      case 'auditor': return 'Audit the immutable ledger for compliance and transparency.';
      default: return 'Manage your decentralized procurement activities.';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{getRoleTitle()}</h1>
          <p className="text-slate-500 mt-1">{getRoleDescription()}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">Download Reports</Button>
          {role === 'issuer' && (
            <Button onClick={handleAction} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Create New Tender
            </Button>
          )}
          {role === 'bidder' && (
            <Button onClick={handleAction} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" /> Submit New Bid
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card 
            key={i} 
            className={cn(
              "border-none shadow-sm bg-white hover:shadow-md transition-all cursor-pointer",
              activeFilter === 'my-bids' && stat.id === 'my-bids' ? "ring-2 ring-emerald-500 bg-emerald-50/30" : "",
              activeFilter === 'all' && stat.id === 'tenders' ? "ring-2 ring-blue-500 bg-blue-50/30" : ""
            )}
            onClick={() => {
              if (stat.id === 'my-bids') setActiveFilter('my-bids');
              if (stat.id === 'tenders') setActiveFilter('all');
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1 text-slate-900">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>{activeFilter === 'my-bids' ? 'My Submitted Bids' : 'Recent Tenders'}</CardTitle>
                <CardDescription>
                  {activeFilter === 'my-bids' 
                    ? 'Tracking your encrypted bid submissions on the ledger.' 
                    : 'Real-time updates from the blockchain ledger.'}
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-600"
                onClick={() => setActiveFilter('all')}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <GenericTable data={displayData} columns={columns} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Network Status</CardTitle>
              <CardDescription>Current state of the decentralized infrastructure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Mainnet Node</span>
                </div>
                <span className="text-xs text-slate-500">12ms latency</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-medium">Validator Pool</span>
                </div>
                <span className="text-xs text-slate-500">99.9% Uptime</span>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Gas Price (Fast)</span>
                  <span className="font-semibold">18 Gwei</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">System Update</h4>
                  <p className="text-white/80 text-sm mt-1">Multi-signature voting will be enabled for all tenders starting next week.</p>
                </div>
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-slate-100 w-full font-bold">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <TransactionModal 
        isOpen={txModal.isOpen} 
        state={txModal.state} 
        onClose={() => setTxModal({ ...txModal, isOpen: false })} 
        onRetry={() => setTxModal({ ...txModal, state: 'signing' })}
      />
    </div>
  );
};
