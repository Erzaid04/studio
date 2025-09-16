import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/layout/header';

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <section className="text-center mb-12">
             <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
             <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
          </section>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-28 w-full" />
              </div>
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-10 w-36" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-5 w-1/4" />
                <div className="flex items-center gap-6">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                </div>
              </div>
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
      </main>
       <footer className="py-6 px-4 sm:px-6 lg:px-8 text-center">
        <Skeleton className="h-5 w-48 mx-auto" />
      </footer>
    </div>
  );
}
