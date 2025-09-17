'use server';

/**
 * @fileOverview Analyzes an image for health claims, extracts text using OCR, and prepares the text for verification.
 *
 * - analyzeImageForHealthClaim - A function that handles the image analysis and text extraction process.
 * - AnalyzeImageForHealthClaimInput - The input type for the analyzeImageForHealthClaim function.
 * - AnalyzeImageForHealthClaimOutput - The return type for the analyzeImageForHealthClaim function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeImageForHealthClaimInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The image data URI containing the health claim. Must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeImageForHealthClaimInput = z.infer<typeof AnalyzeImageForHealthClaimInputSchema>;

const AnalyzeImageForHealthClaimOutputSchema = z.object({
  extractedText: z
    .string()
    .describe('The extracted text from the image, ready for health claim verification.'),
});
export type AnalyzeImageForHealthClaimOutput = z.infer<typeof AnalyzeImageForHealthClaimOutputSchema>;

export async function analyzeImageForHealthClaim(
  input: AnalyzeImageForHealthClaimInput
): Promise<AnalyzeImageForHealthClaimOutput> {
  return analyzeImageForHealthClaimFlow(input);
}

const analyzeImageForHealthClaimFlow = ai.defineFlow(
  {
    name: 'analyzeImageForHealthClaimFlow',
    inputSchema: AnalyzeImageForHealthClaimInputSchema,
    outputSchema: AnalyzeImageForHealthClaimOutputSchema,
  },
  async ({ imageDataUri }) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: [
        {text: `You are an AI assistant tasked with extracting text from images containing health claims.

      Analyze the image provided and extract any text that represents a health claim.  Return ONLY the extracted text.`},
        {media: {url: imageDataUri}}
      ],
      output: {
        schema: AnalyzeImageForHealthClaimOutputSchema,
      },
      config: {
        retries: 3
      }
    });
    return output!;
  }
);
