import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlan } from '@/hooks/usePlan';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { CreditCard, CheckCircle, AlertCircle, ExternalLink, Zap, Building2, Star } from 'lucide-react';
import { toast } from 'sonner';

const STRIPE_PRICES = {
  pro_monthly: import.meta.env.VITE_STRIPE_PRICE_PRO_MONTHLY || '',
  pro_yearly: import.meta.env.VITE_STRIPE_PRICE_PRO_YEARLY || '',
  business_monthly: import.meta.env.VITE_STRIPE_PRICE_BUSINESS_MONTHLY || '',
  business_yearly: import.meta.env.VITE_STRIPE_PRICE_BUSINESS_YEARLY || '',
};

const plans = [
  {
    id: 'free',
    name: 'Grátis',
    price: '€0',
    period: '/mês',
    description: 'Para começar',
    icon: Star,
    color: 'border-border',
    features: ['1 staff', 'Marcações ilimitadas', 'Email de confirmação', 'Página de booking'],
    priceIdMonthly: '',
    priceIdYearly: '',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '€14.90',
    priceYearly: '€149.00',
    period: '/mês',
    vatInfo: 'IVA incluído',
    description: 'Para crescer',
    icon: Zap,
    color: 'border-blue-500/50',
    highlighted: true,
    features: ['5 staff', 'WhatsApp & Telegram', 'Widget embeddable', 'Lista de espera', 'Campanhas marketing'],
    priceIdMonthly: STRIPE_PRICES.pro_monthly,
    priceIdYearly: STRIPE_PRICES.pro_yearly,
  },
  {
    id: 'business',
    name: 'Business',
    price: '€29.90',
    priceYearly: '€299.00',
    period: '/mês',
    vatInfo: 'IVA incluído',
    description: 'Para escalar',
    icon: Building2,
    color: 'border-purple-500/50',
    features: ['Staff ilimitado', 'Ponto de Venda', 'Relatórios avançados', 'API integração', 'Suporte prioritário'],
    priceIdMonthly: STRIPE_PRICES.business_monthly,
    priceIdYearly: STRIPE_PRICES.business_yearly,
  },
];

export default function Billing() {
  const { user, session } = useAuth() as any;
  const { plan } = usePlan();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [immediateServiceAccepted, setImmediateServiceAccepted] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        setSubscription(data);
        setLoading(false);
      });
  }, [user]);

  const handleCheckout = async (planId: string, priceIdMonthly: string, priceIdYearly: string) => {
    if (!priceIdMonthly && !priceIdYearly) {
      toast.error('Stripe não está configurado. Por favor, configure as variáveis de ambiente.');
      return;
    }
    if (!termsAccepted || !immediateServiceAccepted) {
      toast.error('Por favor, aceite os termos antes de continuar.');
      return;
    }

    const priceId = billingCycle === 'yearly' ? priceIdYearly : priceIdMonthly;
    if (!priceId) {
      toast.error('Preço não disponível para este ciclo de faturação.');
      return;
    }

    setCheckoutLoading(planId);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          userEmail: user.email,
          planType: planId,
          appUrl: window.location.origin,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Erro ao iniciar checkout');
      }
    } catch {
      toast.error('Erro de rede. Tente novamente.');
    } finally {
      setCheckoutLoading('');
    }
  };

  const handleManageSubscription = async () => {
    if (!subscription?.stripe_customer_id) return;
    try {
      const res = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: subscription.stripe_customer_id,
          appUrl: window.location.origin,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      toast.error('Erro ao abrir portal de faturação');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-400" />
            Faturação e Planos
          </h1>
          <p className="text-foreground/70 mt-1">Gerir subscrição e método de pagamento</p>
        </div>

        {/* Current Plan */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-foreground/70 mb-1">Plano atual</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-white capitalize">{plan}</span>
                {plan !== 'free' && (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full border border-blue-500/30">
                    Ativo
                  </span>
                )}
              </div>
              {subscription?.current_period_end && (
                <p className="text-sm text-foreground/60 mt-1">
                  Próxima renovação: {new Date(subscription.current_period_end).toLocaleDateString('pt-PT')}
                </p>
              )}
            </div>
            {plan !== 'free' && subscription?.stripe_customer_id && (
              <Button
                onClick={handleManageSubscription}
                variant="outline"
                className="gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
              >
                <ExternalLink className="w-4 h-4" />
                Gerir Subscrição
              </Button>
            )}
          </div>

          {subscription?.status === 'payment_failed' && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-red-400 text-sm">Falha no pagamento. Por favor, atualize o seu método de pagamento.</p>
              <Button size="sm" onClick={handleManageSubscription} className="ml-auto bg-red-500 hover:bg-red-600 text-white text-xs">
                Atualizar
              </Button>
            </div>
          )}
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-card border border-border rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-blue-500 text-white' : 'text-foreground/70 hover:text-foreground'}`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-blue-500 text-white' : 'text-foreground/70 hover:text-foreground'}`}
            >
              Anual
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">-17%</span>
            </button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((p) => {
            const Icon = p.icon;
            const isCurrent = plan === p.id;
            const displayPrice = billingCycle === 'yearly' && p.priceYearly ? p.priceYearly : p.price;
            const periodLabel = billingCycle === 'yearly' ? '/ano' : '/mês';

            return (
              <div
                key={p.id}
                className={`relative rounded-xl border-2 p-6 transition-all ${p.color} ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-background' : ''} ${p.highlighted ? 'bg-blue-950/20' : 'bg-card'}`}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                    Plano atual
                  </div>
                )}
                <Icon className="w-6 h-6 text-blue-400 mb-3" />
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <div className="mt-2 mb-1">
                  <span className="text-3xl font-bold text-white">{displayPrice}</span>
                  <span className="text-foreground/60 text-sm ml-1">{periodLabel}</span>
                </div>
                {p.vatInfo && <p className="text-xs text-foreground/50 mb-4">{p.vatInfo}</p>}
                <ul className="space-y-2 mb-6 mt-4">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {p.id !== 'free' && !isCurrent && (
                  <Button
                    onClick={() => handleCheckout(p.id, p.priceIdMonthly, p.priceIdYearly)}
                    disabled={!!checkoutLoading || !termsAccepted || !immediateServiceAccepted}
                    className={`w-full ${p.highlighted ? 'bg-blue-500 hover:bg-blue-600' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
                  >
                    {checkoutLoading === p.id ? 'A redirecionar...' : `Upgrade para ${p.name}`}
                  </Button>
                )}
                {isCurrent && p.id !== 'free' && (
                  <Button variant="outline" className="w-full border-border" onClick={handleManageSubscription}>
                    Gerir Subscrição
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Legal Checkboxes */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-white text-sm">Termos de subscrição</h3>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 accent-blue-500"
            />
            <span className="text-sm text-foreground/70">
              Li e aceito os{' '}
              <a href="/terms-and-conditions" target="_blank" className="text-blue-400 underline">Termos e Condições</a>{' '}
              e a{' '}
              <a href="/privacy-policy" target="_blank" className="text-blue-400 underline">Política de Privacidade</a>
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={immediateServiceAccepted}
              onChange={(e) => setImmediateServiceAccepted(e.target.checked)}
              className="mt-1 accent-blue-500"
            />
            <span className="text-sm text-foreground/70">
              Autorizo o início imediato do serviço e reconheço que perco o direito de arrependimento de 14 dias após o início da utilização, nos termos do Art. 17.º do Decreto-Lei n.º 24/2014.
            </span>
          </label>
        </div>
      </div>
    </DashboardLayout>
  );
}
