import React, { useState } from 'react';
import { useRole, Role } from '../../hooks/use-wallet';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Shield, Building2, Gavel, Lock, Eye, Wallet, User, UserPlus, Fingerprint } from 'lucide-react';
import { cn } from '../ui/utils';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface LoginPageProps {
  onLogin: (role: Role) => void;
  onPublicClick: () => void;
}

type AuthMode = 'signin' | 'signup';

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onPublicClick }) => {
  const { setRole } = useRole();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [userId, setUserId] = useState('');
  const [walletId, setWalletId] = useState('');

  const roles = [
    {
      id: 'issuer' as Role,
      title: 'Government/Issuer',
      description: 'Create and manage secure tenders, review bids, and oversee procurement.',
      icon: Building2,
    },
    {
      id: 'bidder' as Role,
      title: 'Contractor/Bidder',
      description: 'Discover active tenders, submit blockchain-verified bids, and track status.',
      icon: Gavel,
    },
    {
      id: 'auditor' as Role,
      title: 'Independent Auditor',
      description: 'Review immutable audit logs and ensure compliance with procurement laws.',
      icon: Shield,
    }
  ];

  const handleAuth = () => {
    if (!selectedRole) {
      toast.error("Please select an access type first.");
      return;
    }
    if (!userId) {
      toast.error("Please enter your User ID.");
      return;
    }
    if (authMode === 'signup' && !walletId) {
      toast.error("Please enter your Wallet ID.");
      return;
    }
    
    setRole(selectedRole);
    onLogin(selectedRole);
    toast.success(authMode === 'signin' ? "Welcome back!" : "Account created successfully!");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-4xl w-full z-10 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl text-white font-bold text-2xl mb-4 shadow-lg shadow-blue-200 cursor-pointer" onClick={() => window.location.reload()}>
            T
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {authMode === 'signin' ? 'Sign In to TrustTender' : 'Join TrustTender'}
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">
            {authMode === 'signin' 
              ? 'Access your blockchain-secured dashboard.' 
              : 'Create a decentralized identity for government tendering.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Role Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Select Access Type</h3>
            <div className="space-y-3">
              {roles.map((role) => (
                <Card 
                  key={role.id}
                  className={cn(
                    "cursor-pointer transition-all border-2",
                    selectedRole === role.id 
                      ? `border-blue-600 ring-4 ring-blue-50 bg-blue-50/20 shadow-lg shadow-blue-100` 
                      : "border-slate-100 hover:border-slate-200"
                  )}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <CardHeader className="p-4 flex flex-row items-center space-x-4 space-y-0">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                      selectedRole === role.id ? `bg-blue-600 text-white` : "bg-slate-100 text-slate-400"
                    )}>
                      <role.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">{role.title}</CardTitle>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
            
            <div className="pt-4">
              <button 
                onClick={onPublicClick}
                className="flex items-center text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Public Transparency Ledger
              </button>
            </div>
          </div>

          {/* Auth Form */}
          <Card className="border-none shadow-2xl shadow-slate-200 overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <div className="flex bg-slate-200 p-1 rounded-lg">
                <button 
                  onClick={() => setAuthMode('signin')}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center space-x-2",
                    authMode === 'signin' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button 
                  onClick={() => setAuthMode('signup')}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center space-x-2",
                    authMode === 'signup' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId" className="text-xs font-bold uppercase tracking-widest text-slate-400">User ID / Username</Label>
                  <div className="relative">
                    <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <Input 
                      id="userId" 
                      placeholder="e.g. gov_admin_01" 
                      className="pl-10 h-12 border-slate-200"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {authMode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <Label htmlFor="walletId" className="text-xs font-bold uppercase tracking-widest text-slate-400">Wallet Public Key</Label>
                      <div className="relative">
                        <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <Input 
                          id="walletId" 
                          placeholder="0x..." 
                          className="pl-10 h-12 border-slate-200 font-mono text-sm"
                          value={walletId}
                          onChange={(e) => setWalletId(e.target.value)}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        This will be used to sign all immutable blockchain transactions.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <Label htmlFor="pass" className="text-xs font-bold uppercase tracking-widest text-slate-400">Access Token / Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <Input id="pass" type="password" placeholder="••••••••" className="pl-10 h-12 border-slate-200" />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleAuth}
                  className="w-full h-14 text-lg font-black bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 rounded-xl"
                  disabled={!selectedRole}
                >
                  {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                </Button>
                
                <div className="mt-6 flex flex-col items-center space-y-3">
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">Secure Verification</p>
                  <div className="flex items-center space-x-4 grayscale opacity-50">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Logo.svg" alt="MetaMask" className="h-5" />
                    <div className="w-[1px] h-3 bg-slate-300"></div>
                    <span className="text-[10px] font-black text-slate-500">AES-256</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
