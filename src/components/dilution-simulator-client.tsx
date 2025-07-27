
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  DilutionImpactInput,
  DilutionImpactOutput,
  simulateDilutionImpact,
} from '@/ai/flows/dilution-impact-simulator';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { CapTableChart } from './cap-table-chart';
import { Separator } from './ui/separator';

const formSchema = z.object({
  newInvestmentAmount: z.coerce.number().min(1, 'Investment amount is required.'),
  preMoneyValuation: z.coerce.number().min(1, 'Valuation is required.'),
  roundName: z.string().min(1, 'Round name is required.'),
});

interface DilutionSimulatorClientProps {
  currentCapTable: Record<string, number>;
}

export function DilutionSimulatorClient({ currentCapTable }: DilutionSimulatorClientProps) {
  const [result, setResult] = useState<DilutionImpactOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newInvestmentAmount: 1000000,
      preMoneyValuation: 5000000,
      roundName: 'Seed Round',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const input: DilutionImpactInput = {
      ...values,
      currentCapTable,
    };

    try {
      const response = await simulateDilutionImpact(input);
      setResult(response);
    } catch (error) {
      console.error('Error simulating dilution:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to simulate dilution. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Round Details</CardTitle>
          <CardDescription>Enter the terms of the new funding round.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="newInvestmentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Investment (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1,000,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preMoneyValuation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pre-Money Valuation (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 5,000,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roundName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Round Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Seed Round" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Simulate Impact
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <div className="space-y-8 lg:col-span-2">
        {isLoading && (
            <Card className="flex flex-col items-center justify-center p-8 h-full">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">AI is analyzing the impact...</p>
            </Card>
        )}
        {!isLoading && !result && (
            <Card className="flex flex-col items-center justify-center p-8 h-full">
                <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">Simulation Results</h3>
                <p className="text-muted-foreground text-center">Your dilution analysis will appear here.</p>
            </Card>
        )}
        {result && (
          <>
            <Card>
                <CardHeader>
                    <CardTitle>Simulation Results</CardTitle>
                    <CardDescription>{result.dilutionDetails}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">Post-Money Valuation</p>
                        <p className="text-2xl font-bold">₹{result.postMoneyValuation.toLocaleString()}</p>
                    </div>
                     <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">New Investor Stake</p>
                        <p className="text-2xl font-bold">{result.newCapTable["New Investor"]?.toFixed(2) ?? "0.00"}%</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Updated Cap Table</CardTitle>
                </CardHeader>
                <CardContent>
                    <CapTableChart capTable={result.newCapTable} />
                </CardContent>
            </Card>
             <Card className="bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="text-primary" />
                        Future Fundraising Considerations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-foreground/80">{result.futureFundraisingConsiderations}</p>
                </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
