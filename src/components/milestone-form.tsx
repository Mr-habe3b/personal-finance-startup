
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import type { Milestone, MilestoneCategory, TeamMember } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Check, ChevronsUpDown, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import { suggestMilestoneDetails } from '@/ai/flows/milestone-suggestion';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  dueDate: z.string().min(1, 'A due date is required.'),
  owner: z.array(z.string()).min(1, 'At least one owner is required.'),
  priority: z.enum(['low', 'medium', 'high']),
  category: z.enum(['task', 'daily', 'monthly', 'quarterly', 'yearly']),
  lastUpdateSummary: z.string().min(1, "Update summary is required."),
  updatedBy: z.string().min(1, "Updater's name is required."),
});

type MilestoneFormData = Omit<Milestone, 'id' | 'status' | 'lastUpdated'>;

interface MilestoneFormProps {
    milestone: Milestone | null;
    teamMembers: TeamMember[];
    isOpen: boolean;
    onClose: () => void;
    onSave: (milestone: MilestoneFormData, id?: string) => void;
    onDelete: (id: string) => void;
    isSheet?: boolean;
}

export function MilestoneForm({ milestone, teamMembers, isOpen, onClose, onSave, onDelete, isSheet = false }: MilestoneFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: '',
        description: '',
        owner: [],
        priority: 'medium',
        dueDate: '',
        category: 'task',
        lastUpdateSummary: '',
        updatedBy: '',
    },
  });

  const isEditMode = !!milestone;

  useEffect(() => {
    const defaultUser = teamMembers.length > 0 ? teamMembers[0].name : '';
    if (milestone) {
        form.reset({
            ...milestone,
            dueDate: milestone.dueDate.split('T')[0], // Format for date input
            lastUpdateSummary: '', // Clear for new update
            updatedBy: defaultUser,
        });
    } else {
        form.reset({
            title: '',
            description: '',
            owner: defaultUser ? [defaultUser] : [],
            priority: 'medium',
            dueDate: '',
            category: 'task',
            lastUpdateSummary: 'Created milestone.',
            updatedBy: defaultUser, 
        });
    }
  }, [milestone, form, isOpen, teamMembers])

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values, milestone?.id);
  };
  
  const handleDeleteClick = () => {
    if (milestone) {
      onDelete(milestone.id);
    }
  }

  const handleAIAssist = async () => {
    const title = form.getValues('title');
    if (!title) {
        toast({ variant: 'destructive', title: 'Title Required', description: 'Please enter a title for the AI to provide suggestions.' });
        return;
    }
    setIsGenerating(true);
    try {
        const result = await suggestMilestoneDetails({ title });
        form.setValue('description', result.description);
        
        const subTasksText = result.subTasks.map(task => `- ${task}`).join('\n');
        const newUpdateSummary = `AI-assisted creation. Sub-tasks:\n${subTasksText}`;
        form.setValue('lastUpdateSummary', newUpdateSummary);

        toast({ title: 'AI Suggestions Applied', description: 'Description and sub-tasks have been filled in.'});

    } catch (error) {
        console.error("AI suggestion failed:", error);
        toast({ variant: 'destructive', title: 'AI Error', description: 'Failed to generate suggestions.' });
    } finally {
        setIsGenerating(false);
    }
  }
  
  const FormContent = () => (
      <div className={cn("flex flex-col h-full", isSheet ? "" : "max-h-[80vh]")}>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle>{isEditMode ? 'Edit Milestone' : 'Add New Milestone'}</DialogTitle>
              <DialogDescription>
                  {isEditMode ? "Update the details for this milestone." : "Set a clear target for your team to work towards."}
              </DialogDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleAIAssist} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              AI Assist
            </Button>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <ScrollArea className="flex-1">
              <div className="space-y-4 pr-6 pl-1 py-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Launch Beta Version" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the milestone..." {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="owner"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Owner</FormLabel>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <FormControl>
                                            <Button variant="outline" className="w-full justify-between">
                                                <span className="truncate">{field.value?.join(', ') || 'Select owners'}</span>
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full">
                                        {teamMembers.map(member => (
                                            <DropdownMenuCheckboxItem
                                                key={member.id}
                                                checked={field.value?.includes(member.name)}
                                                onCheckedChange={(checked) => {
                                                    const newOwners = checked 
                                                        ? [...(field.value || []), member.name] 
                                                        : (field.value || []).filter(name => name !== member.name);
                                                    field.onChange(newOwners);
                                                }}
                                            >
                                                {member.name}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="task">Task</SelectItem>
                            <SelectItem value="daily">Daily Target</SelectItem>
                            <SelectItem value="monthly">Monthly Target</SelectItem>
                            <SelectItem value="quarterly">Quarterly Target</SelectItem>
                            <SelectItem value="yearly">Yearly Target</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                    control={form.control}
                    name="lastUpdateSummary"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Update Summary / Sub-tasks</FormLabel>
                        <FormControl>
                            <Textarea placeholder={isEditMode ? "What did you change?" : "Initial summary..."} {...field} rows={5} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                        control={form.control}
                        name="updatedBy"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Updated By</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select the user" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {teamMembers.map(member => (
                                            <SelectItem key={member.id} value={member.name}>{member.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
              </div>
            </ScrollArea>

            <DialogFooter className={cn(
              "flex-col-reverse sm:flex-row sm:justify-between sm:items-center w-full gap-4 pt-4 mt-auto",
               isSheet ? "border-t" : ""
            )}>
              <div>
                {isEditMode && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button type="button" variant="destructive" className="w-full sm:w-auto">
                            <Trash2 className="mr-2" />
                            Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this milestone.
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
              <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => { onClose(); form.reset(); }}>Cancel</Button>
                  <Button type="submit">{isEditMode ? 'Save Changes' : 'Add Milestone'}</Button>
              </div>
          </DialogFooter>
        </form>
      </Form>
    </div>
  )


  if (isSheet) {
    return <FormContent />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md lg:max-w-2xl">
        <FormContent />
      </DialogContent>
    </Dialog>
  );
}
