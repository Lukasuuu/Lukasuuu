import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase, Service } from '@/lib/supabase';
import { Plus, Edit2, Trash2, Clock, Euro, X } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY_FORM = {
  name: '',
  description: '',
  duration_min: 60,
  price: 0,
  category: '',
  color: '#3B82F6',
};

export default function Services() {
  const { business, session } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!business || !session) return;
    fetchServices();
  }, [business, session]);

  const fetchServices = async () => {
    try {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', business!.id)
        .order('created_at', { ascending: false });
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingService(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (service: Service, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingService(service);
    setForm({
      name: service.name,
      description: service.description || '',
      duration_min: service.duration_min,
      price: service.price,
      category: service.category || '',
      color: service.color || '#3B82F6',
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    setSaving(true);
    try {
      if (editingService) {
        const { data, error } = await supabase
          .from('services')
          .update({ ...form })
          .eq('id', editingService.id)
          .select()
          .single();
        if (error) throw error;
        setServices(services.map((s) => (s.id === editingService.id ? data : s)));
        toast.success('Serviço atualizado com sucesso');
      } else {
        const { data, error } = await supabase
          .from('services')
          .insert([{ ...form, business_id: business.id, active: true }])
          .select()
          .single();
        if (error) throw error;
        setServices([data, ...services]);
        toast.success('Serviço criado com sucesso');
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Erro ao guardar serviço');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (serviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Tem certeza que deseja eliminar este serviço?')) return;
    try {
      await supabase.from('services').delete().eq('id', serviceId);
      setServices(services.filter((s) => s.id !== serviceId));
      toast.success('Serviço eliminado');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Erro ao eliminar serviço');
    }
  };

  const handleToggleActive = async (service: Service, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await supabase.from('services').update({ active: !service.active }).eq('id', service.id);
      setServices(services.map((s) => (s.id === service.id ? { ...s, active: !s.active } : s)));
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Serviços</h2>
            <p className="text-foreground/70">Gerencie os serviços oferecidos</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            Novo Serviço
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="w-8 h-8 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mx-auto" />
            </div>
          ) : services.length > 0 ? (
            services.map((service) => (
              <div key={service.id} className="bg-card rounded-lg border border-border p-6 hover:border-blue-500/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: service.color || '#3B82F6' }} />
                  <button
                    onClick={(e) => handleToggleActive(service, e)}
                    className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${service.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                  >
                    {service.active ? 'Ativo' : 'Inativo'}
                  </button>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>
                <p className="text-sm text-foreground/70 mb-4 line-clamp-2">{service.description || 'Sem descrição'}</p>
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
                {service.category && (
                  <div className="mb-4">
                    <span className="inline-block px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs">{service.category}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => openEdit(service, e)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-sm transition-colors"
                  >
                    <Edit2 size={16} />
                    Editar
                  </button>
                  <button
                    onClick={(e) => handleDelete(service.id, e)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm transition-colors"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-foreground/70 mb-4">Nenhum serviço criado ainda</p>
              <button onClick={openCreate} className="text-blue-400 hover:text-blue-300 text-sm">
                + Criar primeiro serviço
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold text-white">{editingService ? 'Editar Serviço' : 'Novo Serviço'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-background rounded-lg text-foreground/60 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500"
                  placeholder="ex: Corte de Cabelo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Descrição opcional"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Duração (min) *</label>
                  <input
                    type="number"
                    required
                    min={5}
                    value={form.duration_min}
                    onChange={(e) => setForm({ ...form, duration_min: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Preço (€) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Categoria</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500"
                  placeholder="ex: Cabelo, Unhas, Massagem"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Cor no calendário</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-border bg-background"
                  />
                  <span className="text-sm text-foreground/60">{form.color}</span>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-background transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold transition-colors"
                >
                  {saving ? 'A guardar...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
