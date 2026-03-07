import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Gavel, 
  Users, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Wallet,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useWallet, useRole, Role } from '../../hooks/use-wallet';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const { role } = useRole();
  
  const baseMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const roleMenu = {
    issuer: [
      { id: 'tender-list', label: 'All Tenders', icon: Gavel },
      { id: 'create-tender', label: 'Create Tender', icon: FileText },
    ],
    bidder: [
      { id: 'tender-list', label: 'View Tenders', icon: FileText },
      { id: 'submit-bid', label: 'My Submissions', icon: Gavel },
    ],
    auditor: [
      { id: 'transparency', label: 'Global Ledger', icon: ShieldCheck },
      { id: 'audit', label: 'Audit Logs', icon: CheckCircle2 },
    ]
  };

  const menuItems = role === 'issuer' 
    ? [...(roleMenu[role] || []), ...baseMenu.slice(1)]
    : [...baseMenu.slice(0, 1), ...(roleMenu[role] || []), ...baseMenu.slice(1)];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-200 flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">TrustTender</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === item.id 
                ? "bg-blue-50 text-blue-600" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export const Navbar: React.FC = () => {
  const { address, isConnected, connect, isConnecting } = useWallet();
  const { role, setRole } = useRole();

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 w-full flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center space-x-6 flex-1">
        <div className="relative w-full lg:max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search on-chain..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>

        <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">{role} Access</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

        <Button 
          variant={isConnected ? "outline" : "default"}
          size="sm"
          className="rounded-full px-4 font-semibold"
          onClick={connect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></span>
              Connecting...
            </span>
          ) : isConnected ? (
            <span className="flex items-center">
              <Wallet className="w-4 h-4 mr-2" />
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          ) : (
            "Connect Wallet"
          )}
        </Button>
      </div>
    </header>
  );
};

export const DashboardLayout: React.FC<{ children: React.ReactNode, activeTab: string, setActiveTab: (tab: string) => void, onLogout?: () => void }> = ({ children, activeTab, setActiveTab, onLogout }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
