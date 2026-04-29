import { useState } from 'react';
import { X } from 'lucide-react';
import { Client, Service, Staff } from '@/lib/supabase';
import { toast } from 'sonner';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (booking: {
    client_id: string;
    service_id: string;
    staff_id: string;
    booking_date: string;
    start_time: string;
    notes?: string;
  }) => Promise<void>;
  clients: Client[];
  services: Service[];
  staff: Staff[];
  isLoading?: boolean;
}

export default function BookingModal({
  isOpen,
  onClose,
  onSave,
  clients,
  services,
  staff,
  isLoading = false,
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    client_id: '',
    service_id: '',
    staff_id: '',
    booking_date: '',
    start_time: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedService = services.find((s) => s.id === formData.service_id);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.client_id) newErrors.client_id = 'Cliente é obrigatório';
    if (!formData.service_id) newErrors.service_id = 'Serviço é obrigatório';
    if (!formData.staff_id) newErrors.staff_id = 'Staff é obrigatório';
    if (!formData.booking_date) newErrors.booking_date = 'Data é obrigatória';
    if (!formData.start_time) newErrors.start_time = 'Hora é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      await onSave(formData);
      setFormData({
        client_id: '',
        service_id: '',
        staff_id: '',
        booking_date: '',
        start_time: '',
        notes: '',
      });
      setErrors({});
      onClose();
      toast.success('Marcação criada com sucesso');
    } catch (error) {
      toast.error('Erro ao criar marcação');
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Nova Marcação</h2>
          <button
            onClick={onClose}
            className="text-foreground/50 hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Cliente *
            </label>
            <select
              value={formData.client_id}
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg bg-background border ${
                errors.client_id ? 'border-red-500' : 'border-border'
              } text-white focus:outline-none focus:border-blue-500`}
              disabled={isLoading}
            >
              <option value="">Selecione um cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.client_id && <p className="text-red-500 text-sm mt-1">{errors.client_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Serviço *
            </label>
            <select
              value={formData.service_id}
              onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg bg-background border ${
                errors.service_id ? 'border-red-500' : 'border-border'
              } text-white focus:outline-none focus:border-blue-500`}
              disabled={isLoading}
            >
              <option value="">Selecione um serviço</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - €{service.price.toFixed(2)}
                </option>
              ))}
            </select>
            {errors.service_id && <p className="text-red-500 text-sm mt-1">{errors.service_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Staff *
            </label>
            <select
              value={formData.staff_id}
              onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg bg-background border ${
                errors.staff_id ? 'border-red-500' : 'border-border'
              } text-white focus:outline-none focus:border-blue-500`}
              disabled={isLoading}
            >
              <option value="">Selecione um membro</option>
              {staff.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
            {errors.staff_id && <p className="text-red-500 text-sm mt-1">{errors.staff_id}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Data *
              </label>
              <input
                type="date"
                value={formData.booking_date}
                onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg bg-background border ${
                  errors.booking_date ? 'border-red-500' : 'border-border'
                } text-white focus:outline-none focus:border-blue-500`}
                disabled={isLoading}
              />
              {errors.booking_date && (
                <p className="text-red-500 text-sm mt-1">{errors.booking_date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Hora *
              </label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg bg-background border ${
                  errors.start_time ? 'border-red-500' : 'border-border'
                } text-white focus:outline-none focus:border-blue-500`}
                disabled={isLoading}
              />
              {errors.start_time && (
                <p className="text-red-500 text-sm mt-1">{errors.start_time}</p>
              )}
            </div>
          </div>

          {selectedService && (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-foreground/70">
                Duração: <span className="text-white font-semibold">{selectedService.duration_min} min</span>
              </p>
              <p className="text-sm text-foreground/70">
                Preço: <span className="text-white font-semibold">€{selectedService.price.toFixed(2)}</span>
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Notas
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-white placeholder-foreground/50 focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Notas adicionais..."
              rows={2}
              disabled={isLoading}
            />
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
                  Criando...
                </>
              ) : (
                'Criar Marcação'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
