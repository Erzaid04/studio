'use server';

import { z } from 'zod';
import { analyzeImageForHealthClaim, AnalyzeImageForHealthClaimOutput } from '@/ai/flows/analyze-image-for-health-claim';
import { verifyHealthClaim, VerifyHealthClaimOutput } from '@/ai/flows/verify-health-claim';
import { textToSpeech } from '@/ai/flows/text-to-speech';

export type ClaimVerificationState = {
  result?: VerifyHealthClaimOutput;
  audioDataUri?: string;
  error?: string;
  formKey: number;
};

const claimSchema = z.object({
  claim: z.string().min(10, { message: 'Please enter a health claim with at least 10 characters.' }),
  language: z.enum(['en', 'hi']),
});

export async function handleClaimVerification(
  prevState: ClaimVerificationState,
  formData: FormData
): Promise<ClaimVerificationState> {
  try {
    const validatedFields = claimSchema.safeParse({
      claim: formData.get('claim'),
      language: formData.get('language'),
    });

    if (!validatedFields.success) {
      const firstError = validatedFields.error.flatten().fieldErrors;
      const errorMessage = Object.values(firstError).flat()[0] || 'Invalid input.';
      return {
        ...prevState,
        error: errorMessage,
        result: undefined,
        audioDataUri: undefined,
      };
    }
    
    const { claim, language } = validatedFields.data;

    const [verificationResult, audioResult] = await Promise.all([
        verifyHealthClaim({ claim, language }),
        (async () => {
            const result = await verifyHealthClaim({ claim, language });
            if (result?.verificationResult) {
                const textToSpeak = `
                    Truthfulness: ${result.verificationResult.truthfulness || 'Not available'}.
                    Tips: ${result.verificationResult.tips || 'Not available'}.
                    Solution: ${result.verificationResult.solution || 'Not available'}.
                `;
                return textToSpeech(textToSpeak);
            }
            return null;
        })()
    ]);
    
    if (!verificationResult || !verificationResult.verificationResult) {
      return { ...prevState, error: 'The AI could not process the claim. Please try again.', result: undefined, audioDataUri: undefined };
    }
    
    return { 
      result: verificationResult, 
      audioDataUri: audioResult?.media,
      formKey: (prevState.formKey ?? 0) + 1, 
      error: undefined 
    };

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return {
      ...prevState,
      error: `An unexpected error occurred: ${errorMessage}. Please try again later.`,
      result: undefined,
      audioDataUri: undefined,
    };
  }
}

export type ImageAnalysisState = {
    result?: AnalyzeImageForHealthClaimOutput;
    error?: string;
};

export async function handleImageAnalysis(imageDataUri: string): Promise<ImageAnalysisState> {
  if (!imageDataUri) {
    return { error: 'No image data provided.' };
  }
  try {
    const result = await analyzeImageForHealthClaim({ imageDataUri });
    if (!result || !result.extractedText) {
      return { error: 'Could not extract text from the image. Please try a clearer image.' };
    }
    return { result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: `Image analysis failed: ${errorMessage}` };
  }
}
