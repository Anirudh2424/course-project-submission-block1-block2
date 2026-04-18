import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Calendar, DollarSign, MapPin, FileUp, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../api';
import { toast } from 'sonner@2.0.3';

interface CreateTenderProps {
  onPublish: () => void;
}

export const CreateTender: React.FC<CreateTenderProps> = ({ onPublish }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePublish = async () => {
    if (!title || !description || !budget || !deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const tenderId = `T-${Date.now().toString().slice(-6)}`;
      const deadlineTimestamp = new Date(deadline).getTime();
      
      await api.createTender({
        tenderId,
        title,
        budget: parseFloat(budget),
        deadline: deadlineTimestamp,
        createdBy: 'Government' // Will be associated with JWT later if needed, but the argument is required
      });
      
      onPublish(); // Trigger parent success flow (toast + redirect)
    } catch (err: any) {
      toast.error(err.message || 'Failed to create tender');
    } finally {
      setIsLoading(false);
    }
  };

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
            <Input 
              id="title" 
              placeholder="e.g., Smart Grid Infrastructure Phase II" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Detailed scope of work and requirements..." 
              className="min-h-[120px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USDC)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="budget" 
                  placeholder="0.00" 
                  className="pl-10" 
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Bid Deadline</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="deadline" 
                  type="date" 
                  className="pl-10" 
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                id="location" 
                placeholder="City, Country" 
                className="pl-10" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
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
            <Button onClick={handlePublish} disabled={isLoading} className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700">
              {isLoading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
              {isLoading ? 'Publishing to Blockchain...' : 'Publish Tender (Blockchain)'}
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
