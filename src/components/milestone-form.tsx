
'use client';

import { useEffect } from 'react';
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
import type { Milestone, MilestoneCategory } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  dueDate: z.string().min(1, 'A due date is required.'),
  owner: z.string().min(1, 'Owner is required.'),
  priority: z.enum(['low', 'medium', 'high']),
  category: z.enum(['task', 'daily', 'monthly', 'quarterly', 'yearly']),
  lastUpdateSummary: z.string().min(1, "Update summary is required."),
  updatedBy: z.string().min(1, "Updater's name is required."),
});

type MilestoneFormData = Omit<Milestone, 'id' | 'status' | 'lastUpdated'>;

interface MilestoneFormProps {
    milestone: Milestone | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (milestone: MilestoneFormData, id?: string) => void;
    onDelete: (id: string) => void;
    isSheet?: boolean;
}

export function MilestoneForm({ milestone, isOpen, onClose, onSave, onDelete, isSheet = false }: MilestoneFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: '',
        description: '',
        owner: '',
        priority: 'medium',
        dueDate: '',
        category: 'task',
        lastUpdateSummary: '',
        updatedBy: '',
    },
  });

  const isEditMode = !!milestone;

  useEffect(() => {
    if (milestone) {
        form.reset({
            ...milestone,
            dueDate: milestone.dueDate.split('T')[0], // Format for date input
            lastUpdateSummary: '', // Clear for new update
            updatedBy: '', // Clear for new updater
        });
    } else {
        form.reset({
            title: '',
            description: '',
            owner: '',
            priority: 'medium',
            dueDate: '',
            category: 'task',
            lastUpdateSummary: 'Created milestone.',
            updatedBy: 'User', // Replace with actual user later
        });
    }
  }, [milestone, form, isOpen])

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values, milestone?.id);
  };
  
  const handleDeleteClick = () => {
    if (milestone) {
      onDelete(milestone.id);
    }
  }
  
  const FormContent = () => (
      <>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Milestone' : 'Add New Milestone'}</DialogTitle>
          <DialogDescription>
              {isEditMode ? "Update the details for this milestone." : "Set a clear target for your team to work towards."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className={cn("flex flex-col", isSheet ? "h-full" : "")}>
            <ScrollArea className={cn(isSheet ? "flex-1 -mr-6" : "")}>
              <div className={cn("space-y-4", isSheet ? "pr-6" : "")}>
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
                        <Textarea placeholder="Describe the milestone..." {...field} />
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
                        <FormControl>
                          <Input placeholder="e.g., Alex Johnson" {...field} />
                        </FormControl>
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
                        <FormLabel>Update Summary</FormLabel>
                        <FormControl>
                            <Textarea placeholder={isEditMode ? "What did you change?" : "Initial summary..."} {...field} />
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
                        <FormControl>
                            <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              </div>
            </ScrollArea>

            <DialogFooter className={cn(
              "flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center w-full gap-4",
               isSheet ? "mt-auto pt-4 border-t -mr-6 pr-6" : "pt-4"
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
    </>
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
