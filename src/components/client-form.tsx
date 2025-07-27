
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Client, ClientStatus, Project, TeamMember } from '@/types';
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
import { CalendarClock, Check, ChevronsUpDown, Plus, Save, Trash2, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

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
  assignedTo: z.array(z.string()).optional(),
});

type ClientFormData = Omit<Client, 'id'>;

interface ClientFormProps {
    client: Client | null;
    teamMembers: TeamMember[];
    onSave: (data: ClientFormData, clientId?: string) => void;
    onDelete: (clientId: string) => void;
    onCancel: () => void;
    isOpen: boolean;
    isSheet?: boolean;
}

export function ClientForm({ client, teamMembers, onSave, onDelete, onCancel, isOpen, isSheet = false }: ClientFormProps) {
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
        assignedTo: [],
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
            assignedTo: [],
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

  const DesktopFormLayout = () => (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex-1 flex flex-col overflow-hidden">
             <div className="grid md:grid-cols-2 flex-1 gap-6 overflow-hidden">
                {/* Client Details Column */}
                <div className="flex flex-col overflow-hidden">
                    <h3 className="text-lg font-medium mb-4">Client Details</h3>
                    <ScrollArea className="flex-1 pr-4 -mr-4">
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
                                name="assignedTo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assigned To</FormLabel>
                                        <FormControl>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-between">
                                                        <span>{field.value?.join(', ') || 'Select team members'}</span>
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                                    {teamMembers.map(member => (
                                                        <DropdownMenuCheckboxItem
                                                            key={member.id}
                                                            checked={field.value?.includes(member.name)}
                                                            onCheckedChange={(checked) => {
                                                                const newValues = checked 
                                                                    ? [...(field.value || []), member.name] 
                                                                    : (field.value || []).filter(name => name !== member.name);
                                                                field.onChange(newValues);
                                                            }}
                                                        >
                                                            {member.name}
                                                        </DropdownMenuCheckboxItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="lead">Lead</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="churned">Churned</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                </div>

                {/* Projects Column */}
                <div className="flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Projects ({projects.length})</h3>
                        <Button type="button" size="sm" onClick={handleAddProject}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
                    </div>
                    <ScrollArea className="flex-1 pr-4 -mr-4">
                        <div className="space-y-4">
                                {projects.length > 0 ? projects.map(p => (
                                    <Card key={p.id}>
                                        <CardContent className="p-4 space-y-4">
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
                                        </CardContent>
                                    </Card>
                                )) : (
                                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                        <p>No projects yet.</p>
                                        <p className="text-sm">Click "Add Project" to begin.</p>
                                    </div>
                                )}
                        </div>
                    </ScrollArea>
                </div>
             </div>
             <DialogFooter className="flex-shrink-0 flex flex-col-reverse sm:flex-row sm:justify-between items-center w-full pt-4 border-t gap-2 mt-6">
                <div className={cn("w-full sm:w-auto", isEditMode ? "block" : "hidden")}>
                    {isEditMode && (
                        <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button type="button" variant="destructive" size={isSheet ? "icon" : "default"} className="w-full sm:w-auto">
                                <Trash2 />
                                <span className="sr-only sm:not-sr-only sm:ml-2">Delete Client</span>
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
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button type="button" variant="outline" onClick={onCancel} className="flex-1 sm:flex-initial">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 sm:flex-initial">
                      {isEditMode ? 'Save Changes' : 'Add Client'}
                    </Button>
                </div>
            </DialogFooter>
        </form>
    </Form>
  )

  const MobileFormLayout = () => (
    <Tabs defaultValue="details" className={cn("flex flex-col h-full", isSheet && "p-4")}>
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Client Details</TabsTrigger>
            <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
        </TabsList>
         <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex-1 flex flex-col overflow-hidden">
             <div className="flex-1 overflow-hidden">
                 <TabsContent value="details" className="h-full">
                     <ScrollArea className="h-full pr-4 -mr-4">
                        <div className="space-y-4 py-4">
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
                                name="assignedTo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assigned To</FormLabel>
                                         <FormControl>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    
                                                        <Button variant="outline" className="w-full justify-between">
                                                            <span>{field.value?.join(', ') || 'Select team members'}</span>
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                                    {teamMembers.map(member => (
                                                        <DropdownMenuCheckboxItem
                                                            key={member.id}
                                                            checked={field.value?.includes(member.name)}
                                                            onCheckedChange={(checked) => {
                                                                const newValues = checked 
                                                                    ? [...(field.value || []), member.name] 
                                                                    : (field.value || []).filter(name => name !== member.name);
                                                                field.onChange(newValues);
                                                            }}
                                                        >
                                                            {member.name}
                                                        </DropdownMenuCheckboxItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
                                 <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="lead">Lead</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="churned">Churned</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                 </TabsContent>
                 <TabsContent value="projects" className="h-full">
                      <div className="flex flex-col h-full overflow-hidden">
                            <div className="flex items-center justify-between py-4">
                                <h3 className="text-lg font-medium">Manage Projects</h3>
                                <Button type="button" size="sm" onClick={handleAddProject}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <ScrollArea className='h-full pr-4 -mr-4'>
                                    <div className="space-y-4">
                                            {projects.length > 0 ? projects.map(p => (
                                                <Card key={p.id}>
                                                    <CardContent className="p-4 space-y-4">
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
                                                    </CardContent>
                                                </Card>
                                            )) : (
                                                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                                    <p>No projects yet.</p>
                                                    <p className="text-sm">Click "Add Project" to begin.</p>
                                                </div>
                                            )}
                                    </div>
                                </ScrollArea>
                            </div>
                      </div>
                 </TabsContent>
            </div>
             <DialogFooter className="flex-shrink-0 flex flex-col-reverse sm:flex-row sm:justify-between items-center w-full pt-4 border-t gap-2">
                <div className={cn("w-full sm:w-auto", isEditMode ? "block" : "hidden")}>
                    {isEditMode && (
                        <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button type="button" variant="destructive" size={isSheet ? "icon" : "default"} className="w-full sm:w-auto">
                                <Trash2 />
                                <span className="sr-only sm:not-sr-only sm:ml-2">Delete Client</span>
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
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button type="button" variant="outline" onClick={onCancel} className="flex-1 sm:flex-initial" size={isSheet ? "icon" : "default"}>
                      <X />
                      <span className="sr-only sm:not-sr-only sm:ml-2">Cancel</span>
                    </Button>
                    <Button type="submit" className="flex-1 sm:flex-initial" size={isSheet ? "icon" : "default"}>
                      <Save />
                      <span className="sr-only sm:not-sr-only sm:ml-2">{isEditMode ? 'Save Changes' : 'Add Client'}</span>
                    </Button>
                </div>
            </DialogFooter>
          </form>
        </Form>
    </Tabs>
  );

  if (isSheet) {
      return <MobileFormLayout />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
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
        <DesktopFormLayout />
      </DialogContent>
    </Dialog>
  );
}
