import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ShieldCheck, History, UserCheck, AlertTriangle } from 'lucide-react';
import { GenericTable } from '../ui/GenericTable';

export const AuditLogs: React.FC = () => {
  const auditData = [
    { 
      id: 'TX-8821', 
      action: 'Tender Creation', 
      user: 'Issuer (0x442...a91)', 
      timestamp: '2026-02-12 14:22:01', 
      status: 'Verified',
      hash: '0x8821...ff2e'
    },
    { 
      id: 'TX-8822', 
      action: 'Bid Submission', 
      user: 'Bidder (0x12b...c33)', 
      timestamp: '2026-02-12 15:01:45', 
      status: 'Verified',
      hash: '0x33ac...11ab'
    },
    { 
      id: 'TX-8823', 
      action: 'Smart Contract Update', 
      user: 'System Admin', 
      timestamp: '2026-02-13 09:12:11', 
      status: 'Pending Audit',
      hash: '0x9922...00bb'
    },
    { 
      id: 'TX-8824', 
      action: 'Winner Selection', 
      user: 'Issuer (0x442...a91)', 
      timestamp: '2026-02-13 10:45:30', 
      status: 'Verified',
      hash: '0xbb11...ddcc'
    }
  ];

  const columns = [
    { 
      header: 'Transaction ID', 
      accessor: (item: any) => <span className="font-mono text-xs font-bold text-slate-500">{item.id}</span>
    },
    { 
      header: 'Action', 
      accessor: 'action' as any
    },
    { 
      header: 'Performed By', 
      accessor: 'user' as any
    },
    { 
      header: 'Timestamp', 
      accessor: 'timestamp' as any
    },
    { 
      header: 'Verification Status', 
      accessor: (item: any) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          item.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {item.status}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Audit Logs</h1>
        <p className="text-slate-500 mt-1">Immutable record of all platform activities and blockchain transactions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
              <History className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Events</p>
              <p className="text-2xl font-bold">1,284</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Verified Trans.</p>
              <p className="text-2xl font-bold">1,281</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Anomalies</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-blue-600" />
            Compliance Ledger
          </CardTitle>
          <CardDescription>Each transaction is cross-referenced with its on-chain hash.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <GenericTable data={auditData} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
};
