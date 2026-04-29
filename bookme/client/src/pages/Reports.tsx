import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import PlanGate from '@/components/PlanGate';
import { supabase } from '@/lib/supabase';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, Calendar, Users, DollarSign } from 'lucide-react';

const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];

export default function Reports() {
  const { business, session } = useAuth() as any;
  const [bookingsData, setBookingsData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!business || !session) return;
    fetchReportData();
  }, [business, session]);

  async function fetchReportData() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

      const { data: bookings } = await supabase
        .from('bookings')
        .select('booking_date, price, services(name)')
        .eq('business_id', business.id)
        .gte('booking_date', thirtyDaysAgoStr)
        .neq('status', 'cancelled');

      if (bookings) {
        // Bookings per day (last 30 days)
        const byDay: Record<string, number> = {};
        bookings.forEach((b: any) => {
          const d = new Date(b.booking_date);
          const label = `${d.getDate()}/${d.getMonth() + 1}`;
          byDay[label] = (byDay[label] || 0) + 1;
        });
        setBookingsData(
          Object.entries(byDay)
            .slice(-14)
            .map(([date, count]) => ({ date, marcações: count }))
        );

        // Revenue per month (last 6 months)
        const byMonth: Record<string, number> = {};
        bookings.forEach((b: any) => {
          const d = new Date(b.booking_date);
          const label = `${d.toLocaleString('pt-PT', { month: 'short' })} ${d.getFullYear()}`;
          byMonth[label] = (byMonth[label] || 0) + (b.price || 0);
        });
        setRevenueData(
          Object.entries(byMonth).map(([month, receita]) => ({ month, receita: parseFloat(receita.toFixed(2)) }))
        );

        // Top services
        const byService: Record<string, number> = {};
        bookings.forEach((b: any) => {
          const name = (b.services as any)?.name || 'Outros';
          byService[name] = (byService[name] || 0) + 1;
        });
        setServicesData(
          Object.entries(byService)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, value]) => ({ name, value }))
        );
      }
    } catch (e) {
      console.error('Reports error:', e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center py-32">
          <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            Relatórios
          </h1>
          <p className="text-foreground/70 mt-1">Análise de desempenho do seu negócio</p>
        </div>

        {/* Bookings per day */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Marcações por Dia (últimos 14 dias)
          </h2>
          {bookingsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={bookingsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }}
                />
                <Bar dataKey="marcações" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-foreground/50 text-center py-8">Sem dados suficientes ainda</p>
          )}
        </div>

        {/* Revenue + Top Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              Receita por Mês
            </h2>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }}
                    formatter={(v: any) => [`€${v}`, 'Receita']}
                  />
                  <Line type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-foreground/50 text-center py-8">Sem dados ainda</p>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Top 5 Serviços
            </h2>
            <PlanGate feature="advancedReports" requiredPlan="business">
              {servicesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={servicesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {servicesData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }}
                    />
                    <Legend
                      formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-foreground/50 text-center py-8">Sem dados ainda</p>
              )}
            </PlanGate>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
