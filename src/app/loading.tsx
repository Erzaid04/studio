import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="text-center max-w-4xl w-full">
        <div className="flex justify-center mb-6">
          <Skeleton className="h-24 w-24 rounded-2xl" />
        </div>
        <Skeleton className="h-12 sm:h-16 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-12 sm:h-16 w-1/2 mx-auto mb-6" />
        <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-2" />
        <Skeleton className="h-6 w-3/4 max-w-lg mx-auto mb-8" />
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Skeleton className="h-12 w-44" />
          <Skeleton className="h-12 w-36" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-36 rounded-lg" />
          <Skeleton className="h-36 rounded-lg" />
          <Skeleton className="h-36 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
