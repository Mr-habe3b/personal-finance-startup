
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TeamMember } from '@/types';
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
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  role: z.string().min(1, 'Role is required.'),
  commitment: z.enum(['Full-time', 'Part-time']),
  equity: z.coerce.number().min(0, 'Equity cannot be negative.').max(100, 'Equity cannot exceed 100.'),
});

type MemberFormData = Omit<TeamMember, 'id' | 'vesting'>;

interface TeamMemberFormProps {
    member: TeamMember | null;
    onSave: (data: MemberFormData, memberId?: string) => void;
    onDelete: (memberId: string) => void;
    onCancel: () => void;
    isOpen: boolean;
}

export function TeamMemberForm({ member, onSave, onDelete, onCancel, isOpen }: TeamMemberFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: '',
        role: '',
        commitment: 'Full-time',
        equity: 0,
    },
  });

  useEffect(() => {
    if (member) {
        form.reset({
            name: member.name,
            role: member.role,
            commitment: member.commitment,
            equity: member.equity,
        });
    } else {
        form.reset({
            name: '',
            role: '',
            commitment: 'Full-time',
            equity: 0,
        });
    }
  }, [member, form, isOpen]);


  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values, member?.id);
  };

  const handleDeleteClick = () => {
    if (member) {
        onDelete(member.id);
    }
  }

  const isEditMode = !!member;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Team Member' : 'Add New Member'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? `Update the details for ${member.name}.` : 'Enter the details for the new team member.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Alex Johnson" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., CEO & Co-founder" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="commitment"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Commitment</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select commitment" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Full-time">Full-time</SelectItem>
                                <SelectItem value="Part-time">Part-time</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                control={form.control}
                name="equity"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Equity (%)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 40" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
           
             <DialogFooter className="flex justify-between items-center sm:justify-between w-full pt-4">
                <div>
                  {isEditMode && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button type="button" variant="destructive">
                              <Trash2 className="mr-2" />
                              Delete Member
                           </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete {member?.name} from the team.
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
                    <Button type="submit">{isEditMode ? 'Save Changes' : 'Add Member'}</Button>
                </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
