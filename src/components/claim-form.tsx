'use client';

import { useEffect, useState, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useToast } from '@/hooks/use-toast';
import { handleClaimVerification, handleImageAnalysis, ClaimVerificationState } from '@/lib/actions';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { VerificationResult } from '@/components/verification-result';
import { Upload, Mic, MicOff, Loader2 } from 'lucide-react';

const claimSchema = z.object({
  claim: z.string().min(10, { message: 'Please enter a health claim with at least 10 characters.' }),
  language: z.enum(['en', 'hi'], { required_error: 'Please select a language.' }),
});

const initialState: ClaimVerificationState = { formKey: 0 };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
        </>
      ) : 'Verify Claim'}
    </Button>
  );
}

type ClaimFormProps = {
    language: 'en' | 'hi';
    setLanguage: (lang: 'en' | 'hi') => void;
}

export function ClaimForm({ language, setLanguage }: ClaimFormProps) {
  const [state, formAction] = useActionState(handleClaimVerification, initialState);
  const { toast } = useToast();
  const [imageIsLoading, setImageIsLoading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof claimSchema>>({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      claim: '',
      language: 'en',
    },
  });

  useEffect(() => {
    form.setValue('language', language);
  }, [language, form]);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport,
    error: speechError,
  } = useSpeechRecognition({ lang: language === 'hi' ? 'hi-IN' : 'en-US' });
  
  useEffect(() => {
    if (transcript) {
      form.setValue('claim', transcript, { shouldValidate: true });
    }
  }, [transcript, form]);
  
  useEffect(() => {
    if (state?.error) {
      toast({
        title: 'Verification Error',
        description: state.error,
        variant: 'destructive',
      });
    }
    if (speechError) {
      toast({
        title: 'Speech Recognition Error',
        description: speechError,
        variant: 'destructive',
      });
    }
    if (state?.result) {
        toast({
            title: "Success",
            description: "Your claim has been verified.",
            variant: "default",
            className: "bg-green-600 text-white border-green-600"
        });
    }
  }, [state, speechError, toast]);
  
  useEffect(() => {
    if (state.formKey > (initialState.formKey ?? 0)) {
        form.reset();
    }
  }, [state.formKey, form]);


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageIsLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const imageDataUri = reader.result as string;
      const analysisResult = await handleImageAnalysis(imageDataUri);
      if (analysisResult.error) {
        toast({ title: 'Image Analysis Failed', description: analysisResult.error, variant: 'destructive' });
      } else if (analysisResult.result) {
        form.setValue('claim', analysisResult.result.extractedText, { shouldValidate: true });
        toast({ title: 'Image Analyzed', description: 'Text extracted from image.' });
      }
      setImageIsLoading(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    };
    reader.onerror = () => {
      toast({ title: 'Error', description: 'Failed to read the image file.', variant: 'destructive' });
      setImageIsLoading(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const onFormSubmit = (data: z.infer<typeof claimSchema>) => {
    const formData = new FormData();
    formData.append('claim', data.claim);
    formData.append('language', data.language);
    formAction(formData);
  }

  return (
    <div className="space-y-12">
      <Card className="shadow-lg border-2 border-primary/20">
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="claim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-headline">Enter Health Claim</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          placeholder="e.g., 'Drinking turmeric milk daily boosts immunity...'"
                          className="min-h-[140px] text-base resize-none pr-24"
                          {...field}
                        />
                         <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center gap-2">
                           {hasRecognitionSupport && (
                            <button
                                type="button"
                                onClick={handleMicClick}
                                className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                                ${isListening ? 'bg-destructive/80 scale-105 shadow-md' : 'bg-primary/10 hover:bg-primary/20'}`}
                            >
                                {isListening ? (
                                    <MicOff className="h-6 w-6 text-destructive" />
                                ) : (
                                    <Mic className="h-6 w-6 text-primary" />
                                )}
                                <span className="sr-only">{isListening ? 'Stop Listening' : 'Record Voice'}</span>
                            </button>
                           )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-wrap items-center gap-4">
                 <p className="text-sm text-muted-foreground font-medium">Or, upload an image of the claim:</p>
                 <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()} disabled={imageIsLoading}>
                  {imageIsLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  Upload Image
                </Button>
                <Input type="file" ref={imageInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
              </div>

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <SubmitButton />
              
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {state?.result && (
          <VerificationResult result={state.result} audioDataUri={state.audioDataUri} />
      )}
    </div>
  );
}
