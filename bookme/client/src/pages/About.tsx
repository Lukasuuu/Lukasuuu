import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Target, Heart, Users, Zap } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Missão',
    description: 'Simplificar a gestão de marcações para qualquer negócio, independentemente do tamanho ou setor, com tecnologia acessível e intuitiva.',
  },
  {
    icon: Heart,
    title: 'Valores',
    description: 'Confiança, transparência e foco no cliente. Acreditamos que a tecnologia deve servir as pessoas, não o contrário.',
  },
  {
    icon: Users,
    title: 'Para Todos',
    description: 'Do salão de barbearia à clínica de saúde, do estúdio de yoga à oficina mecânica — o BookMe adapta-se ao seu negócio.',
  },
  {
    icon: Zap,
    title: 'Inovação',
    description: 'Desenvolvemos constantemente novas funcionalidades baseadas no feedback dos nossos utilizadores para que o seu negócio cresça.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="container text-center py-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Sobre o{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              BookMe
            </span>
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Somos uma empresa portuguesa dedicada a simplificar a gestão de marcações para negócios de todos os tamanhos.
            O nosso objetivo é ajudar os empreendedores a focar-se no que realmente importa — os seus clientes.
          </p>
        </section>

        {/* Story */}
        <section className="container py-16 max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-6">A Nossa História</h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>
                O BookMe nasceu da necessidade real de simplificar a gestão de marcações. Ao trabalhar com pequenos negócios em Portugal, percebemos que muitos ainda dependiam de cadernos, folhas de papel ou mensagens de WhatsApp para gerir as suas marcações — perdendo tempo precioso e, muitas vezes, clientes.
              </p>
              <p>
                Em 2026, desenvolvemos a primeira versão do BookMe com um objetivo claro: criar uma plataforma tão simples que qualquer pessoa pudesse usar, mas suficientemente poderosa para gerir um negócio real. Sem complicações. Sem contratos longos. Sem custos escondidos.
              </p>
              <p>
                Hoje, o BookMe serve dezenas de negócios em Portugal — desde salões de beleza a clínicas, de estúdios de pilates a restaurantes. E estamos apenas a começar.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="container py-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Os Nossos Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Company Info */}
        <section className="container py-16 max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Informação da Empresa</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex gap-4 py-2 border-b border-border">
                <dt className="text-foreground/60 w-40 flex-shrink-0">Designação:</dt>
                <dd className="text-foreground/90">[NOME_EMPRESA]</dd>
              </div>
              <div className="flex gap-4 py-2 border-b border-border">
                <dt className="text-foreground/60 w-40 flex-shrink-0">NIF:</dt>
                <dd className="text-foreground/90">[NIF]</dd>
              </div>
              <div className="flex gap-4 py-2 border-b border-border">
                <dt className="text-foreground/60 w-40 flex-shrink-0">Morada:</dt>
                <dd className="text-foreground/90">[MORADA_FISCAL]</dd>
              </div>
              <div className="flex gap-4 py-2 border-b border-border">
                <dt className="text-foreground/60 w-40 flex-shrink-0">Email:</dt>
                <dd className="text-foreground/90">
                  <a href="mailto:[EMAIL_CONTACTO]" className="text-blue-400 hover:text-blue-300">[EMAIL_CONTACTO]</a>
                </dd>
              </div>
              <div className="flex gap-4 py-2">
                <dt className="text-foreground/60 w-40 flex-shrink-0">Telefone:</dt>
                <dd className="text-foreground/90">[TELEFONE]</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
