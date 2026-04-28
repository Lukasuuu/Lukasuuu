import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Mail, Lock, Building2, AlertCircle, CheckCircle } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { setOnboarding } = useOnboarding();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError('Deve aceitar os Termos e Condições para continuar.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await signUp(email, password, businessName);
      setSuccess(true);
      setTimeout(() => {
        setOnboarding(true);
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Erro ao registar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              BookMe
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Comece Grátis</h1>
          <p className="text-foreground/70">Crie a sua conta e comece a receber marcações</p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nome do Negócio</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Ex: Meu Salão de Beleza"
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border text-white placeholder-foreground/50 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border text-white placeholder-foreground/50 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border text-white placeholder-foreground/50 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-foreground/50 mt-1">Mínimo 6 caracteres</p>
            </div>

            {/* Legal checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 accent-blue-500"
                  required
                />
                <span className="text-sm text-foreground/70">
                  Li e aceito os{' '}
                  <a href="/terms-and-conditions" target="_blank" className="text-blue-400 hover:text-blue-300 underline">
                    Termos e Condições
                  </a>{' '}
                  e a{' '}
                  <a href="/privacy-policy" target="_blank" className="text-blue-400 hover:text-blue-300 underline">
                    Política de Privacidade
                  </a>{' '}
                  <span className="text-red-400">*</span>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketingAccepted}
                  onChange={(e) => setMarketingAccepted(e.target.checked)}
                  className="mt-1 accent-blue-500"
                />
                <span className="text-sm text-foreground/70">
                  Aceito receber comunicações de marketing por email (opcional)
                </span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading || !termsAccepted}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'A registar...' : 'Registar-se Gratuitamente'}
            </Button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Conta Criada com Sucesso!</h2>
            <p className="text-foreground/70 mb-4">
              Bem-vindo ao BookMe. A redirecionar para o dashboard...
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-foreground/70">
            J�� tem conta?{' '}
            <a href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Fazer Login
            </a>
          </p>
        </div>

        <div className="mt-4 text-center">
          <a href="/" className="text-sm text-foreground/50 hover:text-foreground/70 transition-colors">
            ← Voltar à página inicial
          </a>
        </div>
      </div>
    </div>
  );
}
