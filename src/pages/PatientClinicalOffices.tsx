import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Building2, Phone, MapPin, ArrowRight, User, Stethoscope, X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useToast } from '../components/Toast';

// ... (interfaces remain the same)
interface Specialty {
    id: string;
    name: string;
    description: string;
}

interface Schedule {
    id: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    startDate?: string;
    endDate?: string;
    doctorId: string; // Añadido doctorId
}

interface Doctor {
    id: string;
    firstName: string;
    lastName: string;
    specialties: { specialty: Specialty }[];
    appointmentRate: number;
}

interface Office {
    id: string;
    name: string;
    address: string;
    phone: string;
    doctors: { doctor: Doctor }[];
    schedules: Schedule[];
}

interface DoctorCardData {
    doctorId: string;
    doctorName: string;
    officeName: string;
    address: string;
    phone: string;
    specialties: Specialty[];
    schedules: Schedule[];
    appointmentRate: number;
}

export default function PatientClinicalOffices() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [doctorCards, setDoctorCards] = useState<DoctorCardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorCardData | null>(null);
    const [showAgenda, setShowAgenda] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    useEffect(() => {
        const fetchOffices = async () => {
            try {
                const response = await api.get('/medical-offices');
                const offices = response.data;

                const cards: DoctorCardData[] = [];

                offices.forEach((office: Office) => {
                    if (office.doctors && office.doctors.length > 0) {
                        office.doctors.forEach((d) => {
                            // Filter schedules for this specific doctor in this office
                            const filteredSchedules = office.schedules.filter(s => s.doctorId === d.doctor.id);

                            cards.push({
                                doctorId: d.doctor.id,
                                doctorName: `${d.doctor.firstName} ${d.doctor.lastName}`,
                                officeName: office.name,
                                address: office.address,
                                phone: office.phone,
                                specialties: d.doctor.specialties.map(s => s.specialty),
                                schedules: filteredSchedules,
                                appointmentRate: d.doctor.appointmentRate || 0
                            });
                        });
                    }
                });

                setDoctorCards(cards);
            } catch (error) {
                console.error('Error fetching data:', error);
                showToast('Error al cargar la información de los especialistas.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchOffices();
    }, [showToast]);

    const dayNameMap: { [key: string]: number } = {
        'DOMINGO': 0,
        'LUNES': 1,
        'MARTES': 2,
        'MIERCOLES': 3,
        'JUEVES': 4,
        'VIERNES': 5,
        'SABADO': 6
    };

    const getAvailableDays = (schedules: Schedule[]) => {
        const days: Date[] = [];
        const today = new Date();
        const activeDayNums = schedules.map(s => dayNameMap[s.dayOfWeek]);

        for (let i = 0; i < 30; i++) { // Check next 30 days to find 5 valid ones
            const nextDay = new Date();
            nextDay.setDate(today.getDate() + i);
            nextDay.setHours(0, 0, 0, 0); // Normalize to start of day

            if (activeDayNums.includes(nextDay.getDay())) {
                const slots = generateTimeSlots(nextDay, schedules);
                if (slots.length > 0) {
                    days.push(nextDay);
                }
                if (days.length === 5) break;
            }
        }
        return days;
    };

    const generateTimeSlots = (date: Date, schedules: Schedule[]) => {
        const dayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
        const dayName = dayNames[date.getDay()];
        const schedule = schedules.find(s => s.dayOfWeek === dayName);

        if (!schedule) return [];

        const slots: string[] = [];
        const scheduleStart = new Date(schedule.startTime);
        const scheduleEnd = new Date(schedule.endTime);

        // Reference time for comparison (Now)
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        let current = new Date(scheduleStart);
        const endHour = scheduleEnd.getHours();
        const endMin = scheduleEnd.getMinutes();

        while (current.getHours() < endHour || (current.getHours() === endHour && current.getMinutes() < endMin)) {
            const slotHour = current.getHours();
            const slotMin = current.getMinutes();

            // Only add if it's a future time (if it's today)
            if (!isToday || (slotHour > now.getHours() || (slotHour === now.getHours() && slotMin > now.getMinutes()))) {
                const timeString = current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                slots.push(timeString);
            }

            current.setHours(current.getHours() + 1);
        }

        return slots;
    };

    const handleOpenAgenda = (doctor: DoctorCardData) => {
        setSelectedDoctor(doctor);
        setShowAgenda(true);
        setSelectedDate(null);
        setAvailableSlots([]);
        setSelectedSlot(null);
    };

    const handleSelectDate = (date: Date) => {
        setSelectedDate(date);
        setSelectedSlot(null);
        if (selectedDoctor) {
            const slots = generateTimeSlots(date, selectedDoctor.schedules);
            setAvailableSlots(slots);
        }
    };

    const handleConfirmAppointment = async () => {
        if (!selectedDate || !selectedSlot || !selectedDoctor) return;

        try {
            setLoading(true);

            // 1. Prepare appointment data
            const [hours, minutes] = selectedSlot.split(':').map(Number);
            const appointmentDate = new Date(selectedDate);
            appointmentDate.setHours(hours, minutes, 0, 0);

            const dayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
            const dayName = dayNames[appointmentDate.getDay()];
            const schedule = selectedDoctor.schedules.find(s => s.dayOfWeek === dayName);

            if (!schedule) {
                showToast('Horario no encontrado para este día.', 'error');
                return;
            }

            const userData = localStorage.getItem('user');
            if (!userData) {
                showToast('Debe iniciar sesión para agendar una cita.', 'warning');
                return;
            }
            const user = JSON.parse(userData);

            const rate = Number(selectedDoctor.appointmentRate || 0);

            // 2. Case: FREE Appointment ($0)
            if (rate === 0) {
                const payload = {
                    patientId: user.id,
                    scheduleId: schedule.id,
                    appointmentDate: appointmentDate.toISOString(),
                    notes: 'Agendado desde el portal de pacientes (Gratuita)'
                };
                await api.post('/appointments', payload);
                showToast('¡Cita agendada exitosamente!', 'success');
                setShowAgenda(false);
                return;
            }

            // 3. Case: PAID Appointment -> Redirect to intermediate page
            const appointmentPayload = {
                patientId: user.id,
                scheduleId: schedule.id,
                appointmentDate: appointmentDate.toISOString(),
                notes: 'Agendado desde el portal de pacientes (Redirección PayPhone)'
            };

            // Save details to be used by the redirect page
            sessionStorage.setItem('pending_appointment', JSON.stringify(appointmentPayload));
            sessionStorage.setItem('pending_rate', rate.toString());

            // Jump to the redirecting page as requested by user
            navigate('/payment/redirecting');

        } catch (error: any) {
            console.error('Payment preparation error:', error);
            showToast('Error al preparar el pago. Intente nuevamente.', 'error');
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div className="loader-premium">Cargando especialistas...</div>
            </div>
        );
    }

    return (
        <div className="patient-offices-container">
            <div className="page-header-premium">
                <div className="header-text">
                    <h1>Especialistas Disponibles</h1>
                    <p>Encuentra al profesional adecuado en nuestras sedes equipadas para tu bienestar.</p>
                </div>
                <div className="header-decoration"></div>
            </div>

            {doctorCards.length === 0 ? (
                <div className="empty-state">
                    <p>No hay especialistas disponibles asignados a consultorios en este momento.</p>
                </div>
            ) : (
                <div className="offices-grid-premium">
                    {doctorCards.map((card, idx) => (
                        <div key={`${card.doctorId}-${idx}`} className="office-card-premium">
                            <div className="office-card-header-premium">
                                <div className="doctor-avatar-bg">
                                    <User size={28} className="doctor-icon" />
                                </div>
                                <div className="office-title-block">
                                    <h3>{card.doctorName}</h3>
                                    <span className="status-badge">Médico Especialista</span>
                                </div>
                            </div>

                            <div className="doctor-specialties-info">
                                {card.specialties.map((spec) => (
                                    <div key={spec.id} className="specialty-badge-group">
                                        <div className="spec-name-row">
                                            <Stethoscope size={16} className="text-secondary" />
                                            <span className="spec-name">{spec.name}</span>
                                        </div>
                                        <p className="spec-description">{spec.description}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="office-card-body-premium">
                                <div className="info-group">
                                    <div className="info-item-premium">
                                        <Building2 size={16} className="text-muted" />
                                        <span className="office-tag">{card.officeName}</span>
                                    </div>
                                    <div className="info-item-premium">
                                        <MapPin size={16} className="text-muted" />
                                        <span>{card.address}</span>
                                    </div>
                                    <div className="info-item-premium">
                                        <Phone size={16} className="text-muted" />
                                        <span>{card.phone}</span>
                                    </div>
                                    <div className="info-item-premium price-info">
                                        <span className="price-label">Costo Consulta:</span>
                                        <span className="price-value">${card.appointmentRate?.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="office-card-footer-premium">
                                <button className="btn-book-now" onClick={() => handleOpenAgenda(card)}>
                                    <span>Ver Agenda de {card.doctorName.split(' ')[0]}</span>
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de Agenda */}
            {showAgenda && selectedDoctor && (
                <div className="modal-overlay-premium" onClick={() => setShowAgenda(false)}>
                    <div className="modal-content-premium" onClick={e => e.stopPropagation()}>
                        <div className="modal-header-premium">
                            <div className="modal-title-group">
                                <h2>Agenda de Citas</h2>
                                <p>{selectedDoctor.doctorName} • {selectedDoctor.officeName}</p>
                            </div>
                            <button className="close-btn-premium" onClick={() => setShowAgenda(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body-premium">
                            <section className="date-selection-section">
                                <h4 className="section-title"><CalendarIcon size={18} /> Selecciona un día</h4>
                                <div className="dates-horizontal-scroll">
                                    {getAvailableDays(selectedDoctor.schedules).map((date, i) => (
                                        <button
                                            key={i}
                                            className={`date-chip ${selectedDate?.toDateString() === date.toDateString() ? 'active' : ''}`}
                                            onClick={() => handleSelectDate(date)}
                                        >
                                            <span className="day-name">{date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase()}</span>
                                            <span className="day-number">{date.getDate()}</span>
                                            <span className="month-name">{date.toLocaleDateString('es-ES', { month: 'short' })}</span>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section className="slots-selection-section">
                                <h4 className="section-title"><Clock size={18} /> Turnos disponibles (1 hora)</h4>
                                {!selectedDate ? (
                                    <div className="slot-empty-state">
                                        <p>Por favor selecciona un día para ver los horarios.</p>
                                    </div>
                                ) : availableSlots.length === 0 ? (
                                    <div className="slot-empty-state">
                                        <p>No hay turnos configurados para este día.</p>
                                    </div>
                                ) : (
                                    <div className="slots-grid-premium">
                                        {availableSlots.map((time, i) => (
                                            <button
                                                key={i}
                                                className={`slot-btn-premium ${selectedSlot === time ? 'active' : ''}`}
                                                onClick={() => setSelectedSlot(time)}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>

                        <div className="modal-footer-premium">
                            <div className="payment-summary-premium">
                                <div className="summary-row">
                                    <span>Consulta Médica:</span>
                                    <span>${selectedDoctor.appointmentRate?.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total a pagar:</span>
                                    <span>${selectedDoctor.appointmentRate?.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                            <p className="footer-notice">* Las citas tienen una duración estimada de 60 minutos.</p>
                            <button
                                className="btn-confirm-selection"
                                disabled={!selectedDate || !selectedSlot || loading}
                                onClick={handleConfirmAppointment}
                                style={{ marginTop: '1.5rem' }}
                            >
                                {loading ? 'Procesando...' : 
                                 Number(selectedDoctor.appointmentRate || 0) > 0 ? 'Confirmar y Pagar con PayPhone' : 'Confirmar Cita (Gratuita)'}
                            </button>

                            {!selectedSlot && (
                                <p className="footer-notice" style={{ color: '#64748B', fontStyle: 'italic', marginTop: '10px' }}>
                                    * Seleccione una fecha y turno para habilitar el agendamiento.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .patient-offices-container {
                    padding: 20px 0;
                }

                .page-header-premium {
                    position: relative;
                    margin-bottom: 40px;
                    padding: 40px;
                    background: linear-gradient(135deg, #1C2434 0%, #24303F 100%);
                    border-radius: 20px;
                    color: white;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }

                .header-text h1 {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin: 0 0 10px 0;
                    letter-spacing: -0.5px;
                }

                /* ... existing styles ... */
                .offices-grid-premium {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
                    gap: 30px;
                }

                .office-card-premium {
                    background: white;
                    border-radius: 24px;
                    padding: 30px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid #E2E8F0;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }

                .office-card-header-premium {
                    display: flex;
                    align-items: center;
                    gap: 18px;
                }

                .doctor-avatar-bg {
                    width: 64px;
                    height: 64px;
                    background: #F1F5F9;
                    border-radius: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #3C50E0;
                }

                .office-title-block h3 { margin: 0; font-size: 1.4rem; font-weight: 700; color: #1C2434; }
                .status-badge { display: inline-block; padding: 4px 10px; background: #E0E7FF; color: #4338CA; font-size: 0.75rem; font-weight: 600; border-radius: 100px; margin-top: 4px; }

                .doctor-specialties-info { padding: 15px 0; display: flex; flex-direction: column; gap: 15px; }
                .spec-name-row { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #475569; }
                .spec-description { font-size: 0.85rem; color: #64748B; padding-left: 24px; margin: 0; }

                .office-card-body-premium { background: #F8FAFC; border-radius: 16px; padding: 15px; margin-top: auto; }
                .info-group { display: flex; flex-direction: column; gap: 10px; }
                .info-item-premium { display: flex; align-items: center; gap: 10px; color: #64748B; font-size: 0.9rem; }
                .price-info { margin-top: 5px; padding-top: 10px; border-top: 1px dashed #E2E8F0; display: flex; justify-content: space-between; width: 100%; }
                .price-label { font-weight: 600; color: #475569; }
                .price-value { font-weight: 800; color: #10B981; font-size: 1.1rem; }
                .office-tag { color: #3C50E0; font-weight: 600; }

                .btn-book-now { width: 100%; padding: 14px; background: #3C50E0; border: none; border-radius: 14px; color: white; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: all 0.2s ease; }
                .btn-book-now:hover { background: #2D3EAF; }

                /* MODAL STYLES */
                .modal-overlay-premium {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(15, 23, 42, 0.7);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                }

                .modal-content-premium {
                    background: white;
                    width: 100%;
                    max-width: 650px;
                    max-height: 95vh;
                    border-radius: 28px;
                    overflow-y: auto;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }

                .modal-header-premium {
                    padding: 20px 30px;
                    background: #F8FAFC;
                    border-bottom: 1px solid #E2E8F0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }

                .modal-title-group h2 { margin: 0; font-size: 1.5rem; font-weight: 800; color: #1C2434; }
                .modal-title-group p { margin: 5px 0 0 0; font-size: 0.95rem; color: #64748B; }

                .close-btn-premium { background: white; border: 1px solid #E2E8F0; border-radius: 12px; padding: 8px; cursor: pointer; color: #64748B; transition: all 0.2s; }
                .close-btn-premium:hover { background: #F1F5F9; color: #ef4444; }

                .modal-body-premium { padding: 25px 30px; display: flex; flex-direction: column; gap: 30px; }

                .section-title { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; font-weight: 700; color: #1C2434; margin-bottom: 20px; }

                .dates-horizontal-scroll {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    padding: 5px;
                }

                .date-chip {
                    flex: 1 1 100px;
                    height: 100px;
                    background: #F8FAFC;
                    border: 1px solid #E2E8F0;
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .date-chip:hover { 
                    border-color: #3C50E0; 
                    background: white;
                    transform: translateY(-2px);
                }

                .date-chip.active { 
                    background: #3C50E0; 
                    border-color: #3C50E0; 
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 15px -5px rgba(60, 80, 224, 0.4);
                }

                .day-name { 
                    font-size: 0.8rem; 
                    font-weight: 700; 
                    letter-spacing: 1px;
                    opacity: 0.6; 
                }
                
                .date-chip.active .day-name { opacity: 0.9; }

                .day-number { 
                    font-size: 1.8rem; 
                    font-weight: 900; 
                    line-height: 1;
                    margin: 2px 0;
                }

                .month-name { 
                    font-size: 0.85rem; 
                    font-weight: 600; 
                    text-transform: capitalize;
                }

                .slots-grid-premium {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                    gap: 12px;
                }

                .slot-btn-premium {
                    padding: 12px;
                    background: white;
                    border: 1px solid #E2E8F0;
                    border-radius: 14px;
                    font-weight: 700;
                    font-size: 1rem;
                    color: #475569;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .slot-btn-premium:hover { background: #F1F5F9; border-color: #3C50E0; color: #3C50E0; }
                .slot-btn-premium.active { background: #3C50E0; border-color: #3C50E0; color: white; box-shadow: 0 4px 12px rgba(60, 80, 224, 0.3); }

                .slot-empty-state { text-align: center; padding: 40px 0; background: #F8FAFC; border-radius: 20px; color: #94A3B8; border: 2px dashed #E2E8F0; }

                .modal-footer-premium { padding: 25px 30px; border-top: 1px solid #E2E8F0; display: flex; flex-direction: column; gap: 20px; }
                .payment-summary-premium { background: #F0FDF4; border-radius: 16px; padding: 20px; border: 1px solid #DCFCE7; }
                .summary-row { display: flex; justify-content: space-between; font-size: 0.95rem; color: #374151; margin-bottom: 10px; }
                .summary-row.total { margin-top: 10px; padding-top: 10px; border-top: 1px solid #BBF7D0; font-weight: 800; font-size: 1.2rem; color: #065F46; margin-bottom: 0; }
                .footer-notice { margin: 0; font-size: 0.85rem; color: #94A3B8; text-align: center; }

                .btn-confirm-selection {
                    width: 100%;
                    padding: 16px;
                    background: #3C50E0;
                    color: white;
                    border: none;
                    border-radius: 16px;
                    font-weight: 800;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-confirm-selection:hover:not(:disabled) { background: #2D3EAF; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(60, 80, 224, 0.2); }
                .btn-confirm-selection:disabled { background: #E2E8F0; color: #94A3B8; cursor: not-allowed; }

                .loader-premium { font-weight: 700; color: #3C50E0; display: flex; align-items: center; gap: 15px; }
                .loader-premium::after { content: ""; width: 24px; height: 24px; border: 3px solid #3C50E0; border-top-color: transparent; border-radius: 50%; display: inline-block; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
