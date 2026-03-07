// Placeholder for blockchain interactions using ethers.js
// In a real app, this would use a real provider and contract instances

export const mockBlockchainService = {
  getTenders: async () => {
    return [
      { id: '1', title: 'Smart Grid Infrastructure', status: 'active', deadline: '2026-03-20', budget: '500,000 USDC' },
      { id: '2', title: 'Blockchain Identity System', status: 'pending', deadline: '2026-04-15', budget: '1,200,000 USDC' },
      { id: '3', title: 'Decentralized Storage Solution', status: 'completed', deadline: '2026-01-10', budget: '350,000 USDC' },
      { id: '4', title: 'Quantum Encryption Pilot', status: 'active', deadline: '2026-05-01', budget: '2,500,000 USDC' },
    ];
  },

  submitBid: async (tenderId: string, amount: string) => {
    return new Promise((resolve) => setTimeout(resolve, 2000));
  },

  signTransaction: async () => {
    return new Promise((resolve) => setTimeout(resolve, 1500));
  }
};
