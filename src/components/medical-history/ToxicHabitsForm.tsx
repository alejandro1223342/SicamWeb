import { Cigarette, Wine, AlertCircle, Trash2 } from 'lucide-react';

interface ToxicHabitsFormProps {
    data: {
        smokingFrequency: string;
        smokingAmount: string;
        alcoholFrequency: string;
        alcoholAmount: string;
        drugsFrequency: string;
        drugsAmount: string;
        drugsType: string;
    };
    frequencies: string[];
    onChange: (data: any) => void;
    readOnly?: boolean;
}

export default function ToxicHabitsForm({ data, frequencies, onChange, readOnly }: ToxicHabitsFormProps) {
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <AlertCircle size={24} color="#ef4444" /> Hábitos Tóxicos
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    
                    {/* Smoking */}
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ backgroundColor: '#fee2e2', padding: '8px', borderRadius: '8px' }}>
                                <Cigarette size={20} color="#ef4444" />
                            </div>
                            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#334155' }}>CONSUMO DE CIGARRO</h4>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>Frecuencia(*)</label>
                                <select 
                                    value={data.smokingFrequency} 
                                    onChange={(e) => handleChange('smokingFrequency', e.target.value)} 
                                    disabled={readOnly} 
                                    style={inputStyle}
                                >
                                    <option value="">seleccione</option>
                                    {frequencies.map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Cantidad(*)</label>
                                <input 
                                    type="text" 
                                    value={data.smokingAmount} 
                                    onChange={(e) => handleChange('smokingAmount', e.target.value)} 
                                    disabled={readOnly} 
                                    style={inputStyle} 
                                    placeholder="Ingrese la cantidad" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Alcohol */}
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ backgroundColor: '#e0e7ff', padding: '8px', borderRadius: '8px' }}>
                                <Wine size={20} color="#4f46e5" />
                            </div>
                            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#334155' }}>CONSUMO DE ALCOHOL</h4>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>Frecuencia(*)</label>
                                <select 
                                    value={data.alcoholFrequency} 
                                    onChange={(e) => handleChange('alcoholFrequency', e.target.value)} 
                                    disabled={readOnly} 
                                    style={inputStyle}
                                >
                                    <option value="">seleccione</option>
                                    {frequencies.map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Cantidad(*)</label>
                                <input 
                                    type="text" 
                                    value={data.alcoholAmount} 
                                    onChange={(e) => handleChange('alcoholAmount', e.target.value)} 
                                    disabled={readOnly} 
                                    style={inputStyle} 
                                    placeholder="Ingrese la cantidad" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Drugs */}
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ backgroundColor: '#fef3c7', padding: '8px', borderRadius: '8px' }}>
                                <Trash2 size={20} color="#d97706" />
                            </div>
                            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#334155' }}>CONSUMO DE DROGAS</h4>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>Frecuencia(*)</label>
                                <select 
                                    value={data.drugsFrequency} 
                                    onChange={(e) => handleChange('drugsFrequency', e.target.value)} 
                                    disabled={readOnly} 
                                    style={inputStyle}
                                >
                                    <option value="">seleccione</option>
                                    {frequencies.map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Cantidad(*)</label>
                                <input 
                                    type="text" 
                                    value={data.drugsAmount} 
                                    onChange={(e) => handleChange('drugsAmount', e.target.value)} 
                                    disabled={readOnly} 
                                    style={inputStyle} 
                                    placeholder="Ingrese la cantidad" 
                                />
                            </div>
                            <div style={{ gridColumn: 'span 1' }}>
                                <label style={labelStyle}>Tipo(*)</label>
                                <input 
                                    type="text" 
                                    value={data.drugsType} 
                                    onChange={(e) => handleChange('drugsType', e.target.value)} 
                                    disabled={readOnly} 
                                    style={inputStyle} 
                                    placeholder="Ingrese el tipo de droga" 
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
