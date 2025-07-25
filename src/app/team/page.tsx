
'use client';

import { AppHeader } from '@/components/app-header';
import { TeamMembersTable } from '@/components/team-members-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { teamMembers as initialTeamMembers } from '@/data/mock';
import type { TeamMember } from '@/types';
import { useState } from 'react';
import { TeamMemberForm } from '@/components/team-member-form';


export default function TeamPage() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

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
            // Update existing member
             setTeamMembers(currentMembers => 
                currentMembers.map(m => m.id === memberId ? { ...m, ...memberData } : m)
            );
        } else {
             // Add new member
            const newMember: TeamMember = {
                id: `member-${Date.now()}`,
                ...memberData,
                vesting: '4y/1y cliff', // Default vesting
            };
            setTeamMembers(currentMembers => [...currentMembers, newMember]);
        }
        setIsFormOpen(false);
    };

    const handleDeleteMember = (memberId: string) => {
        setTeamMembers(currentMembers => currentMembers.filter(m => m.id !== memberId));
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
                <Card>
                    <CardHeader>
                        <CardTitle>Team Management</CardTitle>
                        <CardDescription>
                            Add, view, and manage your team members and their equity stakes.
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
