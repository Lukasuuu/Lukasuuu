import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { Save, Mail, MessageCircle, Bell } from 'lucide-react';

/**
 * Settings Page Component
 * Design: Business configuration and integrations
 */
export default function Settings() {
  const { business, session } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    email: true,
    whatsapp: false,
    telegram: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name,
        email: business.email,
        phone: business.phone || '',
        address: business.address || '',
      });
      setNotifications((business.settings?.notifications as Record<string, boolean>) || {
        email: true,
        whatsapp: false,
        telegram: false,
      });
    }
  }, [business]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key: string) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    if (!business) return;

    setLoading(true);
    try {
      await supabase
        .from('businesses')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          settings: { notifications },
        })
        .eq('id', business.id);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Configurações</h2>
          <p className="text-foreground/70">Gerencie as configurações do seu negócio</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            Configurações guardadas com sucesso!
          </div>
        )}

        {/* Business Information */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-xl font-bold text-white mb-6">Informações do Negócio</h3>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nome do Negócio
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white placeholder-foreground/50 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white placeholder-foreground/50 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Telefone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+351 912 345 678"
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white placeholder-foreground/50 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Morada
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Rua, Número, Código Postal, Cidade"
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white placeholder-foreground/50 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Bell size={24} />
            Notificações
          </h3>
          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
              <div className="flex items-center gap-3">
                <Mail className="text-blue-400" size={20} />
                <div>
                  <p className="font-semibold text-white">Notificações por Email</p>
                  <p className="text-sm text-foreground/70">Receba confirmações e lembretes por email</p>
                </div>
              </div>
              <button
                onClick={() => handleNotificationChange('email')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications.email ? 'bg-green-500' : 'bg-gray-500'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    notifications.email ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* WhatsApp Notifications */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
              <div className="flex items-center gap-3">
                <MessageCircle className="text-green-400" size={20} />
                <div>
                  <p className="font-semibold text-white">Notificações WhatsApp</p>
                  <p className="text-sm text-foreground/70">Envie notificações via WhatsApp (requer configuração)</p>
                </div>
              </div>
              <button
                onClick={() => handleNotificationChange('whatsapp')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications.whatsapp ? 'bg-green-500' : 'bg-gray-500'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    notifications.whatsapp ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Telegram Notifications */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
              <div className="flex items-center gap-3">
                <MessageCircle className="text-cyan-400" size={20} />
                <div>
                  <p className="font-semibold text-white">Notificações Telegram</p>
                  <p className="text-sm text-foreground/70">Envie notificações via Telegram (requer configuração)</p>
                </div>
              </div>
              <button
                onClick={() => handleNotificationChange('telegram')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications.telegram ? 'bg-green-500' : 'bg-gray-500'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    notifications.telegram ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg transition-colors font-semibold"
          >
            <Save size={20} />
            {loading ? 'A guardar...' : 'Guardar Alterações'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
