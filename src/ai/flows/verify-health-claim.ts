
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
  status: z.enum(['Verified Claim', 'Unproven Claim', 'Debunked Myth', 'Not Applicable']).describe('A strict classification of the claim: "Verified Claim" (true), "Debunked Myth" (false), "Unproven Claim" (lacks evidence), or "Not Applicable".'),
  truthfulness: z.string().optional().describe('A one-sentence summary explaining the status of the claim.'),
  tips: z.string().optional().describe('Helpful, actionable tips related to the health topic.'),
  solution: z.string().optional().describe('A clear solution or course of action based on trusted sources.'),
  sources: z.array(z.string()).optional().describe('A list of full URLs to trusted medical databases or sources.'),
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
  prompt: `You are a health expert responsible for verifying health claims against trusted medical databases. Your response MUST be structured according to the output schema.

The user has submitted a health claim for verification.
Claim: "{{claim}}"
Language of Claim: "{{language}}"

Your task is:
1.  Analyze the claim and classify its status strictly as one of the following: "Verified Claim" (if scientifically true), "Debunked Myth" (if scientifically false), "Unproven Claim" (if there is not enough evidence), or "Not Applicable" (if the text is not a health claim).
2.  Provide a concise, one-sentence summary for the 'truthfulness' field, explaining the classification.
3.  Provide helpful, actionable tips for the 'tips' field.
4.  Suggest a clear solution or course of action for the 'solution' field.
5.  List the full URLs of any trusted sources (like WHO, ICMR, Ministry of Ayush, verified medical journals) you used for verification.

Your entire response, including all fields, must be in the same language as the original claim. If any field cannot be determined, you must return an empty string or an empty array for the corresponding field. Do not omit any fields.
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
