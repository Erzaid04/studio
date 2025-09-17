'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle, RefreshCcw, Link as LinkIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { VerificationResult as VerificationResultType } from '@/lib/types';


type VerificationResultProps = {
  result: VerificationResultType;
  onReset: () => void;
};

const statusConfig = {
    'Verified': {
        icon: <CheckCircle className="h-6 w-6 text-green-500" />,
        badgeVariant: 'default',
        badgeClassName: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
        titleClassName: 'text-green-800',
    },
    'Unproven': {
        icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
        badgeVariant: 'secondary',
        badgeClassName: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100',
        titleClassName: 'text-yellow-800',
    },
    'Debunked': {
        icon: <XCircle className="h-6 w-6 text-red-500" />,
        badgeVariant: 'destructive',
        badgeClassName: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100',
        titleClassName: 'text-red-800',
    }
}

export function VerificationResult({ result, onReset }: VerificationResultProps) {
    const config = statusConfig[result.status] || statusConfig['Unproven'];

    return (
        <Card className="shadow-lg animate-in fade-in">
            <CardHeader>
                <div className="flex items-center gap-3">
                    {config.icon}
                    <Badge className={config.badgeClassName}>{result.status}</Badge>
                </div>
                <CardTitle className={`text-2xl font-headline mt-2 ${config.titleClassName}`}>
                    Claim: "{result.originalClaim}"
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-bold text-lg mb-2 text-foreground">Explanation</h3>
                    <p className="text-muted-foreground">{result.explanation}</p>
                </div>

                {result.sources && result.sources.length > 0 && (
                     <div>
                        <h3 className="font-bold text-lg mb-2 text-foreground flex items-center gap-2">
                           <LinkIcon className="h-5 w-5"/> Trusted Sources
                        </h3>
                        <ul className="space-y-2">
                            {result.sources.map((source, index) => (
                                <li key={index}>
                                    <Link href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                                        {source.name}
                                        <ExternalLink className="h-4 w-4" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 <Button onClick={onReset} size="lg" className="w-full font-bold text-lg">
                    <RefreshCcw className="mr-2" />
                    Verify Another Claim
                </Button>
            </CardFooter>
        </Card>
    );
}
