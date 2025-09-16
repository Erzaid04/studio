'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { ClaimForm } from '@/components/claim-form';

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header language={language} setLanguage={setLanguage} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <section className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">
              Ayush Shield: AI Health Claim Verification
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empowering you with evidence-based information. Submit a health claim via text, image, or voice and our AI will verify it against trusted medical sources.
            </p>
          </section>

          <ClaimForm language={language} setLanguage={setLanguage} />
        </div>
      </main>
      <footer className="py-8 px-4 sm:px-6 lg:px-8 text-center border-t">
        <p className="text-sm text-muted-foreground mb-2">
          Verifications are performed using trusted databases from:
        </p>
        <p className="text-xs text-muted-foreground font-semibold">
          Ministry of Ayush &bull; ICMR &bull; WHO &bull; AIIMS &bull; and more
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          &copy; {new Date().getFullYear()} Ayush Shield. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
