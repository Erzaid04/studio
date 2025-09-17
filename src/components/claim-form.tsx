'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Mic, ImageUp, Send, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ClaimFormProps = {
  onVerify: (claim: string) => void;
};

export function ClaimForm({ onVerify }: ClaimFormProps) {
  const [claim, setClaim] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (claim.trim()) {
      onVerify(claim);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-center">Enter Claim to Verify</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="text"><FileText className="mr-2"/>Text</TabsTrigger>
              <TabsTrigger value="image" disabled><ImageUp className="mr-2"/>Image</TabsTrigger>
              <TabsTrigger value="audio" disabled><Mic className="mr-2"/>Audio</TabsTrigger>
            </TabsList>
            <TabsContent value="text">
              <Textarea
                placeholder="e.g., 'Does drinking turmeric milk cure colds?'"
                className="min-h-[120px] text-lg"
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Enter the health claim you received via WhatsApp, social media, or word-of-mouth.
              </p>
            </TabsContent>
            <TabsContent value="image">
                <Alert>
                  <AlertTitle>Feature In Development</AlertTitle>
                  <AlertDescription>
                    Image upload functionality is for demonstration purposes.
                  </AlertDescription>
                </Alert>
            </TabsContent>
             <TabsContent value="audio">
                <Alert>
                  <AlertTitle>Feature In Development</AlertTitle>
                  <AlertDescription>
                    Audio recording functionality is for demonstration purposes.
                  </AlertDescription>
                </Alert>
            </TabsContent>
          </Tabs>

          <Button type="submit" size="lg" className="w-full mt-6 font-bold text-lg" disabled={!claim.trim()}>
            <Send className="mr-2" />
            Verify Claim
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
