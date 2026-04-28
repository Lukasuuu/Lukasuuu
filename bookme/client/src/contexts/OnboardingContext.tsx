import React, { createContext, useContext, useState, ReactNode } from 'react';

export type OnboardingStep = 'business' | 'hours' | 'service' | 'staff' | 'complete';

interface OnboardingData {
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  workingHours?: Record<string, { open: string; close: string }>;
  serviceId?: string;
  staffAdded?: boolean;
}

interface OnboardingContextType {
  isOnboarding: boolean;
  currentStep: OnboardingStep;
  data: OnboardingData;
  setOnboarding: (value: boolean) => void;
  setCurrentStep: (step: OnboardingStep) => void;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipStep: () => void;
  completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('business');
  const [data, setData] = useState<OnboardingData>({});

  const steps: OnboardingStep[] = ['business', 'hours', 'service', 'staff', 'complete'];
  const currentIndex = steps.indexOf(currentStep);

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const previousStep = () => {
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const skipStep = () => {
    nextStep();
  };

  const completeOnboarding = () => {
    setIsOnboarding(false);
    setCurrentStep('business');
    setData({});
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboarding,
        currentStep,
        data,
        setOnboarding: setIsOnboarding,
        setCurrentStep,
        updateData,
        nextStep,
        previousStep,
        skipStep,
        completeOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
