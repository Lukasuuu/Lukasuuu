import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase, Client } from '@/lib/supabase';
import { Search, Plus, Edit2, Trash2, Mail, Phone } from 'lucide-react';

/**
 * Clients Management Page
 * Design: CRM with client list and details
 */
export default function Clients() {
  const { business, session } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    if (!business || !session) return;

    const fetchClients = async () => {
      try {
        const { data } = await supabase
          .from('clients')
          .select('*')
          .eq('business_id', business.id)
          .order('created_at', { ascending: false });

        setClients(data || []);
        setFilteredClients(data || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [business, session]);

  useEffect(() => {
    const filtered = clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.includes(searchTerm)
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Tem certeza que deseja eliminar este cliente?')) return;

    try {
      await supabase.from('clients').delete().eq('id', clientId);
      setClients(clients.filter((c) => c.id !== clientId));
      setSelectedClient(null);
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Clientes</h2>
            <p className="text-foreground/70">Gerencie sua base de clientes</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
            <Plus size={20} />
            Novo Cliente
          </button>
        </div>

        {/* Search Bar */}
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

        {/* Clients Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Clients List */}
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
                      <div className="text-right">
                        <p className="text-sm text-foreground/70">€{client.total_spent.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-foreground/70 text-center py-8">Nenhum cliente encontrado</p>
            )}
          </div>

          {/* Client Details */}
          {selectedClient && (
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-xl font-bold text-white mb-4">Detalhes do Cliente</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-foreground/70 mb-1">Nome</p>
                  <p className="font-semibold text-white">{selectedClient.name}</p>
                </div>

                {selectedClient.email && (
                  <div>
                    <p className="text-sm text-foreground/70 mb-1 flex items-center gap-2">
                      <Mail size={16} /> Email
                    </p>
                    <p className="text-white break-all">{selectedClient.email}</p>
                  </div>
                )}

                {selectedClient.phone && (
                  <div>
                    <p className="text-sm text-foreground/70 mb-1 flex items-center gap-2">
                      <Phone size={16} /> Telefone
                    </p>
                    <p className="text-white">{selectedClient.phone}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-foreground/70 mb-1">Total de Marcações</p>
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
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                    <Edit2 size={18} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteClient(selectedClient.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
