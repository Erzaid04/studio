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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

export function ClaimForm() {
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

  const language = form.watch('language');

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
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="claim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-headline">Enter Health Claim</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Drinking turmeric milk daily boosts immunity...'"
                        className="min-h-[120px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-wrap items-center gap-4">
                 <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()} disabled={imageIsLoading}>
                  {imageIsLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  Upload Image
                </Button>
                <Input type="file" ref={imageInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />

                {hasRecognitionSupport && (
                  <Button type="button" variant="outline" onClick={handleMicClick} className={isListening ? 'text-destructive border-destructive' : ''}>
                    {isListening ? (
                       <>
                        <MicOff className="mr-2 h-4 w-4 animate-pulse" /> Listening...
                       </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-4 w-4" /> Record Voice
                      </>
                    )}
                  </Button>
                )}
              </div>
              

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="font-headline">Claim Language</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center gap-6"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="en" />
                          </FormControl>
                          <FormLabel className="font-normal text-base">English</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="hi" />
                          </FormControl>
                          <FormLabel className="font-normal text-base">Hindi</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
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
