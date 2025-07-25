
'use client';

import { AppHeader } from '@/components/app-header';
import { CapTableChart } from '@/components/cap-table-chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TeamMembersTable } from '@/components/team-members-table';
import { capTable, initialInvestment } from '@/data/mock';
import { Briefcase, Landmark, Users } from 'lucide-react';
import { useTeam } from '@/context/team-context';
import { useState } from 'react';
import { TeamMemberForm } from '@/components/team-member-form';
import type { TeamMember } from '@/types';


export default function DashboardPage() {
  const { teamMembers, addMember, updateMember } = useTeam();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const totalEquityAllocated = teamMembers.reduce(
    (acc, member) => acc + member.equity,
    0
  );

  const handleAddMemberClick = () => {
    setSelectedMember(null);
    setIsFormOpen(true);
  };

  const handleEditMemberClick = (member: TeamMember) => {
      setSelectedMember(member);
      setIsFormOpen(true);
  };

  const handleSaveMember = (memberData: Omit<TeamMember, 'id' | 'vesting'>, memberId?: string) => {
      if (memberId) {
          updateMember({ ...memberData, id: memberId, vesting: '4y/1y cliff' });
      } else {
          addMember({
              id: `member-${Date.now()}`,
              ...memberData,
              vesting: '4y/1y cliff',
          });
      }
      setIsFormOpen(false);
  };

  const handleDeleteMember = (memberId: string) => {
    // Note: The useTeam hook does not expose a delete function in this implementation.
    // To add delete functionality, you would need to expose it from the context.
    console.log("Delete functionality not implemented in this context provider version.");
    setIsFormOpen(false);
  };

  const handleCancel = () => {
      setIsFormOpen(false);
      setSelectedMember(null);
  }


  return (
      <>
        <AppHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Invested
                  </CardTitle>
                  <Landmark className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${initialInvestment.totalInvested.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Initial founder investment
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teamMembers.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalEquityAllocated}% of equity allocated
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ESOP</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{initialInvestment.esopPool}%</div>
                  <p className="text-xs text-muted-foreground">
                    Employee stock ownership plan
                  </p>
                </CardContent>
              </Card>
               <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                  <Landmark className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                   <p className="text-xs text-muted-foreground">
                    In active fundraising pipeline
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle>Team Overview</CardTitle>
                  <CardDescription>
                    Manage and view your team's equity allocation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TeamMembersTable 
                    teamMembers={teamMembers} 
                    onAddMember={handleAddMemberClick}
                    onEditMember={handleEditMemberClick}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Cap Table</CardTitle>
                  <CardDescription>
                    Current company ownership structure.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CapTableChart capTable={capTable} />
                </CardContent>
              </Card>
            </div>
          </main>
           {isFormOpen && (
                <TeamMemberForm
                    key={selectedMember?.id || 'new'}
                    member={selectedMember}
                    onSave={handleSaveMember}
                    onDelete={handleDeleteMember}
                    onCancel={handleCancel}
                    isOpen={isFormOpen}
                />
            )}
      </>
  );
}
