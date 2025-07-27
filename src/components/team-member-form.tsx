
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
import { Save, Trash2, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  role: z.string().min(1, 'Role is required.'),
  commitment: z.enum(['Full-time', 'Part-time']),
  equity: z.coerce.number().min(0, 'Equity cannot be negative.').max(100, 'Equity cannot exceed 100.'),
  vesting: z.string().min(1, 'Vesting schedule is required.'),
});

type MemberFormData = Omit<TeamMember, 'id'>;

interface TeamMemberFormProps {
    member: TeamMember | null;
    onSave: (data: MemberFormData, memberId?: string) => void;
    onDelete: (memberId: string) => void;
    onCancel: () => void;
    isOpen: boolean;
    isMobile?: boolean;
}

export function TeamMemberForm({ member, onSave, onDelete, onCancel, isOpen, isMobile = false }: TeamMemberFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: '',
        role: '',
        commitment: 'Full-time',
        equity: 0,
        vesting: '4y/1y cliff',
    },
  });

  useEffect(() => {
    if (member) {
        form.reset({
            name: member.name,
            role: member.role,
            commitment: member.commitment,
            equity: member.equity,
            vesting: member.vesting,
        });
    } else {
        form.reset({
            name: '',
            role: '',
            commitment: 'Full-time',
            equity: 0,
            vesting: '4y/1y cliff',
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

  const FormBody = () => (
     <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className={cn("flex flex-col h-full", isMobile ? "p-4 pt-0" : "")}>
            <ScrollArea className="flex-1 -mx-4 px-4">
                <div className="space-y-4 py-4">
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
                    <FormField
                        control={form.control}
                        name="vesting"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Vesting Schedule</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., 4y/1y cliff" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>
            </ScrollArea>
            <DialogFooter className={cn(
                "pt-4",
                isMobile 
                    ? "flex-col-reverse sm:flex-row sm:justify-between items-center w-full gap-2 border-t" 
                    : "flex justify-between items-center w-full"
            )}>
                <div>
                  {isEditMode && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button type="button" variant="destructive" size={isMobile ? "icon" : "default"}>
                              <Trash2 />
                              <span className="sr-only sm:not-sr-only sm:ml-2">Delete Member</span>
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
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button type="button" variant="outline" onClick={onCancel} className="flex-1 sm:flex-initial" size={isMobile ? "icon" : "default"}>
                        <X />
                        <span className="sr-only sm:not-sr-only sm:ml-2">Cancel</span>
                    </Button>
                    <Button type="submit" className="flex-1 sm:flex-initial" size={isMobile ? "icon" : "default"}>
                        <Save />
                        <span className="sr-only sm:not-sr-only sm:ml-2">{isEditMode ? 'Save Changes' : 'Add Member'}</span>
                    </Button>
                </div>
            </DialogFooter>
          </form>
        </Form>
  );


  if (isMobile) {
      return <FormBody />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Team Member' : 'Add New Member'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? `Update the details for ${member.name}.` : 'Enter the details for the new team member.'}
          </DialogDescription>
        </DialogHeader>
       <FormBody />
      </DialogContent>
    </Dialog>
  );
}
