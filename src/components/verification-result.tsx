
import type { VerifyHealthClaimOutput } from '@/ai/flows/verify-health-claim';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, AlertTriangle, Lightbulb, BookOpen, ExternalLink, Activity, Volume2, Loader2, ShieldCheck, ShieldX, ShieldQuestion, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useRef, useEffect } from 'react';

type VerificationResultProps = {
  result: VerifyHealthClaimOutput;
  audioDataUri?: string;
  onReset: () => void;
};

const getTruthfulnessInfo = (status?: string): { badge: React.ReactNode; description: string } => {
    switch (status) {
        case 'Verified Claim':
            return {
                badge: (
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">
                        <ShieldCheck className="mr-2 h-4 w-4" /> Verified Claim
                    </Badge>
                ),
                description: "This claim is supported by scientific evidence from trusted sources."
            };
        case 'Debunked Myth':
            return {
                badge: (
                    <Badge variant="destructive">
                        <ShieldX className="mr-2 h-4 w-4" /> Debunked Myth
                    </Badge>
                ),
                description: "This claim is contradicted by scientific evidence and may be harmful."
            };
        case 'Unproven Claim':
            return {
                badge: (
                    <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                        <AlertTriangle className="mr-2 h-4 w-4" /> Unproven Claim
                    </Badge>
                ),
                description: "There is not enough scientific evidence to support or refute this claim."
            };
        default:
            return {
                badge: (
                    <Badge variant="secondary" className="bg-gray-500 hover:bg-gray-600 text-white">
                        <ShieldQuestion className="mr-2 h-4 w-4" /> Not Applicable
                    </Badge>
                ),
                description: "The provided text was not recognized as a verifiable health claim."
            };
    }
};

export function VerificationResult({ result, audioDataUri, onReset }: VerificationResultProps) {
  const { status, truthfulness, tips, solution, sources } = result.verificationResult;
  const { badge, description: statusDescription } = getTruthfulnessInfo(status);

  const fallbackText = "No information provided.";

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => setIsPlaying(false);
        
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
        }
    }
  }, [audioRef])


  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-center gap-3">
              <CardTitle className="font-headline flex items-center gap-3 text-2xl">
                <Activity className="h-7 w-7 text-primary" />
                Verification Result
              </CardTitle>
              {audioDataUri ? (
                <>
                  <Button onClick={toggleAudio} size="icon" variant="ghost">
                    <Volume2 className={`h-6 w-6 text-primary ${isPlaying ? 'animate-pulse' : ''}`} />
                    <span className="sr-only">Play audio result</span>
                  </Button>
                  <audio ref={audioRef} src={audioDataUri} />
                </>
              ) : (
                <Loader2 className="h-6 w-6 text-primary/50 animate-spin" />
              )}
            </div>
            {badge}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-foreground mb-2">{truthfulness || statusDescription}</p>
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
          <CardContent className="prose prose-sm max-w-none text-muted-foreground">
            <p>{tips || fallbackText}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              Suggested Solution
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground">
            <p>{solution || fallbackText}</p>
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
            {sources && sources.length > 0 ? (
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
            ) : (
                <p className="text-muted-foreground">{fallbackText}</p>
            )}
        </CardContent>
      </Card>

      <div className="text-center pt-4">
        <Button onClick={onReset} size="lg" variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Verify Another Claim
        </Button>
      </div>
    </div>
  );
}
