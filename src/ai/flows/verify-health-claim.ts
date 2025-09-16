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
  truthfulness: z.string().describe('An assessment of the claim truthfulness (e.g., true, false, partially true).'),
  tips: z.string().describe('Helpful tips related to the claim.'),
  solution: z.string().describe('Suggested solutions or actions related to the claim.'),
  sources: z.array(z.string()).describe('A list of URLs to trusted medical databases or sources.'),
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
  prompt: `You are a health expert responsible for verifying health claims against trusted medical databases.

  The health claim to verify is:
  {{claim}}

  The language of the claim is: {{language}}

  Provide a detailed verification result, including the truthfulness of the claim, helpful tips, suggested solutions, and a list of trusted sources.
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
