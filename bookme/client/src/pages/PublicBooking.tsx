import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { supabase, Business, Service, Staff, Client } from '@/lib/supabase';
import { ArrowRight, Calendar, User, Clock, CheckCircle } from 'lucide-react';

/**
 * Public Booking Page
 * Design: Customer-facing booking interface
 * Route: /book/:businessSlug
 */
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
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    if (!businessSlug) return;

    const fetchBusinessData = async () => {
      try {
        // Fetch business
        const { data: businessData } = await supabase
          .from('businesses')
          .select('*')
          .eq('slug', businessSlug)
          .single();

        if (businessData) {
          setBusiness(businessData);

          // Fetch services
          const { data: servicesData } = await supabase
            .from('services')
            .select('*')
            .eq('business_id', businessData.id)
            .eq('active', true);

          // Fetch staff
          const { data: staffData } = await supabase
            .from('staff')
            .select('*')
            .eq('business_id', businessData.id)
            .eq('active', true);

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

  const handleBooking = async () => {
    if (!business || !selectedService || !selectedStaff || !selectedDate || !selectedTime) return;

    try {
      // Create or get client
      let clientId: string;
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('business_id', business.id)
        .eq('email', clientData.email)
        .single();

      if (existingClient) {
        clientId = existingClient.id;
      } else {
        const { data: newClient } = await supabase
          .from('clients')
          .insert([
            {
              business_id: business.id,
              name: clientData.name,
              email: clientData.email,
              phone: clientData.phone,
              notes: clientData.notes,
            },
          ])
          .select()
          .single();

        if (!newClient) throw new Error('Failed to create client');
        clientId = newClient.id;
      }

      // Calculate end time
      const startDate = new Date(`${selectedDate}T${selectedTime}`);
      const endDate = new Date(startDate.getTime() + selectedService.duration_min * 60000);
      const endTime = endDate.toTimeString().slice(0, 5);

      // Create booking
      const { error } = await supabase.from('bookings').insert([
        {
          business_id: business.id,
          client_id: clientId,
          staff_id: selectedStaff.id,
          service_id: selectedService.id,
          booking_date: selectedDate,
          start_time: selectedTime,
          end_time: endTime,
          price: selectedService.price,
          status: 'confirmed',
        },
      ]);

      if (error) throw error;
      setBookingConfirmed(true);
    } catch (error) {
      console.error('Error creating booking:', error);
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
          <a href="/" className="text-blue-400 hover:text-blue-300">
            ← Voltar à página inicial
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => {
                        setSelectedService(service);
                        setStep('staff');
                      }}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedService?.id === service.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-border hover:border-blue-500/50'
                      }`}
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
              </div>
            )}

            {/* Step 2: Staff Selection */}
            {step === 'staff' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Escolha um Profissional</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staff.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => {
                        setSelectedStaff(member);
                        setStep('date');
                      }}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedStaff?.id === member.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-border hover:border-blue-500/50'
                      }`}
                    >
                      <h3 className="font-bold text-white">{member.name}</h3>
                      {member.email && <p className="text-sm text-foreground/70">{member.email}</p>}
                    </button>
                  ))}
                </div>
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
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Hora</label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => setStep('details')}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Continuar <ArrowRight size={20} />
                </button>
              </div>
            )}

            {/* Step 4: Client Details */}
            {step === 'details' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Seus Dados</h2>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nome</label>
                  <input
                    type="text"
                    value={clientData.name}
                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white placeholder-foreground/50 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    value={clientData.email}
                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white placeholder-foreground/50 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={clientData.phone}
                    onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-white placeholder-foreground/50 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => setStep('confirm')}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Confirmar <ArrowRight size={20} />
                </button>
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
                    <Clock size={20} className="text-blue-400" />
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
                </div>
                <button
                  onClick={handleBooking}
                  className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} />
                  Confirmar Marcação
                </button>
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
            <a href="/" className="text-blue-400 hover:text-blue-300">
              ← Voltar à página inicial
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
