import { useState } from 'react';
import { X } from 'lucide-react';
import { Service } from '@/lib/supabase';
import { toast } from 'sonner';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Partial<Service>) => Promise<void>;
  initialData?: Service;
  isLoading?: boolean;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export default function ServiceModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isLoading = false,
}: ServiceModalProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    duration_min: initialData?.duration_min || 60,
    price: initialData?.price || 0,
    category: initialData?.category || '',
    color: initialData?.color || '#3B82F6',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (formData.duration_min < 15) {
      newErrors.duration_min = 'Duração mínima é 15 minutos';
    }

    if (formData.price < 0) {
      newErrors.price = 'Preço não pode ser negativo';
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
        description: '',
        duration_min: 60,
        price: 0,
        category: '',
        color: '#3B82F6',
      });
      setErrors({});
      onClose();
      toast.success(initialData ? 'Serviço atualizado com sucesso' : 'Serviço criado com sucesso');
    } catch (error) {
      toast.error('Erro ao guardar serviço');
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Editar Serviço' : 'Novo Serviço'}
          </h2>
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
              Nome *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg bg-background border ${
                errors.name ? 'border-red-500' : 'border-border'
              } text-white placeholder-foreground/50 focus:outline-none focus:border-blue-500`}
              placeholder="Nome do serviço"
              disabled={isLoading}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-white placeholder-foreground/50 focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Descrição do serviço..."
              rows={2}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Duração (min) *
              </label>
              <input
                type="number"
                value={formData.duration_min}
                onChange={(e) => setFormData({ ...formData, duration_min: parseInt(e.target.value) })}
                className={`w-full px-3 py-2 rounded-lg bg-background border ${
                  errors.duration_min ? 'border-red-500' : 'border-border'
                } text-white focus:outline-none focus:border-blue-500`}
                min="15"
                step="15"
                disabled={isLoading}
              />
              {errors.duration_min && (
                <p className="text-red-500 text-sm mt-1">{errors.duration_min}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Preço (€) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className={`w-full px-3 py-2 rounded-lg bg-background border ${
                  errors.price ? 'border-red-500' : 'border-border'
                } text-white focus:outline-none focus:border-blue-500`}
                min="0"
                step="0.01"
                disabled={isLoading}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Categoria
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-white placeholder-foreground/50 focus:outline-none focus:border-blue-500"
              placeholder="Ex: Corte, Coloração, etc."
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Cor para Calendário
            </label>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    formData.color === color ? 'border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  disabled={isLoading}
                />
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
