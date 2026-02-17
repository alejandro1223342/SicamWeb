import React, { useState, useEffect, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { X, AlertTriangle } from 'lucide-react';
import axios from 'axios';
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
    const { activeSpecialty } = useSpecialty();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [offices, setOffices] = useState<any[]>([]);
    const [selectedOfficeId, setSelectedOfficeId] = useState<string>('');

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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

                if (officesRes.data.length > 0) {
                    setSelectedOfficeId(officesRes.data[0].id);
                }

                // Fetch Schedules
                fetchSchedules(user.id);
            } catch (error) {
                console.error('Error loading initial data:', error);
                toast.error('Error al cargar datos del médico');
            }
        };

        fetchInitialized();
    }, []);

    // Helper to map Spanish backend days to FullCalendar integers (0=Sunday, 1=Monday...)
    const getDayId = (dayName: string) => {
        const days = { 'DOMINGO': 0, 'LUNES': 1, 'MARTES': 2, 'MIERCOLES': 3, 'JUEVES': 4, 'VIERNES': 5, 'SABADO': 6 };
        return days[dayName as keyof typeof days] ?? 1; // Default to Monday if error
    };

    const fetchSchedules = async (doctorId: string) => {
        try {
            const response = await api.get(`/schedules/doctor/${doctorId}`);

            setEvents(response.data.map((s: any) => {
                // Correctly parse ISO string to Local Time (HH:mm)
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

                return {
                    id: s.id,
                    title: `${s.office?.name || 'Consultorio'} (${start} - ${end})`,
                    // Recurring Event Properties
                    daysOfWeek: [getDayId(s.dayOfWeek)],
                    startTime: start,
                    endTime: end,
                    startRecur: s.startDate.split('T')[0],
                    endRecur: endDate.toISOString().split('T')[0],
                    // Visuals
                    backgroundColor: s.isActive ? '#6366f1' : '#e5e7eb',
                    borderColor: s.isActive ? '#6366f1' : '#d1d5db',
                    textColor: s.isActive ? 'white' : '#9ca3af',
                    extendedProps: {
                        isActive: s.isActive !== false, // Default to true if undefined
                        officeId: s.officeId,
                        specialtyId: s.specialtyId,
                        originalStartDate: s.startDate,
                        originalEndDate: s.endDate
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
        setModalMode('edit');
        setSelectedEventId(clickInfo.event.id);

        // Helper to extract HH:mm from a Date object
        const formatTime = (date: Date | null) => {
            if (!date) return '00:00';
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        };

        setFormData({
            title: clickInfo.event.title.split('(')[0].trim(), // Clean title
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

            // Construct valid Dates for startTime/endTime
            const startDateTime = new Date(`${formData.startDate}T${formData.startTime}:00`);
            const endDateTime = new Date(`${formData.endDate}T${formData.endTime}:00`);

            const payload = {
                officeId: selectedOfficeId || offices[0].id,
                doctorId: user.id,
                specialtyId: activeSpecialty?.id || user.specialties?.[0]?.specialtyId,
                dayOfWeek: getDayOfWeek(formData.startDate),
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
                isActive: formData.isActive
            };

            console.log('Enviando Payload:', payload);

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
        } catch (error) {
            console.error('Error saving schedule:', error);
            if (axios.isAxiosError(error) && error.response) {
                console.error('Server response:', error.response.data);
                toast.error(`Error: ${error.response.data.message || 'Error al guardar'}`);
            } else {
                toast.error('Error al guardar el horario');
            }
        }
    };

    const handleDelete = () => {
        if (selectedEventId) {
            setShowDeleteConfirm(true);
        }
    };

    const confirmDelete = async () => {
        if (!selectedEventId) return;

        try {
            await api.delete(`/schedules/${selectedEventId}`);
            toast.success('Horario eliminado');
            setShowModal(false);
            setShowDeleteConfirm(false);
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

            {/* Header */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>Mi Agenda</h1>
                    <div style={{ fontSize: '0.95rem', color: '#6b7280' }}>
                        Gestión de Horarios {'>'} <span style={{ color: '#6366f1', fontWeight: '500' }}>Calendario</span>
                    </div>
                </div>

                {offices.length > 1 && (
                    <div style={{ minWidth: '200px' }}>
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
                padding: '20px',
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                background: '#fff',
                overflow: 'hidden'
            }}>
                <style>{`
                    .fc-toolbar { 
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0 0 24px 0; 
                        margin-bottom: 0 !important; 
                    }
                    .fc-toolbar-title { 
                        font-size: 1.25rem !important; 
                        fontWeight: 700; 
                        color: #111827; 
                    }
                    .fc-button { 
                        border-radius: 8px !important; 
                        font-weight: 500; 
                        font-size: 0.875rem; 
                        padding: 0.6rem 1rem !important; 
                        transition: all 0.2s;
                        box-shadow: none !important;
                        border: 1px solid #e5e7eb !important;
                        background-color: #fff !important;
                        color: #374151 !important;
                    }
                    .fc-button:hover { background-color: #f9fafb !important; border-color: #d1d5db !important; }
                    .fc-button-group > .fc-button {
                        background-color: transparent !important;
                        border: none !important;
                        color: #6b7280 !important;
                        border-radius: 8px !important;
                        margin: 0 !important;
                        font-size: 0.85rem;
                    }
                    .fc-button-group > .fc-button.fc-button-active {
                        background-color: #fff !important;
                        color: #5D5FEF !important;
                        box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
                        font-weight: 600;
                    } 
                    .fc-today-button { display: none; } 
                    .fc-theme-standard td, .fc-theme-standard th { border-color: #f3f4f6; }
                    .fc-col-header-cell { padding: 16px 0; background: transparent; border-bottom: 2px solid #f3f4f6; }
                    .fc-event { 
                        border-radius: 6px; 
                        border: none; 
                        padding: 2px 4px; 
                        font-size: 0.85rem; 
                        font-weight: 500;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.05); 
                    }
                    .fc-addEventButton-button { 
                        background-color: #5D5FEF !important; 
                        border-color: #5D5FEF !important;
                        color: white !important; 
                    }
                `}</style>

                <div style={{ height: '700px', overflow: 'hidden' }}>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        locale={esLocale}
                        headerToolbar={{
                            left: 'prev,next,addEventButton',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        customButtons={{
                            addEventButton: {
                                text: '+ Nuevo Evento',
                                click: () => {
                                    setModalMode('add');
                                    setShowModal(true);
                                },
                            }
                        }}
                        initialView="timeGridWeek"
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        weekends={true}
                        initialEvents={events}
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
                            try {
                                const newStart = info.event.start;
                                const newEnd = info.event.end || info.event.start; // Fallback if null

                                if (!newStart || !newEnd) return;

                                // Helper to map Spanish backend days
                                const days = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
                                const dayOfWeek = days[newStart.getDay()];

                                // Send ISO strings as expected by backend DTO
                                await api.patch(`/schedules/${info.event.id}`, {
                                    startTime: newStart.toISOString(),
                                    endTime: newEnd.toISOString(),
                                    dayOfWeek
                                });

                                toast.success('Horario actualizado');
                            } catch (error: any) {
                                console.error('Error updating schedule via drag:', error);
                                const msg = error.response?.data?.message || 'Error al mover el evento';
                                toast.error(`Error: ${Array.isArray(msg) ? msg[0] : msg}`);
                                info.revert();
                            }
                        }}
                        eventResize={async (info) => {
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
                                console.error('Error updating schedule via resize:', error);
                                const msg = error.response?.data?.message || 'Error al cambiar duración';
                                toast.error(`Error: ${Array.isArray(msg) ? msg[0] : msg}`);
                                info.revert();
                            }
                        }}
                    />
                </div>
            </div>

            {/* Modal Profesional */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '450px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827' }}>
                                {modalMode === 'add' ? 'Agendar Nuevo Evento' : 'Editar Evento'}
                            </h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', borderRadius: '4px' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>Título</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Ej. Consulta General"
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '10px', color: '#374151' }}>Etiqueta de Color</label>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {[
                                        { id: 'primary', color: '#6366f1', label: 'Azul' },
                                        { id: 'success', color: '#10b981', label: 'Verde' },
                                        { id: 'warning', color: '#f59e0b', label: 'Naranja' },
                                        { id: 'danger', color: '#ef4444', label: 'Rojo' }
                                    ].map(theme => (
                                        <div
                                            key={theme.id}
                                            onClick={() => setFormData({ ...formData, color: theme.id })}
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                background: theme.color,
                                                cursor: 'pointer',
                                                border: formData.color === theme.id ? `3px solid #fff` : '2px solid transparent',
                                                boxShadow: formData.color === theme.id ? `0 0 0 2px ${theme.color}` : 'none'
                                            }}
                                            title={theme.label}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Fecha de Inicio</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '10px' }}>
                                    <input type="date" required value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                                    <input type="time" required value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Fecha de Fin</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '10px' }}>
                                    <input type="date" required value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                                    <input type="time" required value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <label htmlFor="isActive" style={{ fontSize: '0.9rem', fontWeight: '500', color: '#374151', cursor: 'pointer' }}>
                                    Horario Activo
                                </label>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                                {modalMode === 'edit' ? (
                                    <button type="button" onClick={handleDelete} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
                                        Eliminar
                                    </button>
                                ) : <div></div>}

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button type="button" onClick={() => setShowModal(false)} style={{ background: 'white', color: '#6b7280', border: '1px solid #d1d5db', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
                                        Cancelar
                                    </button>
                                    <button type="submit" style={{ background: '#6366f1', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4)' }}>
                                        {modalMode === 'add' ? 'Guardar Evento' : 'Actualizar'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {
                showDeleteConfirm && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
                        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', transform: 'scale(1)', transition: 'transform 0.2s' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                                    <AlertTriangle size={24} color="#ef4444" />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>¿Eliminar este horario?</h3>
                                <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '24px' }}>
                                    Esta acción no se puede deshacer. El horario se eliminará permanentemente de tu calendario.
                                </p>
                                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        style={{ flex: 1, background: 'white', border: '1px solid #d1d5db', color: '#374151', padding: '10px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', transition: 'background 0.2s' }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        style={{ flex: 1, background: '#ef4444', border: 'none', color: 'white', padding: '10px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.4)', transition: 'background 0.2s' }}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
