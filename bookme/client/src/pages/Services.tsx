import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase, Service } from '@/lib/supabase';
import { Plus, Edit2, Trash2, Clock, Euro } from 'lucide-react';

/**
 * Services Management Page
 * Design: Service list with CRUD operations
 */
export default function Services() {
  const { business, session } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    if (!business || !session) return;

    const fetchServices = async () => {
      try {
        const { data } = await supabase
          .from('services')
          .select('*')
          .eq('business_id', business.id)
          .order('created_at', { ascending: false });

        setServices(data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [business, session]);

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Tem certeza que deseja eliminar este serviço?')) return;

    try {
      await supabase.from('services').delete().eq('id', serviceId);
      setServices(services.filter((s) => s.id !== serviceId));
      setSelectedService(null);
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await supabase
        .from('services')
        .update({ active: !service.active })
        .eq('id', service.id);

      setServices(
        services.map((s) =>
          s.id === service.id ? { ...s, active: !s.active } : s
        )
      );
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Serviços</h2>
            <p className="text-foreground/70">Gerencie os serviços oferecidos</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
            <Plus size={20} />
            Novo Serviço
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="w-8 h-8 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mx-auto" />
            </div>
          ) : services.length > 0 ? (
            services.map((service) => (
              <div
                key={service.id}
                className="bg-card rounded-lg border border-border p-6 hover:border-blue-500/50 transition-colors cursor-pointer"
                onClick={() => setSelectedService(service)}
              >
                {/* Color Indicator */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg"
                    style={{ backgroundColor: service.color || '#3B82F6' }}
                  />
                  <div
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      service.active
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {service.active ? 'Ativo' : 'Inativo'}
                  </div>
                </div>

                {/* Service Info */}
                <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>
                <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                  {service.description || 'Sem descrição'}
                </p>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Clock size={16} />
                    <span>{service.duration_min} minutos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Euro size={16} />
                    <span>€{service.price.toFixed(2)}</span>
                  </div>
                </div>

                {/* Category */}
                {service.category && (
                  <div className="mb-4">
                    <span className="inline-block px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs">
                      {service.category}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-sm transition-colors">
                    <Edit2 size={16} />
                    Editar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteService(service.id);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm transition-colors"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-foreground/70">Nenhum serviço criado ainda</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
