
interface DischargeData {
    finalDischarge: boolean | null;
    transitoryDischarge: boolean | null;
    asymptomatic: boolean | null;
    mildDisability: boolean | null;
    moderateDisability: boolean | null;
    severeDisability: boolean | null;
    voluntaryRetirement: boolean | null;
    involuntaryRetirement: boolean | null;
    deathBefore48h: boolean | null;
    deathAfter48h: boolean | null;
    stayDays: string;
    disabilityDays: string;
}

interface GeneralEpicrisisDischargeFormProps {
    data: DischargeData;
    onChange: (data: DischargeData) => void;
    readOnly?: boolean;
}

export default function GeneralEpicrisisDischargeForm({ data, onChange, readOnly = false }: GeneralEpicrisisDischargeFormProps) {
    const isObject = (val: any) => val !== null && typeof val === 'object' && !Array.isArray(val);
    const normalizedData = isObject(data) ? data : {};

    const safeData: DischargeData = {
        finalDischarge: null,
        transitoryDischarge: null,
        asymptomatic: null,
        mildDisability: null,
        moderateDisability: null,
        severeDisability: null,
        voluntaryRetirement: null,
        involuntaryRetirement: null,
        deathBefore48h: null,
        deathAfter48h: null,
        stayDays: '',
        disabilityDays: '',
        ...normalizedData
    };

    const handleToggle = (field: keyof DischargeData, value: boolean) => {
        if (readOnly) return;
        // Only allow toggling fields that are boolean | null
        const currentValue = safeData[field];
        if (typeof currentValue === 'string') return; 

        const newValue = currentValue === value ? null : value;
        onChange({ ...safeData, [field]: newValue });
    };

    const handleNumberChange = (field: 'stayDays' | 'disabilityDays', value: string) => {
        if (readOnly) return;
        const sanitizedValue = value.replace(/[^0-9]/g, '');
        onChange({ ...safeData, [field]: sanitizedValue });
    };

    const toggleFields: { id: keyof DischargeData; label: string }[] = [
        { id: 'finalDischarge', label: 'Alta Definitiva' },
        { id: 'transitoryDischarge', label: 'Alta Transitoria' },
        { id: 'asymptomatic', label: 'Asintomático' },
        { id: 'mildDisability', label: 'Discapacidad Leve' },
        { id: 'moderateDisability', label: 'Discapacidad Moderada' },
        { id: 'severeDisability', label: 'Discapacidad Grave' },
        { id: 'voluntaryRetirement', label: 'Retiro Voluntario' },
        { id: 'involuntaryRetirement', label: 'Retiro Involuntario' },
        { id: 'deathBefore48h', label: 'Defunción antes 48h' },
        { id: 'deathAfter48h', label: 'Defunción después 48h' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Condition Toggles Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {toggleFields.map((field) => (
                    <div key={field.id} style={{ 
                        padding: '16px', 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase' }}>{field.label}</span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <button
                                onClick={() => handleToggle(field.id, true)}
                                style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1.5px solid',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    backgroundColor: safeData[field.id] === true ? '#eff6ff' : 'white',
                                    borderColor: safeData[field.id] === true ? '#3b82f6' : '#e2e8f0',
                                    color: safeData[field.id] === true ? '#3b82f6' : '#64748b'
                                }}
                            >
                                SI
                            </button>
                            <button
                                onClick={() => handleToggle(field.id, false)}
                                style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1.5px solid',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    backgroundColor: safeData[field.id] === false ? '#fef2f2' : 'white',
                                    borderColor: safeData[field.id] === false ? '#ef4444' : '#e2e8f0',
                                    color: safeData[field.id] === false ? '#ef4444' : '#64748b'
                                }}
                            >
                                NO
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Numeric Inputs Section */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '24px',
                padding: '24px',
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                border: '1px solid #f1f5f9'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>DÍAS ESTADA</label>
                    <input
                        type="text"
                        placeholder="Ej: 5"
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none' }}
                        value={safeData.stayDays}
                        onChange={(e) => handleNumberChange('stayDays', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>DÍAS INCAPACIDAD</label>
                    <input
                        type="text"
                        placeholder="Ej: 15"
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none' }}
                        value={safeData.disabilityDays}
                        onChange={(e) => handleNumberChange('disabilityDays', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
            </div>
        </div>
    );
}
