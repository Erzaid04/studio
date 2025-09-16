import { ShieldIcon } from '@/components/icons';
import { Home, ShieldCheck, History, Info, Check } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar-DEFAULT text-sidebar-foreground p-6 flex flex-col justify-between border-r">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-primary p-2 rounded-lg">
            <ShieldIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-headline font-bold">
              Ayush Shield
            </h1>
            <p className="text-sm text-muted-foreground">स्वास्थ्य की सुरक्षा</p>
          </div>
        </div>
        
        <nav className="space-y-4">
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Navigation</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="flex items-center gap-3 py-2 px-3 rounded-md bg-secondary text-primary font-semibold">
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-secondary">
                  <ShieldCheck className="h-5 w-5" />
                  <span>Verify Health Claims</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-secondary">
                  <History className="h-5 w-5" />
                  <span>Verification History</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-secondary">
                  <Info className="h-5 w-5" />
                  <span>About</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Trusted Sources</h2>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>World Health Organization</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>Indian Council of Medical Research</span>
          </li>
           <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>Ministry of Ayush</span>
          </li>
           <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>Verified Medical Journals</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
