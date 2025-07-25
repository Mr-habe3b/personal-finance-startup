import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TeamMembersTable } from '@/components/team-members-table';
import { CapTableChart } from '@/components/cap-table-chart';
import { teamMembers, capTable, initialInvestment } from '@/data/mock';
import { Landmark, Users, Briefcase } from 'lucide-react';

export default function DashboardPage() {
  const totalEquityAllocated = teamMembers.reduce(
    (acc, member) => acc + member.equity,
    0
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
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
      <div className="grid grid-cols-1 gap-8">
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
    </div>
  );
}
