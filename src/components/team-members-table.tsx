
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
import { Edit, MoreHorizontal, PlusCircle, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

interface TeamMembersTableProps {
  teamMembers: TeamMember[];
  onAddMember: () => void;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (memberId: string) => void;
}

export function TeamMembersTable({
  teamMembers,
  onAddMember,
  onEditMember,
  onDeleteMember,
}: TeamMembersTableProps) {
  const isMobile = useIsMobile();

  const AddMemberButton = () => (
    <Button onClick={onAddMember} size={isMobile ? 'icon' : 'default'}>
      <PlusCircle />
      <span className="sr-only md:not-sr-only md:ml-2">Add Member</span>
    </Button>
  );

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
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
        </div>
        {teamMembers.map((member) => (
          <Card key={member.id} className="w-full">
            <div onClick={() => onEditMember(member)} className="cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`https://placehold.co/40x40.png`}
                        alt="Avatar"
                        data-ai-hint="person"
                      />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
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
                </div>
              </CardHeader>
              <CardContent>
                  <div className="flex justify-between text-sm">
                      <div className="text-muted-foreground">Commitment</div>
                      <Badge
                        variant={
                          member.commitment === 'Full-time' ? 'default' : 'secondary'
                        }
                      >
                        {member.commitment}
                      </Badge>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                      <div className="text-muted-foreground">Vesting</div>
                      <div>{member.vesting}</div>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                      <div className="text-muted-foreground">Equity</div>
                      <div className="font-medium">{member.equity}%</div>
                  </div>
              </CardContent>
            </div>
             <CardFooter className="flex justify-end pt-2 pb-3 px-4">
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="h-4 w-4" />
                          </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete {member.name}.
                              </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDeleteMember(member.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
              </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

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
      <div className="overflow-x-auto">
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
                      <AvatarImage
                        src={`https://placehold.co/40x40.png`}
                        alt="Avatar"
                        data-ai-hint="person"
                      />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {member.role}
                      </div>
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
                <TableCell className="hidden sm:table-cell">
                  {member.vesting}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {member.equity}%
                </TableCell>
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
    </div>
  );
}
