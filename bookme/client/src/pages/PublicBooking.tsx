import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { supabase, Business, Service, Staff } from '@/lib/supabase';
import { ArrowRight, Calendar, User, Clock, CheckCircle } from 'lucide-react';

function generateTimeSlots(open: string, close: string, durationMin: number, bookedSlots: { start: string; end: string }[]): string[] {
  const slots: string[] = [];
  const [oh, om] = open.split(':').map(Number);
  const [ch, cm] = close.split(':').map(Number);
  const openMinutes = oh * 60 + om;
  const closeMinutes = ch * 60 + cm;

  for (let m = openMinutes; m + durationMin <= closeMinutes; m += durationMin) {
    const hh = String(Math.floor(m / 60)).padStart(2, '0');
    const mm = String(m % 60).padStart(2, '0');
    const slotStart = `${hh}:${mm}`;
    const slotEnd = (() => {
      const end = m + durationMin;
      return `${String(Math.floor(end / 60)).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`;
    })();

    const isBooked = bookedSlots.some(({ start, end }) => {
      const sMin = parseInt(start.slice(0, 2)) * 60 + parseInt(start.slice(3, 5));
      const eMin = parseInt(end.slice(0, 2)) * 60 + parseInt(end.slice(3, 5));
      const slotStartMin = m;
      const slotEndMin = m + durationMin;
      return slotStartMin < eMin && slotEndMin > sMin;
    });

    if (!isBooked) slots.push(slotStart);
  }
  return slots;
}

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default function PublicBooking() {
  const [, params] = useRoute('/book/:businessSlug');
  const businessSlug = params?.businessSlug;

  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'service' | 'staff' | 'date' | 'details' | 'confirm'>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [clientData, setClientData] = useState({ name: '', email: '', phone: '', notes: '' });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!businessSlug) return;
    const fetchBusinessData = async () => {
      try {
        const { data: businessData } = await supabase.from('businesses').select('*').eq('slug', businessSlug).single();
        if (businessData) {
          setBusiness(businessData);
          const [{ data: servicesData }, { data: staffData }] = await Promise.all([
            supabase.from('services').select('*').eq('business_id', businessData.id).eq('active', true),
            supabase.from('staff').select('*').eq('business_id', businessData.id).eq('active', true),
          ]);
          setServices(servicesData || []);
          setStaff(staffData || []);
        }
      } catch (error) {
        console.error('Error fetching booking data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinessData();
  }, [businessSlug]);

  // Load available slots when date or staff changes
  useEffect(() => {
    if (!selectedDate || !selectedStaff || !selectedService || !business) return;
    loadAvailableSlots();
  }, [selectedDate, selectedStaff, selectedService]);

  const loadAvailableSlots = async () => {
    if (!selectedDate || !selectedStaff || !selectedService || !business) return;
    setLoadingSlots(true);
    setSelectedTime('');
    try {
      // Get existing bookings for this staff on this date
      const { data: existingBookings } = await supabase
        .from('bookings')
        .select('start_time, end_time')
        .eq('staff_id', selectedStaff.id)
        .eq('booking_date', selectedDate)
        .neq('status', 'cancelled');

      const bookedSlots = (existingBookings || []).map((b: any) => ({
        start: b.start_time,
        end: b.end_time,
      }));

      // Get business working hours for the day
      const dayKey = DAY_KEYS[new Date(selectedDate + 'T12:00:00').getDay()];
      const hours = business.working_hours as any;
      const dayHours = hours?.[dayKey];

      if (!dayHours) {
        setAvailableSlots([]);
        return;
      }

      const open = dayHours.start || dayHours.open || '09:00';
      const close = dayHours.end || dayHours.close || '18:00';

      const slots = generateTimeSlots(open, close, selectedService.duration_min, bookedSlots);
      setAvailableSlots(slots);
    } catch (err) {
      console.error('Error loading slots:', err);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBooking = async () => {
    if (!business || !selectedService || !selectedStaff || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    try {
      let clientId: string;
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('business_id', business.id)
        .eq('email', clientData.email)
        .maybeSingle();

      if (existingClient) {
        clientId = existingClient.id;
      } else {
        const { data: newClient } = await supabase
          .from('clients')
          .insert([{ business_id: business.id, name: clientData.name, email: clientData.email, phone: clientData.phone, notes: clientData.notes }])
          .select()
          .single();
        if (!newClient) throw new Error('Failed to create client');
        clientId = newClient.id;
      }

      const startDate = new Date(`${selectedDate}T${selectedTime}`);
      const endDate = new Date(startDate.getTime() + selectedService.duration_min * 60000);
      const endTime = endDate.toTimeString().slice(0, 5);

      const { error } = await supabase.from('bookings').insert([{
        business_id: business.id,
        client_id: clientId,
        staff_id: selectedStaff.id,
        service_id: selectedService.id,
        booking_date: selectedDate,
        start_time: selectedTime,
        end_time: endTime,
        price: selectedService.price,
        status: 'confirmed',
      }]);

      if (error) throw error;
      setBookingConfirmed(true);
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-foreground/70">A carregar...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground/70 mb-4">Negócio não encontrado</p>
          <a href="/" className="text-blue-400 hover:text-blue-300">← Voltar à página inicial</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">{business.name}</h1>
          <p className="text-foreground/70">Agende seu serviço</p>
        </div>

        {!bookingConfirmed ? (
          <div className="bg-card rounded-lg border border-border p-8">
            {/* Step 1: Service Selection */}
            {step === 'service' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Escolha um Serviço</h2>
                {services.length === 0 ? (
                  <p className="text-foreground/70">Nenhum serviço disponível de momento.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => { setSelectedService(service); setStep('staff'); }}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${selectedService?.id === service.id ? 'border-blue-500 bg-blue-500/10' : 'border-border hover:border-blue-500/50'}`}
                      >
                        <h3 className="font-bold text-white mb-2">{service.name}</h3>
                        <p className="text-sm text-foreground/70 mb-3">{service.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground/70">{service.duration_min} min</span>
                          <span className="font-semibold text-blue-400">€{service.price.toFixed(2)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Staff Selection */}
            {step === 'staff' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Escolha um Profissional</h2>
                {staff.length === 0 ? (
                  <p className="text-foreground/70">Nenhum profissional disponível de momento.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {staff.map((member) => (
                      <button
                        key={member.id}
                        onClick={() => { setSelectedStaff(member); setStep('date'); }}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${selectedStaff?.id === member.id ? 'border-blue-500 bg-blue-500/10' : 'border-border hover:border-blue-500/50'}`}
                      >
                        <h3 className="font-bold text-white">{member.name}</h3>
                        {member.email && <p className="text-sm text-foreground/70">{member.email}</p>}
                      </button>
                    ))}
                  </div>
                )}
                <button onClick={() => setStep('service')} className="text-sm text-foreground/60 hover:text-foreground">← Voltar</button>
              </div>
            )}

            {/* Step 3: Date & Time */}
            {step === 'date' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Escolha Data e Hora</h2>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Data</label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Horários disponíveis</label>
                    {loadingSlots ? (
                      <div className="flex items-center gap-2 text-foreground/60">
                        <div className="w-4 h-4 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
                        A verificar disponibilidade...
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <p className="text-foreground/60 text-sm">Sem horários disponíveis para este dia. Escolha outra data.</p>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedTime === slot ? 'bg-blue-500 text-white' : 'bg-background border border-border text-foreground/80 hover:border-blue-500/50'}`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setStep('staff')} className="text-sm text-foreground/60 hover:text-foreground">← Voltar</button>
                  <button
                    onClick={() => setStep('details')}
                    disabled={!selectedDate || !selectedTime}
                    className="ml-auto px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    Continuar <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Client Details */}
            {step === 'details' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Seus Dados</h2>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nome *</label>
                  <input type="text" required value={clientData.name} onChange={(e) => setClientData({ ...clientData, name: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input type="email" value={clientData.email} onChange={(e) => setClientData({ ...clientData, email: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Telefone</label>
                  <input type="tel" value={clientData.phone} onChange={(e) => setClientData({ ...clientData, phone: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep('date')} className="text-sm text-foreground/60 hover:text-foreground">← Voltar</button>
                  <button
                    onClick={() => setStep('confirm')}
                    disabled={!clientData.name}
                    className="ml-auto px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    Confirmar <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {step === 'confirm' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Confirme sua Marcação</h2>
                <div className="space-y-4 p-4 rounded-lg bg-background/50">
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-blue-400" />
                    <div>
                      <p className="text-sm text-foreground/70">Serviço</p>
                      <p className="font-semibold text-white">{selectedService?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-blue-400" />
                    <div>
                      <p className="text-sm text-foreground/70">Data e Hora</p>
                      <p className="font-semibold text-white">{selectedDate} às {selectedTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-blue-400" />
                    <div>
                      <p className="text-sm text-foreground/70">Profissional</p>
                      <p className="font-semibold text-white">{selectedStaff?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-blue-400" />
                    <div>
                      <p className="text-sm text-foreground/70">Duração / Preço</p>
                      <p className="font-semibold text-white">{selectedService?.duration_min} min · €{selectedService?.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep('details')} className="text-sm text-foreground/60 hover:text-foreground">← Voltar</button>
                  <button
                    onClick={handleBooking}
                    disabled={submitting}
                    className="ml-auto px-6 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <CheckCircle size={20} />
                    {submitting ? 'A confirmar...' : 'Confirmar Marcação'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Marcação Confirmada!</h2>
            <p className="text-foreground/70 mb-6">
              Receberá uma confirmação por email em breve. Obrigado por escolher {business.name}!
            </p>
            <a href="/" className="text-blue-400 hover:text-blue-300">← Voltar à página inicial</a>
          </div>
        )}
      </div>
    </div>
  );
}
