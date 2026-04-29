import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase, Client } from '@/lib/supabase';
import { Search, Plus, Edit2, Trash2, Mail, Phone, X } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY_FORM = { name: '', email: '', phone: '', notes: '' };

export default function Clients() {
  const { business, session } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!business || !session) return;
    fetchClients();
  }, [business, session]);

  const fetchClients = async () => {
    try {
      const { data } = await supabase
        .from('clients')
        .select('*')
        .eq('business_id', business!.id)
        .order('created_at', { ascending: false });
      setClients(data || []);
      setFilteredClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = clients.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm)
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const openCreate = () => {
    setEditingClient(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (client: Client) => {
    setEditingClient(client);
    setForm({ name: client.name, email: client.email || '', phone: client.phone || '', notes: client.notes || '' });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    setSaving(true);
    try {
      if (editingClient) {
        const { data, error } = await supabase
          .from('clients')
          .update({ name: form.name, email: form.email, phone: form.phone, notes: form.notes })
          .eq('id', editingClient.id)
          .select()
          .single();
        if (error) throw error;
        setClients(clients.map((c) => (c.id === editingClient.id ? data : c)));
        if (selectedClient?.id === editingClient.id) setSelectedClient(data);
        toast.success('Cliente atualizado com sucesso');
      } else {
        const { data, error } = await supabase
          .from('clients')
          .insert([{ ...form, business_id: business.id, total_bookings: 0, total_spent: 0 }])
          .select()
          .single();
        if (error) throw error;
        setClients([data, ...clients]);
        toast.success('Cliente criado com sucesso');
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error('Erro ao guardar cliente');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (clientId: string) => {
    if (!confirm('Tem certeza que deseja eliminar este cliente?')) return;
    try {
      await supabase.from('clients').delete().eq('id', clientId);
      setClients(clients.filter((c) => c.id !== clientId));
      if (selectedClient?.id === clientId) setSelectedClient(null);
      toast.success('Cliente eliminado');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Erro ao eliminar cliente');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Clientes</h2>
            <p className="text-foreground/70">Gerencie sua base de clientes</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            Novo Cliente
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
          <input
            type="text"
            placeholder="Pesquisar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border text-white placeholder-foreground/50 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
            <h3 className="text-xl font-bold text-white mb-4">Lista de Clientes ({filteredClients.length})</h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mx-auto" />
              </div>
            ) : filteredClients.length > 0 ? (
              <div className="space-y-2">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedClient?.id === client.id
                        ? 'bg-blue-500/20 border border-blue-500/50'
                        : 'bg-background/50 hover:bg-background border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{client.name}</p>
                        <p className="text-sm text-foreground/70">{client.total_bookings} marcações</p>
                      </div>
                      <p className="text-sm text-foreground/70">€{client.total_spent.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-foreground/70 text-center py-8">Nenhum cliente encontrado</p>
            )}
          </div>

          {selectedClient && (
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-xl font-bold text-white mb-4">Detalhes</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-foreground/70 mb-1">Nome</p>
                  <p className="font-semibold text-white">{selectedClient.name}</p>
                </div>
                {selectedClient.email && (
                  <div>
                    <p className="text-sm text-foreground/70 mb-1 flex items-center gap-2"><Mail size={14} /> Email</p>
                    <p className="text-white break-all text-sm">{selectedClient.email}</p>
                  </div>
                )}
                {selectedClient.phone && (
                  <div>
                    <p className="text-sm text-foreground/70 mb-1 flex items-center gap-2"><Phone size={14} /> Telefone</p>
                    <p className="text-white text-sm">{selectedClient.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-foreground/70 mb-1">Marcações</p>
                  <p className="text-2xl font-bold text-blue-400">{selectedClient.total_bookings}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/70 mb-1">Total Gasto</p>
                  <p className="text-2xl font-bold text-green-400">€{selectedClient.total_spent.toFixed(2)}</p>
                </div>
                {selectedClient.notes && (
                  <div>
                    <p className="text-sm text-foreground/70 mb-1">Notas</p>
                    <p className="text-white text-sm">{selectedClient.notes}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => openEdit(selectedClient)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(selectedClient.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Client Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold text-white">{editingClient ? 'Editar Cliente' : 'Novo Cliente'}</h3>
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
                  placeholder="Nome do cliente"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500"
                  placeholder="email@example.com"
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
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Notas</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Observações sobre o cliente"
                />
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
