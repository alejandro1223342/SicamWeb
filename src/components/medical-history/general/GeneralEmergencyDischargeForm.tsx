
interface DischargeData {
    // Legacy fields
    date: string;
    time: string;
    
    // Modernized fields from reference
    destination: string; // DOMICILIO, CONSULTA, OBSERVACIÓN, INTERNACIÓN, REFERENCIA
    service: string;
    establishment: string;
    condition: string;   // VIVO, ESTABLE, INESTABLE
    incapacityDays: string;
    deathInEmergency: boolean | null;
    cause: string;
    
    // Additional notes (preserved)
    clinicalSummary: string;
}

interface GeneralEmergencyDischargeFormProps {
    data: DischargeData | undefined;
    onChange: (data: DischargeData) => void;
    readOnly?: boolean;
}

export default function GeneralEmergencyDischargeForm({ data, onChange, readOnly = false }: GeneralEmergencyDischargeFormProps) {
    const isObject = (val: any) => val !== null && typeof val === 'object' && !Array.isArray(val);
    
    const safeData: DischargeData = {
        date: '',
        time: '',
        destination: '',
        service: '',
        establishment: '',
        condition: '',
        incapacityDays: '',
        deathInEmergency: null,
        cause: '',
        clinicalSummary: '',
        ...(isObject(data) ? data : {})
    };

    const handleChange = (field: keyof DischargeData, value: any) => {
        if (readOnly) return;
        onChange({ ...safeData, [field]: value });
    };

    const handleNumericUpdate = (field: keyof DischargeData, value: string) => {
        const cleanValue = value.replace(/[^0-9]/g, '');
        handleChange(field, cleanValue);
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '12px',
        border: '1.5px solid #e2e8f0',
        fontSize: '15px',
        outline: 'none',
        transition: 'all 0.2s',
        backgroundColor: readOnly ? '#f8fafc' : 'white',
        color: '#334155'
    };

    const labelStyle = {
        fontSize: '12px',
        fontWeight: '800',
        color: '#64748b',
        marginBottom: '8px',
        display: 'block',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em'
    };

    const RadioGroup = ({ 
        label, 
        options, 
        currentValue, 
        onSelect, 
        color = '#3b82f6' 
    }: { 
        label: string, 
        options: { value: any, label: string }[], 
        currentValue: any, 
        onSelect: (val: any) => void,
        color?: string
    }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={labelStyle}>{label}</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {options.map((opt) => (
                    <button
                        key={opt.value.toString()}
                        onClick={() => {
                            if (readOnly) return;
                            // Allow deselecting if clicking the already selected value
                            if (currentValue === opt.value) {
                                onSelect(typeof opt.value === 'boolean' ? null : '');
                            } else {
                                onSelect(opt.value);
                            }
                        }}
                        style={{
                            padding: '10px 18px',
                            borderRadius: '12px',
                            border: `1.5px solid ${currentValue === opt.value ? color : '#e2e8f0'}`,
                            backgroundColor: currentValue === opt.value ? `${color}10` : 'white',
                            color: currentValue === opt.value ? color : '#64748b',
                            fontSize: '13px',
                            fontWeight: '700',
                            cursor: readOnly ? 'default' : 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <div style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            border: `2px solid ${currentValue === opt.value ? color : '#cbd5e1'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {currentValue === opt.value && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color }} />}
                        </div>
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Date and Time Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                <div>
                    <label style={labelStyle}>Fecha de Alta / Salida</label>
                    <input
                        type="date"
                        style={inputStyle}
                        value={safeData.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Hora de Alta / Salida</label>
                    <input
                        type="time"
                        style={inputStyle}
                        value={safeData.time}
                        onChange={(e) => handleChange('time', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
            </div>

            {/* Destination Section */}
            <RadioGroup
                label="Seleccione Destino(*)"
                currentValue={safeData.destination}
                onSelect={(val) => handleChange('destination', val)}
                options={[
                    { value: 'DOMICILIO', label: 'DOMICILIO' },
                    { value: 'CONSULTA', label: 'CONSULTA' },
                    { value: 'OBSERVACION', label: 'OBSERVACIÓN' },
                    { value: 'INTERNACION', label: 'INTERNACIÓN' },
                    { value: 'REFERENCIA', label: 'REFERENCIA' }
                ]}
            />

            {/* Service and Establishment Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                <div>
                    <label style={labelStyle}>Servicio(*)</label>
                    <input
                        style={inputStyle}
                        value={safeData.service}
                        onChange={(e) => handleChange('service', e.target.value)}
                        placeholder="Ej. Medicina Interna"
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Establecimiento(*)</label>
                    <input
                        style={inputStyle}
                        value={safeData.establishment}
                        onChange={(e) => handleChange('establishment', e.target.value)}
                        placeholder="Ej. Hospital Central"
                        disabled={readOnly}
                    />
                </div>
            </div>

            {/* Clinical State Section */}
            <RadioGroup
                label="Estado Clínico al Salida(*)"
                currentValue={safeData.condition}
                onSelect={(val) => handleChange('condition', val)}
                color="#6366f1"
                options={[
                    { value: 'VIVO', label: 'VIVO' },
                    { value: 'ESTABLE', label: 'ESTABLE' },
                    { value: 'INESTABLE', label: 'INESTABLE' }
                ]}
            />

            {/* Incapacity Days Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'end' }}>
                <div>
                    <label style={labelStyle}>Días de Incapacidad(*)</label>
                    <input
                        style={inputStyle}
                        value={safeData.incapacityDays}
                        onChange={(e) => handleNumericUpdate('incapacityDays', e.target.value)}
                        placeholder="Ej. 3"
                        disabled={readOnly}
                    />
                </div>
                <RadioGroup
                    label="Muerto en Emergencia(*)"
                    currentValue={safeData.deathInEmergency}
                    onSelect={(val) => handleChange('deathInEmergency', val)}
                    color="#ef4444"
                    options={[
                        { value: true, label: 'SÍ' },
                        { value: false, label: 'NO' }
                    ]}
                />
            </div>

            {/* Cause / Clinical Summary Section */}
            <div>
                <label style={labelStyle}>Causa / Resumen Clínico adicional</label>
                <textarea
                    style={{ ...inputStyle, minHeight: '150px', resize: 'vertical' }}
                    value={safeData.clinicalSummary}
                    onChange={(e) => handleChange('clinicalSummary', e.target.value)}
                    placeholder="Describa la causa de muerte o detalles adicionales de la condición al alta..."
                    disabled={readOnly}
                />
            </div>
        </div>
    );
}
