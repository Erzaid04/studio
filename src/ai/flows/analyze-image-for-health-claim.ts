
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

  const apiKey = process.env.GOOGLE_VISION_API_KEY;

  if (!apiKey) {
    throw new Error('Google Cloud Vision API Key (GOOGLE_VISION_API_KEY) is not set in environment variables.');
  }

  // Use API Key for authentication
  const clientOptions = {
    key: apiKey,
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
      return { extractedText: 'No text could be extracted from the image. Please try a clearer image.' };
    }

    return { extractedText };
  } catch (error) {
    console.error('Google Cloud Vision API error:', error);
    throw new Error('Failed to analyze image with Google Cloud Vision. Please check your API key and ensure the Vision API is enabled in your Google Cloud project.');
  }
}
