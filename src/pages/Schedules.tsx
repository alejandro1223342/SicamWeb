import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { X } from 'lucide-react';
import api from '../api';
import toast, { Toaster } from 'react-hot-toast';
import { useSpecialty } from '../context/SpecialtyContext';
import '../index.css';

// Day mapping helper (Spanish for Backend Enum)
const getDayOfWeek = (dateString: string): string => {
    const days = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
    const date = new Date(dateString + 'T12:00:00');
    return days[date.getDay()];
};

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end?: string;
    backgroundColor?: string;
    borderColor?: string;
    allDay?: boolean;
    textColor?: string;
    extendedProps?: {
        isActive?: boolean;
        officeId?: string;
        specialtyId?: string;
        originalStartDate?: string;
        originalEndDate?: string;
    };
}

export default function Schedules() {
    const { specialtyId: urlSpecialtyId } = useParams<{ specialtyId: string }>();
    const { activeSpecialty, getActiveSpecialtyId } = useSpecialty();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [offices, setOffices] = useState<any[]>([]);
    const [selectedOfficeId, setSelectedOfficeId] = useState<string>('');

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    
    // Conflict Modal State
    const [conflictModalOpen, setConflictModalOpen] = useState(false);
    const [conflictData, setConflictData] = useState<any>(null);
    const [pendingPayload, setPendingPayload] = useState<any>(null);

    
    interface ScheduleFormData {
        title: string;
        color: string;
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
        isActive: boolean;
    }

    const [formData, setFormData] = useState<ScheduleFormData>({
        title: '',
        color: 'primary',
        startDate: '',
        endDate: '',
        startTime: '09:00',
        endTime: '10:00',
        isActive: true
    });

    const filteredEvents = useMemo(() => {
        if (!selectedOfficeId) return events;
        return events.filter(event => event.extendedProps?.officeId === selectedOfficeId);
    }, [events, selectedOfficeId]);

    // Track window size for responsiveness
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Load User and Offices
    useEffect(() => {
        const fetchInitialized = async () => {
            try {
                const userData = localStorage.getItem('user');
                if (!userData) return;
                const user = JSON.parse(userData);

                // Fetch Doctor's Offices
                const officesRes = await api.get(`/medical-offices/doctor/${user.id}`);
                setOffices(officesRes.data);

                if (officesRes.data.length > 0 && !selectedOfficeId) {
                    setSelectedOfficeId(officesRes.data[0].id);
                }

                // Fetch Schedules with active specialty filter
                fetchSchedules(user.id);
            } catch (error) {
                console.error('Error loading initial data:', error);
                toast.error('Error al cargar datos del médico');
            }
        };

        fetchInitialized();
    }, [activeSpecialty]);

    // Helper to map Spanish backend days to FullCalendar integers (0=Sunday, 1=Monday...)
    const getDayId = (dayName: string) => {
        const days = { 'DOMINGO': 0, 'LUNES': 1, 'MARTES': 2, 'MIERCOLES': 3, 'JUEVES': 4, 'VIERNES': 5, 'SABADO': 6 };
        return days[dayName as keyof typeof days] ?? 1; // Default to Monday if error
    };

    const fetchSchedules = async (doctorId: string) => {
        try {
            // Fetch ALL schedules so we can show blocked times
            const response = await api.get('/schedules');

            setEvents(response.data.map((s: any) => {
                const extractLocalTime = (dateStr: string) => {
                    if (!dateStr) return '00:00';
                    const date = new Date(dateStr);
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    return `${hours}:${minutes}`;
                };

                const start = extractLocalTime(s.startTime);
                const end = extractLocalTime(s.endTime);

                const endDate = new Date(s.endDate);
                endDate.setDate(endDate.getDate() + 1);

                const isMine = s.doctorId === doctorId;
                
                let title = `${s.office?.name || 'Consultorio'}`;
                if (isMine) {
                    title += ` (${start} - ${end})`;
                } else {
                    title += ` - Ocupado por Dr. ${s.doctor?.firstName} ${s.doctor?.lastName} (${s.specialty?.name})`;
                }

                return {
                    id: s.id,
                    title,
                    daysOfWeek: [getDayId(s.dayOfWeek)],
                    startTime: start,
                    endTime: end,
                    startRecur: s.startDate ? s.startDate.split('T')[0] : undefined,
                    endRecur: endDate.toISOString().split('T')[0],
                    backgroundColor: isMine ? (s.isActive ? '#6366f1' : '#e5e7eb') : '#4b5563', // gray for others
                    borderColor: isMine ? (s.isActive ? '#6366f1' : '#d1d5db') : '#374151',
                    textColor: isMine ? (s.isActive ? 'white' : '#9ca3af') : '#e5e7eb',
                    editable: isMine,
                    startEditable: isMine,
                    durationEditable: isMine,
                    extendedProps: {
                        isActive: s.isActive !== false,
                        officeId: s.officeId,
                        specialtyId: s.specialtyId,
                        originalStartDate: s.startDate,
                        originalEndDate: s.endDate,
                        isMine
                    }
                };
            }));
        } catch (error) {
            console.error(error);
        }
    };

    const handleDateSelect = (selectInfo: any) => {
        setModalMode('add');
        const startStr = selectInfo.startStr;
        const endStr = selectInfo.endStr;

        setFormData({
            title: '',
            color: 'primary',
            startDate: startStr.includes('T') ? startStr.split('T')[0] : startStr,
            endDate: endStr.includes('T') ? endStr.split('T')[0] : startStr,
            startTime: startStr.includes('T') ? startStr.split('T')[1].substring(0, 5) : '09:00',
            endTime: endStr.includes('T') ? endStr.split('T')[1].substring(0, 5) : '10:00',
            isActive: true
        });
        setShowModal(true);
        selectInfo.view.calendar.unselect();
    };

    const handleEventClick = (clickInfo: any) => {
        if (clickInfo.event.extendedProps.isMine === false) {
            toast.error('No puedes editar el horario de otro médico.');
            return;
        }

        setModalMode('edit');
        setSelectedEventId(clickInfo.event.id);

        const formatTime = (date: Date | null) => {
            if (!date) return '00:00';
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        };

        setFormData({
            title: clickInfo.event.title.split('(')[0].trim(),
            color: 'primary',
            startDate: clickInfo.event.extendedProps.originalStartDate ? clickInfo.event.extendedProps.originalStartDate.split('T')[0] : clickInfo.event.startStr.split('T')[0],
            endDate: clickInfo.event.extendedProps.originalEndDate ? clickInfo.event.extendedProps.originalEndDate.split('T')[0] : clickInfo.event.endStr.split('T')[0],
            startTime: formatTime(clickInfo.event.start),
            endTime: formatTime(clickInfo.event.end || clickInfo.event.start),
            isActive: clickInfo.event.extendedProps.isActive ?? true
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userData = localStorage.getItem('user');
            if (!userData) {
                toast.error('Sesión no válida');
                return;
            }
            const user = JSON.parse(userData);

            if (!selectedOfficeId && offices.length === 0) {
                toast.error('No tienes consultorios asignados para crear horarios.');
                return;
            }

            const startDateTime = new Date(`${formData.startDate}T${formData.startTime}:00`);
            const endDateTime = new Date(`${formData.endDate}T${formData.endTime}:00`);

            const payload = {
                officeId: selectedOfficeId || offices[0].id,
                doctorId: user.id,
                specialtyId: urlSpecialtyId || getActiveSpecialtyId(),
                dayOfWeek: getDayOfWeek(formData.startDate),
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
                isActive: formData.isActive
            };

            if (!payload.specialtyId) {
                toast.error('Selecciona una especialidad activa primero.');
                return;
            }

            if (modalMode === 'add') {
                await api.post('/schedules', payload);
                toast.success('Horario creado exitosamente');
            } else if (selectedEventId) {
                await api.patch(`/schedules/${selectedEventId}`, payload);
                toast.success('Horario actualizado');
            }

            setShowModal(false);
            fetchSchedules(user.id);
        } catch (error: any) {
            console.error('Error guardando horario:', error);
            if (error.response?.status === 409 && error.response.data?.conflict) {
                // Any doctor can override if they accept the warning
                setConflictData(error.response.data);
                
                // Rebuild payload to have it ready for forced submit
                const startDateTime = new Date(`${formData.startDate}T${formData.startTime}:00`);
                const endDateTime = new Date(`${formData.endDate}T${formData.endTime}:00`);
                const userData = localStorage.getItem('user');
                const userObj = userData ? JSON.parse(userData) : { id: '' };

                setPendingPayload({
                    officeId: selectedOfficeId || offices[0].id,
                    doctorId: userObj.id,
                    specialtyId: urlSpecialtyId || getActiveSpecialtyId(),
                    dayOfWeek: getDayOfWeek(formData.startDate),
                    startDate: new Date(formData.startDate).toISOString(),
                    endDate: new Date(formData.endDate).toISOString(),
                    startTime: startDateTime.toISOString(),
                    endTime: endDateTime.toISOString(),
                    isActive: formData.isActive
                });
                
                setConflictModalOpen(true);
            } else {
                toast.error('Error al guardar el evento');
            }
        }
    };

    const confirmForceSubmit = async () => {
        if (!pendingPayload) return;
        try {
            const payloadWithOverride = { ...pendingPayload, forceOverride: true };
            if (modalMode === 'add') {
                await api.post('/schedules', payloadWithOverride);
                toast.success('Horario creado forzosamente');
            } else if (selectedEventId) {
                await api.patch(`/schedules/${selectedEventId}`, payloadWithOverride);
                toast.success('Horario actualizado forzosamente');
            }
            setConflictModalOpen(false);
            setShowModal(false);
            
            const userData = localStorage.getItem('user');
            if (userData) fetchSchedules(JSON.parse(userData).id);
        } catch (error) {
            console.error(error);
            toast.error('Error al forzar guardado');
        }
    };

    const handleDelete = async () => {
        if (!selectedEventId) return;
        if (!window.confirm('¿Estás seguro de que deseas eliminar este horario?')) return;
        
        try {
            await api.delete(`/schedules/${selectedEventId}`);
            toast.success('Horario eliminado');
            setShowModal(false);
            const userData = localStorage.getItem('user');
            if (userData) fetchSchedules(JSON.parse(userData).id);
        } catch (error) {
            console.error(error);
            toast.error('Error al eliminar');
        }
    };

    return (
        <div className="management-container" style={{ maxWidth: '100%', padding: '24px' }}>
            <Toaster position="top-right" />

            {/* Header Sensible al Dispositivo */}
            <div style={{ 
                marginBottom: '24px', 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'flex-start' : 'end',
                gap: isMobile ? '16px' : '0'
            }}>
                <div>
                    <h1 style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>Mi Agenda</h1>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                        Gestión de Horarios {'>'} <span style={{ color: '#6366f1', fontWeight: '500' }}>Calendario</span>
                    </div>
                </div>

                {offices.length > 1 && (
                    <div style={{ width: isMobile ? '100%' : '200px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px' }}>Consultorio:</label>
                        <select
                            className="form-input"
                            value={selectedOfficeId}
                            onChange={(e) => setSelectedOfficeId(e.target.value)}
                            style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%' }}
                        >
                            {offices.map(off => (
                                <option key={off.id} value={off.id}>{off.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="card" style={{
                padding: isMobile ? '10px' : '20px',
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                background: '#fff',
                overflow: 'hidden'
            }}>
                <style>{`
                    .fc-toolbar { 
                        display: flex;
                        flex-direction: ${isMobile ? 'column' : 'row'};
                        gap: 10px;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0 0 24px 0; 
                        margin-bottom: 0 !important; 
                    }
                    .fc-toolbar-title { 
                        font-size: ${isMobile ? '1rem' : '1.25rem'} !important; 
                        font-weight: 700; 
                        color: #111827; 
                    }
                    .fc-button { 
                        border-radius: 8px !important; 
                        font-weight: 500; 
                        font-size: 0.8rem !important; 
                        padding: 0.5rem 0.8rem !important; 
                        transition: all 0.2s;
                        box-shadow: none !important;
                        border: 1px solid #e5e7eb !important;
                        background-color: #fff !important;
                        color: #374151 !important;
                    }
                    .fc-button:hover { background-color: #f9fafb !important; border-color: #d1d5db !important; }
                    .fc-button-group { display: flex; gap: 2px; }
                    .fc-button-group > .fc-button {
                        background-color: transparent !important;
                        border: none !important;
                        color: #6b7280 !important;
                        border-radius: 8px !important;
                        margin: 0 !important;
                        font-size: 0.75rem !important;
                    }
                    .fc-button-group > .fc-button.fc-button-active {
                        background-color: #fff !important;
                        color: #5D5FEF !important;
                        box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
                        font-weight: 600;
                    } 
                    .fc-today-button { display: none; } 
                    .fc-theme-standard td, .fc-theme-standard th { border-color: #f3f4f6; }
                    .fc-col-header-cell { padding: 8px 0 !important; background: transparent; border-bottom: 2px solid #f3f4f6; }
                    .fc-event { 
                        border-radius: 6px; 
                        border: none; 
                        padding: 2px 4px; 
                        font-size: 0.75rem !important; 
                        font-weight: 500;
                        box-shadow: 0 2px 3px rgba(0,0,0,0.05); 
                    }
                    .fc-addEventButton-button { 
                        background-color: #5D5FEF !important; 
                        border-color: #5D5FEF !important;
                        color: white !important; 
                        width: ${isMobile ? '100%' : 'auto'};
                    }
                `}</style>

                <div style={{ height: isMobile ? '500px' : '700px', overflow: 'hidden' }}>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        locale={esLocale}
                        headerToolbar={isMobile ? {
                            left: 'prev,next',
                            center: 'title',
                            right: 'addEventButton'
                        } : {
                            left: 'prev,next,addEventButton',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        customButtons={{
                            addEventButton: {
                                text: '+ Nuevo',
                                click: () => {
                                    setModalMode('add');
                                    setShowModal(true);
                                },
                            }
                        }}
                        initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        weekends={true}
                        events={filteredEvents}
                        select={handleDateSelect}
                        eventClick={handleEventClick}
                        slotMinTime="06:00:00"
                        slotMaxTime="22:00:00"
                        allDaySlot={false}
                        height="100%"
                        expandRows={true}
                        stickyHeaderDates={true}
                        eventDrop={async (info) => {
                            if (info.event.extendedProps.isMine === false) {
                                info.revert();
                                return;
                            }
                            try {
                                const newStart = info.event.start;
                                const newEnd = info.event.end || info.event.start;
                                if (!newStart || !newEnd) return;
                                const days = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
                                const dayOfWeek = days[newStart.getDay()];
                                await api.patch(`/schedules/${info.event.id}`, {
                                    startTime: newStart.toISOString(),
                                    endTime: newEnd.toISOString(),
                                    dayOfWeek
                                });
                                toast.success('Horario actualizado');
                            } catch (error: any) {
                                info.revert();
                                if (error.response?.status === 409 && error.response.data?.conflict) {
                                    setConflictData(error.response.data);
                                    
                                    const newStart = info.event.start;
                                    const newEnd = info.event.end || info.event.start;
                                    const days = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
                                    
                                    setPendingPayload({
                                        startTime: newStart?.toISOString(),
                                        endTime: newEnd?.toISOString(),
                                        dayOfWeek: newStart ? days[newStart.getDay()] : undefined
                                    });
                                    setSelectedEventId(info.event.id);
                                    setModalMode('edit');
                                    setConflictModalOpen(true);
                                } else {
                                    toast.error(error.response?.data?.message || 'Error al mover el evento');
                                }
                            }
                        }}
                        eventResize={async (info) => {
                            if (info.event.extendedProps.isMine === false) {
                                info.revert();
                                return;
                            }
                            try {
                                const newStart = info.event.start;
                                const newEnd = info.event.end;
                                if (!newStart || !newEnd) return;
                                await api.patch(`/schedules/${info.event.id}`, {
                                    startTime: newStart.toISOString(),
                                    endTime: newEnd.toISOString()
                                });
                                toast.success('Duración actualizada');
                            } catch (error: any) {
                                info.revert();
                                if (error.response?.status === 409 && error.response.data?.conflict) {
                                    setConflictData(error.response.data);
                                    
                                    setPendingPayload({
                                        startTime: info.event.start?.toISOString(),
                                        endTime: info.event.end?.toISOString()
                                    });
                                    setSelectedEventId(info.event.id);
                                    setModalMode('edit');
                                    setConflictModalOpen(true);
                                } else {
                                    toast.error(error.response?.data?.message || 'Error al cambiar duración');
                                }
                            }
                        }}
                    />
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
                    <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '450px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                                {modalMode === 'add' ? 'Nuevo Evento' : 'Editar Evento'}
                            </h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>Título</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>Color</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {[
                                        { id: 'primary', color: '#6366f1' },
                                        { id: 'success', color: '#10b981' },
                                        { id: 'warning', color: '#f59e0b' },
                                        { id: 'danger', color: '#ef4444' }
                                    ].map(theme => (
                                        <div key={theme.id} onClick={() => setFormData({ ...formData, color: theme.id })} style={{ width: '20px', height: '20px', borderRadius: '50%', background: theme.color, cursor: 'pointer', border: formData.color === theme.id ? `2px solid #000` : '1px solid #eee' }} />
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>Inicio</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                    <input type="date" required value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem' }} />
                                    <input type="time" required value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem' }} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>Fin</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                    <input type="date" required value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem' }} />
                                    <input type="time" required value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                {modalMode === 'edit' && (
                                    <button type="button" onClick={handleDelete} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>Eliminar</button>
                                )}
                                <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                                    <button type="button" onClick={() => setShowModal(false)} style={{ background: 'white', border: '1px solid #d1d5db', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>Cancelar</button>
                                    <button type="submit" style={{ background: '#6366f1', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem' }}>Aceptar</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Conflict Modal */}
            {conflictModalOpen && conflictData && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '16px' }}>
                    <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#b91c1c' }}>
                            <div style={{ background: '#fee2e2', padding: '8px', borderRadius: '50%' }}>
                                <X size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>Conflicto de Horario</h3>
                        </div>
                        
                        <p style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: '1.5', marginBottom: '24px' }}>
                            {conflictData.message}
                            <br /><br />
                            <strong>A pesar de esto, ¿deseas forzar la creación de este horario y compartir el consultorio?</strong>
                        </p>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button 
                                onClick={() => setConflictModalOpen(false)} 
                                style={{ background: 'white', border: '1px solid #d1d5db', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer', color: '#374151' }}>
                                Cancelar
                            </button>
                            <button 
                                onClick={confirmForceSubmit} 
                                style={{ background: '#b91c1c', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer' }}>
                                Sí, forzar guardado
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
