import { useEffect, useState } from 'react';
import { X, Cookie, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CookiePrefs {
  essential: true;
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = 'bookme_cookie_prefs';

function loadPrefs(): CookiePrefs | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePrefs(prefs: CookiePrefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  document.cookie = `cookie_consent=${JSON.stringify(prefs)};path=/;max-age=33696000;SameSite=Lax`;
}

export function loadAnalytics(measurementId: string) {
  if (!measurementId) return;
  if (document.getElementById('ga-script')) return;
  const s = document.createElement('script');
  s.id = 'ga-script';
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(s);
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) { (window as any).dataLayer.push(args); }
  gtag('js', new Date());
  gtag('config', measurementId);
}

export function loadFacebookPixel(pixelId: string) {
  if (!pixelId) return;
  if ((window as any).fbq) return;
  const f: any = (window as any).fbq = function (...args: any[]) {
    f.callMethod ? f.callMethod(...args) : f.queue.push(args);
  };
  f.push = f;
  f.loaded = true;
  f.version = '2.0';
  f.queue = [];
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(s);
  (window as any).fbq('init', pixelId);
  (window as any).fbq('track', 'PageView');
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>({ essential: true, analytics: false, marketing: false });

  useEffect(() => {
    const saved = loadPrefs();
    if (!saved) {
      setVisible(true);
    } else {
      applyConsent(saved);
    }
  }, []);

  function applyConsent(p: CookiePrefs) {
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    const fbId = import.meta.env.VITE_FB_PIXEL_ID;
    if (p.analytics && gaId) loadAnalytics(gaId);
    if (p.marketing && fbId) loadFacebookPixel(fbId);
  }

  function handleAcceptAll() {
    const all: CookiePrefs = { essential: true, analytics: true, marketing: true };
    savePrefs(all);
    applyConsent(all);
    setVisible(false);
  }

  function handleEssentialOnly() {
    const ess: CookiePrefs = { essential: true, analytics: false, marketing: false };
    savePrefs(ess);
    setVisible(false);
  }

  function handleSaveCustom() {
    savePrefs(prefs);
    applyConsent(prefs);
    setVisible(false);
    setCustomizing(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Cookie className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Preferências de Cookies</h3>
              <p className="text-xs text-foreground/60 mt-0.5">
                Utilizamos cookies para melhorar a sua experiência.{' '}
                <a href="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">
                  Saiba mais
                </a>
              </p>
            </div>
          </div>
          <button
            onClick={handleEssentialOnly}
            className="text-foreground/40 hover:text-foreground/70 transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Custom panel */}
        {customizing && (
          <div className="px-5 py-4 border-b border-border space-y-3">
            {/* Essential — always on */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-foreground/90">Cookies Essenciais</p>
                <p className="text-xs text-foreground/50 mt-0.5">Necessários para o funcionamento do site. Não podem ser desativados.</p>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-400 font-medium">Sempre ativo</span>
              </div>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between py-2 border-t border-border/50">
              <div>
                <p className="text-sm font-medium text-foreground/90">Cookies Analíticos</p>
                <p className="text-xs text-foreground/50 mt-0.5">Google Analytics — ajudam-nos a entender como os visitantes usam o site.</p>
              </div>
              <button
                onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${prefs.analytics ? 'bg-blue-500' : 'bg-border'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${prefs.analytics ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between py-2 border-t border-border/50">
              <div>
                <p className="text-sm font-medium text-foreground/90">Cookies de Marketing</p>
                <p className="text-xs text-foreground/50 mt-0.5">Facebook Pixel — permitem mostrar anúncios relevantes noutras plataformas.</p>
              </div>
              <button
                onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${prefs.marketing ? 'bg-blue-500' : 'bg-border'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${prefs.marketing ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-4 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setCustomizing(!customizing)}
            className="flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground/90 transition-colors"
          >
            {customizing ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            Personalizar
          </button>

          <div className="flex gap-2 ml-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={handleEssentialOnly}
              className="border-border text-foreground/70 hover:text-foreground text-xs px-4"
            >
              Apenas Essenciais
            </Button>
            {customizing ? (
              <Button
                size="sm"
                onClick={handleSaveCustom}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4"
              >
                Guardar Preferências
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4"
              >
                Aceitar Todos
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
