
import type { TeamMember, Document, FundraisingDeal, FinancialRecord, Client } from '@/types';

export const teamMembers: TeamMember[] = [
  { id: '1', name: 'Alex Johnson', role: 'CEO & Co-founder', commitment: 'Full-time', equity: 40, vesting: '4y/1y cliff' },
  { id: '2', name: 'Ben Carter', role: 'CTO & Co-founder', commitment: 'Full-time', equity: 40, vesting: '4y/1y cliff' },
  { id: '3', name: 'Casey Lee', role: 'Lead Designer', commitment: 'Full-time', equity: 5, vesting: '4y/1y cliff' },
  { id: '4', name: 'Dana White', role: 'Advisor', commitment: 'Part-time', equity: 1, vesting: '2y/6m cliff' },
];

export const capTable: Record<string, number> = {
  'Alex Johnson (Founder)': 40,
  'Ben Carter (Founder)': 40,
  'Casey Lee': 5,
  'Dana White': 1,
  'ESOP': 14,
};

export const initialInvestment = {
    totalInvested: 50000,
    teamMembersCount: 4,
    esopPool: 14,
}

export const documents: Document[] = [
    { id: '1', name: 'Series A Term Sheet', type: 'Legal', dateAdded: '2024-05-15', path: '/documents/series-a-term-sheet.pdf' },
    { id: '2', name: 'Master Services Agreement', type: 'Sales', dateAdded: '2024-05-20', path: '/documents/msa.pdf' },
    { id: '3', name: 'Cloud Services RFQ', type: 'RFQ', dateAdded: '2024-06-01', path: '/documents/cloud-rfq.pdf' },
    { id: '4', name: 'Employee NDA', type: 'Legal', dateAdded: '2024-04-10', path: '/documents/employee-nda.pdf' },
];

export const fundraisingStages = [
    { id: 'lead', title: 'Lead' },
    { id: 'pitched', title: 'Pitched' },
    { id: 'term-sheet', title: 'Term Sheet' },
    { id: 'closed', title: 'Closed' },
] as const;


export const fundraisingDeals: FundraisingDeal[] = [
    { id: 'deal-1', investor: 'Sequoia Capital', amount: 2000000, stage: 'pitched', contact: 'rori@sequoia.com' },
    { id: 'deal-2', investor: 'Andreessen Horowitz', amount: 3000000, stage: 'lead', contact: 'marc@a16z.com' },
    { id: 'deal-3', investor: 'Y Combinator', amount: 150000, stage: 'closed', contact: 'garry@ycombinator.com' },
    { id: 'deal-4', investor: 'Techstars', amount: 120000, stage: 'closed', contact: 'david@techstars.com' },
    { id: 'deal-5', investor: 'Accel', amount: 1500000, stage: 'term-sheet', contact: 'ryan@accel.com' },
    { id: 'deal-6', investor: 'Lightspeed Venture Partners', amount: 2500000, stage: 'pitched', contact: 'nicole@lsvp.com' },
];

export const financialData: FinancialRecord[] = [
    { month: 'Jan', revenue: 10000, expenses: 15000, netIncome: -5000, details: 'Initial server costs and software licenses.', invoicePath: '/invoices/jan-2024.pdf' },
    { month: 'Feb', revenue: 12000, expenses: 16000, netIncome: -4000, details: 'Hired a part-time contractor.', invoicePath: '/invoices/feb-2024.pdf' },
    { month: 'Mar', revenue: 18000, expenses: 17000, netIncome: 1000, details: 'First major client signed.', invoicePath: '/invoices/mar-2024.pdf' },
    { month: 'Apr', revenue: 20000, expenses: 18000, netIncome: 2000, details: 'Increased marketing spend.', invoicePath: '/invoices/apr-2024.pdf' },
    { month: 'May', revenue: 25000, expenses: 20000, netIncome: 5000, details: 'Recurring revenue growth.', invoicePath: '/invoices/may-2024.pdf' },
    { month: 'Jun', revenue: 28000, expenses: 22000, netIncome: 6000, details: 'Stable operations and team expansion.', invoicePath: '/invoices/jun-2024.pdf' },
];

export const clients: Client[] = [
    { 
        id: 'client-1', 
        name: 'Innovate Corp', 
        company: 'Innovate Corp', 
        email: 'contact@innovate.com', 
        status: 'active', 
        notes: 'Initial integration complete. Monthly check-ins scheduled.',
        projects: [
            { id: 'proj-1', name: 'Platform V2 Launch', description: 'Oversee development and launch of the new platform.', status: 'active' },
            { id: 'proj-2', name: 'Mobile App POC', description: 'Develop a proof of concept for the new mobile application.', status: 'planning' },
        ]
    },
    { 
        id: 'client-2', 
        name: 'Synergy Solutions', 
        company: 'Synergy Solutions', 
        email: 'main@synergy.com', 
        status: 'active', 
        notes: 'High-value client. Exploring upsell opportunities.',
        projects: [
            { id: 'proj-3', name: 'Q3 Marketing Campaign', description: 'Launch and manage the Q3 marketing initiatives.', status: 'active' }
        ]
    },
    { 
        id: 'client-3', 
        name: 'Lead Ventures', 
        company: 'Lead Ventures', 
        email: 'info@leadventures.io', 
        status: 'lead', 
        notes: 'Met at conference. Follow up next week.',
        projects: []
    },
    { 
        id: 'client-4', 
        name: 'Old Guard Inc.', 
        company: 'Old Guard Inc.', 
        email: 'support@oldguard.com', 
        status: 'churned', 
        notes: 'Churned due to budget cuts. Re-engage in 6 months.',
        projects: [
             { id: 'proj-4', name: 'Legacy System Migration', description: 'Migrate data from old system to our platform.', status: 'completed' }
        ]
    },
];
