
interface ReasonData {
    destination: string;
    consultedService: string;
    requestingService: string;
    ward: string;
    bed: string;
    priority: 'NORMAL' | 'URGENTE' | null;
    consultedDoctor: string;
}

interface GeneralInterconsultationReasonFormProps {
    data: ReasonData;
    onChange: (data: ReasonData) => void;
    readOnly?: boolean;
}

export default function GeneralInterconsultationReasonForm({ data, onChange, readOnly = false }: GeneralInterconsultationReasonFormProps) {
    const safeData: ReasonData = {
        destination: '',
        consultedService: '',
        requestingService: '',
        ward: '',
        bed: '',
        priority: null,
        consultedDoctor: '',
        ...(typeof data === 'object' ? data : {})
    };

    const handleChange = (field: keyof ReasonData, value: string | null) => {
        if (readOnly) return;
        onChange({ ...safeData, [field]: value });
    };

    const handlePriorityToggle = (value: 'NORMAL' | 'URGENTE') => {
        if (readOnly) return;
        const newValue = safeData.priority === value ? null : value;
        onChange({ ...safeData, priority: newValue });
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>Establecimiento del destino</label>
                    <input
                        type="text"
                        placeholder="Ingrese el establecimiento de destino"
                        style={inputStyle}
                        value={safeData.destination}
                        onChange={(e) => handleChange('destination', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                
                <div>
                    <label style={labelStyle}>Servicio consultado</label>
                    <input
                        type="text"
                        placeholder="Ingrese el servicio consultado"
                        style={inputStyle}
                        value={safeData.consultedService}
                        onChange={(e) => handleChange('consultedService', e.target.value)}
                        disabled={readOnly}
                    />
                </div>

                <div>
                    <label style={labelStyle}>Servicio que solicita</label>
                    <input
                        type="text"
                        placeholder="Ingrese el servicio que solicita"
                        style={inputStyle}
                        value={safeData.requestingService}
                        onChange={(e) => handleChange('requestingService', e.target.value)}
                        disabled={readOnly}
                    />
                </div>

                <div>
                    <label style={labelStyle}>Sala</label>
                    <input
                        type="text"
                        placeholder="Ingrese la sala"
                        style={inputStyle}
                        value={safeData.ward}
                        onChange={(e) => handleChange('ward', e.target.value)}
                        disabled={readOnly}
                    />
                </div>

                <div>
                    <label style={labelStyle}>Cama</label>
                    <input
                        type="text"
                        placeholder="Ingrese la cama"
                        style={inputStyle}
                        value={safeData.bed}
                        onChange={(e) => handleChange('bed', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
            </div>

            <div style={{ 
                padding: '24px', 
                backgroundColor: '#f8fafc', 
                borderRadius: '16px', 
                border: '1px solid #f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <div>
                    <label style={labelStyle}>Prioridad de la Solicitud</label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => handlePriorityToggle('NORMAL')}
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '10px',
                                border: '2px solid',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                backgroundColor: safeData.priority === 'NORMAL' ? '#eff6ff' : 'white',
                                borderColor: safeData.priority === 'NORMAL' ? '#3b82f6' : '#e2e8f0',
                                color: safeData.priority === 'NORMAL' ? '#3b82f6' : '#64748b'
                            }}
                        >
                            NORMAL
                        </button>
                        <button
                            onClick={() => handlePriorityToggle('URGENTE')}
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '10px',
                                border: '2px solid',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                backgroundColor: safeData.priority === 'URGENTE' ? '#fef2f2' : 'white',
                                borderColor: safeData.priority === 'URGENTE' ? '#ef4444' : '#e2e8f0',
                                color: safeData.priority === 'URGENTE' ? '#ef4444' : '#64748b'
                            }}
                        >
                            URGENTE
                        </button>
                    </div>
                </div>

                <div>
                    <label style={labelStyle}>Médico inter consultado</label>
                    <input
                        type="text"
                        placeholder="Ingrese el médico inter consultado"
                        style={inputStyle}
                        value={safeData.consultedDoctor}
                        onChange={(e) => handleChange('consultedDoctor', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
            </div>
        </div>
    );
}
