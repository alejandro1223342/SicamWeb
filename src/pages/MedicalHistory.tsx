import React, { useState, useEffect } from 'react';
import api from '../api';
import { useSpecialty } from '../context/SpecialtyContext';
import { Loader2, Save, FileText, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';

interface TemplateField {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'number';
    options?: string[];
    required?: boolean;
}

interface SpecialtyTemplate {
    schema: {
        fields: TemplateField[];
    };
}

export default function MedicalHistory() {
    const { activeSpecialty } = useSpecialty();
    const [template, setTemplate] = useState<SpecialtyTemplate | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');
    const [notes, setNotes] = useState('');

    // For patient search (Mocking for now, will link to real patients later)
    // Using a placeholder UUID for development
    const [selectedPatientId] = useState('00000000-0000-0000-0000-000000000000');

    useEffect(() => {
        const fetchTemplate = async () => {
            if (!activeSpecialty) return;
            setLoading(true);
            try {
                const response = await api.get(`/medical-records/template/${activeSpecialty.id}`);
                setTemplate(response.data);

                // Initialize form data
                const initialData: any = {};
                if (response.data?.schema?.fields) {
                    response.data.schema.fields.forEach((f: TemplateField) => {
                        initialData[f.id] = '';
                    });
                }
                setFormData(initialData);
            } catch (error) {
                console.error('Error fetching template:', error);
                toast.error('No se pudo cargar la plantilla de la especialidad');
                setTemplate(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, [activeSpecialty]);

    const handleFieldChange = (id: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeSpecialty) return;

        setSaving(true);
        try {
            const userData = localStorage.getItem('user');
            const user = userData ? JSON.parse(userData) : {};

            await api.post('/medical-records', {
                patientId: selectedPatientId,
                doctorId: user.id || '00000000-0000-0000-0000-000000000000',
                specialtyId: activeSpecialty.id,
                data: formData,
                diagnosis,
                treatment,
                notes
            });
            toast.success('Historia clínica guardada correctamente');
        } catch (error) {
            console.error('Error saving record:', error);
            toast.error('Error al guardar la historia clínica');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px' }}>
                <Loader2 className="animate-spin text-primary" size={40} style={{ color: 'var(--primary)' }} />
            </div>
        );
    }

    if (!activeSpecialty) {
        return (
            <div className="chart-card" style={{ padding: '80px 20px', textAlign: 'center' }}>
                <FileText size={48} className="mx-auto" style={{ margin: '0 auto 16px', color: 'var(--border)' }} />
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Selecciona una especialidad</h3>
                <p style={{ color: 'var(--text-gray)' }}>Por favor, selecciona una especialidad en la barra lateral para comenzar.</p>
            </div>
        );
    }

    return (
        <div className="management-container" style={{ padding: '24px' }}>
            <div className="management-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 className="management-title" style={{ fontSize: '24px', fontWeight: '700', margin: '0' }}>
                        Historia Clínica - {activeSpecialty.name}
                    </h2>
                    <p className="management-subtitle" style={{ color: 'var(--text-gray)', marginTop: '4px' }}>
                        Registro de evolución clínica especializada
                    </p>
                </div>
                <div className="management-actions">
                    <button
                        className="submit-btn"
                        onClick={handleSubmit}
                        disabled={saving}
                        style={{ width: 'auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px', height: '44px' }}
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {saving ? 'Guardando...' : 'Guardar Historia'}
                    </button>
                </div>
            </div>

            <div className="chart-card" style={{ padding: '32px', background: 'white', border: '1px solid var(--border)', borderRadius: '12px' }}>
                <form className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* General Section */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: '500', marginBottom: '8px', display: 'block' }}>Diagnóstico Principal</label>
                            <input
                                type="text"
                                className="form-input"
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                placeholder="Ej: Alopecia androgenética"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: '500', marginBottom: '8px', display: 'block' }}>Tratamiento Sugerido</label>
                            <input
                                type="text"
                                className="form-input"
                                value={treatment}
                                onChange={(e) => setTreatment(e.target.value)}
                                placeholder="Ej: Minoxidil al 5%"
                            />
                        </div>
                    </div>

                    {/* Dynamic Specialty Section */}
                    <div style={{ borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '32px 0' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Stethoscope size={20} style={{ color: 'var(--primary)' }} />
                            Exploración Especializada ({activeSpecialty.name})
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                            {template?.schema.fields.map(field => (
                                <div key={field.id} className="form-group">
                                    <label className="form-label" style={{ fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                                        {field.label}
                                        {field.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                                    </label>

                                    {field.type === 'textarea' ? (
                                        <textarea
                                            className="form-input"
                                            rows={3}
                                            value={formData[field.id] || ''}
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                            style={{ minHeight: '100px', resize: 'vertical' }}
                                        />
                                    ) : field.type === 'select' ? (
                                        <select
                                            className="form-input"
                                            value={formData[field.id] || ''}
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                            style={{ height: '44px' }}
                                        >
                                            <option value="">Seleccionar...</option>
                                            {field.options?.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type}
                                            className="form-input"
                                            value={formData[field.id] || ''}
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                            style={{ height: '44px' }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '500', marginBottom: '8px', display: 'block' }}>Observaciones Adicionales</label>
                        <textarea
                            className="form-input"
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Notas clínicas adicionales..."
                            style={{ minHeight: '120px', resize: 'vertical' }}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
