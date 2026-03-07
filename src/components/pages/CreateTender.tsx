import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Calendar, DollarSign, MapPin, FileUp, AlertCircle } from 'lucide-react';

interface CreateTenderProps {
  onPublish: () => void;
}

export const CreateTender: React.FC<CreateTenderProps> = ({ onPublish }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Create New Tender</h1>
        <p className="text-slate-500 mt-1">Fill out the details below to publish a new procurement request to the blockchain.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Name</Label>
            <Input id="title" placeholder="e.g., Smart Grid Infrastructure Phase II" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Detailed scope of work and requirements..." 
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USDC)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input id="budget" placeholder="0.00" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Bid Deadline</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input id="deadline" type="date" className="pl-10" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input id="location" placeholder="City, Country" className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Upload Documents</Label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer group">
              <FileUp className="w-10 h-10 text-slate-300 mx-auto mb-3 group-hover:text-blue-500 transition-colors" />
              <p className="text-sm font-medium text-slate-600">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-400 mt-1">PDF, DOCX or ZIP up to 50MB</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col items-center">
            <Button onClick={onPublish} className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700">
              Publish Tender (Blockchain)
            </Button>
            <div className="flex items-center mt-4 text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
              <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
              Transaction will be recorded on blockchain
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
