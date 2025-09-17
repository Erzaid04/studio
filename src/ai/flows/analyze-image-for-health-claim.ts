
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

  // Construct credentials from environment variables
  const credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Replace literal \n with actual newlines
  };

  if (!credentials.client_email || !credentials.private_key) {
    throw new Error('Google Cloud service account credentials (GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY) are not set in environment variables.');
  }

  // The 'eu-vision.googleapis.com' endpoint is generally available and a good default.
  const clientOptions = {
    apiEndpoint: 'eu-vision.googleapis.com',
    credentials,
  };

  const client = new ImageAnnotatorClient(clientOptions);

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
      // Return a structured output even if no text is found
      return { extractedText: 'No text could be extracted from the image. Please try a clearer image.' };
    }

    return { extractedText };
  } catch (error) {
    console.error('Google Cloud Vision API error:', error);
    // It's better to throw the error to be handled by the calling action
    throw new Error('Failed to analyze image with Google Cloud Vision.');
  }
}
