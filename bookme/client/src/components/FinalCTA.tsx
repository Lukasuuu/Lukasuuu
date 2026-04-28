import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

/**
 * Final CTA Section Component
 * Design: Eye-catching gradient background with strong call-to-action
 * - Main CTA button
 * - Secondary text
 * - Responsive design
 */
export default function FinalCTA() {
  const handleGetStarted = () => {
    // This would redirect to signup in a real implementation
    console.log("Get started clicked");
  };

  return (
    <section id="cta" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-green-600/20 z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-0" />

      <div className="relative z-10 container max-w-3xl text-center">
        {/* Main Heading */}
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
            Comece a receber marcações hoje
          </span>
        </h2>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-foreground/80 mb-8 leading-relaxed">
          Junte-se a milhares de negócios que já transformaram a forma como gerem as suas marcações com BookMe.
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-base px-10 py-7 rounded-lg group"
            onClick={handleGetStarted}
          >
            Registar-se Gratuitamente
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-blue-500/30 hover:bg-blue-500/10 text-white text-base px-10 py-7 rounded-lg"
          >
            Agendar Demonstração
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-foreground/70">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>Sem cartão de crédito necessário</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>Teste gratuito de 14 dias</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>Cancelar a qualquer momento</span>
          </div>
        </div>
      </div>
    </section>
  );
}
