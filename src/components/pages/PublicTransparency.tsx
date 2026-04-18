import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { ExternalLink, Search, Download, Filter, Eye } from 'lucide-react';
import { Input } from '../ui/input';

export const PublicTransparency: React.FC = () => {
  const projects = [
    { name: 'Bridge Renovation #4', contractor: 'ConstruX Ltd', amount: '1.2M USDC', status: 'Payment Released', date: '2026-02-10' },
    { name: 'City Fiber Optics', contractor: 'NetStream Systems', amount: '450K USDC', status: 'In Progress', date: '2026-01-25' },
    { name: 'Rural Water Wells', contractor: 'AquaSource Corp', amount: '89K USDC', status: 'Completed', date: '2026-01-05' },
    { name: 'School Tablet Program', contractor: 'EduTech India', amount: '2.1M USDC', status: 'Winner Selected', date: '2025-12-15' },
    { name: 'Public Park Lighting', contractor: 'BrightCity Inc', amount: '15K USDC', status: 'Payment Released', date: '2025-11-20' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Public Transparency</h1>
          <p className="text-slate-500 mt-2 text-lg">Real-time view of government expenditure and contractor selection.</p>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <Button variant="outline" className="border-2 font-bold">
            <Download className="w-4 h-4 mr-2" /> Audit Report
          </Button>
          <Button className="bg-blue-600 font-bold px-6">
            Live Feed
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Projects</p>
            <p className="text-3xl font-black text-slate-900 mt-2">1,284</p>
            <p className="text-xs text-emerald-600 font-bold mt-1">+12 this month</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Public Spending</p>
            <p className="text-3xl font-black text-slate-900 mt-2">425.8M USDC</p>
            <p className="text-xs text-blue-600 font-bold mt-1">Verified on-chain</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Verified Contractors</p>
            <p className="text-3xl font-black text-slate-900 mt-2">842</p>
            <p className="text-xs text-amber-600 font-bold mt-1">All passed compliance</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 p-8">
          <div>
            <CardTitle>Expenditure Ledger</CardTitle>
            <CardDescription>Anti-corruption record of all platform transactions.</CardDescription>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Filter by project..." className="pl-10 h-10 w-64 bg-white" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Project Name</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Selected Contractor</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {projects.map((proj, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-900">{proj.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase">Date: {proj.date}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-600">
                          {proj.contractor[0]}
                        </div>
                        <span className="font-medium text-slate-700">{proj.contractor}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-mono text-slate-600 font-bold">{proj.amount}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        proj.status.includes('Released') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        proj.status.includes('Progress') ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-slate-50 text-slate-700 border-slate-200'
                      }`}>
                        {proj.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Button variant="ghost" size="sm" className="text-blue-600 font-bold hover:bg-blue-50">
                        View on Explorer <ExternalLink className="ml-2 w-3 h-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="p-8 bg-blue-50 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 border border-blue-100">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 shrink-0">
            <Eye className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-black text-slate-900">Total Auditability</h4>
            <p className="text-slate-500 max-w-md">Any citizen can verify these records against the public ledger. No data can be altered or hidden by officials.</p>
          </div>
        </div>
        <Button className="bg-slate-900 text-white hover:bg-black font-bold h-12 px-8 rounded-xl shadow-lg">
          Connect Observer Node
        </Button>
      </div>
    </div>
  );
};
