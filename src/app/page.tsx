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
import { CheckCircle, AlertTriangle, XCircle, Mic, Shield, Type } from 'lucide-react';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8 pt-16">
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
      <div className="bg-background py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-headline font-bold text-foreground mb-4">
            Designed for Every Indian Family
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            From tech-savvy children worried about their parents to elderly grandparents receiving
            WhatsApp forwards - Ayush Shield is built for everyone.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
                  <Mic className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-bold font-headline mb-2">Voice-First Interface</h3>
              <p className="text-muted-foreground mb-6">
                Simply speak your health question in Hindi or English. No typing needed - perfect for elderly family members.
              </p>
              <Button variant="outline">हिंदी में बात करें</Button>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
                  <Type className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-bold font-headline mb-2">Multi-Modal Verification</h3>
              <p className="text-muted-foreground mb-6">
                Paste text from WhatsApp, upload screenshots, or type directly. We verify health claims from any source.
              </p>
              <Button variant="outline">WhatsApp Ready</Button>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
                  <Shield className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-bold font-headline mb-2">Trusted Sources Only</h3>
              <p className="text-muted-foreground mb-6">
                Every answer backed by WHO, ICMR, Ministry of Ayush, and verified medical journals.
              </p>
              <Button variant="outline">100% Verified</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
