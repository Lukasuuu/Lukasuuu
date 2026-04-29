import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase, Staff, Service } from '@/lib/supabase';
import { Plus, Edit2, Trash2, Mail, Phone, X } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
};

export default function StaffPage() {
  const { business, session } = useAuth();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    if (!business || !session) return;
    fetchData();
  }, [business, session]);

  const fetchData = async () => {
    try {
      const [staffRes, servicesRes] = await Promise.all([
        supabase.from('staff').select('*').eq('business_id', business!.id).order('created_at', { ascending: false }),
        supabase.from('services').select('id, name').eq('business_id', business!.id).eq('active', true),
      ]);
      setStaff(staffRes.data || []);
      setServices(servicesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const serviceNameById = (id: string) => services.find((s) => s.id === id)?.name || id.slice(0, 8);

  const openCreate = () => {
    setEditingStaff(null);
    setForm(EMPTY_FORM);
    setSelectedServices([]);
    setModalOpen(true);
  };

  const openEdit = (member: Staff, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStaff(member);
    setForm({ name: member.name, email: member.email || '', phone: member.phone || '' });
    setSelectedServices(member.services || []);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    setSaving(true);
    try {
      if (editingStaff) {
        const { data, error } = await supabase
          .from('staff')
          .update({ ...form, services: selectedServices })
          .eq('id', editingStaff.id)
          .select()
          .single();
        if (error) throw error;
        setStaff(staff.map((s) => (s.id === editingStaff.id ? data : s)));
        toast.success('Membro atualizado com sucesso');
      } else {
        const { data, error } = await supabase
          .from('staff')
          .insert([{ ...form, business_id: business.id, services: selectedServices, active: true }])
          .select()
          .single();
        if (error) throw error;
        setStaff([data, ...staff]);
        toast.success('Membro criado com sucesso');
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving staff:', error);
      toast.error('Erro ao guardar membro');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (staffId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Tem certeza que deseja eliminar este membro?')) return;
    try {
      await supabase.from('staff').delete().eq('id', staffId);
      setStaff(staff.filter((s) => s.id !== staffId));
      toast.success('Membro eliminado');
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast.error('Erro ao eliminar membro');
    }
  };

  const handleToggleActive = async (member: Staff, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await supabase.from('staff').update({ active: !member.active }).eq('id', member.id);
      setStaff(staff.map((s) => (s.id === member.id ? { ...s, active: !s.active } : s)));
    } catch (error) {
      console.error('Error updating staff:', error);
    }
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Equipa</h2>
            <p className="text-foreground/70">Gerencie membros da sua equipa</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            Novo Membro
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="w-8 h-8 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mx-auto" />
            </div>
          ) : staff.length > 0 ? (
            staff.map((member) => (
              <div key={member.id} className="bg-card rounded-lg border border-border p-6 hover:border-blue-500/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={(e) => handleToggleActive(member, e)}
                    className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${member.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                  >
                    {member.active ? 'Ativo' : 'Inativo'}
                  </button>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{member.name}</h3>
                <div className="space-y-2 mb-4">
                  {member.email && (
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <Mail size={16} />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <Phone size={16} />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>
                {member.services && member.services.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-foreground/70 mb-2">Serviços ({member.services.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {member.services.slice(0, 3).map((svcId) => (
                        <span key={svcId} className="inline-block px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs">
                          {serviceNameById(svcId)}
                        </span>
                      ))}
                      {member.services.length > 3 && (
                        <span className="inline-block px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs">
                          +{member.services.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => openEdit(member, e)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-sm transition-colors"
                  >
                    <Edit2 size={16} />
                    Editar
                  </button>
                  <button
                    onClick={(e) => handleDelete(member.id, e)}
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
              <p className="text-foreground/70 mb-4">Nenhum membro da equipa criado ainda</p>
              <button onClick={openCreate} className="text-blue-400 hover:text-blue-300 text-sm">
                + Adicionar primeiro membro
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Staff Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold text-white">{editingStaff ? 'Editar Membro' : 'Novo Membro'}</h3>
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
                  placeholder="ex: João Silva"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500"
                  placeholder="joao@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Telefone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500"
                  placeholder="+351 912 345 678"
                />
              </div>
              {services.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Serviços que oferece</label>
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {services.map((svc) => (
                      <label key={svc.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(svc.id)}
                          onChange={() => toggleService(svc.id)}
                          className="rounded accent-blue-500"
                        />
                        <span className="text-sm text-foreground">{svc.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
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
