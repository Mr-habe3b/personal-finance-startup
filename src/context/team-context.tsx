
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { TeamMember } from '@/types';
import { teamMembers as initialTeamMembers, capTable as initialCapTable } from '@/data/mock';

interface TeamContextType {
  teamMembers: TeamMember[];
  capTable: Record<string, number>;
  addMember: (member: TeamMember) => void;
  updateMember: (member: TeamMember) => void;
  deleteMember: (memberId: string) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [capTable, setCapTable] = useState<Record<string, number>>(initialCapTable);

  useEffect(() => {
    const newCapTable: Record<string, number> = {};
    let totalAllocatedEquity = 0;

    teamMembers.forEach(member => {
        const key = member.role.includes('Founder') ? `${member.name} (Founder)` : member.name;
        newCapTable[key] = member.equity;
        totalAllocatedEquity += member.equity;
    });

    const esopPool = 100 - totalAllocatedEquity;
    newCapTable['ESOP'] = esopPool;

    setCapTable(newCapTable);

  }, [teamMembers]);

  const addMember = (member: TeamMember) => {
    setTeamMembers(prev => [...prev, member]);
  };

  const updateMember = (updatedMember: TeamMember) => {
    setTeamMembers(prev => prev.map(m => (m.id === updatedMember.id ? updatedMember : m)));
  };

  const deleteMember = (memberId: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== memberId));
  };

  return (
    <TeamContext.Provider value={{ teamMembers, capTable, addMember, updateMember, deleteMember }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = (): TeamContextType => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};
