'use server';

// In a real production app, you would not need to import 'dotenv' here.
// Environment variables are typically set through the hosting provider's interface.
// For local development, Next.js automatically loads .env.local, .env.development, and .env.
import { config } from 'dotenv';
config({ path: '.env' });

import '@/ai/flows/dilution-impact-simulator.ts';
import '@/ai/flows/financial-analysis.ts';
import '@/ai/flows/document-qa.ts';
import '@/ai/flows/wiki-content-generator.ts';
import '@/ai/flows/milestone-suggestion.ts';
