import React from 'react';
import { FileText, Droplets, Activity, AlertCircle, ShieldAlert } from 'lucide-react';

interface MainDataFormProps {
    data: {
        reason: string;
        bloodType: string;
        surgeries: string;
        allergies: string;
        diagnosis: string;
        treatment: string;
        familyHistory: string;
    };
    onChange: (data: any) => void;
    readOnly?: boolean;
}

export default function MainDataForm({ data, onChange, readOnly }: MainDataFormProps) {
    const handleChange = (field: string, value: string) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        fontSize: '14px',
        marginTop: '8px',
        outline: 'none',
        backgroundColor: readOnly ? '#f8fafc' : 'white',
        transition: 'border-color 0.2s',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
    };

    const labelStyle = {
        fontSize: '13px',
        fontWeight: '700',
        color: '#475569',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.025em'
    };

    const textareaStyle = {
        ...inputStyle,
        minHeight: '80px',
        resize: 'vertical' as const,
        lineHeight: '1.5'
    };

    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText size={24} color="#3b82f6" /> Datos Principales de la Consulta
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                    <div style={{ gridColumn: 'span 1' }}>
                        <label style={labelStyle}><FileText size={16} /> Motivo de consulta(*)</label>
                        <textarea 
                            value={data.reason} 
                            onChange={(e) => handleChange('reason', e.target.value)} 
                            disabled={readOnly} 
                            style={textareaStyle} 
                            placeholder="Ingrese el motivo de consulta" 
                        />
                    </div>

                    <div style={{ gridColumn: 'span 1' }}>
                        <label style={labelStyle}><Droplets size={16} color="#ef4444" /> Tipo de sangre(*)</label>
                        <select 
                            value={data.bloodType} 
                            onChange={(e) => handleChange('bloodType', e.target.value)} 
                            disabled={readOnly} 
                            style={inputStyle}
                        >
                            <option value="">seleccione</option>
                            {bloodTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ gridColumn: 'span 1' }}>
                        <label style={labelStyle}><Activity size={16} color="#10b981" /> Cirugías realizadas(*)</label>
                        <textarea 
                            value={data.surgeries} 
                            onChange={(e) => handleChange('surgeries', e.target.value)} 
                            disabled={readOnly} 
                            style={textareaStyle} 
                            placeholder="Ingrese cirugías realizadas" 
                        />
                    </div>

                    <div style={{ gridColumn: 'span 1' }}>
                        <label style={labelStyle}><AlertCircle size={16} color="#f59e0b" /> Alergías(*)</label>
                        <textarea 
                            value={data.allergies} 
                            onChange={(e) => handleChange('allergies', e.target.value)} 
                            disabled={readOnly} 
                            style={textareaStyle} 
                            placeholder="Ingrese las alergias" 
                        />
                    </div>
                </div>
            </div>

            <div style={{ height: '1px', backgroundColor: '#f1f5f9' }}></div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                <div>
                    <label style={labelStyle}><ShieldAlert size={16} /> Diagnostico previo(*)</label>
                    <textarea 
                        value={data.diagnosis} 
                        onChange={(e) => handleChange('diagnosis', e.target.value)} 
                        disabled={readOnly} 
                        style={textareaStyle} 
                        placeholder="Ingrese el diagnostico previo" 
                    />
                </div>
                <div>
                    <label style={labelStyle}><Activity size={16} /> Terapéutica previa(*)</label>
                    <textarea 
                        value={data.treatment} 
                        onChange={(e) => handleChange('treatment', e.target.value)} 
                        disabled={readOnly} 
                        style={textareaStyle} 
                        placeholder="Ingrese terapéutica previa" 
                    />
                </div>
            </div>

            <div>
                <label style={labelStyle}><ShieldAlert size={16} /> Antecedentes heredo-familiares(*)</label>
                <textarea 
                    value={data.familyHistory} 
                    onChange={(e) => handleChange('familyHistory', e.target.value)} 
                    disabled={readOnly} 
                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} 
                    placeholder="Ingrese los antecedentes familiares..." 
                />
            </div>
        </div>
    );
}
