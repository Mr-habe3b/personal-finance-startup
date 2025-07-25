'use server';
/**
 * @fileOverview AI-powered financial analysis for generating insights from records.
 *
 * - analyzeFinancials - Analyzes historical financial data to identify trends.
 * - FinancialAnalysisInput - The input type for the analyzeFinancials function.
 * - FinancialAnalysisOutput - The return type for the analyzeFinancials function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import type { FinancialRecord } from '@/types';

const FinancialAnalysisInputSchema = z.object({
    financialRecords: z.any().describe('An array of financial records for the company.')
});

export type FinancialAnalysisInput = {
    financialRecords: FinancialRecord[];
}

const FinancialAnalysisOutputSchema = z.object({
  keyTrends: z.array(z.string()).describe('A list of 3-4 key trends observed in the financial data.'),
  profitabilityAnalysis: z.string().describe('A brief analysis of the company\'s profitability over the period.'),
  burnRateAnalysis: z.string().describe('An analysis of the average monthly burn rate.'),
  forwardLookingStatement: z.string().describe('A short, forward-looking statement based on the trends.'),
});

export type FinancialAnalysisOutput = z.infer<typeof FinancialAnalysisOutputSchema>;


export async function analyzeFinancials(input: FinancialAnalysisInput): Promise<FinancialAnalysisOutput> {
  return financialAnalysisFlow(input);
}

const financialAnalysisPrompt = ai.definePrompt({
  name: 'financialAnalysisPrompt',
  input: {schema: FinancialAnalysisInputSchema},
  output: {schema: FinancialAnalysisOutputSchema},
  prompt: `You are a financial analyst for a startup. Analyze the following financial records and provide insights.

Financial Records:
\`\`\`json
{{{json financialRecords}}}
\`\`\`

Based on the data, provide the following analysis:
1.  **Key Trends**: Identify 3-4 significant trends in revenue, expenses, or net income.
2.  **Profitability Analysis**: Briefly summarize the company's profitability. Is it improving or declining?
3.  **Burn Rate Analysis**: Calculate and comment on the average monthly cash burn.
4.  **Forward-Looking Statement**: Offer a concise, forward-looking statement based on the data.

Keep the analysis clear, concise, and easy for a founder to understand.
`, 
});

const financialAnalysisFlow = ai.defineFlow(
  {
    name: 'financialAnalysisFlow',
    inputSchema: FinancialAnalysisInputSchema,
    outputSchema: FinancialAnalysisOutputSchema,
  },
  async input => {
    const {output} = await financialAnalysisPrompt(input);
    return output!;
  }
);
