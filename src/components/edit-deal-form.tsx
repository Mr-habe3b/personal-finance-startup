
'use client';

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
    DialogClose,
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

const formSchema = z.object({
  investor: z.string().min(1, 'Investor name is required.'),
  amount: z.coerce.number().min(1, 'Amount is required.'),
  contact: z.string().email('Invalid email address.').min(1, 'Contact email is required.'),
});

interface EditDealFormProps {
    deal: FundraisingDeal;
    onSave: (deal: FundraisingDeal) => void;
    onCancel: () => void;
    isOpen: boolean;
}

export function EditDealForm({ deal, onSave, onCancel, isOpen }: EditDealFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        investor: deal.investor,
        amount: deal.amount,
        contact: deal.contact,
    },
  });

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({
        ...deal,
        ...values,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Deal</DialogTitle>
          <DialogDescription>Update the details for the deal with {deal.investor}.</DialogDescription>
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
             <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

