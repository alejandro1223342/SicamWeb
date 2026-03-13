import { Ruler, Scale, Baby, Activity } from 'lucide-react';

interface BasicMeasurementsFormProps {
    data: {
        height: string;
        weight: string;
        isPregnant: string;
    };
    onChange: (data: any) => void;
    readOnly?: boolean;
}

export default function BasicMeasurementsForm({ data, onChange, readOnly }: BasicMeasurementsFormProps) {
    const handleChange = (field: string, value: any) => {
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
        color: '#334155'
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Activity size={24} color="#e11d48" /> Mediciones Básicas
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    
                    {/* Height */}
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ backgroundColor: '#f0f9ff', padding: '8px', borderRadius: '8px' }}>
                                <Ruler size={20} color="#0ea5e9" />
                            </div>
                            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#334155' }}>ESTATURA</h4>
                        </div>
                        <label style={labelStyle}>Estatura (*)</label>
                        <input 
                            type="text"
                            value={data.height} 
                            onChange={(e) => handleChange('height', e.target.value)} 
                            disabled={readOnly} 
                            style={inputStyle} 
                            placeholder="Ingrese la estatura (ej: 1.75)" 
                        />
                    </div>

                    {/* Weight */}
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ backgroundColor: '#fdf4ff', padding: '8px', borderRadius: '8px' }}>
                                <Scale size={20} color="#d946ef" />
                            </div>
                            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#334155' }}>PESO KG</h4>
                        </div>
                        <label style={labelStyle}>Peso Kg (*)</label>
                        <input 
                            type="text"
                            value={data.weight} 
                            onChange={(e) => handleChange('weight', e.target.value)} 
                            disabled={readOnly} 
                            style={inputStyle} 
                            placeholder="Ingrese el peso (ej: 70)" 
                        />
                    </div>

                    {/* Pregnancy */}
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ backgroundColor: '#fff1f2', padding: '8px', borderRadius: '8px' }}>
                                <Baby size={20} color="#e11d48" />
                            </div>
                            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#334155' }}>EMBARAZO</h4>
                        </div>
                        <label style={labelStyle}>¿Está en periodo de embarazo? (*)</label>
                        <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#475569' }}>
                                <input 
                                    type="radio" 
                                    name="isPregnant" 
                                    value="si" 
                                    checked={data.isPregnant === 'si'} 
                                    onChange={() => handleChange('isPregnant', 'si')} 
                                    disabled={readOnly}
                                    style={{ width: '18px', height: '18px', accentColor: '#e11d48' }}
                                /> Si
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#475569' }}>
                                <input 
                                    type="radio" 
                                    name="isPregnant" 
                                    value="no" 
                                    checked={data.isPregnant === 'no'} 
                                    onChange={() => handleChange('isPregnant', 'no')} 
                                    disabled={readOnly}
                                    style={{ width: '18px', height: '18px', accentColor: '#e11d48' }}
                                /> No
                            </label>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
