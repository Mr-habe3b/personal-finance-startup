import { TeamMembersTable } from '@/components/team-members-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { teamMembers } from '@/data/mock';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset } from '@/components/ui/sidebar';

export default function TeamPage() {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full flex-col">
                <AppSidebar />
                <SidebarInset>
                    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
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
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
