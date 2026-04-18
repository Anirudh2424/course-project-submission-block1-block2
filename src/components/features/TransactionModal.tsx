import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Loader2, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type TransactionState = 'idle' | 'signing' | 'pending' | 'confirmed' | 'failed';

interface TransactionModalProps {
  state: TransactionState;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  onRetry?: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ 
  state, 
  isOpen, 
  onClose, 
  title = "Blockchain Transaction",
  onRetry 
}) => {
  const renderContent = () => {
    switch (state) {
      case 'signing':
        return (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="relative">
              <ShieldCheck className="w-16 h-16 text-blue-500" />
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-500"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">Signature Required</h3>
              <p className="text-sm text-slate-500">Please confirm the transaction in your wallet.</p>
            </div>
          </div>
        );
      case 'pending':
        return (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Processing Transaction</h3>
              <p className="text-sm text-slate-500">Awaiting block confirmation on the network...</p>
            </div>
          </div>
        );
      case 'confirmed':
        return (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Transaction Confirmed</h3>
              <p className="text-sm text-slate-500">Your action has been successfully recorded on-chain.</p>
            </div>
          </div>
        );
      case 'failed':
        return (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <XCircle className="w-16 h-16 text-red-500" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Transaction Failed</h3>
              <p className="text-sm text-slate-500">Something went wrong. Please check your balance or try again.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && state !== 'pending' && state !== 'signing' && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">
            Status of your blockchain transaction: {state}
          </DialogDescription>
        </DialogHeader>
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
        <DialogFooter className="flex-row space-x-2 justify-center sm:justify-center">
          {state === 'confirmed' && (
            <Button onClick={onClose} className="w-full">Close</Button>
          )}
          {state === 'failed' && (
            <>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={onRetry}>Retry</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
