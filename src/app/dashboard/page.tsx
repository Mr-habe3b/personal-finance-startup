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
import { capTable, initialInvestment, teamMembers } from '@/data/mock';
import { Briefcase, Landmark, Users } from 'lucide-react';

export default function DashboardPage() {
  const totalEquityAllocated = teamMembers.reduce(
    (acc, member) => acc + member.equity,
    0
  );

  return (
      <div className="flex min-h-screen w-full flex-col">
        <AppHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                  <div className="text-2xl font-bold">{initialInvestment.teamMembersCount}</div>
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
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
              <Card>
                <CardHeader>
                  <CardTitle>Team Overview</CardTitle>
                  <CardDescription>
                    Manage and view your team's equity allocation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TeamMembersTable teamMembers={teamMembers} />
                </CardContent>
              </Card>
            </div>
          </main>
      </div>
  );
}
