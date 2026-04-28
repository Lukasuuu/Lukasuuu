import { Calendar, MessageCircle, CreditCard, Users, BarChart3, Smartphone } from "lucide-react";
import { useTilt } from "@/hooks/useTilt";

/**
 * Features Section Component
 * Design: Dark background with gradient feature cards
 * - 6 feature cards with icons and descriptions
 * - Gradient borders and hover effects
 * - Responsive grid layout
 */
/**
 * Features Card Component with 3D Tilt Effect
 */
function FeatureCard({ feature, index }: { feature: any; index: number }) {
  const { ref, tiltStyle } = useTilt();
  const Icon = feature.icon;

  return (
    <div
      ref={ref}
      style={tiltStyle as React.CSSProperties}
      className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
    >
      {/* Gradient Border Effect */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="text-white" size={24} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-2">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-foreground/70 text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

export default function Features() {
  const features = [
    {
      icon: Calendar,
      title: "Marcações Online",
      description: "Permita que os clientes marquem serviços 24/7 através da sua página pública.",
      color: "from-blue-400 to-cyan-400",
    },
    {
      icon: Smartphone,
      title: "Aplicação Móvel",
      description: "Gerencie o seu negócio em qualquer lugar com a app para iOS e Android.",
      color: "from-cyan-400 to-green-400",
    },
    {
      icon: CreditCard,
      title: "Ponto de Venda",
      description: "Integre pagamentos e gerencie vendas directamente no sistema.",
      color: "from-green-400 to-emerald-400",
    },
    {
      icon: MessageCircle,
      title: "Notificações Inteligentes",
      description: "Envie lembretes por WhatsApp, Telegram e Email automaticamente.",
      color: "from-blue-500 to-purple-500",
    },
    {
      icon: Users,
      title: "CRM de Clientes",
      description: "Mantenha histórico completo de cada cliente e personalize o atendimento.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: BarChart3,
      title: "Relatórios & Analytics",
      description: "Acompanhe vendas, ocupação e desempenho com relatórios detalhados.",
      color: "from-pink-500 to-red-500",
    },
  ];

  return (
    <section id="features" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://d2xsxph8kpxj0f.cloudfront.net/310419663028509195/5ixqLLB2nC7T5i2mEf8auL/bookme-features-bg-9i4L8DvgzH4HxHomDoyGcv.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
      </div>

      <div className="relative z-10 container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Funcionalidades Poderosas
            </span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Tudo o que precisa para gerir o seu negócio de forma eficiente e profissional.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
