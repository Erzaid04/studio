
'use server';

/**
 * @fileOverview A health claim verification AI agent that uses a search tool.
 *
 * - verifyHealthClaim - A function that handles the health claim verification process.
 * - VerifyHealthClaimInput - The input type for the verifyHealthClaim function.
 * - VerifyHealthClaimOutput - The return type for the verifyHealthClaim function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { searchTrustedSources } from '@/ai/tools/search-trusted-sources';

const VerifyHealthClaimInputSchema = z.object({
  claim: z.string().describe('The health-related claim to verify.'),
  language: z.enum(['en', 'hi']).describe('The language of the health claim (en for English, hi for Hindi).'),
});
export type VerifyHealthClaimInput = z.infer<typeof VerifyHealthClaimInputSchema>;

const VerificationResultSchema = z.object({
  status: z.enum(['Verified Claim', 'Unproven Claim', 'Debunked Myth', 'Not Applicable']).describe('A strict classification of the claim: "Verified Claim" (true), "Debunked Myth" (false), "Unproven Claim" (lacks evidence), or "Not Applicable".'),
  truthfulness: z.string().optional().describe('A one-sentence summary explaining the status of the claim.'),
  tips: z.string().optional().describe('Helpful, actionable tips related to the health topic.'),
  solution: z.string().optional().describe('A clear solution or course of action based on trusted sources.'),
  sources: z.array(z.string()).optional().describe('A list of full URLs to trusted medical databases or sources found by the search tool.'),
});

const VerifyHealthClaimOutputSchema = z.object({
  verificationResult: VerificationResultSchema.describe('The verification result of the health claim.'),
});
export type VerifyHealthClaimOutput = z.infer<typeof VerifyHealthClaimOutputSchema>;


export async function verifyHealthClaim(input: VerifyHealthClaimInput): Promise<VerifyHealthClaimOutput> {
  return verifyHealthClaimFlow(input);
}

const verifyHealthClaimPrompt = ai.definePrompt({
  name: 'verifyHealthClaimPrompt',
  input: {schema: VerifyHealthClaimInputSchema},
  output: {schema: VerifyHealthClaimOutputSchema},
  tools: [searchTrustedSources],
  prompt: `You are a health expert responsible for verifying health claims. Your response MUST be structured according to the output schema.

The user has submitted a health claim for verification.
Claim: "{{claim}}"
Language of Claim: "{{language}}"

Your task is:
1.  **You MUST use the 'searchTrustedSources' tool** to search for evidence related to the claim.
2.  Based *only* on the search results from the tool, analyze the claim and classify its status strictly as one of the following: "Verified Claim" (if proven true by sources), "Debunked Myth" (if proven false by sources), "Unproven Claim" (if sources show a lack of evidence), or "Not Applicable" (if the text is not a health claim).
3.  Provide a concise, one-sentence summary for the 'truthfulness' field, explaining the classification based on the search results.
4.  Provide helpful, actionable tips for the 'tips' field.
5.  Suggest a clear solution or course of action for the 'solution' field.
6.  List the full URLs from the search results that you used for verification in the 'sources' field.

Your entire response, including all fields, must be in the same language as the original claim. If the search tool returns no relevant results, classify the claim as "Unproven Claim" and explain that no information was found in trusted sources. Do not use your general knowledge.
`,
});

const verifyHealthClaimFlow = ai.defineFlow(
  {
    name: 'verifyHealthClaimFlow',
    inputSchema: VerifyHealthClaimInputSchema,
    outputSchema: VerifyHealthClaimOutputSchema,
  },
  async input => {
    const {output} = await verifyHealthClaimPrompt(input);
    return output!;
  }
);
