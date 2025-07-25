
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FundraisingDeal } from '@/types';
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

const formSchema = z.object({
  investor: z.string().min(1, 'Investor name is required.'),
  amount: z.coerce.number().min(1, 'Amount is required.'),
  contact: z.string().email('Invalid email address.').min(1, 'Contact email is required.'),
});

type DealFormData = Omit<FundraisingDeal, 'id' | 'stage'>;

interface DealFormProps {
    deal: FundraisingDeal | null;
    onSave: (data: DealFormData, dealId?: string) => void;
    onDelete: (dealId: string) => void;
    onCancel: () => void;
    isOpen: boolean;
}

export function DealForm({ deal, onSave, onDelete, onCancel, isOpen }: DealFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        investor: '',
        amount: 0,
        contact: '',
    },
  });

  useEffect(() => {
    if (deal) {
        form.reset({
            investor: deal.investor,
            amount: deal.amount,
            contact: deal.contact,
        });
    } else {
        form.reset({
            investor: '',
            amount: 0,
            contact: '',
        });
    }
  }, [deal, form, isOpen]);


  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values, deal?.id);
  };

  const handleDeleteClick = () => {
    if (deal) {
        onDelete(deal.id);
    }
  }

  const isEditMode = !!deal;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Deal' : 'Add New Deal'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? `Update the details for the deal with ${deal.investor}.` : 'Enter the details for the new deal.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="investor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investor</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sequoia Capital" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 2,000,000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g., rori@sequoia.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <DialogFooter className="flex justify-between items-center sm:justify-between w-full">
                <div>
                  {isEditMode && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button type="button" variant="destructive" size="icon">
                              <Trash2 />
                              <span className="sr-only">Delete Deal</span>
                           </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the deal with {deal?.investor}.
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
                    <Button type="submit">{isEditMode ? 'Save Changes' : 'Add Deal'}</Button>
                </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
