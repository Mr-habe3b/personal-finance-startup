
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
import type { Client, Project } from '@/types';
import { Edit, FolderKanban, MoreHorizontal, CalendarClock, Users, Mail, Building, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ClientTableProps {
  clients: Client[];
  onEditClient: (client: Client) => void;
}

export function ClientTable({ clients, onEditClient }: ClientTableProps) {
  const isMobile = useIsMobile();

  const getStatusVariant = (status: Client['status']) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'lead':
        return 'secondary';
      case 'churned':
        return 'destructive';
      default:
        return 'outline';
    }
  }

  const getUpcomingDeadline = (projects: Project[] = []) => {
      const upcomingDeadlines = projects
        .filter(p => p.deadline && new Date(p.deadline) >= new Date())
        .map(p => new Date(p.deadline!))
        .sort((a, b) => a.getTime() - b.getTime());

      return upcomingDeadlines.length > 0 ? format(upcomingDeadlines[0], 'PP') : null;
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {clients.map((client) => {
          const upcomingDeadline = getUpcomingDeadline(client.projects);
          return (
             <Card key={client.id} onClick={() => onEditClient(client)} className="cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-semibold">{client.company}</CardTitle>
                    <Badge variant={getStatusVariant(client.status)} className="capitalize">{client.status}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground space-y-2">
                        <div className="flex items-center gap-2">
                           <User className="h-4 w-4" />
                           <span>{client.name}</span>
                        </div>
                         <div className="flex items-center gap-2">
                           <Mail className="h-4 w-4" />
                           <span>{client.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FolderKanban className="h-4 w-4" />
                            <span>{client.projects?.length || 0} Projects</span>
                        </div>
                        {upcomingDeadline && (
                            <div className="flex items-center gap-2 pt-1">
                               <CalendarClock className="h-4 w-4" />
                               <span>Next Deadline: {upcomingDeadline}</span>
                            </div>
                        )}
                         <div className="flex items-center gap-2 pt-1">
                            <Users className="h-4 w-4" />
                            <span>{client.assignedTo?.join(', ') || 'Unassigned'}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
          )
        })}
         {clients.length === 0 && (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No clients added yet.</p>
            </div>
        )}
      </div>
    )
  }
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
            <TableHead className="hidden sm:table-cell">Projects</TableHead>
            <TableHead>Upcoming Deadline</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => {
            const upcomingDeadline = getUpcomingDeadline(client.projects);
            return (
                <TableRow key={client.id}>
                <TableCell>
                    <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarFallback>{client.company.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{client.company}</div>
                        <div className="text-sm text-muted-foreground">{client.name}</div>
                    </div>
                    </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    <Badge variant={getStatusVariant(client.status)} className="capitalize">
                    {client.status}
                    </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center -space-x-2">
                      {client.assignedTo && client.assignedTo.length > 0 ? (
                        client.assignedTo.map(name => (
                          <TooltipProvider key={name}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                  <Avatar className="h-7 w-7 border-2 border-background">
                                      <AvatarImage src={`https://placehold.co/32x32.png`} alt={name} data-ai-hint="person" />
                                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">Unassigned</span>
                      )}
                    </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <FolderKanban className="h-4 w-4" />
                        <span>{client.projects?.length || 0}</span>
                    </div>
                </TableCell>
                <TableCell>
                    {upcomingDeadline ? (
                        <div className="flex items-center gap-2">
                           <CalendarClock className="h-4 w-4 text-muted-foreground" />
                           <span>{upcomingDeadline}</span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground">N/A</span>
                    )}
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
                            <DropdownMenuItem onClick={() => onEditClient(client)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
                </TableRow>
            );
          })}
        </TableBody>
      </Table>
       {clients.length === 0 && (
          <div className="text-center py-12">
              <p className="text-muted-foreground">No clients added yet.</p>
          </div>
      )}
    </div>
  );
}
