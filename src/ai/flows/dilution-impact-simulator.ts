
'use server';
/**
 * @fileOverview AI-powered dilution impact simulator for modeling funding rounds.
 *
 * This flow takes the current cap table, a new investment amount, and a pre-money valuation
 * to simulate the effects of a new funding round. It calculates the post-money valuation,
 * the updated cap table with diluted percentages for all stakeholders, and provides
 * strategic advice on the implications for future fundraising.
 *
 * - simulateDilutionImpact - Simulates the impact of new funding rounds on equity distribution.
 * - DilutionImpactInput - The input type for the simulateDilutionImpact function.
 * - DilutionImpactOutput - The return type for the simulateDilutionImpact function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DilutionImpactInputSchema = z.object({
  currentCapTable: z.record(z.number()).describe('Current cap table with stakeholder names as keys and equity percentage as values (0-100).'),
  newInvestmentAmount: z.number().describe('Amount of new investment raised in the local currency.'),
  preMoneyValuation: z.number().describe('Pre-money valuation of the company in the local currency.'),
  roundName: z.string().describe('The name of the funding round (e.g., Series A).'),
});

export type DilutionImpactInput = z.infer<typeof DilutionImpactInputSchema>;

const DilutionImpactOutputSchema = z.object({
  postMoneyValuation: z.number().describe('Post-money valuation after the funding round.'),
  newCapTable: z.record(z.number()).describe('Updated cap table reflecting dilution for each stakeholder.'),
  dilutionDetails: z.string().describe('A summary of the dilution impact on each stakeholder, including percentage change.'),
  futureFundraisingConsiderations: z.string().describe('Reasoning about the impact to future fundraising rounds based on round terms.')
});

export type DilutionImpactOutput = z.infer<typeof DilutionImpactOutputSchema>;


export async function simulateDilutionImpact(input: DilutionImpactInput): Promise<DilutionImpactOutput> {
  return dilutionImpactFlow(input);
}

const dilutionImpactPrompt = ai.definePrompt({
  name: 'dilutionImpactPrompt',
  input: {schema: DilutionImpactInputSchema},
  output: {schema: DilutionImpactOutputSchema},
  prompt: `You are an expert in venture capital and startup equity.  Given the following cap table, investment amount, and pre-money valuation, calculate the post-money valuation and the resulting dilution for each stakeholder. The currency is in Rupees (₹).

Current Cap Table:
{{#each currentCapTable}}{{{@key}}}: {{{this}}}%
{{/each}}

New Investment Amount: ₹{{newInvestmentAmount}}
Pre-Money Valuation: ₹{{preMoneyValuation}}

Round Name: {{{roundName}}}

Consider the implications of these terms on future fundraising rounds. What strategic advice would you give the founders regarding valuation and future equity allocation?


Return the results in JSON format.
`, 
});

const dilutionImpactFlow = ai.defineFlow(
  {
    name: 'dilutionImpactFlow',
    inputSchema: DilutionImpactInputSchema,
    outputSchema: DilutionImpactOutputSchema,
  },
  async input => {
    const {output} = await dilutionImpactPrompt(input);
    return output!;
  }
);
