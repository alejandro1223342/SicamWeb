import { FileSignature } from 'lucide-react';

interface ConsultationReasonFormProps {
    data: string;
    onChange: (data: string) => void;
    readOnly?: boolean;
}

export default function ConsultationReasonForm({ data, onChange, readOnly = false }: ConsultationReasonFormProps) {
    return (
        <div className="section-container" style={{ animation: 'fadeIn 0.3s ease-in-out', backgroundColor: '#fcfcfd', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileSignature size={24} color="#3b82f6" /> Motivo de la consulta
            </h3>

            <div style={{ marginBottom: '16px' }}>
                <label style={{ fontWeight: '600', color: '#475569', marginBottom: '12px', display: 'block', fontSize: '14px' }}>
                    Indique la razón principal por la que el paciente acude a la consulta:
                </label>
                <textarea
                    className="form-input"
                    value={data || ''}
                    onChange={(e) => onChange(e.target.value)}
                    readOnly={readOnly}
                    rows={6}
                    placeholder={readOnly ? "Sin motivo registrado" : "Escriba aquí el motivo de la consulta..."}
                    style={{ 
                        width: '100%', 
                        padding: '16px 20px', 
                        border: '1.5px solid #e2e8f0', 
                        borderRadius: '12px', 
                        outline: 'none', 
                        resize: 'vertical', 
                        minHeight: '180px', 
                        transition: 'all 0.2s', 
                        fontSize: '16px', 
                        lineHeight: '1.6',
                        backgroundColor: readOnly ? '#f8fafc' : 'white',
                        color: '#1e293b'
                    }}
                    onFocus={(e) => { if (!readOnly) e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)'; }}
                    onBlur={(e) => { if (!readOnly) e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
            </div>
            
            {!readOnly && (
                <div style={{ marginTop: '16px', padding: '12px 16px', backgroundColor: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#3b82f6' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
                    Esta información es fundamental para orientar el diagnóstico y tratamiento.
                </div>
            )}
        </div>
    );
}
