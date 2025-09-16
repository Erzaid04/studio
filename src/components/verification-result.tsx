import type { VerifyHealthClaimOutput } from '@/ai/flows/verify-health-claim';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, AlertTriangle, Lightbulb, BookOpen, ExternalLink, Activity, Volume2, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useRef, useEffect } from 'react';

type VerificationResultProps = {
  result: VerifyHealthClaimOutput;
  audioDataUri?: string;
};

const getTruthfulnessInfo = (truthfulness?: string): { badge: React.ReactNode; description: string } => {
    if (!truthfulness) {
        return {
          badge: (
            <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">
              <AlertTriangle className="mr-2 h-4 w-4" /> Not Available
            </Badge>
          ),
          description: "The AI could not determine the truthfulness of this claim.",
        };
      }
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
      <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">
        <AlertTriangle className="mr-2 h-4 w-4" /> Nuanced
      </Badge>
    ),
    description: truthfulness,
    };
};

export function VerificationResult({ result, audioDataUri }: VerificationResultProps) {
  const { truthfulness, tips, solution, sources } = result.verificationResult;
  const { badge, description } = getTruthfulnessInfo(truthfulness);

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
          <p className="text-base text-foreground/80">{description}</p>
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
    </div>
  );
}
