
import { z } from 'zod';

// Team and Equity
export const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required.'),
  role: z.string().min(1, 'Role is required.'),
  commitment: z.enum(['Full-time', 'Part-time']),
  equity: z.coerce.number().min(0).max(100),
  vesting: z.string().min(1, 'Vesting schedule is required.'),
});

// Clients and Projects
export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Project name is required.'),
  description: z.string().optional(),
  status: z.enum(['planning', 'active', 'completed', 'on-hold']),
  deadline: z.string().optional(),
  details: z.string().optional(),
});

export const clientSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Contact name is required.'),
  company: z.string().min(1, 'Company name is required.'),
  email: z.string().email('Invalid email address.'),
  status: z.enum(['lead', 'active', 'churned']),
  notes: z.string().optional(),
  projects: z.array(projectSchema).optional(),
  assignedTo: z.array(z.string()).optional(),
});

// Fundraising
export const fundraisingDealSchema = z.object({
  id: z.string(),
  investor: z.string().min(1, 'Investor name is required.'),
  amount: z.coerce.number().min(1),
  stage: z.enum(['lead', 'pitched', 'term-sheet', 'closed']),
  contact: z.string().email(),
});

// Financials
export const revenueItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required.'),
  amount: z.coerce.number().min(0),
});

export const expenseItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required.'),
  amount: z.coerce.number().min(0),
});

export const financialRecordSchema = z.object({
  month: z.string().min(1),
  year: z.coerce.number(),
  revenueItems: z.array(revenueItemSchema),
  expenses: z.array(expenseItemSchema),
  invoicePath: z.string().url().or(z.string().startsWith('/')),
  lastUpdated: z.string().datetime(),
});

// Documents
export const documentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['Legal', 'Sales', 'RFQ']),
  dateAdded: z.string(),
  path: z.string(),
});

// Milestones
export const milestoneSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  dueDate: z.string(),
  status: z.enum(['todo', 'inprogress', 'done']),
  owner: z.array(z.string()).min(1, 'At least one owner is required.'),
  priority: z.enum(['low', 'medium', 'high']),
  category: z.enum(['task', 'daily', 'monthly', 'quarterly', 'yearly']),
  lastUpdated: z.string().datetime(),
  updatedBy: z.string(),
  lastUpdateSummary: z.string(),
});

// Wiki
export const wikiPageSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Title is required'),
    content: z.string(),
});

// Auth
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});
