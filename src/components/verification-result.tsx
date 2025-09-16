import type { VerifyHealthClaimOutput } from '@/ai/flows/verify-health-claim';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, AlertTriangle, Lightbulb, BookOpen, ExternalLink, Activity } from 'lucide-react';

type VerificationResultProps = {
  result: VerifyHealthClaimOutput;
};

const getTruthfulnessInfo = (truthfulness: string): { badge: React.ReactNode; description: string } => {
  const lowerTruth = truthfulness.toLowerCase();

  if (lowerTruth.includes('true') && !lowerTruth.includes('partially') && !lowerTruth.includes('false')) {
    return {
      badge: (
        <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">
          <CheckCircle2 className="mr-2 h-4 w-4" /> True
        </Badge>
      ),
      description: truthfulness,
    };
  }
  if (lowerTruth.includes('false')) {
    return {
      badge: (
        <Badge variant="destructive">
          <AlertTriangle className="mr-2 h-4 w-4" /> False
        </Badge>
      ),
      description: truthfulness,
    };
  }
  return {
    badge: (
      <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-amber-50">
        <AlertTriangle className="mr-2 h-4 w-4" /> Nuanced
      </Badge>
    ),
    description: truthfulness,
  };
};

export function VerificationResult({ result }: VerificationResultProps) {
  const { truthfulness, tips, solution, sources } = result.verificationResult;
  const { badge, description } = getTruthfulnessInfo(truthfulness);

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <CardTitle className="font-headline flex items-center gap-3 text-2xl">
              <Activity className="h-7 w-7 text-primary" />
              Verification Result
            </CardTitle>
            {badge}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-base text-slate-700">{description}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-3">
              <Lightbulb className="h-6 w-6 text-primary" />
              Helpful Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-slate-600">
            <p>{tips}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              Suggested Solution
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-slate-600">
            <p>{solution}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {sources.map((source, index) => (
              <li key={index}>
                <a
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4 shrink-0 opacity-70 group-hover:opacity-100" />
                  <span className="truncate">{source}</span>
                </a>
                {index < sources.length -1 && <Separator className="mt-4" />}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
