import { Apple, Scale, Ruler, Activity, Target } from 'lucide-react';

interface NutritionFindingsFormProps {
    data: {
        weight: string;
        height: string;
        bmi: string;
        bodyFat: string;
        muscleMass: string;
        waist: string;
        hip: string;
        observations: string;
        dietaryRecall: string;
        clinicalHistory: string;
    };
    onChange: (data: any) => void;
    readOnly?: boolean;
}

export default function NutritionFindingsForm({ data, onChange, readOnly }: NutritionFindingsFormProps) {
    const handleChange = (field: string, value: string) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        fontSize: '14px',
        marginTop: '6px',
        outline: 'none',
        backgroundColor: readOnly ? '#f8fafc' : 'white'
    };

    const labelStyle = {
        fontSize: '13px',
        fontWeight: '600',
        color: '#475569',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Scale size={24} color="#10b981" /> Antropometría y Composición Corporal
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div>
                        <label style={labelStyle}><Scale size={16} /> Peso (kg)</label>
                        <input type="text" value={data.weight} onChange={(e) => handleChange('weight', e.target.value)} disabled={readOnly} style={inputStyle} placeholder="Ej: 75.5" />
                    </div>
                    <div>
                        <label style={labelStyle}><Ruler size={16} /> Talla (cm)</label>
                        <input type="text" value={data.height} onChange={(e) => handleChange('height', e.target.value)} disabled={readOnly} style={inputStyle} placeholder="Ej: 175" />
                    </div>
                    <div>
                        <label style={labelStyle}><Activity size={16} /> IMC</label>
                        <input type="text" value={data.bmi} onChange={(e) => handleChange('bmi', e.target.value)} disabled={readOnly} style={inputStyle} placeholder="Auto o manual" />
                    </div>
                    <div>
                        <label style={labelStyle}><Target size={16} /> % Grasa Corporal</label>
                        <input type="text" value={data.bodyFat} onChange={(e) => handleChange('bodyFat', e.target.value)} disabled={readOnly} style={inputStyle} placeholder="Ej: 22.5" />
                    </div>
                    <div>
                        <label style={labelStyle}><Activity size={16} /> Masa Muscular (kg)</label>
                        <input type="text" value={data.muscleMass} onChange={(e) => handleChange('muscleMass', e.target.value)} disabled={readOnly} style={inputStyle} placeholder="Ej: 35" />
                    </div>
                    <div>
                        <label style={labelStyle}><Ruler size={16} /> Circunferencia Cintura (cm)</label>
                        <input type="text" value={data.waist} onChange={(e) => handleChange('waist', e.target.value)} disabled={readOnly} style={inputStyle} placeholder="Ej: 85" />
                    </div>
                </div>
            </div>

            <div style={{ height: '1px', backgroundColor: '#f1f5f9' }}></div>

            <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Apple size={24} color="#10b981" /> Evaluación Dietética y Clínica
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                        <label style={labelStyle}>Recordatorio de 24 horas / Hábitos alimentarios</label>
                        <textarea value={data.dietaryRecall} onChange={(e) => handleChange('dietaryRecall', e.target.value)} disabled={readOnly} style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder="Describa los hábitos alimentarios del paciente..." />
                    </div>
                    <div>
                        <label style={labelStyle}>Historia Clínica Nutricional (Antecedentes médicos relevantes)</label>
                        <textarea value={data.clinicalHistory} onChange={(e) => handleChange('clinicalHistory', e.target.value)} disabled={readOnly} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Cirugías, patologías, suplementación..." />
                    </div>
                    <div>
                        <label style={labelStyle}>Observaciones Generales</label>
                        <textarea value={data.observations} onChange={(e) => handleChange('observations', e.target.value)} disabled={readOnly} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Notas adicionales del profesional..." />
                    </div>
                </div>
            </div>
        </div>
    );
}
