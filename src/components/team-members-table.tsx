'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { TeamMember } from '@/types';
import { PlusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface TeamMembersTableProps {
  teamMembers: TeamMember[];
}

export function TeamMembersTable({ teamMembers }: TeamMembersTableProps) {
  return (
    <div>
        <div className="flex justify-end mb-4">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Member
            </Button>
        </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Commitment</TableHead>
            <TableHead className="hidden sm:table-cell">Vesting</TableHead>
            <TableHead className="text-right">Equity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://placehold.co/40x40.png`} alt="Avatar" data-ai-hint="person" />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.role}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge
                  variant={
                    member.commitment === 'Full-time' ? 'default' : 'secondary'
                  }
                >
                  {member.commitment}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">{member.vesting}</TableCell>
              <TableCell className="text-right font-medium">{member.equity}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
