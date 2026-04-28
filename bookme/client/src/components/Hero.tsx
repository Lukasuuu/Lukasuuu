import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

/**
 * Hero Section Component
 * Design: Dark background with gradient hero image overlay
 * - Main title and subtitle
 * - Primary CTA "Comece Grátis Agora"
 * - Secondary CTA "Ver Demonstração"
 * - Background image with geometric shapes
 */
export default function Hero() {
  const handleGetStarted = () => {
    const element = document.getElementById("cta");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://d2xsxph8kpxj0f.cloudfront.net/310419663028509195/5ixqLLB2nC7T5i2mEf8auL/bookme-hero-bg-ZSfebvnPGzmmwJ6wx8nVqf.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-blue-300">Mais de 5.000 negócios confiam em BookMe</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
            Software de marcações
          </span>
          <br />
          <span className="text-white">que ajuda o seu negócio a crescer</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed">
          Marcações, vendas e clientes — tudo num só lugar. Deixe connosco as suas tarefas mais aborrecidas enquanto se concentra no que faz melhor.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-base px-8 py-6 rounded-lg group"
            onClick={handleGetStarted}
          >
            Comece Grátis Agora
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-blue-500/30 hover:bg-blue-500/10 text-white text-base px-8 py-6 rounded-lg"
          >
            <Play size={20} className="mr-2" />
            Ver Demonstração
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-foreground/60">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-background"
                />
              ))}
            </div>
            <span>Milhares de utilizadores satisfeitos</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-border" />
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-green-400">★</span>
            ))}
            <span className="ml-2">4.9/5 no Trustpilot</span>
          </div>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-foreground/50">Scroll para explorar</span>
          <div className="w-6 h-10 border border-foreground/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-foreground/50 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
