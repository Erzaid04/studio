'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-image-for-health-claim.ts';
import '@/ai/flows/verify-health-claim.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/tools/search-trusted-sources.ts';
