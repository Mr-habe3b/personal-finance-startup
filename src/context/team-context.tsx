
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { TeamMember } from '@/types';
import { teamMembers as initialTeamMembers } from '@/data/mock';

interface TeamContextType {
  teamMembers: TeamMember[];
  addMember: (member: TeamMember) => void;
  updateMember: (member: TeamMember) => void;
  deleteMember: (memberId: string) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);

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
    <TeamContext.Provider value={{ teamMembers, addMember, updateMember, deleteMember }}>
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
