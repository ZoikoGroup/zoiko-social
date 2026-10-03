import Link from 'next/link';
import { CheckCircle2, LayoutDashboard, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SubscribedSuccessfullyPage({ searchParams }: { searchParams: { plan?: string } }) {
  const plan = searchParams.plan || 'commercial';
  
  let planName = 'Premium';
  if (plan === 'seller_professional') planName = 'Seller Professional';
  if (plan === 'breeder_professional') planName = 'Breeder Professional';
  if (plan === 'care_professional') planName = 'Care Professional';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface-50 dark:bg-surface-900">
      <div className="max-w-md w-full bg-white dark:bg-surface-800 rounded-3xl p-8 shadow-xl text-center border border-surface-200 dark:border-surface-700 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
          Subscribed Successfully!
        </h1>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          Welcome to your <span className="font-semibold text-primary">{planName}</span> plan. 
          Your account has been upgraded and your new limits are now active.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/dashboard">
            <Button size="lg" className="w-full flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5" />
              Go to My Dashboard
            </Button>
          </Link>
          
          <Link href="/settings?section=billing">
            <Button variant="outline" size="lg" className="w-full flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Manage Billing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
