import React, { useState } from 'react';
import { User, Trash2, Plus, LogIn } from 'lucide-react';

interface AttendingDoctor {
    name: string;
    specialty: string;
    code: string;
    date: string;
}

interface GeneralEpicrisisDoctorsFormProps {
    data: AttendingDoctor[];
    onChange: (data: AttendingDoctor[]) => void;
    readOnly?: boolean;
}

export default function GeneralEpicrisisDoctorsForm({ data = [], onChange, readOnly = false }: GeneralEpicrisisDoctorsFormProps) {
    const [newName, setNewName] = useState('');
    const [newSpecialty, setNewSpecialty] = useState('');
    const [newCode, setNewCode] = useState('');
    const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

    const handleAddMe = () => {
        if (readOnly) return;
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            const doctorName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
            const doctorCode = user.code || 'N/A';
            const doctorSpecialty = user.specialty || 'Medicina General';
            
            // Check if already added
            if (data.some(d => d.code === doctorCode && d.name === doctorName)) return;

            const newDoctor: AttendingDoctor = {
                name: doctorName || 'Mi usuario',
                specialty: doctorSpecialty,
                code: doctorCode,
                date: new Date().toISOString().split('T')[0]
            };
            onChange([...data, newDoctor]);
        }
    };

    const handleAddNew = () => {
        if (readOnly || !newName.trim()) return;
        const newDoctor: AttendingDoctor = {
            name: newName.trim(),
            specialty: newSpecialty.trim() || 'General',
            code: newCode.trim() || 'N/A',
            date: newDate || new Date().toISOString().split('T')[0]
        };
        onChange([...data, newDoctor]);
        setNewName('');
        setNewSpecialty('');
        setNewCode('');
    };

    const removeDoctor = (index: number) => {
        if (readOnly) return;
        const updated = [...data];
        updated.splice(index, 1);
        onChange(updated);
    };

    const cardStyle: React.CSSProperties = {
        padding: '16px',
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        transition: 'all 0.2s'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header & Quick Action */}
            {!readOnly && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Primary Quick Action */}
                    <div>
                        <button
                            onClick={handleAddMe}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 16px',
                                backgroundColor: '#eff6ff',
                                color: '#3b82f6',
                                border: '1px solid #dbeafe',
                                borderRadius: '10px',
                                fontWeight: '600',
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dbeafe')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#eff6ff')}
                        >
                            <LogIn size={18} />
                            Agregarme como médico tratante
                        </button>
                    </div>
                    
                    {/* Manual Registration */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr)) auto', 
                        gap: '12px',
                        alignItems: 'end',
                        backgroundColor: '#f8fafc',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Nombre completo</label>
                            <input
                                type="text"
                                placeholder="Dr. Juan Perez"
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', minWidth: '0' }}
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Especialidad</label>
                            <input
                                type="text"
                                placeholder="Especialidad"
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', minWidth: '0' }}
                                value={newSpecialty}
                                onChange={(e) => setNewSpecialty(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Código</label>
                            <input
                                type="text"
                                placeholder="Código"
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', minWidth: '0' }}
                                value={newCode}
                                onChange={(e) => setNewCode(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Fecha</label>
                            <input
                                type="date"
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', minWidth: '0' }}
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <button
                                onClick={handleAddNew}
                                disabled={!newName.trim()}
                                style={{
                                    width: '42px',
                                    height: '42px',
                                    backgroundColor: newName.trim() ? '#3b82f6' : '#cbd5e1',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: newName.trim() ? 'pointer' : 'default',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    boxShadow: newName.trim() ? '0 4px 6px -1px rgba(59, 130, 246, 0.2)' : 'none'
                                }}
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* List Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                    Lista de Médicos Tratantes ({data.length})
                </span>
                
                {data.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                        <User size={32} style={{ color: '#94a3b8', marginBottom: '8px' }} />
                        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>No hay médicos registrados aún.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
                        {data.map((doctor, index) => (
                            <div key={index} style={cardStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                    <div style={{ width: '40px', height: '40px', backgroundColor: '#f1f5f9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
                                        <User size={20} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {doctor.name}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '2px' }}>
                                            <span style={{ fontSize: '11px', backgroundColor: '#eff6ff', color: '#3b82f6', padding: '2px 8px', borderRadius: '20px', fontWeight: '600' }}>
                                                {doctor.specialty}
                                            </span>
                                            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>
                                                Cod: {doctor.code}
                                            </span>
                                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                                                • {doctor.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {!readOnly && (
                                    <button
                                        onClick={() => removeDoctor(index)}
                                        style={{ padding: '8px', color: '#ef4444', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '6px', flexShrink: 0 }}
                                        title="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
