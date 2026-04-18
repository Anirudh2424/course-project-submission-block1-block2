const BASE_URL = 'http://localhost:5000';

export const apiCall = async (endpoint: string, method: string, data?: any) => {
    let url = `${BASE_URL}${endpoint}`;
    if (method === 'GET' && data) {
        const params = new URLSearchParams(data);
        url += `?${params.toString()}`;
    }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    // Inject JWT Token from localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method,
        headers,
        body: (method !== 'GET' && data) ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
            const errorData = await response.json();
            if (errorData.error) errorMsg = errorData.error;
        } catch (e) {}
        throw new Error(errorMsg);
    }
    
    return await response.json();
};

export const api = {
    // ---- Auth Commands ----
    login: (data: any) => 
        apiCall('/auth/login', 'POST', data),
    
    signup: (data: any) => 
        apiCall('/auth/signup', 'POST', data),

    // ---- Government Commands ----
    createTender: (data: { tenderId: string, title: string, budget: number, deadline: number, createdBy: string }) => 
        apiCall('/tender/create', 'POST', data),
    
    evaluateBids: (tenderId: string) => 
        apiCall('/tender/evaluate', 'POST', { tenderId }),
        
    awardContract: (tenderId: string, contractorId: string) => 
        apiCall('/tender/award', 'POST', { tenderId, contractorId }),
        
    orchestrateAward: (tenderId: string) =>
        apiCall('/tender/orchestrate-award', 'POST', { tenderId }),
        
    releasePayment: (tenderId: string, milestoneId: string) => 
        apiCall('/milestone/pay', 'POST', { tenderId, milestoneId }),

    // ---- Contractor Commands ----
    submitBid: (data: { tenderId: string, contractorId: string, bidAmount: number, salt: string }) => 
        apiCall('/bid/submit', 'POST', data),
        
    revealBid: (data: { tenderId: string, contractorId: string, bidAmount: number, salt: string }) => 
        apiCall('/bid/reveal', 'POST', data),
        
    // ---- General Commands ----
    getAllTenders: () => 
        apiCall('/tender/all', 'GET'),
    
    getTenderDetails: (id: string) => 
        apiCall(`/tender/${id}`, 'GET'),
    
    createMilestone: (data: { tenderId: string, milestoneId: string, description: string, amount: number }) => 
        apiCall('/milestone/create', 'POST', data), 
        
    verifyMilestone: (data: { milestoneId: string, auditorId: string, status: string }) => 
        apiCall('/milestone/verify', 'POST', data), 
};
