export interface TeamMember {
  id: string;
  name: string;
  role: string;
  commitment: 'Full-time' | 'Part-time';
  equity: number;
  vesting: string;
}

export interface CapTableEntry {
  stakeholder: string;
  equity: number;
}

export interface Document {
  id: string;
  name: string;
  type: 'Legal' | 'Sales' | 'RFQ';
  dateAdded: string;
}

export type FundraisingStage = 'lead' | 'pitched' | 'term-sheet' | 'closed';

export interface FundraisingDeal {
    id: string;
    investor: string;
    amount: number;
    stage: FundraisingStage;
    contact: string;
}

export type MilestoneCategory = 'task' | 'daily' | 'monthly' | 'quarterly' | 'yearly';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'todo' | 'inprogress' | 'done';
  owner: string;
  priority: 'low' | 'medium' | 'high';
  category: MilestoneCategory;
}
