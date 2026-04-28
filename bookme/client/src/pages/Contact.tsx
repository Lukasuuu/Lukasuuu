import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error('Erro ao enviar mensagem. Por favor, tente novamente.');
      }
    } catch {
      toast.error('Erro de rede. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: '[EMAIL_CONTACTO]', href: 'mailto:[EMAIL_CONTACTO]' },
    { icon: Phone, label: 'Telefone', value: '[TELEFONE]', href: 'tel:[TELEFONE]' },
    { icon: MapPin, label: 'Morada', value: '[MORADA_FISCAL]', href: undefined },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <section className="container py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Fale <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Connosco</span>
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Tem alguma dúvida, sugestão ou precisa de ajuda? Estamos sempre disponíveis.
          </p>
        </section>

        <section className="container py-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-4">
              {contactInfo.map((info, i) => {
                const Icon = info.icon;
                return (
                  <div key={i} className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60 mb-0.5">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="text-foreground/90 hover:text-blue-400 transition-colors text-sm font-medium">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-foreground/90 text-sm font-medium">{info.value}</p>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="bg-card border border-border rounded-xl p-5">
                <p className="text-sm text-foreground/60 mb-2">Horário de atendimento</p>
                <p className="text-foreground/90 text-sm font-medium">Segunda a Sexta</p>
                <p className="text-foreground/70 text-sm">09:00 — 18:00</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3 bg-card border border-border rounded-xl p-6">
              {sent ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Mensagem enviada!</h3>
                  <p className="text-foreground/70">Respondemos em até 24 horas úteis.</p>
                  <Button
                    onClick={() => setSent(false)}
                    variant="outline"
                    className="mt-6 border-border"
                  >
                    Enviar outra mensagem
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-1">Nome *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        placeholder="O seu nome"
                        className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-white placeholder-foreground/40 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-1">Email *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        placeholder="seu@email.com"
                        className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-white placeholder-foreground/40 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-1">Assunto *</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      required
                      placeholder="Sobre o que é a sua mensagem?"
                      className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-white placeholder-foreground/40 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-1">Mensagem *</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      rows={5}
                      placeholder="Escreva a sua mensagem aqui..."
                      className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-white placeholder-foreground/40 focus:outline-none focus:border-blue-500 transition-colors text-sm resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? 'A enviar...' : 'Enviar Mensagem'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
