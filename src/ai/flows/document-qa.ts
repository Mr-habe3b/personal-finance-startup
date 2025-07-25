'use server';
/**
 * @fileOverview An AI-powered document Q&A flow.
 *
 * - answerDocumentQuestion - Answers a question based on the content of a document.
 * - DocumentQAInput - The input type for the answerDocumentQuestion function.
 * - DocumentQAOutput - The return type for the answerDocumentQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const DocumentQAInputSchema = z.object({
  documentContent: z.string().describe('The full text content of the document.'),
  question: z.string().describe('The question to ask about the document.'),
});

export type DocumentQAInput = z.infer<typeof DocumentQAInputSchema>;

const DocumentQAOutputSchema = z.object({
  answer: z.string().describe('The answer to the question based on the document.'),
});

export type DocumentQAOutput = z.infer<typeof DocumentQAOutputSchema>;


export async function answerDocumentQuestion(input: DocumentQAInput): Promise<DocumentQAOutput> {
  return documentQAFlow(input);
}

const documentQAPrompt = ai.definePrompt({
  name: 'documentQAPrompt',
  input: {schema: DocumentQAInputSchema},
  output: {schema: DocumentQAOutputSchema},
  prompt: `You are a helpful assistant that answers questions based on the provided document content.

Document Content:
---
{{{documentContent}}}
---

Question:
"{{{question}}}"

Based on the document content, please provide a clear and concise answer to the question. If the answer cannot be found in the document, state that the information is not available in the provided text.
`, 
});

const documentQAFlow = ai.defineFlow(
  {
    name: 'documentQAFlow',
    inputSchema: DocumentQAInputSchema,
    outputSchema: DocumentQAOutputSchema,
  },
  async input => {
    const {output} = await documentQAPrompt(input);
    return output!;
  }
);
