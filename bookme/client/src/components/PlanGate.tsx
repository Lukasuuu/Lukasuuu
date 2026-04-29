import { type Plan, usePlan, type PlanLimits } from '@/hooks/usePlan';
import { Lock, Zap, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

const PLAN_PRICES: Record<Plan, string> = {
  free: '€0/mês',
  pro: '€14.90/mês',
  business: '€29.90/mês',
};

const PLAN_LABELS: Record<Plan, string> = {
  free: 'Grátis',
  pro: 'Pro',
  business: 'Business',
};

interface PlanGateProps {
  feature: keyof PlanLimits;
  requiredPlan?: Plan;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function PlanGate({ feature, requiredPlan = 'pro', children, fallback }: PlanGateProps) {
  const { hasFeature } = usePlan();

  if (hasFeature(feature)) return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  return <UpgradePrompt requiredPlan={requiredPlan} feature={feature} />;
}

function UpgradePrompt({ requiredPlan, feature }: { requiredPlan: Plan; feature: keyof PlanLimits }) {
  const [, navigate] = useLocation();

  const featureLabels: Partial<Record<keyof PlanLimits, string>> = {
    whatsappNotifications: 'Notificações WhatsApp',
    telegramNotifications: 'Notificações Telegram',
    bookingWidget: 'Widget de Reservas',
    waitingList: 'Lista de Espera',
    recurringBookings: 'Marcações Recorrentes',
    marketingCampaigns: 'Campanhas de Marketing',
    posSystem: 'Ponto de Venda',
    advancedReports: 'Relatórios Avançados',
    integrationApi: 'API de Integração',
    exportData: 'Exportar Dados',
    autoCommissions: 'Comissões Automáticas',
    prioritySupport: 'Suporte Prioritário',
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-6">
        <Lock className="w-8 h-8 text-blue-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">
        {featureLabels[feature] || 'Esta funcionalidade'}
      </h3>
      <p className="text-foreground/70 mb-6 max-w-sm">
        Esta funcionalidade está disponível no plano{' '}
        <span className="text-blue-400 font-semibold">{PLAN_LABELS[requiredPlan]}</span>{' '}
        ({PLAN_PRICES[requiredPlan]}).
      </p>
      <Button
        onClick={() => navigate('/dashboard/billing')}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white gap-2"
      >
        {requiredPlan === 'business' ? (
          <Building2 className="w-4 h-4" />
        ) : (
          <Zap className="w-4 h-4" />
        )}
        Fazer Upgrade para {PLAN_LABELS[requiredPlan]}
      </Button>
    </div>
  );
}
