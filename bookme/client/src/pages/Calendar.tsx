import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

/**
 * Calendar Page Component
 * Design: Monthly calendar view with booking management
 */
export default function Calendar() {
  const { business, session } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  useEffect(() => {
    if (!business || !session) return;

    const fetchBookings = async () => {
      try {
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
          .toISOString()
          .split('T')[0];
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
          .toISOString()
          .split('T')[0];

        const { data } = await supabase
          .from('bookings')
          .select(`
            *,
            clients(name, email),
            services(name, color),
            staff(name)
          `)
          .eq('business_id', business.id)
          .gte('booking_date', monthStart)
          .lte('booking_date', monthEnd)
          .order('booking_date', { ascending: true });

        setBookings(data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [business, session, currentDate]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getBookingsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bookings.filter((b) => b.booking_date === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const monthName = currentDate.toLocaleString('pt-PT', { month: 'long', year: 'numeric' });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Calendário</h2>
            <p className="text-foreground/70">Gerencie suas marcações</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
            <Plus size={20} />
            Nova Marcação
          </button>
        </div>

        {/* View Mode Selector */}
        <div className="flex gap-2">
          {(['month', 'week', 'day'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                viewMode === mode
                  ? 'bg-blue-500 text-white'
                  : 'bg-card border border-border text-foreground/70 hover:text-foreground'
              }`}
            >
              {mode === 'month' ? 'Mês' : mode === 'week' ? 'Semana' : 'Dia'}
            </button>
          ))}
        </div>

        {/* Calendar */}
        <div className="bg-card rounded-lg border border-border p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-background rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-xl font-bold text-white capitalize">{monthName}</h3>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-background rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-foreground/70 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty days */}
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square bg-background/50 rounded-lg" />
            ))}

            {/* Days */}
            {days.map((day) => {
              const dayBookings = getBookingsForDate(day);
              return (
                <div
                  key={day}
                  className="aspect-square bg-background rounded-lg border border-border p-2 hover:border-blue-500/50 transition-colors cursor-pointer flex flex-col"
                >
                  <span className="text-sm font-semibold text-white mb-1">{day}</span>
                  <div className="flex-1 overflow-y-auto space-y-1">
                    {dayBookings.slice(0, 2).map((booking, i) => (
                      <div
                        key={i}
                        className="text-xs px-1 py-0.5 rounded bg-blue-500/20 text-blue-300 truncate"
                        title={booking.clients?.name}
                      >
                        {booking.start_time}
                      </div>
                    ))}
                    {dayBookings.length > 2 && (
                      <div className="text-xs text-foreground/50">+{dayBookings.length - 2} mais</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Bookings List */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-xl font-bold text-white mb-4">Marcações do Mês</h3>
          {bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.slice(0, 10).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: booking.services?.color || '#3B82F6' }}
                    />
                    <div>
                      <p className="font-semibold text-white">{booking.clients?.name}</p>
                      <p className="text-sm text-foreground/70">{booking.services?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{booking.booking_date}</p>
                    <p className="text-sm text-foreground/70">{booking.start_time} - {booking.end_time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-foreground/70 text-center py-8">Nenhuma marcação neste mês</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
