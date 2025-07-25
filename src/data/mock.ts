import type { TeamMember, Document } from '@/types';

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
    { id: '1', name: 'Series A Term Sheet', type: 'Legal', dateAdded: '2024-05-15' },
    { id: '2', name: 'Master Services Agreement', type: 'Sales', dateAdded: '2024-05-20' },
    { id: '3', name: 'Cloud Services RFQ', type: 'RFQ', dateAdded: '2024-06-01' },
    { id: '4', name: 'Employee NDA', type: 'Legal', dateAdded: '2024-04-10' },
];
