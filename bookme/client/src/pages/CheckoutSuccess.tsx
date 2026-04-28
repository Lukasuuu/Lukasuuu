import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccess() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/dashboard/billing'), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500/40">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Pagamento Confirmado!</h1>
        <p className="text-foreground/70 mb-2">
          A sua conta está agora ativa. Pode começar a usar todas as funcionalidades do seu plano.
        </p>
        <p className="text-sm text-foreground/50 mb-8">
          Receberá um email de confirmação em breve. A redirecionar em 5 segundos...
        </p>
        <Button
          onClick={() => navigate('/dashboard/billing')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
        >
          Ir para o Dashboard
        </Button>
      </div>
    </div>
  );
}
