import { Header } from '@/components/layout/header';
import { ClaimForm } from '@/components/claim-form';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <section className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4 text-slate-800">
              Verify Health Claims with Confidence
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Submit a health claim via text, image, or voice, and our AI will verify it against trusted medical sources.
            </p>
          </section>

          <ClaimForm />
        </div>
      </main>
      <footer className="py-6 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Ayush Shield. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
