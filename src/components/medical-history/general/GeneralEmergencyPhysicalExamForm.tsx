
interface PhysicalExamData {
    selections: Record<string, 'CP' | 'SP' | null>;
    description: string;
}

interface GeneralEmergencyPhysicalExamFormProps {
    data: PhysicalExamData;
    onChange: (data: PhysicalExamData) => void;
    readOnly?: boolean;
}

export default function GeneralEmergencyPhysicalExamForm({ data, onChange, readOnly = false }: GeneralEmergencyPhysicalExamFormProps) {
    const safeData: PhysicalExamData = {
        selections: data?.selections || {},
        description: data?.description || ''
    };

    const localizationItems = [
        { id: 'piel', label: '1R PIEL Y FANERAS' },
        { id: 'cabeza', label: '2R CABEZA' },
        { id: 'ojos', label: '3R OJOS' },
        { id: 'oidos', label: '4R OIDOS' },
        { id: 'nariz', label: '5R NARIZ' },
        { id: 'boca', label: '6R BOCA' },
        { id: 'oro_faringe', label: '7R ORO FARINGE' },
        { id: 'cuello', label: '8R CUELLO' },
        { id: 'axilas_mamas', label: '9R AXILAS MAMAS' },
        { id: 'torax', label: '10R TORAX' },
        { id: 'abdomen', label: '11R ABDOMEN' },
        { id: 'columna', label: '12R COLUMNA VERTEBRAL' },
        { id: 'ingle_perine', label: '13R INGLE-PERINE' },
        { id: 'miembros_sup', label: '14R MIEMBROS SUPERIORES' },
        { id: 'miembros_inf', label: '15R MIEMBROS INFERIORES' }
    ];

    const systemItems = [
        { id: 'sentidos', label: '1S ORGANOS DE LOS SENTIDOS' },
        { id: 'respiratorio', label: '2S RESPIRATORIO' },
        { id: 'cardiovascular', label: '3S CARDIO VASCULAR' },
        { id: 'digestivo', label: '4S DIGESTIVO' },
        { id: 'genital', label: '5S GENITAL' },
        { id: 'urinario', label: '6S URINARIO' },
        { id: 'musculo_esqueletico', label: '7S MUSCULO ESQUELETICO' },
        { id: 'endocrino', label: '8S ENDOCRINO' },
        { id: 'hemo_linfatico', label: '9S HEMO LINFÁTICO' },
        { id: 'neurologico', label: '10S NEUROLÓGICO' }
    ];

    const handleToggle = (id: string, value: 'CP' | 'SP') => {
        if (readOnly) return;
        const current = safeData.selections[id];
        const next = current === value ? null : value;
        onChange({
            ...safeData,
            selections: { ...safeData.selections, [id]: next }
        });
    };

    const handleDescriptionChange = (val: string) => {
        if (readOnly) return;
        onChange({ ...safeData, description: val });
    };

    const getButtonStyle = (id: string, variant: 'CP' | 'SP') => {
        const isSelected = safeData.selections[id] === variant;
        const colors = {
            SP: { bg: '#f0fdf4', border: '#22c55e', text: '#15803d' },
            CP: { bg: '#fff1f2', border: '#f43f5e', text: '#be123c' }
        };

        return {
            flex: 1,
            padding: '6px 4px',
            fontSize: '11px',
            fontWeight: '700',
            borderRadius: '6px',
            border: '1.5px solid',
            cursor: readOnly ? 'default' : 'pointer',
            textAlign: 'center' as const,
            transition: 'all 0.2s',
            userSelect: 'none' as const,
            backgroundColor: isSelected ? colors[variant].bg : '#fff',
            borderColor: isSelected ? colors[variant].border : '#e2e8f0',
            color: isSelected ? colors[variant].text : '#94a3b8'
        };
    };

    const renderItem = (item: { id: string, label: string }) => (
        <div key={item.id} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px', 
            padding: '12px', 
            backgroundColor: '#fff', 
            border: '1px solid #f1f5f9', 
            borderRadius: '10px' 
        }}>
            <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
                {item.label}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
                <div 
                    onClick={() => handleToggle(item.id, 'SP')} 
                    style={getButtonStyle(item.id, 'SP')}
                >
                    SP
                </div>
                <div 
                    onClick={() => handleToggle(item.id, 'CP')} 
                    style={getButtonStyle(item.id, 'CP')}
                >
                    CP
                </div>
            </div>
        </div>
    );

    const sectionTitleStyle = {
        fontSize: '13px',
        fontWeight: '800',
        color: '#475569',
        marginBottom: '16px',
        marginTop: '24px',
        display: 'block',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <span style={{ ...sectionTitleStyle, marginTop: 0 }}>LOCALIZACIÓN (R)</span>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                gap: '12px' 
            }}>
                {localizationItems.map(renderItem)}
            </div>

            <span style={sectionTitleStyle}>SISTEMAS (S)</span>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                gap: '12px' 
            }}>
                {systemItems.map(renderItem)}
            </div>

            <div style={{ marginTop: '32px' }}>
                <span style={sectionTitleStyle}>Descripción de hallazgos (*)</span>
                <textarea
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1.5px solid #e2e8f0',
                        minHeight: '180px',
                        fontSize: '15px',
                        outline: 'none',
                        backgroundColor: readOnly ? '#f8fafc' : 'white',
                        color: '#334155',
                        resize: 'vertical'
                    }}
                    value={safeData.description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    placeholder="Detalle los hallazgos patológicos encontrados..."
                    disabled={readOnly}
                />
            </div>
        </div>
    );
}
