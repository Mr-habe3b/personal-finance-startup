
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
import { Edit, FolderKanban, MoreHorizontal, CalendarClock } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { format } from 'date-fns';

interface ClientTableProps {
  clients: Client[];
  onEditClient: (client: Client) => void;
}

export function ClientTable({ clients, onEditClient }: ClientTableProps) {

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
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden sm:table-cell">Projects</TableHead>
            <TableHead className="hidden lg:table-cell">Upcoming Deadline</TableHead>
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
                <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <FolderKanban className="h-4 w-4" />
                        <span>{client.projects?.length || 0}</span>
                    </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
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

