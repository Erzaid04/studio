
'use client';

import { useState } from 'react';
import { Shield } from 'lucide-react';
import { ClaimForm } from '@/components/claim-form';
import { useActionState } from 'react';
import { handleClaimVerification, ClaimVerificationState } from '@/lib/actions';
import { VerificationResult } from '@/components/verification-result';

const initialState: ClaimVerificationState = { formKey: 0 };


export default function VerifyPage() {
    const [language, setLanguage] = useState<'en' | 'hi'>('en');
    const [state, formAction] = useActionState(handleClaimVerification, initialState);

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

                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
                    Protect your family from health misinformation. Get instant verification from trusted medical sources.
                </p>
                <p className="text-base sm:text-lg text-primary max-w-2xl mx-auto mb-12">
                    स्वास्थ्य दावों की जांच करें - सत्यापित जानकारी प्राप्त करें
                </p>
                
                <div className="w-full max-w-3xl mx-auto">
                    {state?.result ? (
                        <VerificationResult result={state.result} audioDataUri={state.audioDataUri} />
                    ) : (
                        <ClaimForm
                            language={language}
                            setLanguage={setLanguage}
                            formAction={formAction}
                            state={state}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
