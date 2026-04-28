import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase, Booking, Client, Service } from '@/lib/supabase';
import { Calendar, Users, Briefcase, TrendingUp } from 'lucide-react';

/**
 * Dashboard Main Page
 * Design: Overview of business metrics and upcoming bookings
 */
export default function Dashboard() {
  const { business, user, session } = useAuth();
  const [stats, setStats] = useState({
    todayBookings: 0,
    totalClients: 0,
    totalServices: 0,
    revenue: 0,
  });
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!business || !session) return;

    const fetchDashboardData = async () => {
      try {
        // Fetch today's bookings
        const today = new Date().toISOString().split('T')[0];
        const { data: todayBookings } = await supabase
          .from('bookings')
          .select('*')
          .eq('business_id', business.id)
          .eq('booking_date', today);

        // Fetch total clients
        const { data: clients } = await supabase
          .from('clients')
          .select('*')
          .eq('business_id', business.id);

        // Fetch services
        const { data: services } = await supabase
          .from('services')
          .select('*')
          .eq('business_id', business.id)
          .eq('active', true);

        // Fetch upcoming bookings
        const { data: upcoming } = await supabase
          .from('bookings')
          .select(`
            *,
            clients(name, email, phone),
            services(name, price),
            staff(name)
          `)
          .eq('business_id', business.id)
          .gte('booking_date', today)
          .order('booking_date', { ascending: true })
          .limit(5);

        setStats({
          todayBookings: todayBookings?.length || 0,
          totalClients: clients?.length || 0,
          totalServices: services?.length || 0,
          revenue: todayBookings?.reduce((sum, b) => sum + (b.price || 0), 0) || 0,
        });

        setUpcomingBookings(upcoming || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [business, session]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-foreground/70">A carregar dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Bem-vindo, {user?.name || 'Utilizador'}!</h2>
          <p className="text-foreground/70">Aqui está um resumo do seu negócio</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Today's Bookings */}
          <div className="bg-card rounded-lg border border-border p-6 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/70 text-sm mb-1">Marcações Hoje</p>
                <p className="text-3xl font-bold text-white">{stats.todayBookings}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Calendar className="text-blue-400" size={24} />
              </div>
            </div>
          </div>

          {/* Total Clients */}
          <div className="bg-card rounded-lg border border-border p-6 hover:border-green-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/70 text-sm mb-1">Total de Clientes</p>
                <p className="text-3xl font-bold text-white">{stats.totalClients}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Users className="text-green-400" size={24} />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-card rounded-lg border border-border p-6 hover:border-cyan-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/70 text-sm mb-1">Serviços Ativos</p>
                <p className="text-3xl font-bold text-white">{stats.totalServices}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Briefcase className="text-cyan-400" size={24} />
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-card rounded-lg border border-border p-6 hover:border-green-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/70 text-sm mb-1">Receita Hoje</p>
                <p className="text-3xl font-bold text-white">€{stats.revenue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="text-green-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-xl font-bold text-white mb-4">Próximas Marcações</h3>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background transition-colors"
                >
                  <div>
                    <p className="font-semibold text-white">{booking.clients?.name}</p>
                    <p className="text-sm text-foreground/70">{booking.services?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{booking.booking_date} às {booking.start_time}</p>
                    <p className="text-sm text-foreground/70">{booking.staff?.name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-foreground/70 text-center py-8">Nenhuma marcação agendada</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/dashboard/calendar"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <h4 className="font-bold mb-2">Ver Calendário</h4>
            <p className="text-sm opacity-90">Gerencie todas as suas marcações</p>
          </a>
          <a
            href="/dashboard/clients"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
          >
            <h4 className="font-bold mb-2">Gestão de Clientes</h4>
            <p className="text-sm opacity-90">Veja e gerencie seus clientes</p>
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
