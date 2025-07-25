import type { TeamMember } from '@/types';

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
