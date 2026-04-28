import { Monitor, Smartphone, Apple, Tablet, Download, CheckCircle } from 'lucide-react';

const platforms = [
  {
    icon: Monitor,
    title: 'Windows & Mac',
    subtitle: 'Computador',
    desc: 'Use no browser ou instale como app de ambiente de trabalho via Chrome ou Edge.',
    color: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/20',
  },
  {
    icon: Smartphone,
    title: 'Android',
    subtitle: 'Telemóvel Android',
    desc: 'Instale diretamente do Chrome — sem Google Play, sem taxas, sem esperas.',
    color: 'from-green-500/20 to-green-600/10',
    border: 'border-green-500/20',
  },
  {
    icon: Apple,
    title: 'iPhone & iPad',
    subtitle: 'iOS / iPadOS',
    desc: 'Adicione ao ecrã inicial via Safari em segundos. Funciona como uma app nativa.',
    color: 'from-gray-500/20 to-gray-600/10',
    border: 'border-gray-500/20',
  },
  {
    icon: Tablet,
    title: 'Tablet',
    subtitle: 'Qualquer tablet',
    desc: 'Interface adaptada para ecrãs maiores. Perfeito para a receção do negócio.',
    color: 'from-purple-500/20 to-purple-600/10',
    border: 'border-purple-500/20',
  },
];

const benefits = [
  'Sem App Store nem Google Play',
  'Sem taxas de publicação',
  'Atualização automática',
  'Funciona offline',
  'Notificações push nativas',
  'Instalação em segundos',
];

export default function Platforms() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-cyan-950/10 to-background z-0" />

      <div className="relative z-10 container">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
            PWA — Progressive Web App
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Disponível em Todas as Plataformas
            </span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Use o BookMe no computador, telemóvel ou tablet.
            Instale como app sem precisar da App Store nem do Google Play.
          </p>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {platforms.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className={`relative rounded-2xl overflow-hidden border ${p.border} bg-gradient-to-br ${p.color} backdrop-blur-sm p-6 text-center transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs text-foreground/50 mb-1">{p.subtitle}</p>
                <h3 className="font-bold text-white mb-2">{p.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Benefits */}
        <div className="bg-card/50 border border-border rounded-2xl p-8 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <Download className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-lg">Porquê instalar o BookMe como app?</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-sm text-foreground/80">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <Download className="w-5 h-5" />
            Experimente Grátis em Qualquer Dispositivo
          </a>
        </div>
      </div>
    </section>
  );
}
