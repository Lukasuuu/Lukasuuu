import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

/**
 * Pricing Section Component
 * Design: 3-column pricing cards with gradient accents
 * - Free, Pro, and Business plans
 * - Feature lists with checkmarks
 * - Highlighted Pro plan
 */
export default function Pricing() {
  const plans = [
    {
      name: "Grátis",
      price: "€0",
      period: "/mês",
      description: "Perfeito para começar",
      features: [
        "Marcações ilimitadas",
        "1 membro de staff",
        "Confirmações por email",
        "Página de booking pública",
        "Suporte por email",
      ],
      highlighted: false,
    },
    {
      name: "Pro",
      price: "€14.90",
      period: "/mês",
      description: "Para negócios em crescimento",
      features: [
        "Tudo do plano Grátis",
        "Notificações WhatsApp & Telegram",
        "Widget de reservas",
        "Lista de espera",
        "Marcações recorrentes",
        "Campanhas de marketing",
        "Até 5 membros de staff",
      ],
      highlighted: true,
    },
    {
      name: "Business",
      price: "€29.90",
      period: "/mês",
      description: "Para empresas estabelecidas",
      features: [
        "Tudo do plano Pro",
        "Ponto de Venda integrado",
        "Relatórios avançados",
        "Staff ilimitado",
        "API de integração",
        "Suporte prioritário",
        "Comissões automáticas",
      ],
      highlighted: false,
    },
  ];

  const handleCheckout = (planName: string) => {
    if (planName === 'Grátis') {
      window.location.href = '/signup';
    } else {
      window.location.href = '/dashboard/billing';
    }
  };

  return (
    <section id="pricing" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-blue-950/10 to-background z-0" />

      <div className="relative z-10 container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Planos Simples e Transparentes
            </span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Escolha o plano que melhor se adequa ao seu negócio. Sem contratos de longa duração.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                plan.highlighted
                  ? "md:scale-105 md:z-10"
                  : ""
              }`}
            >
              {/* Card Background */}
              <div
                className={`absolute inset-0 ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-blue-600/20 to-cyan-600/20"
                    : "bg-card/40"
                } backdrop-blur-sm`}
              />

              {/* Border */}
              <div
                className={`absolute inset-0 rounded-2xl ${
                  plan.highlighted
                    ? "border-2 border-blue-500/50"
                    : "border border-border"
                }`}
              />

              {/* Badge */}
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold">
                    Mais Popular
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 p-8">
                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-foreground/70 text-sm mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-5xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-foreground/70 ml-2">
                    {plan.period}
                  </span>
                </div>
                {plan.price !== '€0' && (
                  <p className="text-xs text-foreground/50 mb-6">IVA incluído (23%)</p>
                )}
                {plan.price === '€0' && <div className="mb-6" />}

                {/* CTA Button */}
                <Button
                  className={`w-full mb-8 py-6 rounded-lg font-semibold transition-all duration-300 ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                      : "border border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                  }`}
                  onClick={() => handleCheckout(plan.name)}
                >
                  Comece Agora
                </Button>

                {/* Features List */}
                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/80 text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <p className="text-foreground/70 text-sm">
            Preços com IVA incluído (23%). Sem contratos de longa duração. Cancele a qualquer momento.
            <br />
            Precisa de ajuda? <a href="/contact" className="text-blue-400 hover:text-blue-300 underline">Contacte-nos</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
