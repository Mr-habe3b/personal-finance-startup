
'use client';

import { TeamMembersTable } from '@/components/team-members-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { TeamMember } from '@/types';
import { useState } from 'react';
import { TeamMemberForm } from '@/components/team-member-form';
import { useTeam } from '@/context/team-context';


export default function TeamPage() {
    const { teamMembers, addMember, updateMember, deleteMember } = useTeam();
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

    const handleSaveMember = (memberData: Omit<TeamMember, 'id'>, memberId?: string) => {
        if (memberId) {
            const existingMember = teamMembers.find(m => m.id === memberId);
            if (existingMember) {
                updateMember({ ...existingMember, ...memberData, id: memberId });
            }
        } else {
             // Add new member
            const newMember: TeamMember = {
                id: `member-${Date.now()}`,
                ...memberData,
            };
            addMember(newMember);
        }
        setIsFormOpen(false);
    };

    const handleDeleteMember = (memberId: string) => {
        deleteMember(memberId);
        setIsFormOpen(false);
    };

    const handleCancel = () => {
        setIsFormOpen(false);
        setSelectedMember(null);
    }

    return (
        <>
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
