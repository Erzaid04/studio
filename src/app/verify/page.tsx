
'use client';

import { Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VerifyPage() {
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
                    The backend for this feature has been removed. This is now a frontend-only placeholder page.
                </p>
                
                <div className="w-full max-w-3xl mx-auto">
                   <Card>
                        <CardHeader>
                            <CardTitle>Frontend Components Ready</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">The UI components for the claim form and verification result are available in the project. You can integrate your own backend logic to make them functional.</p>
                            <Link href="/">
                                <Button>Go Back Home</Button>
                            </Link>
                        </CardContent>
                   </Card>
                </div>
            </div>
        </div>
    );
}
