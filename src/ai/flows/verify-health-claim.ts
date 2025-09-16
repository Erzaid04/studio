'use server';

/**
 * @fileOverview A health claim verification AI agent.
 *
 * - verifyHealthClaim - A function that handles the health claim verification process.
 * - VerifyHealthClaimInput - The input type for the verifyHealthClaim function.
 * - VerifyHealthClaimOutput - The return type for the verifyHealthClaim function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyHealthClaimInputSchema = z.object({
  claim: z.string().describe('The health-related claim to verify.'),
  language: z.enum(['en', 'hi']).describe('The language of the health claim (en for English, hi for Hindi).'),
});
export type VerifyHealthClaimInput = z.infer<typeof VerifyHealthClaimInputSchema>;

const VerificationResultSchema = z.object({
  truthfulness: z.string().optional().describe('An assessment of the claim truthfulness (e.g., true, false, partially true).'),
  tips: z.string().optional().describe('Helpful tips related to the claim.'),
  solution: z.string().optional().describe('Suggested solutions or actions related to the claim.'),
  sources: z.array(z.string()).optional().describe('A list of URLs to trusted medical databases or sources.'),
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
  prompt: `You are a health expert responsible for verifying health claims against trusted medical databases. Your response must be structured according to the output schema.

The user has submitted a health claim for verification.
Claim: "{{claim}}"
Language of Claim: "{{language}}"

Your task is to:
1.  Assess the truthfulness of the claim (true, false, partially true, or nuanced).
2.  Provide helpful, actionable tips related to the health topic.
3.  Suggest a clear solution or course of action.
4.  List any trusted sources (as URLs) you used for verification.

If any of the above cannot be determined, you must return an empty string or an empty array for the corresponding field. Do not omit any fields.
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
