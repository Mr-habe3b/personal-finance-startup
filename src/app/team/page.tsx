import { AppHeader } from '@/components/app-header';
import { TeamMembersTable } from '@/components/team-members-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { teamMembers } from '@/data/mock';

export default function TeamPage() {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <AppHeader />
            <main className="flex-1 p-4 sm:px-6 sm:py-8 md:gap-8">
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
        </div>
    );
}
