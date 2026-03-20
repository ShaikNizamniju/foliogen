import { useState, ReactNode } from 'react';
import { Lock, Sparkles, Crown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePro } from '@/contexts/ProContext';
import { useAuth } from '@/contexts/AuthContext';
import { handlePayment } from '@/lib/payment';
import { motion } from 'framer-motion';

interface ProGateProps {
  children?: ReactNode;
  featureName: string;
  variant?: 'overlay' | 'inline' | 'button';
  className?: string;
}

export function ProGate({
  children,
  featureName,
  variant = 'overlay',
  className = ''
}: ProGateProps) {
  const { isPro, loading, refreshProStatus } = usePro();
  const { user } = useAuth();
  const [paying, setPaying] = useState(false);

  const handleUpgrade = async () => {
    if (!user) return;

    setPaying(true);
    try {
      await handlePayment(
        { id: user.id, email: user.email, name: user.user_metadata?.full_name },
        'PRO',
        () => {
          refreshProStatus();
        }
      );
    } catch (error) {

    } finally {
      setPaying(false);
    }
  };

  // If Pro, just render children
  if (isPro) {
    return <>{children}</>;
  }

  // Button variant - show upgrade button instead of content
  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        size="sm"
        className={`bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border-amber-500/30 text-amber-600 hover:text-amber-700 gap-2 ${className}`}
        onClick={handleUpgrade}
        disabled={paying || loading}
      >
        {paying ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Crown className="h-4 w-4" />
            Upgrade to use {featureName}
          </>
        )}
      </Button>
    );
  }

  // Inline variant - simpler locked state
  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-6 text-center ${className}`}
      >
        <div className="p-3 rounded-full bg-amber-500/10 w-fit mx-auto mb-4">
          <Lock className="h-6 w-6 text-amber-500" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">
          Unlock {featureName}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upgrade to Pro to access this feature
        </p>
        <Button
          onClick={handleUpgrade}
          disabled={paying || loading}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
        >
          {paying ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Claim Free Pro Access
            </>
          )}
        </Button>
      </motion.div>
    );
  }

  // Overlay variant - shows children with locked overlay
  return (
    <div className={`relative ${className}`}>
      {/* Blurred content preview */}
      <div className="blur-sm opacity-50 pointer-events-none select-none">
        {children}
      </div>

      {/* Lock overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl"
      >
        <div className="text-center p-6 max-w-sm">
          <div className="p-4 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 w-fit mx-auto mb-4">
            <Lock className="h-8 w-8 text-amber-500" />
          </div>
          <h3 className="font-bold text-lg text-foreground mb-2">
            {featureName}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Upgrade to Pro to unlock this premium feature
          </p>
          <Button
            onClick={handleUpgrade}
            disabled={paying || loading}
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25"
          >
            {paying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Claim Free Pro Access
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
