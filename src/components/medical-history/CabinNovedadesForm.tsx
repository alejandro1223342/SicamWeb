import { Stethoscope } from 'lucide-react';

interface CabinNovedadesData {
    novedades: string;
}

interface CabinNovedadesFormProps {
    data: CabinNovedadesData;
    onChange: (data: CabinNovedadesData) => void;
    readOnly?: boolean;
}

export default function CabinNovedadesForm({ data, onChange, readOnly = false }: CabinNovedadesFormProps) {
    const handleFieldChange = (field: keyof CabinNovedadesData, value: string) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="section-container" style={{ animation: 'fadeIn 0.3s ease-in-out', backgroundColor: '#fcfcfd', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Stethoscope size={24} color="#3b82f6" /> Novedades y Observaciones (Cabina)
            </h3>

            <div style={{ marginBottom: '24px' }}>
                <label style={{ fontWeight: '600', color: '#475569', marginBottom: '12px', display: 'block', fontSize: '14px' }}>
                    Notas de la Sesión:
                </label>
                <textarea
                    className="form-input"
                    value={data?.novedades || ''}
                    onChange={(e) => handleFieldChange('novedades', e.target.value)}
                    readOnly={readOnly}
                    rows={8}
                    placeholder={readOnly ? "Sin novedades registradas" : "Describa el procedimiento realizado, observaciones relevantes y evolución de la sesión..."}
                    style={{ 
                        width: '100%', 
                        padding: '16px 20px', 
                        border: '1.5px solid #e2e8f0', 
                        borderRadius: '12px', 
                        outline: 'none', 
                        resize: 'vertical', 
                        minHeight: '200px', 
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
                    Esta sección es fundamental para mantener el historial detallado de lo que se aplicó o evaluó en la cabina durante esta visita.
                </div>
            )}
        </div>
    );
}
