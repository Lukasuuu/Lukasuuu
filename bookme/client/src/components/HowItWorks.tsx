import { UserPlus, Settings, CheckCircle } from "lucide-react";

/**
 * How It Works Section Component
 * Design: 3-step process with icons and descriptions
 * - Clean, linear layout
 * - Numbered steps with connecting lines
 * - Responsive design
 */
export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: UserPlus,
      title: "Registe-se Gratuitamente",
      description: "Crie a sua conta em menos de 2 minutos. Sem cartão de crédito necessário.",
    },
    {
      number: 2,
      icon: Settings,
      title: "Configure os Seus Serviços",
      description: "Adicione os seus serviços, preços, horários e membros da equipa.",
    },
    {
      number: 3,
      icon: CheckCircle,
      title: "Receba Marcações Online",
      description: "Partilhe a sua página de booking e comece a receber marcações imediatamente.",
    },
  ];

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-background via-background/95 to-background overflow-hidden">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Como Funciona
            </span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Três passos simples para começar a gerir as suas marcações de forma profissional.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (hidden on mobile) */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 z-0" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative z-10">
                {/* Step Card */}
                <div className="text-center">
                  {/* Icon Circle */}
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-6 mx-auto ring-4 ring-background">
                    <Icon className="text-white" size={32} />
                  </div>

                  {/* Step Number */}
                  <div className="absolute top-0 right-0 md:left-1/2 md:-translate-x-1/2 md:top-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg ring-4 ring-background">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
