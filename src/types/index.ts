










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
  path: string;
}

export interface UIDocument extends Document {
    file?: File;
    url?: string;
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
  owner: string[];
  priority: 'low' | 'medium' | 'high';
  category: MilestoneCategory;
  lastUpdated: string;
  updatedBy: string;
  lastUpdateSummary: string;
}

export interface WikiPage {
  id: string;
  title: string;
  content: string;
}

export interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
}

export interface RevenueItem {
  id: string;
  description: string;
  amount: number;
}

export interface FinancialRecord {
  month: string;
  year: number;
  revenueItems: RevenueItem[];
  expenses: ExpenseItem[];
  invoicePath: string;
  lastUpdated: string;
}

export type ClientStatus = 'lead' | 'active' | 'churned';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  status: ClientStatus;
  notes: string;
  projects?: Project[];
}
