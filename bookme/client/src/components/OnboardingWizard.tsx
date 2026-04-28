import { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Copy } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { toast } from 'sonner';

export default function OnboardingWizard() {
  const {
    isOnboarding,
    currentStep,
    data,
    updateData,
    nextStep,
    previousStep,
    skipStep,
    completeOnboarding,
  } = useOnboarding();

  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 'business', label: 'Dados do Negócio', icon: '🏢' },
    { id: 'hours', label: 'Horários', icon: '⏰' },
    { id: 'service', label: 'Serviço', icon: '💇' },
    { id: 'staff', label: 'Staff', icon: '👥' },
    { id: 'complete', label: 'Concluído', icon: '🎉' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    updateData({
      businessName: formData.get('businessName') as string,
      businessAddress: formData.get('businessAddress') as string,
      businessPhone: formData.get('businessPhone') as string,
    });
    nextStep();
  };

  const handleHoursSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const hours: Record<string, { open: string; close: string }> = {};
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    days.forEach((day) => {
      hours[day] = {
        open: formData.get(`${day}_open`) as string,
        close: formData.get(`${day}_close`) as string,
      };
    });
    
    updateData({ workingHours: hours });
    nextStep();
  };

  const copyBookingLink = () => {
    const link = `${window.location.origin}/book/${data.businessName?.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copiado para clipboard!');
  };

  if (!isOnboarding) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Progress Bar */}
        <div className="h-1 bg-background">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Bem-vindo ao BookMe! 🚀</h1>
            <span className="text-sm text-foreground/70">
              Passo {currentStepIndex + 1} de {steps.length}
            </span>
          </div>

          {/* Step Indicators */}
          <div className="flex gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    index <= currentStepIndex
                      ? 'bg-blue-500 text-white'
                      : 'bg-background text-foreground/50 border border-border'
                  }`}
                >
                  {index < currentStepIndex ? <Check size={20} /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-12 mx-1 transition-all ${
                      index < currentStepIndex ? 'bg-blue-500' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Business Data */}
          {currentStep === 'business' && (
            <form onSubmit={handleBusinessSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nome do Negócio *
                </label>
                <input
                  type="text"
                  name="businessName"
                  defaultValue={data.businessName}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500"
                  placeholder="ex: Salão de Beleza XYZ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Morada
                </label>
                <input
                  type="text"
                  name="businessAddress"
                  defaultValue={data.businessAddress}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500"
                  placeholder="ex: Rua Principal, 123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="businessPhone"
                  defaultValue={data.businessPhone}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500"
                  placeholder="ex: +351 912 345 678"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={skipStep}
                  className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-background/50 transition-colors font-medium"
                >
                  Saltar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  Continuar <ChevronRight size={20} />
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Working Hours */}
          {currentStep === 'hours' && (
            <form onSubmit={handleHoursSubmit} className="space-y-4">
              <p className="text-foreground/70 mb-4">Defina os horários de funcionamento:</p>

              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(
                (day) => (
                  <div key={day} className="flex items-center gap-4">
                    <label className="w-24 text-sm font-medium text-foreground capitalize">
                      {day === 'monday' && 'Segunda'}
                      {day === 'tuesday' && 'Terça'}
                      {day === 'wednesday' && 'Quarta'}
                      {day === 'thursday' && 'Quinta'}
                      {day === 'friday' && 'Sexta'}
                      {day === 'saturday' && 'Sábado'}
                      {day === 'sunday' && 'Domingo'}
                    </label>
                    <input
                      type="time"
                      name={`${day}_open`}
                      defaultValue={data.workingHours?.[day]?.open || '09:00'}
                      className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-foreground/50">-</span>
                    <input
                      type="time"
                      name={`${day}_close`}
                      defaultValue={data.workingHours?.[day]?.close || '18:00'}
                      className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={previousStep}
                  className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-background/50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={20} /> Anterior
                </button>
                <button
                  type="button"
                  onClick={skipStep}
                  className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-background/50 transition-colors font-medium"
                >
                  Saltar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  Continuar <ChevronRight size={20} />
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Add Service */}
          {currentStep === 'service' && (
            <div className="space-y-4">
              <p className="text-foreground/70">
                Adicione pelo menos um serviço para começar a receber marcações.
              </p>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-foreground/70">
                  💡 Pode adicionar mais serviços depois no dashboard em "Serviços".
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nome do Serviço
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500"
                    placeholder="ex: Corte de Cabelo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Duração (minutos)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Preço (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500"
                    placeholder="25.00"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={previousStep}
                  className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-background/50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={20} /> Anterior
                </button>
                <button
                  type="button"
                  onClick={skipStep}
                  className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-background/50 transition-colors font-medium"
                >
                  Saltar
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  Continuar <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Add Staff */}
          {currentStep === 'staff' && (
            <div className="space-y-4">
              <p className="text-foreground/70">
                Adicione membros da sua equipa (opcional).
              </p>

              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-foreground/70">
                  ✓ Pode adicionar staff depois no dashboard. Por enquanto, pode continuar como
                  único membro.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nome do Membro
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500"
                    placeholder="ex: João Silva"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500"
                    placeholder="joao@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500"
                    placeholder="+351 912 345 678"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={previousStep}
                  className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-background/50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={20} /> Anterior
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  Concluir <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {currentStep === 'complete' && (
            <div className="text-center space-y-6 py-8">
              <div className="text-6xl">🎉</div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Parabéns!</h2>
                <p className="text-foreground/70">
                  Sua conta está configurada e pronta para receber marcações.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-foreground/70 mb-3">
                  Partilhe este link com seus clientes para que possam fazer marcações:
                </p>
                <div className="flex items-center gap-2 bg-background p-3 rounded-lg">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/book/${data.businessName?.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                  />
                  <button
                    onClick={copyBookingLink}
                    className="p-2 hover:bg-background/50 rounded-lg transition-colors"
                  >
                    <Copy size={20} className="text-blue-400" />
                  </button>
                </div>
              </div>

              <button
                onClick={completeOnboarding}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold transition-all"
              >
                Ir para o Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
