'use client';

import { useEffect, useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useToast } from '@/hooks/use-toast';
import { handleImageAnalysis, ClaimVerificationState } from '@/lib/actions';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Mic, Loader2, Type, Image as ImageIcon, Info, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const claimSchema = z.object({
  claim: z.string().min(10, { message: 'Please enter a health claim with at least 10 characters.' }),
  language: z.enum(['en', 'hi'], { required_error: 'Please select a language.' }),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full font-semibold mt-6" disabled={pending}>
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
    formAction: (payload: FormData) => void;
    state: ClaimVerificationState;
}

export function ClaimForm({ language, setLanguage, formAction, state }: ClaimFormProps) {
  const { toast } = useToast();
  const [imageIsLoading, setImageIsLoading] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof claimSchema>>({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      claim: '',
      language: language,
    },
  });
  
  useEffect(() => {
    form.setValue('language', language);
  }, [language, form]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setHasMicPermission(true))
      .catch(() => {
        setHasMicPermission(false);
        toast({
            variant: 'destructive',
            title: 'Microphone Access Denied',
            description: 'Please enable microphone permissions in your browser settings for voice input.',
        })
      });
  }, [toast]);


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
  }, [state, speechError, toast]);
  
  useEffect(() => {
    if (state.formKey > 0) {
        form.reset({ claim: '', language });
    }
  }, [state.formKey, form, language]);


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
        toast({ title: 'Image Analyzed', description: 'Text extracted from image. You can now submit for verification.' });
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
  
  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isVald = await form.trigger();
    if (isVald && formRef.current) {
        const formData = new FormData(formRef.current);
        formAction(formData);
    }
  }


  return (
    <div className="bg-gradient-to-b from-green-50/20 to-transparent p-4 sm:p-8 rounded-2xl border shadow-sm">
        <h3 className="text-xl font-bold text-center mb-6">Choose Your Input Method</h3>
        <Tabs defaultValue="voice" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/60">
            <TabsTrigger value="voice"><Mic className="mr-2"/>Voice</TabsTrigger>
            <TabsTrigger value="text"><Type className="mr-2"/>Text</TabsTrigger>
            <TabsTrigger value="image"><ImageIcon className="mr-2"/>Image</TabsTrigger>
        </TabsList>
        <Form {...form}>
            <form ref={formRef} onSubmit={onFormSubmit} className="space-y-6 pt-8">
                <div className="flex justify-between items-center">
                    <LanguageSwitcher language={language} setLanguage={setLanguage} />
                    <Button variant="outline" size="sm">
                        <Info className="mr-2"/> Instructions
                    </Button>
                </div>
                
                <TabsContent value="voice">
                    <div className="flex flex-col items-center justify-center text-center py-8 px-4 h-[250px]">
                        {hasRecognitionSupport ? (
                            <>
                                {hasMicPermission ? (
                                    <>
                                        <button
                                        type="button"
                                        onClick={handleMicClick}
                                        className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300
                                        ${isListening ? 'bg-red-500/20' : 'bg-primary/10'}`}
                                        >
                                        <span className={`absolute inset-0 rounded-full bg-primary/20 animate-ping ${!isListening && 'hidden'}`}></span>
                                        <span className={`w-20 h-20 rounded-full flex items-center justify-center
                                            ${isListening ? 'bg-red-500 text-white' : 'bg-primary text-white'}`}>
                                            <Mic className="h-10 w-10" />
                                        </span>
                                        </button>
                                        <p className="text-muted-foreground mt-6">
                                            {isListening ? "Listening..." : "Press the microphone and start speaking"}
                                        </p>
                                        <p className="text-sm text-muted-foreground/80 mt-2">Example: "Does drinking lemon water help with weight loss?"</p>
                                        {transcript && <p className="mt-4 text-sm font-medium">"{transcript}"</p>}
                                    </>
                                ) : (
                                    <Alert variant="destructive" className="w-full max-w-sm">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>Microphone Access Required</AlertTitle>
                                        <AlertDescription>
                                            Please enable microphone permissions in your browser to use voice input.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </>
                        ) : (
                            <Alert variant="destructive" className="w-full max-w-sm">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Unsupported Browser</AlertTitle>
                                <AlertDescription>
                                Speech recognition is not supported in this browser. Please try Google Chrome.
                                </AlertDescription>
                            </Alert>
                        )}
                         <FormField
                            control={form.control}
                            name="claim"
                            render={({ field }) => (
                                <FormItem className="hidden">
                                <FormControl><Input {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="text">
                    <div className="h-[250px]">
                        <FormField
                        control={form.control}
                        name="claim"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="sr-only">Enter Health Claim</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="e.g., 'Drinking turmeric milk daily boosts immunity...'"
                                    className="min-h-[180px] text-base resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="image">
                    <div className="flex flex-col items-center justify-center text-center py-8 px-4 h-[250px]">
                        <Button type="button" variant="outline" className="w-full max-w-xs text-base py-8 border-dashed border-2" onClick={() => imageInputRef.current?.click()} disabled={imageIsLoading}>
                            {imageIsLoading ? (
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            ) : (
                                <Upload className="mr-2 h-6 w-6" />
                            )}
                            Upload an Image
                        </Button>
                        <p className="text-muted-foreground mt-4 text-sm">Upload a screenshot or photo of a health claim.</p>
                        <Input type="file" ref={imageInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
                        {form.getValues('claim') && !imageIsLoading && (
                             <p className="mt-4 text-sm font-medium text-green-600">Image text extracted. Ready to verify.</p>
                        )}
                         <FormField
                            control={form.control}
                            name="claim"
                            render={({ field }) => (
                                <FormItem className="hidden">
                                <FormControl><Input {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </TabsContent>

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
        </Tabs>
    </div>
  );
}
