import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Plus, X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import '../index.css';

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end?: string;
    backgroundColor?: string;
    borderColor?: string;
    allDay?: boolean;
}

export default function Schedules() {
    const [events, setEvents] = useState<CalendarEvent[]>([
        { id: '1', title: 'Consultas Mañana', start: '2025-02-17T08:00:00', end: '2025-02-17T12:00:00', backgroundColor: '#5D5FEF', borderColor: '#5D5FEF' },
        { id: '2', title: 'Cirugía Capilar', start: '2025-02-18T14:00:00', end: '2025-02-18T16:00:00', backgroundColor: '#F43F5E', borderColor: '#F43F5E' },
    ]);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        color: 'primary', // primary, success, warning, danger
        startDate: '',
        endDate: '',
        startTime: '09:00',
        endTime: '10:00'
    });

    // Helper to map color names to hex
    const getColorHex = (colorName: string) => {
        switch (colorName) {
            case 'danger': return '#ef4444'; // Red-500
            case 'success': return '#10b981'; // Emerald-500
            case 'warning': return '#f59e0b'; // Amber-500
            case 'primary': default: return '#6366f1'; // Indigo-500
        }
    };

    const handleDateSelect = (selectInfo: any) => {
        setModalMode('add');
        setFormData({
            title: '',
            color: 'primary',
            startDate: selectInfo.startStr.split('T')[0],
            endDate: selectInfo.endStr.split('T')[0] || selectInfo.startStr.split('T')[0],
            startTime: selectInfo.startStr.includes('T') ? selectInfo.startStr.split('T')[1].substring(0, 5) : '09:00',
            endTime: selectInfo.endStr.includes('T') ? selectInfo.endStr.split('T')[1].substring(0, 5) : '10:00'
        });
        setShowModal(true);
        selectInfo.view.calendar.unselect();
    };

    const handleEventClick = (clickInfo: any) => {
        setModalMode('edit');
        setSelectedEventId(clickInfo.event.id);
        const eventColorHex = clickInfo.event.backgroundColor;
        // Simple heuristic to map back to color code if needed, or just keep strict

        setFormData({
            title: clickInfo.event.title,
            color: 'primary',
            startDate: clickInfo.event.startStr.split('T')[0],
            endDate: clickInfo.event.endStr ? clickInfo.event.endStr.split('T')[0] : clickInfo.event.startStr.split('T')[0],
            startTime: clickInfo.event.startStr.includes('T') ? clickInfo.event.startStr.split('T')[1].substring(0, 5) : '00:00',
            endTime: clickInfo.event.endStr && clickInfo.event.endStr.includes('T') ? clickInfo.event.endStr.split('T')[1].substring(0, 5) : '23:59'
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newEvent: CalendarEvent = {
            id: modalMode === 'edit' && selectedEventId ? selectedEventId : String(Date.now()),
            title: formData.title,
            start: `${formData.startDate}T${formData.startTime}:00`,
            end: `${formData.startDate}T${formData.endTime}:00`,
            backgroundColor: getColorHex(formData.color),
            borderColor: getColorHex(formData.color)
        };

        if (modalMode === 'add') {
            setEvents([...events, newEvent]);
        } else {
            setEvents(events.map(ev => ev.id === selectedEventId ? newEvent : ev));
        }

        setShowModal(false);
    };

    const handleDelete = () => {
        if (selectedEventId && confirm('¿Estás seguro de eliminar este evento?')) {
            setEvents(events.filter(ev => ev.id !== selectedEventId));
            setShowModal(false);
        }
    };

    return (
        <div className="management-container" style={{ maxWidth: '100%', padding: '24px' }}>

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>Mi Agenda</h1>
                <div style={{ fontSize: '0.95rem', color: '#6b7280' }}>
                    Gestión de Horarios {'>'} <span style={{ color: '#6366f1', fontWeight: '500' }}>Calendario</span>
                </div>
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

                    /* General Button Styles */
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
                    .fc-button:focus { box-shadow: none !important; }

                    /* Left Side: Navigation Group */
                    .fc-toolbar-chunk:first-child {
                        display: flex;
                        align-items: center;
                        gap: 12px; /* Space between nav arrows and Add button */
                    }
                    
                    /* Navigation Arrows Group */
                    .fc-prev-button, .fc-next-button {
                        border: 1px solid #e5e7eb !important;
                        background-color: #fff !important;
                        color: #374151 !important;
                        width: 40px;
                        padding: 0 !important;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    /* Add Event Button - Prominent Blue */
                    .fc-addEventButton-button { 
                        background-color: #5D5FEF !important; 
                        border-color: #5D5FEF !important;
                        color: white !important; 
                        font-weight: 600;
                        padding-left: 1.2rem !important;
                        padding-right: 1.2rem !important;
                        border: none !important;
                    }
                    .fc-addEventButton-button:hover { 
                        background-color: #4f46e5 !important; 
                        box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2) !important;
                    }

                    /* Right Side: View Switcher (Segmented Control) */
                    .fc-button-group {
                        background-color: #f3f4f6;
                        padding: 4px;
                        border-radius: 10px;
                        gap: 0;
                        border: none;
                    }
                    .fc-button-group > .fc-button {
                        background-color: transparent !important;
                        border: none !important;
                        color: #6b7280 !important;
                        border-radius: 8px !important;
                        margin: 0 !important;
                        font-size: 0.85rem;
                    }
                    .fc-button-group > .fc-button:hover {
                        color: #111827 !important;
                        background-color: rgba(255,255,255,0.5) !important;
                    }
                    .fc-button-group > .fc-button.fc-button-active {
                        background-color: #fff !important;
                        color: #5D5FEF !important;
                        box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
                        font-weight: 600;
                    }

                    /* Hide Today button for cleaner look matching reference, or style it minimal */
                    .fc-today-button { display: none; } 

                    /* Calendar Grid & Header */
                    .fc-theme-standard td, .fc-theme-standard th { border-color: #f3f4f6; }
                    .fc-col-header-cell { padding: 16px 0; background: transparent; border-bottom: 2px solid #f3f4f6; }
                    .fc-col-header-cell-cushion { color: #9ca3af; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
                    .fc-timegrid-slot { height: 3.5rem !important; }
                    .fc-timegrid-slot-label-cushion { font-size: 0.75rem; color: #9ca3af; font-weight: 500; }
                    .fc-scrollgrid { border: none !important; }
                    .fc-scrollgrid-section-header > td { border: none !important; }
                    
                    /* Events */
                    .fc-event { 
                        border-radius: 6px; 
                        border: none; 
                        padding: 2px 4px; 
                        font-size: 0.85rem; 
                        font-weight: 500;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.05); 
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
                        events={events}
                        select={handleDateSelect}
                        eventClick={handleEventClick}
                        slotMinTime="06:00:00"
                        slotMaxTime="22:00:00"
                        allDaySlot={false}
                        height="100%"
                        expandRows={true}
                        stickyHeaderDates={true}
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
        </div>
    );
}
