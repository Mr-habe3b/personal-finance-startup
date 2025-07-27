
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
import { Edit, PlusCircle, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface TeamMembersTableProps {
  teamMembers: TeamMember[];
  onAddMember: () => void;
  onEditMember: (member: TeamMember) => void;
}

export function TeamMembersTable({ teamMembers, onAddMember, onEditMember }: TeamMembersTableProps) {
  const isMobile = useIsMobile();

  const AddMemberButton = () => (
    <Button onClick={onAddMember} size={isMobile ? "icon" : "default"}>
        <PlusCircle />
        <span className="sr-only md:not-sr-only md:ml-2">Add Member</span>
    </Button>
  );

  return (
    <div>
        <div className="flex justify-end mb-4">
           {isMobile ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AddMemberButton />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Member</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
           ) : (
              <AddMemberButton />
           )}
        </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Commitment</TableHead>
            <TableHead className="hidden sm:table-cell">Vesting</TableHead>
            <TableHead className="text-right">Equity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
               <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditMember(member)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
