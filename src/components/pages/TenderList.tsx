import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { StatusBadge, StatusType } from '../ui/StatusBadge';
import { Calendar, DollarSign, ArrowRight, Filter, Search } from 'lucide-react';
import { Input } from '../ui/input';

interface TenderListProps {
  onViewDetails: (id: string) => void;
}

export const TenderList: React.FC<TenderListProps> = ({ onViewDetails }) => {
  const tenders = [
    { id: '1', title: 'National Highway Expansion', budget: '15M USDC', deadline: '2026-04-12', status: 'active', desc: 'Civil engineering project for state highway 402.' },
    { id: '2', title: 'Solar Farm Installation', budget: '2.4M USDC', deadline: '2026-03-28', status: 'active', desc: 'Renewable energy infrastructure for northern districts.' },
    { id: '3', title: 'Public Health Data System', budget: '800K USDC', deadline: '2026-05-15', status: 'pending', desc: 'Implementation of decentralized medical record storage.' },
    { id: '4', title: 'Quantum Research Grant', budget: '5M USDC', deadline: '2026-02-10', status: 'completed', desc: 'Collaborative research for quantum encryption protocols.' },
  ];

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
        {tenders.map((tender) => (
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
                onClick={() => onViewDetails(tender.id)}
                className="w-full bg-slate-100 text-slate-900 hover:bg-blue-600 hover:text-white border-none shadow-none"
              >
                View Details <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
