import React from 'react';

interface CareData {
    time: string;
    bloodType: string;
    airwayState: 'LIBRE' | 'OBSTRUIDA' | null;
    arrivalCondition: 'ESTABLE' | 'INESTABLE' | 'OTRO' | null;
    arrivalReason: string;
}

interface GeneralEmergencyCareStartFormProps {
    data: CareData;
    onChange: (data: CareData) => void;
    readOnly?: boolean;
    patient?: any;
}

export default function GeneralEmergencyCareStartForm({ data, onChange, readOnly = false, patient }: GeneralEmergencyCareStartFormProps) {
    const isObject = (val: any) => val !== null && typeof val === 'object' && !Array.isArray(val);
    const safeData: CareData = {
        time: '',
        bloodType: '',
        airwayState: null,
        arrivalCondition: null,
        arrivalReason: '',
        ...(isObject(data) ? data : {})
    };

    // Auto-fill effect
    React.useEffect(() => {
        if (readOnly || !patient) return;

        const isNew = !safeData.time && !safeData.bloodType && !safeData.airwayState;
        const updates: Partial<CareData> = {};

        if (isNew) {
            const now = new Date();
            updates.time = now.toTimeString().split(' ')[0].substring(0, 5);
        }

        if (!safeData.bloodType && patient.bloodType) {
            updates.bloodType = patient.bloodType;
        }

        if (Object.keys(updates).length > 0) {
            onChange({ ...safeData, ...updates });
        }
    }, [patient, readOnly]);

    const handleChange = (field: keyof CareData, value: any) => {
        if (readOnly) return;
        onChange({ ...safeData, [field]: value });
    };

    const handleToggle = (field: 'airwayState' | 'arrivalCondition', value: string) => {
        if (readOnly) return;
        const newValue = safeData[field] === value ? null : value;
        onChange({ ...safeData, [field]: newValue as any });
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '10px',
        border: '1.5px solid #e2e8f0',
        fontSize: '15px',
        outline: 'none',
        transition: 'all 0.2s',
        backgroundColor: readOnly ? '#f8fafc' : 'white'
    };

    const labelStyle = {
        fontSize: '13px',
        fontWeight: '700',
        color: '#475569',
        marginBottom: '4px',
        display: 'block',
        textTransform: 'uppercase' as const
    };

    const radioButtonContainerGroup = {
        display: 'flex',
        gap: '10px',
        marginTop: '4px'
    };

    const getRadioButtonStyle = (isSelected: boolean) => ({
        flex: 1,
        padding: '10px',
        borderRadius: '8px',
        border: '2px solid',
        fontWeight: '700',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: isSelected ? '#fef2f2' : 'white',
        borderColor: isSelected ? '#ef4444' : '#e2e8f0',
        color: isSelected ? '#ef4444' : '#64748b'
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>
                Descripción del inicio de la atención médica y triaje inicial
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div>
                    <label style={labelStyle}>Hora(*)</label>
                    <input
                        type="time"
                        style={inputStyle}
                        value={safeData.time}
                        onChange={(e) => handleChange('time', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Grupo - Rh(*)</label>
                    <input
                        type="text"
                        placeholder="Ingrese el grupo rh"
                        style={inputStyle}
                        value={safeData.bloodType}
                        onChange={(e) => handleChange('bloodType', e.target.value)}
                        disabled={readOnly}
                    />
                </div>

                <div>
                    <label style={labelStyle}>Seleccione(*)</label>
                    <div style={radioButtonContainerGroup}>
                        <button
                            onClick={() => handleToggle('airwayState', 'LIBRE')}
                            style={getRadioButtonStyle(safeData.airwayState === 'LIBRE')}
                        >
                            VÍA AÉREA LIBRE
                        </button>
                        <button
                            onClick={() => handleToggle('airwayState', 'OBSTRUIDA')}
                            style={getRadioButtonStyle(safeData.airwayState === 'OBSTRUIDA')}
                        >
                            VÍA AÉREA OBSTRUIDA
                        </button>
                    </div>
                </div>

                <div>
                    <label style={labelStyle}>Condiciones de llegada(*)</label>
                    <div style={radioButtonContainerGroup}>
                        {['ESTABLE', 'INESTABLE', 'OTRO'].map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleToggle('arrivalCondition', opt)}
                                style={getRadioButtonStyle(safeData.arrivalCondition === opt)}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <label style={labelStyle}>Motivo de llegada(*)</label>
                <textarea
                    placeholder="Ingrese el motivo de llegada"
                    style={{
                        ...inputStyle,
                        minHeight: '120px',
                        resize: 'vertical',
                        lineHeight: '1.5'
                    }}
                    value={safeData.arrivalReason}
                    onChange={(e) => handleChange('arrivalReason', e.target.value)}
                    disabled={readOnly}
                />
            </div>
        </div>
    );
}
