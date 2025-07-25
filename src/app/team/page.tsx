import { AppHeader } from '@/components/app-header';
import { TeamMembersTable } from '@/components/team-members-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { teamMembers } from '@/data/mock';

export default function TeamPage() {
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
                        <TeamMembersTable teamMembers={teamMembers} />
                    </CardContent>
                </Card>
            </main>
        </>
    );
}
