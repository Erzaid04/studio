'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ClaimForm } from '@/components/claim-form';
import { CheckCircle, AlertTriangle, XCircle, Mic, Shield } from 'lucide-react';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="text-center max-w-4xl w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-primary to-accent p-4 rounded-2xl shadow-lg">
            <Shield className="h-16 w-16 text-white" />
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-extrabold text-foreground">
          India's Most Trusted
        </h1>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-headline font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-6">
          Health Guardian
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
          Protect your loved ones from dangerous health misinformation with instant, AI-powered verification that understands <span className="font-semibold text-primary">Hindi</span> and <span className="font-semibold text-primary">English</span>.
        </p>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          अपने परिवार को फर्जी स्वास्थ्य समाचारों से बचाएं
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" onClick={openModal} className="font-bold text-lg">
            <Mic className="mr-2 h-5 w-5" />
            Start Verification
          </Button>
          <Button size="lg" variant="outline" className="font-bold text-lg">
            Learn More
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-green-50 border-green-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-10 w-10 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-green-800 mb-1">Verified</h3>
              <p className="text-sm text-green-700">Scientifically proven and safe</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 border-yellow-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-10 w-10 text-yellow-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-yellow-800 mb-1">Unproven</h3>
              <p className="text-sm text-yellow-700">No scientific evidence available</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <XCircle className="h-10 w-10 text-red-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-red-800 mb-1">Debunked</h3>
              <p className="text-sm text-red-700">Proven false or potentially harmful</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline">Verify a Health Claim</DialogTitle>
            <DialogDescription>
              Enter a claim below, upload an image, or use your voice. Our AI will verify it against trusted sources.
            </DialogDescription>
          </DialogHeader>
          <ClaimForm language={language} setLanguage={setLanguage} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
