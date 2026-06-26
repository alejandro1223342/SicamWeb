import { FileSignature } from 'lucide-react';

interface ConsultationReasonData {
    reason: string;
    currentIllness: string;
}

interface CabinConsultationReasonFormProps {
    data: string | ConsultationReasonData;
    onChange: (data: ConsultationReasonData) => void;
    readOnly?: boolean;
}

export default function CabinConsultationReasonForm({ data, onChange, readOnly = false }: CabinConsultationReasonFormProps) {
    // Normalize data: if it's a string (legacy), convert to object
    const normalizedData: ConsultationReasonData = typeof data === 'string' 
        ? { reason: data, currentIllness: '' }
        : { reason: data?.reason || '', currentIllness: data?.currentIllness || '' };

    const handleFieldChange = (field: keyof ConsultationReasonData, value: string) => {
        if (readOnly) return;
        onChange({ ...normalizedData, [field]: value });
    };

    return (
        <div className="section-container" style={{ animation: 'fadeIn 0.3s ease-in-out', backgroundColor: '#fcfcfd', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileSignature size={24} color="#3b82f6" /> Motivo de la consulta y Enfermedad Actual
            </h3>

            <div style={{ marginBottom: '24px' }}>
                <label style={{ fontWeight: '600', color: '#475569', marginBottom: '12px', display: 'block', fontSize: '14px' }}>
                    Motivo de la consulta:
                </label>
                <textarea
                    className="form-input"
                    value={normalizedData.reason}
                    onChange={(e) => handleFieldChange('reason', e.target.value)}
                    readOnly={readOnly}
                    rows={4}
                    placeholder={readOnly ? "Sin motivo registrado" : "Indique la razón principal por la que el paciente acude a la consulta..."}
                    style={{ 
                        width: '100%', 
                        padding: '16px 20px', 
                        border: '1.5px solid #e2e8f0', 
                        borderRadius: '12px', 
                        outline: 'none', 
                        resize: 'vertical', 
                        minHeight: '120px', 
                        transition: 'all 0.2s', 
                        fontSize: '16px', 
                        lineHeight: '1.6',
                        backgroundColor: readOnly ? '#f8fafc' : 'white',
                        color: '#1e293b'
                    }}
                />
            </div>

            <div style={{ marginBottom: '16px' }}>
                <label style={{ fontWeight: '600', color: '#475569', marginBottom: '12px', display: 'block', fontSize: '14px' }}>
                    Enfermedad Actual:
                </label>
                <textarea
                    className="form-input"
                    value={normalizedData.currentIllness}
                    onChange={(e) => handleFieldChange('currentIllness', e.target.value)}
                    readOnly={readOnly}
                    rows={6}
                    placeholder={readOnly ? "Sin enfermedad actual registrada" : "Describa la evolución de los síntomas..."}
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
