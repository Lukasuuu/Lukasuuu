import { Mail, Linkedin, Twitter, Facebook, Instagram, BookOpen, Scale } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-background border-t border-border">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                BookMe
              </span>
            </div>
            <p className="text-foreground/70 text-sm leading-relaxed mb-4">
              Software de marcações que ajuda o seu negócio a crescer. Simples, poderoso e acessível.
            </p>
            {/* Legal Company Info */}
            <div className="text-xs text-foreground/50 space-y-0.5 border-t border-border/50 pt-4">
              <p className="font-medium text-foreground/60">[NOME_EMPRESA]</p>
              <p>NIF: [NIF]</p>
              <p>[MORADA_FISCAL]</p>
              <a href="mailto:[EMAIL_CONTACTO]" className="text-blue-400/70 hover:text-blue-400 transition-colors">
                [EMAIL_CONTACTO]
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Produto</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-foreground/70 hover:text-foreground transition-colors text-sm">Funcionalidades</a></li>
              <li><a href="#pricing" className="text-foreground/70 hover:text-foreground transition-colors text-sm">Preços</a></li>
              <li><a href="#faq" className="text-foreground/70 hover:text-foreground transition-colors text-sm">FAQ</a></li>
              <li><a href="/login" className="text-foreground/70 hover:text-foreground transition-colors text-sm">Entrar</a></li>
              <li><a href="/signup" className="text-foreground/70 hover:text-foreground transition-colors text-sm">Registar Grátis</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-foreground/70 hover:text-foreground transition-colors text-sm">Sobre Nós</a></li>
              <li><a href="/contact" className="text-foreground/70 hover:text-foreground transition-colors text-sm">Contacto</a></li>
              <li><a href="/privacy-policy" className="text-foreground/70 hover:text-foreground transition-colors text-sm">Política de Privacidade</a></li>
              <li><a href="/terms-and-conditions" className="text-foreground/70 hover:text-foreground transition-colors text-sm">Termos e Condições</a></li>
              <li>
                <button
                  onClick={() => localStorage.removeItem('bookme_cookie_prefs') || window.location.reload()}
                  className="text-foreground/70 hover:text-foreground transition-colors text-sm text-left"
                >
                  Gerir Cookies
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contacto</h4>
            <div className="space-y-3">
              <a
                href="mailto:[EMAIL_CONTACTO]"
                className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors text-sm"
              >
                <Mail size={16} />
                [EMAIL_CONTACTO]
              </a>
              <p className="text-foreground/60 text-sm">[TELEFONE]</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mb-8" />

        {/* Legal Links Row */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6">
          <a
            href="https://www.livroreclamacoes.pt"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-foreground/60 hover:text-foreground/90 transition-colors text-xs"
          >
            <BookOpen size={14} className="text-red-400" />
            Livro de Reclamações
          </a>
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-foreground/60 hover:text-foreground/90 transition-colors text-xs"
          >
            <Scale size={14} className="text-blue-400" />
            Resolução de Litígios (UE)
          </a>
          <a href="/privacy-policy" className="text-foreground/60 hover:text-foreground/90 transition-colors text-xs">
            Política de Privacidade
          </a>
          <a href="/terms-and-conditions" className="text-foreground/60 hover:text-foreground/90 transition-colors text-xs">
            Termos e Condições
          </a>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-foreground/60 text-sm">
            &copy; {currentYear} BookMe — [NOME_EMPRESA] · NIF [NIF] · Todos os direitos reservados.
          </p>

          {/* Social Media */}
          <div className="flex items-center gap-4">
            {[
              { icon: Twitter, label: 'Twitter', href: '#' },
              { icon: Linkedin, label: 'LinkedIn', href: '#' },
              { icon: Facebook, label: 'Facebook', href: '#' },
              { icon: Instagram, label: 'Instagram', href: '#' },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="w-9 h-9 rounded-full bg-card hover:bg-card/80 flex items-center justify-center text-foreground/70 hover:text-blue-400 transition-colors"
                aria-label={label}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
