
'use server';
/**
 * @fileOverview An AI flow to generate milestone descriptions and sub-tasks.
 *
 * This flow takes a milestone title and uses AI to generate a detailed,
 * goal-oriented description and a list of actionable sub-tasks required to
 * achieve that milestone. This helps streamline project planning.
 *
 * - suggestMilestoneDetails - Suggests a detailed description and sub-tasks for a given milestone title.
 * - MilestoneSuggestionInput - The input type for the suggestMilestoneDetails function.
 * - MilestoneSuggestionOutput - The return type for the suggestMilestoneDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const MilestoneSuggestionInputSchema = z.object({
  title: z.string().describe('The title of the milestone.'),
});

export type MilestoneSuggestionInput = z.infer<typeof MilestoneSuggestionInputSchema>;

const MilestoneSuggestionOutputSchema = z.object({
  description: z.string().describe('A detailed, goal-oriented description for the milestone.'),
  subTasks: z.array(z.string()).describe('A list of actionable sub-tasks to achieve the milestone.'),
});

export type MilestoneSuggestionOutput = z.infer<typeof MilestoneSuggestionOutputSchema>;


export async function suggestMilestoneDetails(input: MilestoneSuggestionInput): Promise<MilestoneSuggestionOutput> {
  return milestoneSuggestionFlow(input);
}

const milestoneSuggestionPrompt = ai.definePrompt({
  name: 'milestoneSuggestionPrompt',
  input: {schema: MilestoneSuggestionInputSchema},
  output: {schema: MilestoneSuggestionOutputSchema},
  prompt: `You are a project management expert. For the given milestone title, generate a detailed description and a list of actionable sub-tasks.

Milestone Title: "{{{title}}}"

Description:
Provide a clear, concise description that outlines the primary goal of this milestone.

Sub-tasks:
List 3-5 specific, actionable sub-tasks that need to be completed to achieve this milestone.
`,
});

const milestoneSuggestionFlow = ai.defineFlow(
  {
    name: 'milestoneSuggestionFlow',
    inputSchema: MilestoneSuggestionInputSchema,
    outputSchema: MilestoneSuggestionOutputSchema,
  },
  async input => {
    const {output} = await milestoneSuggestionPrompt(input);
    return output!;
  }
);
