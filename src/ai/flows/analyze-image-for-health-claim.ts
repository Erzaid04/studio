
'use server';

/**
 * @fileOverview Analyzes an image for health claims using Google Cloud Vision OCR.
 *
 * - analyzeImageForHealthClaim - A function that handles the image analysis and text extraction process.
 * - AnalyzeImageForHealthClaimInput - The input type for the analyzeImageForHealthClaim function.
 * - AnalyzeImageForHealthClaimOutput - The return type for the analyzeImageForHealthClaim function.
 */

import { z } from 'zod';
import { ImageAnnotatorClient } from '@google-cloud/vision';

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
  const { imageDataUri } = AnalyzeImageForHealthClaimInputSchema.parse(input);

  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  // The private key needs to have its newlines properly escaped in the .env file
  // but here we need to replace the literal `\n` with actual newlines.
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error('Google Cloud service account credentials (GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY) are not set in environment variables.');
  }

  const client = new ImageAnnotatorClient({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
  });

  // Extracts the Base64 content from the data URI
  const base64Image = imageDataUri.split(';base64,').pop();

  if (!base64Image) {
    throw new Error('Invalid image data URI format.');
  }

  const request = {
    image: {
      content: base64Image,
    },
    features: [{ type: 'TEXT_DETECTION' }],
  };

  try {
    const [result] = await client.textDetection(request);
    const detections = result.textAnnotations;
    const extractedText = detections?.[0]?.description?.trim() || '';

    if (!extractedText) {
      return { extractedText: 'No text could be extracted from the image. Please try a clearer image.' };
    }

    return { extractedText };
  } catch (error: any) {
    console.error('Google Cloud Vision API error:', error);
    throw new Error(`Failed to analyze image with Google Cloud Vision: ${error.message || 'Please check your credentials and ensure the Vision API is enabled in your Google Cloud project.'}`);
  }
}
