import { Stethoscope, FileText } from 'lucide-react';

interface TreatmentFormProps {
    data: {
        treatment: string;
        observations: string;
    };
    onChange: (data: any) => void;
    readOnly?: boolean;
}

export default function TreatmentForm({ data, onChange, readOnly = false }: TreatmentFormProps) {
    const handleChange = (field: string, value: string) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="section-container" style={{ animation: 'fadeIn 0.3s ease-in-out', backgroundColor: '#fcfcfd', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Stethoscope size={24} color="#3b82f6" /> Procedimiento / Tratamiento y Observaciones
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                <div className="form-group">
                    <label style={{ fontWeight: '600', color: '#475569', marginBottom: '12px', display: 'block', fontSize: '14px' }}>
                        Procedimiento / Tratamiento realizado:
                    </label>
                    <textarea
                        className="form-input"
                        value={data?.treatment || ''}
                        onChange={(e) => handleChange('treatment', e.target.value)}
                        readOnly={readOnly}
                        rows={5}
                        placeholder={readOnly ? "Sin registro de tratamiento" : "Describa el procedimiento realizado en esta sesión..."}
                        style={{ 
                            width: '100%', 
                            padding: '14px 18px', 
                            border: '1.5px solid #e2e8f0', 
                            borderRadius: '12px', 
                            outline: 'none', 
                            resize: 'vertical', 
                            minHeight: '140px', 
                            transition: 'all 0.2s', 
                            fontSize: '15px', 
                            lineHeight: '1.6',
                            backgroundColor: readOnly ? '#f8fafc' : 'white',
                            color: '#1e293b'
                        }}
                        onFocus={(e) => { if (!readOnly) e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)'; }}
                        onBlur={(e) => { if (!readOnly) e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                    />
                </div>

                <div className="form-group">
                    <label style={{ fontWeight: '600', color: '#475569', marginBottom: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} /> Observaciones adicionales:
                    </label>
                    <textarea
                        className="form-input"
                        value={data?.observations || ''}
                        onChange={(e) => handleChange('observations', e.target.value)}
                        readOnly={readOnly}
                        rows={4}
                        placeholder={readOnly ? "Sin observaciones" : "Ingrese observaciones generales de la sesión..."}
                        style={{ 
                            width: '100%', 
                            padding: '14px 18px', 
                            border: '1.5px solid #e2e8f0', 
                            borderRadius: '12px', 
                            outline: 'none', 
                            resize: 'vertical', 
                            minHeight: '120px', 
                            transition: 'all 0.2s', 
                            fontSize: '15px', 
                            lineHeight: '1.6',
                            backgroundColor: readOnly ? '#f8fafc' : 'white',
                            color: '#1e293b'
                        }}
                        onFocus={(e) => { if (!readOnly) e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1)'; }}
                        onBlur={(e) => { if (!readOnly) e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                    />
                </div>
            </div>
            
            {!readOnly && (
                <div style={{ marginTop: '24px', padding: '12px 16px', backgroundColor: '#f0fdf4', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#166534' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
                    Ambos campos son persistentes en el registro de hoy.
                </div>
            )}
        </div>
    );
}
