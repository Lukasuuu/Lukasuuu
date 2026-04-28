import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase, Staff } from '@/lib/supabase';
import { Plus, Edit2, Trash2, Mail, Phone, Clock } from 'lucide-react';

/**
 * Staff Management Page
 * Design: Team member management with schedules
 */
export default function StaffPage() {
  const { business, session } = useAuth();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  useEffect(() => {
    if (!business || !session) return;

    const fetchStaff = async () => {
      try {
        const { data } = await supabase
          .from('staff')
          .select('*')
          .eq('business_id', business.id)
          .order('created_at', { ascending: false });

        setStaff(data || []);
      } catch (error) {
        console.error('Error fetching staff:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [business, session]);

  const handleDeleteStaff = async (staffId: string) => {
    if (!confirm('Tem certeza que deseja eliminar este membro da equipa?')) return;

    try {
      await supabase.from('staff').delete().eq('id', staffId);
      setStaff(staff.filter((s) => s.id !== staffId));
      setSelectedStaff(null);
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

  const handleToggleActive = async (staffMember: Staff) => {
    try {
      await supabase
        .from('staff')
        .update({ active: !staffMember.active })
        .eq('id', staffMember.id);

      setStaff(
        staff.map((s) =>
          s.id === staffMember.id ? { ...s, active: !s.active } : s
        )
      );
    } catch (error) {
      console.error('Error updating staff:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Equipa</h2>
            <p className="text-foreground/70">Gerencie membros da sua equipa</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
            <Plus size={20} />
            Novo Membro
          </button>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="w-8 h-8 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mx-auto" />
            </div>
          ) : staff.length > 0 ? (
            staff.map((staffMember) => (
              <div
                key={staffMember.id}
                className="bg-card rounded-lg border border-border p-6 hover:border-blue-500/50 transition-colors cursor-pointer"
                onClick={() => setSelectedStaff(staffMember)}
              >
                {/* Avatar */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold">
                    {staffMember.name.charAt(0)}
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      staffMember.active
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {staffMember.active ? 'Ativo' : 'Inativo'}
                  </div>
                </div>

                {/* Staff Info */}
                <h3 className="text-lg font-bold text-white mb-2">{staffMember.name}</h3>

                {/* Contact */}
                <div className="space-y-2 mb-4">
                  {staffMember.email && (
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <Mail size={16} />
                      <span className="truncate">{staffMember.email}</span>
                    </div>
                  )}
                  {staffMember.phone && (
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <Phone size={16} />
                      <span>{staffMember.phone}</span>
                    </div>
                  )}
                </div>

                {/* Services Count */}
                {staffMember.services && staffMember.services.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-foreground/70 mb-2">Serviços ({staffMember.services.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {staffMember.services.slice(0, 3).map((service, i) => (
                        <span key={i} className="inline-block px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs">
                          Serviço {i + 1}
                        </span>
                      ))}
                      {staffMember.services.length > 3 && (
                        <span className="inline-block px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs">
                          +{staffMember.services.length - 3}
                        </span>
                      )}
                    </div>
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
                      handleDeleteStaff(staffMember.id);
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
              <p className="text-foreground/70">Nenhum membro da equipa criado ainda</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
