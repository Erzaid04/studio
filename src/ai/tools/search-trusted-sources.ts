
'use server';
/**
 * @fileOverview A tool that performs a targeted search across trusted health sources.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Note: This requires a Google Custom Search Engine to be set up.
// The Custom Search Engine should be configured to search the domains:
// - who.int
// - icmr.gov.in
// - main.ayush.gov.in
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const SearchResultItemSchema = z.object({
  title: z.string().describe('The title of the search result.'),
  link: z.string().describe('The URL of the search result.'),
  snippet: z.string().describe('A small snippet of the content from the search result.'),
});

export const searchTrustedSources = ai.defineTool(
  {
    name: 'searchTrustedSources',
    description: 'Searches for information across trusted medical sources like the World Health Organization (WHO), Indian Council of Medical Research (ICMR), and the Ministry of Ayush.',
    inputSchema: z.object({
      query: z.string().describe('The search query, which should be the health claim to verify.'),
    }),
    outputSchema: z.object({
      results: z.array(SearchResultItemSchema).describe('A list of search results.'),
    }),
  },
  async (input) => {
    if (!GOOGLE_CSE_ID || !GOOGLE_API_KEY) {
      console.error('GOOGLE_CSE_ID or GOOGLE_API_KEY is not set in environment variables.');
      throw new Error('Search environment variables not configured.');
    }

    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CSE_ID}&q=${encodeURIComponent(input.query)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Custom Search API error:', errorText);
        throw new Error(`Google Custom Search API request failed with status: ${response.status}`);
      }
      const data = await response.json();
      
      const results = data.items?.map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
      })) || [];
      
      return { results };

    } catch (error: any) {
      console.error('Failed to execute search:', error);
      // Return empty results to the model so it can respond gracefully
      return { results: [] };
    }
  }
);
