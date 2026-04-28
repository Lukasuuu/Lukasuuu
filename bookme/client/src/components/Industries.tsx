import { Scissors, Zap, Stethoscope, Coffee, ShoppingBag, Palette, Wrench, Dumbbell } from "lucide-react";

/**
 * Industries Section Component
 * Design: Grid of industry cards with icons
 * - 8 different business types
 * - Hover effects and gradient accents
 * - Responsive grid layout
 */
export default function Industries() {
  const industries = [
    {
      icon: Scissors,
      title: "Salões de Beleza",
      description: "Gerencie cortes, colorações e tratamentos",
    },
    {
      icon: Zap,
      title: "Barbearias",
      description: "Organize agendamentos e clientes regulares",
    },
    {
      icon: Stethoscope,
      title: "Clínicas de Saúde",
      description: "Consultas, exames e acompanhamentos",
    },
    {
      icon: Coffee,
      title: "Restaurantes & Cafés",
      description: "Reservas de mesas e eventos",
    },
    {
      icon: ShoppingBag,
      title: "Lojas de Retalho",
      description: "Serviços de consultoria e atendimento",
    },
    {
      icon: Palette,
      title: "Estúdios de Design",
      description: "Sessões de fotografia e consultoria criativa",
    },
    {
      icon: Wrench,
      title: "Oficinas Mecânicas",
      description: "Reparações e manutenção de veículos",
    },
    {
      icon: Dumbbell,
      title: "Centros de Estética",
      description: "Tratamentos e aulas personalizadas",
    },
  ];

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Para Todos os Negócios
            </span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            BookMe é perfeito para qualquer tipo de negócio que dependa de marcações.
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <div
                key={index}
                className="group relative p-6 rounded-lg bg-card/40 backdrop-blur-sm border border-border hover:border-green-500/50 transition-all duration-300 hover:bg-card/60"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="text-white" size={24} />
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-white mb-1">
                  {industry.title}
                </h3>

                {/* Description */}
                <p className="text-foreground/60 text-sm leading-relaxed">
                  {industry.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
