'use client';

import { useState } from 'react';
import { Shield } from 'lucide-react';
import { ClaimForm } from '@/components/claim-form';
import { VerificationResult } from '@/components/verification-result';
import type { VerificationResult as VerificationResultType } from '@/lib/types';

const sampleResult: VerificationResultType = {
  status: 'Verified',
  originalClaim: 'Drinking turmeric milk can boost your immunity.',
  isMisinformation: false,
  explanation: "Turmeric contains curcumin, a substance with powerful anti-inflammatory and antioxidant properties. While it's not a magic cure, regular consumption of turmeric milk (Haldi Doodh) can contribute to a stronger immune system as part of a balanced diet. It is a traditional remedy backed by modern scientific studies.",
  sources: [
    { name: 'PubMed Central', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5664031/' },
    { name: 'WHO', url: 'https://www.who.int/publications/i/item/9789241513729' },
  ]
};


export default function VerifyPage() {
    const [result, setResult] = useState<VerificationResultType | null>(null);

    const handleVerification = () => {
        // This is a placeholder. In a real app, you'd call the backend here.
        setResult(sampleResult);
    };

    const handleReset = () => {
        setResult(null);
    };

    return (
        <div className="flex flex-col items-center bg-background p-4 sm:p-6 lg:p-8 pt-16">
            <div className="text-center max-w-4xl w-full">
                 <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-br from-primary to-accent p-4 rounded-2xl shadow-lg">
                        <Shield className="h-16 w-16 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-5xl font-headline font-extrabold text-foreground mb-4">
                    Verify Health Claims
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
                   Check if a health claim is true, unproven, or false using AI backed by trusted sources.
                </p>

                <div className="w-full max-w-3xl mx-auto">
                   {result ? (
                        <VerificationResult result={result} onReset={handleReset} />
                   ) : (
                        <ClaimForm onVerify={handleVerification} />
                   )}
                </div>
            </div>
        </div>
    );
}
