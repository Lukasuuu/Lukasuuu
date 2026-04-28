import { useLocation } from 'wouter';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutCancel() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500/40">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Pagamento Cancelado</h1>
        <p className="text-foreground/70 mb-8">
          O pagamento foi cancelado. Pode tentar novamente a qualquer momento.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => navigate('/dashboard/billing')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          >
            Tentar novamente
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="border-border text-foreground/70"
          >
            Ir ao Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
