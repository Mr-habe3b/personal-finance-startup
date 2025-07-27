
'use server';
/**
 * @fileOverview An AI flow to generate content for a wiki page.
 *
 * This flow takes a title and generates comprehensive, well-structured
 * content for a wiki page in Markdown format. It can include headings,
 * lists, and code snippets to quickly bootstrap documentation.
 *
 * - generateWikiContent - Generates wiki page content based on a title.
 * - WikiContentInput - The input type for the generateWikiContent function.
 * - WikiContentOutput - The return type for the generateWikiContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const WikiContentInputSchema = z.object({
  title: z.string().describe('The title of the wiki page.'),
});

export type WikiContentInput = z.infer<typeof WikiContentInputSchema>;

const WikiContentOutputSchema = z.object({
  content: z.string().describe('The generated content for the wiki page in Markdown format.'),
});

export type WikiContentOutput = z.infer<typeof WikiContentOutputSchema>;


export async function generateWikiContent(input: WikiContentInput): Promise<WikiContentOutput> {
  return wikiContentGeneratorFlow(input);
}

const wikiContentGeneratorPrompt = ai.definePrompt({
  name: 'wikiContentGeneratorPrompt',
  input: {schema: WikiContentInputSchema},
  output: {schema: WikiContentOutputSchema},
  prompt: `You are an expert technical writer. Generate a comprehensive wiki page in Markdown format for the following title: "{{{title}}}".

The content should be well-structured, informative, and easy to understand. Include headings, lists, and code snippets where appropriate.
`,
});

const wikiContentGeneratorFlow = ai.defineFlow(
  {
    name: 'wikiContentGeneratorFlow',
    inputSchema: WikiContentInputSchema,
    outputSchema: WikiContentOutputSchema,
  },
  async input => {
    const {output} = await wikiContentGeneratorPrompt(input);
    return output!;
  }
);
