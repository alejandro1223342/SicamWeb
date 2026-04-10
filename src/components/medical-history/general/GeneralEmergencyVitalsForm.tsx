
interface Glasgow {
    ocular: string;
    verbal: string;
    motor: string;
    total: string;
}

interface VitalsData {
    bloodPressure: string;
    heartRate: string;
    respiratoryRate: string;
    oralTemp: string;
    axillaryTemp: string;
    weight: string;
    height: string;
    bmi: string;
    headCircumference: string;
    glasgow: Glasgow;
    pupillaryReactionRight: string;
    pupillaryReactionLeft: string;
    capillaryRefill: string;
}

interface GeneralEmergencyVitalsFormProps {
    data: VitalsData;
    onChange: (data: VitalsData) => void;
    readOnly?: boolean;
    title?: string;
}

export default function GeneralEmergencyVitalsForm({ data, onChange, readOnly = false, title }: GeneralEmergencyVitalsFormProps) {
    const isObject = (val: any) => val !== null && typeof val === 'object' && !Array.isArray(val);
    const safeData: VitalsData = {
        bloodPressure: '',
        heartRate: '',
        respiratoryRate: '',
        oralTemp: '',
        axillaryTemp: '',
        weight: '',
        height: '',
        bmi: '',
        headCircumference: '',
        glasgow: { ocular: '', verbal: '', motor: '', total: '' },
        pupillaryReactionRight: '',
        pupillaryReactionLeft: '',
        capillaryRefill: '',
        ...(isObject(data) ? data : {})
    };

    const handleChange = (field: string, value: any) => {
        if (readOnly) return;
        onChange({ ...safeData, [field]: value });
    };

    const handleGlasgowChange = (field: keyof Glasgow, value: string) => {
        if (readOnly) return;
        const newGlasgow = { ...safeData.glasgow, [field]: value };
        
        // Auto-calculate total if numeric
        if (field !== 'total') {
            const o = parseInt(newGlasgow.ocular) || 0;
            const v = parseInt(newGlasgow.verbal) || 0;
            const m = parseInt(newGlasgow.motor) || 0;
            const total = o + v + m;
            if (total > 0) newGlasgow.total = total.toString();
        }
        
        onChange({ ...safeData, glasgow: newGlasgow });
    };

    const handleNumericUpdate = (field: string, value: string) => {
        if (readOnly) return;
        const cleanValue = value.replace(/[^0-9.]/g, '');
        const parts = cleanValue.split('.');
        const finalValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
        handleChange(field, finalValue);
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 14px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: readOnly ? '#f8fafc' : 'white',
        color: '#334155',
        transition: 'all 0.2s'
    };

    const labelStyle = {
        fontSize: '12px',
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase' as const,
        marginBottom: '6px',
        display: 'block'
    };

    const sectionTitleStyle = {
        fontSize: '15px',
        fontWeight: '700',
        color: '#1e293b',
        margin: '24px 0 16px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    };

    const mainFields = [
        { id: 'bloodPressure', label: 'Presión arterial', placeholder: 'Ej: 120/80', numeric: false },
        { id: 'heartRate', label: 'Frecuencia cardiaca', placeholder: 'Ej: 75', numeric: true },
        { id: 'respiratoryRate', label: 'Frecuencia respiratoria. min', placeholder: 'Ej: 18', numeric: true },
        { id: 'oralTemp', label: 'Temperatura bucal °C', placeholder: 'Ej: 36.5', numeric: true },
        { id: 'axillaryTemp', label: 'Temperatura axilar °C', placeholder: 'Ej: 36.2', numeric: true },
        { id: 'weight', label: 'Peso Kg', placeholder: 'Ej: 70', numeric: true },
        { id: 'height', label: 'Talla m', placeholder: 'Ej: 1.75', numeric: true },
        { id: 'headCircumference', label: 'Perimet. cefalic cm', placeholder: 'Ej: 54', numeric: true },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {title && (
                <h3 style={{ ...sectionTitleStyle, marginTop: 0 }}>{title}</h3>
            )}
            
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '20px', 
                padding: '24px', 
                backgroundColor: '#fff', 
                border: '1px solid #f1f5f9', 
                borderRadius: '12px' 
            }}>
                {mainFields.map(field => (
                    <div key={field.id}>
                        <label style={labelStyle}>{field.label}</label>
                        <input
                            type="text"
                            style={inputStyle}
                            value={(safeData as any)[field.id] || ''}
                            onChange={(e) => field.numeric ? handleNumericUpdate(field.id, e.target.value) : handleChange(field.id, e.target.value)}
                            disabled={readOnly}
                            placeholder={field.placeholder}
                        />
                    </div>
                ))}
            </div>

            <h3 style={sectionTitleStyle}>Glasgow inicial</h3>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: '20px', 
                padding: '24px', 
                backgroundColor: '#fff', 
                border: '1px solid #f1f5f9', 
                borderRadius: '12px' 
            }}>
                <div>
                    <label style={labelStyle}>Ocular</label>
                    <input
                        type="text"
                        style={inputStyle}
                        value={safeData.glasgow.ocular}
                        onChange={(e) => handleGlasgowChange('ocular', e.target.value)}
                        placeholder="1-4"
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Verbal</label>
                    <input
                        type="text"
                        style={inputStyle}
                        value={safeData.glasgow.verbal}
                        onChange={(e) => handleGlasgowChange('verbal', e.target.value)}
                        placeholder="1-5"
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Motora</label>
                    <input
                        type="text"
                        style={inputStyle}
                        value={safeData.glasgow.motor}
                        onChange={(e) => handleGlasgowChange('motor', e.target.value)}
                        placeholder="1-6"
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Total</label>
                    <input
                        type="text"
                        style={{ ...inputStyle, fontWeight: '700', backgroundColor: '#f8fafc' }}
                        value={safeData.glasgow.total}
                        onChange={(e) => handleGlasgowChange('total', e.target.value)}
                        placeholder="3-15"
                        disabled={readOnly}
                    />
                </div>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '20px', 
                marginTop: '24px',
                padding: '24px', 
                backgroundColor: '#fff', 
                border: '1px solid #f1f5f9', 
                borderRadius: '12px' 
            }}>
                <div>
                    <label style={labelStyle}>Reacción pupilar der</label>
                    <input
                        type="text"
                        style={inputStyle}
                        value={safeData.pupillaryReactionRight}
                        onChange={(e) => handleChange('pupillaryReactionRight', e.target.value)}
                        placeholder="Ej: Reactiva"
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Reacción pupilar izq</label>
                    <input
                        type="text"
                        style={inputStyle}
                        value={safeData.pupillaryReactionLeft}
                        onChange={(e) => handleChange('pupillaryReactionLeft', e.target.value)}
                        placeholder="Ej: Isocórica"
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>T. llenado capilar</label>
                    <input
                        type="text"
                        style={inputStyle}
                        value={safeData.capillaryRefill}
                        onChange={(e) => handleChange('capillaryRefill', e.target.value)}
                        placeholder="Ej: < 2 seg"
                        disabled={readOnly}
                    />
                </div>
            </div>
        </div>
    );
}
