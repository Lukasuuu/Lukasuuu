import { useAuth } from '@/contexts/AuthContext';

export type Plan = 'free' | 'pro' | 'business';

export interface PlanLimits {
  staffLimit: number; // -1 = unlimited
  whatsappNotifications: boolean;
  telegramNotifications: boolean;
  bookingWidget: boolean;
  waitingList: boolean;
  recurringBookings: boolean;
  marketingCampaigns: boolean;
  posSystem: boolean;
  advancedReports: boolean;
  integrationApi: boolean;
  prioritySupport: boolean;
  autoCommissions: boolean;
  exportData: boolean;
}

const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    staffLimit: 1,
    whatsappNotifications: false,
    telegramNotifications: false,
    bookingWidget: false,
    waitingList: false,
    recurringBookings: false,
    marketingCampaigns: false,
    posSystem: false,
    advancedReports: false,
    integrationApi: false,
    prioritySupport: false,
    autoCommissions: false,
    exportData: false,
  },
  pro: {
    staffLimit: 5,
    whatsappNotifications: true,
    telegramNotifications: true,
    bookingWidget: true,
    waitingList: true,
    recurringBookings: true,
    marketingCampaigns: true,
    posSystem: false,
    advancedReports: false,
    integrationApi: false,
    prioritySupport: false,
    autoCommissions: false,
    exportData: false,
  },
  business: {
    staffLimit: -1,
    whatsappNotifications: true,
    telegramNotifications: true,
    bookingWidget: true,
    waitingList: true,
    recurringBookings: true,
    marketingCampaigns: true,
    posSystem: true,
    advancedReports: true,
    integrationApi: true,
    prioritySupport: true,
    autoCommissions: true,
    exportData: true,
  },
};

export function usePlan() {
  const { profile } = useAuth() as any;
  const plan: Plan = (profile?.plan as Plan) || 'free';
  const limits = PLAN_LIMITS[plan];

  const hasFeature = (feature: keyof PlanLimits): boolean => {
    const val = limits[feature];
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val !== 0;
    return false;
  };

  const isPro = plan === 'pro' || plan === 'business';
  const isBusiness = plan === 'business';

  return { plan, limits, hasFeature, isPro, isBusiness };
}
