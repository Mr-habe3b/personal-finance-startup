
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Client, ClientStatus, Project } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { CalendarClock, Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Project name is required.'),
  description: z.string().optional(),
  status: z.enum(['planning', 'active', 'completed', 'on-hold']),
  deadline: z.string().optional(),
  details: z.string().optional(),
});

const formSchema = z.object({
  name: z.string().min(1, 'Contact name is required.'),
  company: z.string().min(1, 'Company name is required.'),
  email: z.string().email('Invalid email address.'),
  status: z.enum(['lead', 'active', 'churned']),
  notes: z.string().optional(),
  projects: z.array(projectSchema).optional(),
});

type ClientFormData = Omit<Client, 'id'>;

interface ClientFormProps {
    client: Client | null;
    onSave: (data: ClientFormData, clientId?: string) => void;
    onDelete: (clientId: string) => void;
    onCancel: () => void;
    isOpen: boolean;
}

export function ClientForm({ client, onSave, onDelete, onCancel, isOpen }: ClientFormProps) {
  const [projects, setProjects] = useState<Project[]>(client?.projects || []);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: '',
        company: '',
        email: '',
        status: 'lead',
        notes: '',
        projects: [],
    },
  });

    const upcomingDeadline = useMemo(() => {
        const upcomingDeadlines = projects
            .filter(p => p.deadline && new Date(p.deadline) >= new Date())
            .map(p => new Date(p.deadline!))
            .sort((a, b) => a.getTime() - b.getTime());

        return upcomingDeadlines.length > 0 ? format(upcomingDeadlines[0], 'PP') : null;
    }, [projects]);


  useEffect(() => {
    if (client) {
        const clientData = {
            ...client,
            projects: client.projects?.map(p => ({
                ...p,
                deadline: p.deadline ? p.deadline.split('T')[0] : '',
            }))
        };
        form.reset(clientData);
        setProjects(client.projects || []);
    } else {
        form.reset({
            name: '',
            company: '',
            email: '',
            status: 'lead',
            notes: '',
            projects: [],
        });
        setProjects([]);
    }
  }, [client, form, isOpen]);


  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({...values, projects}, client?.id);
  };

  const handleDeleteClick = () => {
    if (client) {
        onDelete(client.id);
    }
  }

  const handleAddProject = () => {
    setProjects(prev => [...prev, {id: `proj-${Date.now()}`, name: "New Project", description: "", status: 'planning'}]);
  }
  
  const handleProjectChange = (projectId: string, field: keyof Project, value: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? {...p, [field]: value} : p));
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  }

  const isEditMode = !!client;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-4xl flex flex-col max-h-[90vh]">
        <DialogHeader>
            <div className='flex justify-between items-start'>
                <div>
                    <DialogTitle>{isEditMode ? 'Edit Client' : 'Add New Client'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode ? `Update the details for ${client.company}.` : 'Enter the details for the new client.'}
                    </DialogDescription>
                </div>
                 {isEditMode && upcomingDeadline && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground border rounded-lg px-3 py-2 mt-0 shrink-0">
                        <CalendarClock className="h-4 w-4" />
                        <div>
                            <span>Upcoming Deadline: </span>
                            <span className="font-semibold text-foreground">{upcomingDeadline}</span>
                        </div>
                    </div>
                )}
            </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex-1 flex flex-col overflow-hidden">
             <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 overflow-hidden py-4">
                <ScrollArea className="pr-4">
                    <div className="space-y-4">
                        <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Acme Inc." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="lead">Lead</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="churned">Churned</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Contact Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Jane Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Contact Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="e.g., jane@acme.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Add any relevant notes here..." {...field} rows={5} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                </ScrollArea>
                <div className="flex flex-col overflow-hidden">
                    <Card className='flex flex-col flex-1 overflow-hidden'>
                        <CardHeader className='p-4 border-b'>
                        <div className="flex items-center justify-between">
                            <CardTitle className='text-lg'>Projects</CardTitle>
                            <Button type="button" size="sm" onClick={handleAddProject}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
                        </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-hidden">
                             <ScrollArea className='h-full p-4'>
                                <div className="space-y-4">
                                        {projects.length > 0 ? projects.map(p => (
                                            <div key={p.id} className="p-4 border rounded-lg space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Input 
                                                        value={p.name} 
                                                        onChange={(e) => handleProjectChange(p.id, 'name', e.target.value)} 
                                                        className="text-base font-semibold border-none shadow-none focus-visible:ring-0 p-0"
                                                    />
                                                    <Button type="button" size="icon" variant="ghost" onClick={() => handleDeleteProject(p.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <Textarea 
                                                    placeholder="Project description..." 
                                                    value={p.description}
                                                    onChange={(e) => handleProjectChange(p.id, 'description', e.target.value)}
                                                />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Select value={p.status} onValueChange={(value) => handleProjectChange(p.id, 'status', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="planning">Planning</SelectItem>
                                                            <SelectItem value="active">Active</SelectItem>
                                                            <SelectItem value="completed">Completed</SelectItem>
                                                            <SelectItem value="on-hold">On Hold</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Input 
                                                        type="date"
                                                        value={p.deadline ? p.deadline.split('T')[0] : ''}
                                                        onChange={(e) => handleProjectChange(p.id, 'deadline', e.target.value)}
                                                    />
                                                </div>
                                                <Textarea 
                                                    placeholder="Client demands, review meeting notes, etc." 
                                                    value={p.details}
                                                    onChange={(e) => handleProjectChange(p.id, 'details', e.target.value)}
                                                    rows={3}
                                                />
                                            </div>
                                        )) : (
                                            <div className="text-center py-8 text-muted-foreground">No projects yet.</div>
                                        )}
                                </div>
                             </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
             <DialogFooter className="flex-shrink-0 flex flex-col-reverse sm:flex-row sm:justify-between items-center w-full pt-4 border-t">
                <div>
                    {isEditMode && (
                        <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button type="button" variant="destructive">
                                <Trash2 className="mr-2" />
                                Delete Client
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete {client?.company}.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteClick}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">{isEditMode ? 'Save Changes' : 'Add Client'}</Button>
                </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
