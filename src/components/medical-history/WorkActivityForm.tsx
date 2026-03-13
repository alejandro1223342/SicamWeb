import { Briefcase, Clock, Activity, FileText } from 'lucide-react';

interface WorkActivityFormProps {
    data: {
        activity: string;
        description: string;
        schedule: string;
        stressLevel: string;
    };
    onChange: (data: any) => void;
    readOnly?: boolean;
}

export default function WorkActivityForm({ data, onChange, readOnly }: WorkActivityFormProps) {
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

    const textareaStyle = {
        ...inputStyle,
        minHeight: '80px',
        resize: 'vertical' as const,
        lineHeight: '1.5'
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

    const stressLevels = ['Bajo', 'Medio Bajo', 'Moderado', 'Alto', 'Extremo'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Briefcase size={24} color="#8b5cf6" /> Actividad Laboral y Nivel de Estrés
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                    <div style={{ gridColumn: 'span 1' }}>
                        <label style={labelStyle}><Briefcase size={16} /> Actividad laboral(*)</label>
                        <textarea 
                            value={data.activity} 
                            onChange={(e) => handleChange('activity', e.target.value)} 
                            disabled={readOnly} 
                            style={textareaStyle} 
                            placeholder="Ingrese su cargo o actividad laboral" 
                        />
                    </div>

                    <div style={{ gridColumn: 'span 1' }}>
                        <label style={labelStyle}><Activity size={16} color="#f59e0b" /> Nivel de estrés(*)</label>
                        <select 
                            value={data.stressLevel} 
                            onChange={(e) => handleChange('stressLevel', e.target.value)} 
                            disabled={readOnly} 
                            style={inputStyle}
                        >
                            <option value="">seleccione</option>
                            {stressLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ gridColumn: 'span 1' }}>
                        <label style={labelStyle}><FileText size={16} color="#3b82f6" /> Descripción de la actividad(*)</label>
                        <textarea 
                            value={data.description} 
                            onChange={(e) => handleChange('description', e.target.value)} 
                            disabled={readOnly} 
                            style={textareaStyle} 
                            placeholder="Describa brevemente sus tareas laborales" 
                        />
                    </div>

                    <div style={{ gridColumn: 'span 1' }}>
                        <label style={labelStyle}><Clock size={16} color="#10b981" /> Horario y horas trabajadas(*)</label>
                        <textarea 
                            value={data.schedule} 
                            onChange={(e) => handleChange('schedule', e.target.value)} 
                            disabled={readOnly} 
                            style={textareaStyle} 
                            placeholder="Ingrese su horario y total de horas al día" 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
