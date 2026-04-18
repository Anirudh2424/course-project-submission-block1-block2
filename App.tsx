import React, { useState } from 'react';
import { WalletProvider, RoleProvider } from './hooks/use-wallet';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './components/pages/Dashboard';
import { LoginPage } from './components/pages/Login';
import { LandingPage } from './components/pages/LandingPage';
import { CreateTender } from './components/pages/CreateTender';
import { TenderList } from './components/pages/TenderList';
import { SubmitBid } from './components/pages/SubmitBid';
import { ResultWinner } from './components/pages/ResultWinner';
import { PublicTransparency } from './components/pages/PublicTransparency';
import { AuditLogs } from './components/pages/AuditLogs';
import { Toaster, toast } from 'sonner@2.0.3';

type AppView = 'landing' | 'login' | 'dashboard' | 'create-tender' | 'tender-list' | 'submit-bid' | 'result' | 'transparency' | 'audit' | 'settings';

export default function App() {
  const [view, setView] = useState<AppView>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedTenderId, setSelectedTenderId] = useState<string | null>(null);

  const handleLoginSuccess = (role: string) => {
    setIsAuthenticated(true);
    if (role === 'issuer') {
      setView('tender-list');
    } else {
      setView('dashboard');
    }
    toast.success("Wallet connected successfully!");
  };

  const handlePublishSuccess = () => {
    toast.success("Tender published to blockchain!");
    setView('tender-list');
  };

  const handleBidSubmitSuccess = () => {
    toast.success("Bid encrypted and submitted!");
    setView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('landing');
    toast.info("Logged out successfully.");
  };

  const renderView = () => {
    // If not authenticated, only allow landing, login, and public transparency
    if (!isAuthenticated) {
      switch (view) {
        case 'landing':
          return <LandingPage onLoginClick={() => setView('login')} onPublicClick={() => setView('transparency')} />;
        case 'login':
          return <LoginPage onLogin={(role) => handleLoginSuccess(role)} onPublicClick={() => setView('transparency')} />;
        case 'transparency':
          return (
            <div className="min-h-screen bg-slate-50 py-12 px-6">
              <PublicTransparency />
              <div className="max-w-6xl mx-auto mt-8 flex justify-center">
                <button onClick={() => setView('landing')} className="text-sm font-bold text-blue-600 hover:underline">
                  ← Back to Home
                </button>
              </div>
            </div>
          );
        default:
          return <LandingPage onLoginClick={() => setView('login')} onPublicClick={() => setView('transparency')} />;
      }
    }

    // Authenticated view
    return (
      <DashboardLayout activeTab={view} setActiveTab={(tab) => setView(tab as AppView)} onLogout={handleLogout}>
        {renderDashboardContent()}
      </DashboardLayout>
    );
  };

  const renderDashboardContent = () => {
    switch (view) {
      case 'dashboard':
        return <DashboardPage />;
      case 'create-tender':
        return <CreateTender onPublish={handlePublishSuccess} />;
      case 'tender-list':
        return <TenderList onViewDetails={(id) => { setSelectedTenderId(id); setView('submit-bid'); }} />;
      case 'submit-bid':
        return <SubmitBid tenderId={selectedTenderId || '1'} onBack={() => setView('tender-list')} onSubmit={handleBidSubmitSuccess} />;
      case 'result':
        return <ResultWinner onBackToDashboard={() => setView('dashboard')} />;
      case 'transparency':
        return <PublicTransparency />;
      case 'audit':
        return <AuditLogs />;
      case 'settings':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
            <h2 className="text-xl font-bold">Account Settings</h2>
            <p>Profile and security preferences are managed on-chain.</p>
          </div>
        );
      default:
        return <DashboardPage />;
    }
  };

  return (
    <RoleProvider>
      <WalletProvider>
        {renderView()}
        <Toaster position="top-right" richColors />
      </WalletProvider>
    </RoleProvider>
  );
}
