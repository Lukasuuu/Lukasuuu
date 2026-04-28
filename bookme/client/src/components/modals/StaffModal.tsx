import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Staff, Service } from '@/lib/supabase';
import { toast } from 'sonner';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staff: Partial<Staff>) => Promise<void>;
  initialData?: Staff;
  services?: Service[];
  isLoading?: boolean;
}

export default function StaffModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  services = [],
  isLoading = false,
}: StaffModalProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    services: initialData?.services || [],
    working_hours: initialData?.working_hours || {
      monday: { start: '09:00', end: '18:00' },
      tuesday: { start: '09:00', end: '18:00' },
      wednesday: { start: '09:00', end: '18:00' },
      thursday: { start: '09:00', end: '18:00' },
      friday: { start: '09:00', end: '18:00' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: null,
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, corrija os erros do formulário');
      return;
    }

    try {
      await onSave(formData);
      setFormData({
        name: '',
        email: '',
        phone: '',
        services: [],
        working_hours: {
          monday: { start: '09:00', end: '18:00' },
          tuesday: { start: '09:00', end: '18:00' },
          wednesday: { start: '09:00', end: '18:00' },
          thursday: { start: '09:00', end: '18:00' },
          friday: { start: '09:00', end: '18:00' },
          saturday: { start: '10:00', end: '14:00' },
          sunday: null,
        },
      });
      setErrors({});
      onClose();
      toast.success(initialData ? 'Staff atualizado com sucesso' : 'Staff criado com sucesso');
    } catch (error) {
      toast.error('Erro ao guardar staff');
      console.error(error);
    }
  };

  const toggleService = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
  const dayLabels: Record<string, string> = {
    monday: 'Segunda',
    tuesday: 'Terça',
    wednesday: 'Quarta',
    thursday: 'Quinta',
    friday: 'Sexta',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-card rounded-lg p-6 w-full max-w-md my-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Editar Staff' : 'Novo Staff'}
          </h2>
          <button
            onClick={onClose}
            className="text-foreground/50 hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Nome *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg bg-background border ${
                errors.name ? 'border-red-500' : 'border-border'
              } text-white placeholder-foreground/50 focus:outline-none focus:border-blue-500`}
              placeholder="Nome do staff"
              disabled={isLoading}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg bg-background border ${
                errors.email ? 'border-red-500' : 'border-border'
              } text-white placeholder-foreground/50 focus:outline-none focus:border-blue-500`}
              placeholder="email@exemplo.com"
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Telefone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-white placeholder-foreground/50 focus:outline-none focus:border-blue-500"
              placeholder="+351 912 345 678"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Serviços
            </label>
            <div className="space-y-2">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.id)}
                  disabled={isLoading}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                    formData.services.includes(service.id)
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-border hover:border-blue-500/50'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      formData.services.includes(service.id)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-foreground/30'
                    }`}
                  >
                    {formData.services.includes(service.id) && (
                      <Check size={16} className="text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{service.name}</p>
                    <p className="text-sm text-foreground/70">€{service.price.toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Horário de Trabalho
            </label>
            <div className="space-y-2">
              {days.map((day) => (
                <div key={day} className="flex items-center gap-2">
                  <label className="w-20 text-sm text-foreground">{dayLabels[day]}</label>
                  {formData.working_hours[day] ? (
                    <div className="flex gap-2 flex-1">
                      <input
                        type="time"
                        value={formData.working_hours[day]?.start || '09:00'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            working_hours: {
                              ...formData.working_hours,
                              [day]: { ...formData.working_hours[day]!, start: e.target.value },
                            },
                          })
                        }
                        className="flex-1 px-2 py-1 rounded bg-background border border-border text-white text-sm"
                        disabled={isLoading}
                      />
                      <span className="text-foreground/50">-</span>
                      <input
                        type="time"
                        value={formData.working_hours[day]?.end || '18:00'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            working_hours: {
                              ...formData.working_hours,
                              [day]: { ...formData.working_hours[day]!, end: e.target.value },
                            },
                          })
                        }
                        className="flex-1 px-2 py-1 rounded bg-background border border-border text-white text-sm"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            working_hours: { ...formData.working_hours, [day]: null },
                          })
                        }
                        className="px-2 py-1 text-sm text-red-400 hover:text-red-300"
                        disabled={isLoading}
                      >
                        Fechar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          working_hours: {
                            ...formData.working_hours,
                            [day]: { start: '09:00', end: '18:00' },
                          },
                        })
                      }
                      className="flex-1 px-2 py-1 text-sm text-blue-400 hover:text-blue-300"
                      disabled={isLoading}
                    >
                      Abrir
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-background/50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
