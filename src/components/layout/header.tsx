import { ShieldPlusIcon } from '@/components/icons';

export function Header() {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b bg-card shadow-sm sticky top-0 z-20">
      <div className="container mx-auto flex items-center gap-3">
        <ShieldPlusIcon className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-headline font-bold text-foreground">
          Ayush Shield
        </h1>
      </div>
    </header>
  );
}
