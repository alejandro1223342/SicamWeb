
interface AccidentData {
    eventPlace: string;
    eventAddress: string;
    eventDate: string;
    eventTime: string;
    vehicleOrWeapon: string;
    eventType: 'ACCIDENTE' | 'ENVENENAMIENTO' | 'VIOLENCIA' | 'OTRO' | null;
    otherEventType: string;
    reportTime: string;
    policeCustody: 'SI' | 'NO' | null;
    reportObservations: string;
    alcoholBreath: 'SI' | 'NO' | null;
    alcocheckValue: string;
    examTime: string;
    substanceSelection: 'ALCOHOLEMIA' | 'OTRAS SUSTANCIAS' | null;
    abuseSuspicion: 'SOSPECHA' | 'ABUSO FÍSICO' | 'ABUSO PSICOLÓGICO' | 'ABUSO SEXUAL' | null;
    generalObservations: string;
    burnDegree: 'GRADO I' | 'GRADO II' | 'GRADO III' | null;
    burnPercentage: string;
    stingDetail: string;
    biteDetail: string;
}

interface GeneralEmergencyAccidentFormProps {
    data: AccidentData;
    onChange: (data: AccidentData) => void;
    readOnly?: boolean;
}

export default function GeneralEmergencyAccidentForm({ data, onChange, readOnly = false }: GeneralEmergencyAccidentFormProps) {
    const isObject = (val: any) => val !== null && typeof val === 'object' && !Array.isArray(val);
    const safeData: AccidentData = {
        eventPlace: '',
        eventAddress: '',
        eventDate: '',
        eventTime: '',
        vehicleOrWeapon: '',
        eventType: null,
        otherEventType: '',
        reportTime: '',
        policeCustody: null,
        reportObservations: '',
        alcoholBreath: null,
        alcocheckValue: '',
        examTime: '',
        substanceSelection: null,
        abuseSuspicion: null,
        generalObservations: '',
        burnDegree: null,
        burnPercentage: '',
        stingDetail: '',
        biteDetail: '',
        ...(isObject(data) ? data : {})
    };

    const handleChange = (field: keyof AccidentData, value: any) => {
        if (readOnly) return;
        onChange({ ...safeData, [field]: value });
    };

    const handleToggle = (field: keyof AccidentData, value: string) => {
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

    const sectionHeaderStyle = {
        fontSize: '14px',
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: '16px',
        marginTop: '8px',
        borderLeft: '4px solid #ef4444',
        paddingLeft: '12px',
        textTransform: 'uppercase' as const
    };

    const getButtonStyle = (isSelected: boolean) => ({
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

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px 20px'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Section 1: Event Details */}
            <div>
                <h4 style={sectionHeaderStyle}>LOCALIZACIÓN Y EVENTO</h4>
                <div style={gridStyle}>
                    <div>
                        <label style={labelStyle}>Lugar del evento(*)</label>
                        <input type="text" placeholder="Ingrese el lugar" style={inputStyle} value={safeData.eventPlace} onChange={(e) => handleChange('eventPlace', e.target.value)} disabled={readOnly} />
                    </div>
                    <div>
                        <label style={labelStyle}>Dirección del evento(*)</label>
                        <input type="text" placeholder="Ingrese la dirección" style={inputStyle} value={safeData.eventAddress} onChange={(e) => handleChange('eventAddress', e.target.value)} disabled={readOnly} />
                    </div>
                    <div>
                        <label style={labelStyle}>Fecha(*)</label>
                        <input type="date" style={inputStyle} value={safeData.eventDate} onChange={(e) => handleChange('eventDate', e.target.value)} disabled={readOnly} />
                    </div>
                    <div>
                        <label style={labelStyle}>Hora(*)</label>
                        <input type="time" style={inputStyle} value={safeData.eventTime} onChange={(e) => handleChange('eventTime', e.target.value)} disabled={readOnly} />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={labelStyle}>Vehículo o arma(*)</label>
                        <input type="text" placeholder="Vehículo o arma utilizado" style={inputStyle} value={safeData.vehicleOrWeapon} onChange={(e) => handleChange('vehicleOrWeapon', e.target.value)} disabled={readOnly} />
                    </div>
                </div>
            </div>

            {/* Section 2: Event Type */}
            <div>
                <h4 style={sectionHeaderStyle}>TIPO DE EVENTO</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={labelStyle}>Tipo de evento(*)</label>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {['ACCIDENTE', 'ENVENENAMIENTO', 'VIOLENCIA', 'OTRO'].map(opt => (
                                <button key={opt} onClick={() => handleToggle('eventType', opt)} style={getButtonStyle(safeData.eventType === opt)}>{opt}</button>
                            ))}
                        </div>
                    </div>
                    {safeData.eventType === 'OTRO' && (
                        <div>
                            <label style={labelStyle}>Especificar evento (Otro)</label>
                            <textarea 
                                placeholder="Especifique aquí los detalles del evento..." 
                                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} 
                                value={safeData.otherEventType} 
                                onChange={(e) => handleChange('otherEventType', e.target.value)} 
                                disabled={readOnly} 
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Section 3: Legal/Report */}
            <div>
                <h4 style={sectionHeaderStyle}>ESTADO LEGAL Y DENUNCIA</h4>
                <div style={gridStyle}>
                    <div>
                        <label style={labelStyle}>Hora de denuncia(*)</label>
                        <input type="time" style={inputStyle} value={safeData.reportTime} onChange={(e) => handleChange('reportTime', e.target.value)} disabled={readOnly} />
                    </div>
                    <div>
                        <label style={labelStyle}>Custodia policial(*)</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {['SI', 'NO'].map(opt => (
                                <button key={opt} onClick={() => handleToggle('policeCustody', opt)} style={getButtonStyle(safeData.policeCustody === opt)}>{opt}</button>
                            ))}
                        </div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={labelStyle}>Observaciones del reporte</label>
                        <textarea 
                            placeholder="Ingrese detalles de la denuncia u observaciones" 
                            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
                            value={safeData.reportObservations} 
                            onChange={(e) => handleChange('reportObservations', e.target.value)} 
                            disabled={readOnly} 
                        />
                    </div>
                </div>
            </div>

            {/* Section 4: Alcohol/Substances */}
            <div>
                <h4 style={sectionHeaderStyle}>ESTADO ETÍLICO Y EXÁMENES</h4>
                <div style={gridStyle}>
                    <div>
                        <label style={labelStyle}>Aliento etílico detectado(*)</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {['SI', 'NO'].map(opt => (
                                <button key={opt} onClick={() => handleToggle('alcoholBreath', opt)} style={getButtonStyle(safeData.alcoholBreath === opt)}>{opt}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Valor del alcocheck</label>
                        <input type="text" placeholder="Ingrese valor si aplica" style={inputStyle} value={safeData.alcocheckValue} onChange={(e) => handleChange('alcocheckValue', e.target.value)} disabled={readOnly} />
                    </div>
                    <div>
                        <label style={labelStyle}>Hora del examen</label>
                        <input type="time" style={inputStyle} value={safeData.examTime} onChange={(e) => handleChange('examTime', e.target.value)} disabled={readOnly} />
                    </div>
                    <div>
                        <label style={labelStyle}>Procedimiento seleccionado(*)</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {['ALCOHOLEMIA', 'OTRAS SUSTANCIAS'].map(opt => (
                                <button key={opt} onClick={() => handleToggle('substanceSelection', opt)} style={getButtonStyle(safeData.substanceSelection === opt)}>{opt}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 5: Abuse Suspicion & Observations */}
            <div>
                <h4 style={sectionHeaderStyle}>SOSPECHA DE VIOLENCIA Y OBSERVACIONES</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={labelStyle}>Tipo de sospecha(*)</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {['SOSPECHA', 'ABUSO FÍSICO', 'ABUSO PSICOLÓGICO', 'ABUSO SEXUAL'].map(opt => (
                                <button key={opt} onClick={() => handleToggle('abuseSuspicion', opt)} style={getButtonStyle(safeData.abuseSuspicion === opt)}>{opt}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Detalles adicionales / Observaciones generales</label>
                        <textarea 
                            placeholder="Describa aquí cualquier detalle relevante adicional..." 
                            style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} 
                            value={safeData.generalObservations} 
                            onChange={(e) => handleChange('generalObservations', e.target.value)} 
                            disabled={readOnly} 
                        />
                    </div>
                </div>
            </div>

            {/* Section 6: Specific Injuries */}
            <div>
                <h4 style={sectionHeaderStyle}>LESIONES ESPECÍFICAS (QUEMADURAS, PICADURAS, MORDEDURAS)</h4>
                <div style={gridStyle}>
                    <div>
                        <label style={labelStyle}>Grado de quemadura</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {['GRADO I', 'GRADO II', 'GRADO III'].map(opt => (
                                <button key={opt} onClick={() => handleToggle('burnDegree', opt)} style={getButtonStyle(safeData.burnDegree === opt)}>{opt}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Porcentaje de superficie corporal</label>
                        <input type="text" placeholder="Ej: 15%" style={inputStyle} value={safeData.burnPercentage} onChange={(e) => handleChange('burnPercentage', e.target.value)} disabled={readOnly} />
                    </div>
                    <div>
                        <label style={labelStyle}>Detalle de Picadura</label>
                        <textarea 
                            placeholder="Especifique picadura" 
                            style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} 
                            value={safeData.stingDetail} 
                            onChange={(e) => handleChange('stingDetail', e.target.value)} 
                            disabled={readOnly} 
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Detalle de Mordedura</label>
                        <textarea 
                            placeholder="Especifique mordedura" 
                            style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} 
                            value={safeData.biteDetail} 
                            onChange={(e) => handleChange('biteDetail', e.target.value)} 
                            disabled={readOnly} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
