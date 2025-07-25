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
