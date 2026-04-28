import { Star } from "lucide-react";

/**
 * Testimonials Section Component
 * Design: 3 testimonial cards with avatar placeholders
 * - Real Portuguese testimonials
 * - Star ratings
 * - Responsive grid layout
 */
export default function Testimonials() {
  const testimonials = [
    {
      name: "Ana Silva",
      role: "Proprietária - Salão de Beleza",
      content: "BookMe transformou completamente a forma como giro o meu salão. As marcações online aumentaram 40% e os clientes adoram a facilidade de reagendar pelo WhatsApp.",
      rating: 5,
      initials: "AS",
    },
    {
      name: "Miguel Santos",
      role: "Proprietário - Barbearia",
      content: "Antes perdia clientes porque não tinha um sistema de marcações eficiente. Agora com BookMe, tenho lista de espera, lembretes automáticos e até ganho tempo administrativo.",
      rating: 5,
      initials: "MS",
    },
    {
      name: "Carla Ferreira",
      role: "Diretora - Clínica de Estética",
      content: "O suporte da BookMe é excelente e a plataforma é muito intuitiva. Os relatórios ajudam-me a entender melhor o desempenho do negócio e tomar melhores decisões.",
      rating: 5,
      initials: "CF",
    },
  ];

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "url('https://d2xsxph8kpxj0f.cloudfront.net/310419663028509195/5ixqLLB2nC7T5i2mEf8auL/bookme-testimonial-pattern-B3DwgGzk3SdVz9V7fLTTsJ.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              O Que Dizem os Nossos Clientes
            </span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Milhares de negócios portugueses já confiam em BookMe para gerir as suas marcações.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
            >
              {/* Quote Mark */}
              <div className="absolute top-4 right-6 text-4xl text-blue-500/20">
                "
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-foreground/90 mb-6 leading-relaxed text-sm">
                  {testimonial.content}
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {testimonial.initials}
                    </span>
                  </div>

                  {/* Author Info */}
                  <div>
                    <h4 className="text-white font-semibold text-sm">
                      {testimonial.name}
                    </h4>
                    <p className="text-foreground/60 text-xs">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
