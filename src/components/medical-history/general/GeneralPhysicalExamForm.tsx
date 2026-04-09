import React from 'react';

interface PhysicalExamData {
    description: string;
    areas: {
        skin: 'CP' | 'SP' | null;
        head: 'CP' | 'SP' | null;
        eyes: 'CP' | 'SP' | null;
        ears: 'CP' | 'SP' | null;
        nose: 'CP' | 'SP' | null;
        mouth: 'CP' | 'SP' | null;
        oropharynx: 'CP' | 'SP' | null;
        neck: 'CP' | 'SP' | null;
        axillaeBreasts: 'CP' | 'SP' | null;
        thorax: 'CP' | 'SP' | null;
        abdomen: 'CP' | 'SP' | null;
        spine: 'CP' | 'SP' | null;
        groinPerineum: 'CP' | 'SP' | null;
        upperLimbs: 'CP' | 'SP' | null;
        lowerLimbs: 'CP' | 'SP' | null;
    }
}

interface GeneralPhysicalExamFormProps {
    data: PhysicalExamData | string;
    onChange: (data: PhysicalExamData) => void;
    readOnly?: boolean;
}

export default function GeneralPhysicalExamForm({ data, onChange, readOnly = false }: GeneralPhysicalExamFormProps) {
    const safeData: PhysicalExamData = typeof data === 'string'
        ? { description: data, areas: { skin: null, head: null, eyes: null, ears: null, nose: null, mouth: null, oropharynx: null, neck: null, axillaeBreasts: null, thorax: null, abdomen: null, spine: null, groinPerineum: null, upperLimbs: null, lowerLimbs: null } }
        : data || { description: '', areas: { skin: null, head: null, eyes: null, ears: null, nose: null, mouth: null, oropharynx: null, neck: null, axillaeBreasts: null, thorax: null, abdomen: null, spine: null, groinPerineum: null, upperLimbs: null, lowerLimbs: null } };

    const handleUpdateArea = (area: keyof PhysicalExamData['areas'], value: 'CP' | 'SP') => {
        if (readOnly) return;
        const newValue = safeData.areas[area] === value ? null : value;
        onChange({
            ...safeData,
            areas: { ...safeData.areas, [area]: newValue }
        });
    };

    const handleUpdateDescription = (val: string) => {
        if (readOnly) return;
        onChange({ ...safeData, description: val });
    };

    const areasList: { id: keyof PhysicalExamData['areas'], label: string }[] = [
        { id: 'skin', label: '1R PIEL Y FANERAS' },
        { id: 'head', label: '2R CABEZA' },
        { id: 'eyes', label: '3R OJOS' },
        { id: 'ears', label: '4R OIDOS' },
        { id: 'nose', label: '5R NARIZ' },
        { id: 'mouth', label: '6R BOCA' },
        { id: 'oropharynx', label: '7R ORO FARINGE' },
        { id: 'neck', label: '8R CUELLO' },
        { id: 'axillaeBreasts', label: '9R AXILAS MAMAS' },
        { id: 'thorax', label: '10R TORAX' },
        { id: 'abdomen', label: '11R ABDOMEN' },
        { id: 'spine', label: '12R COLUMNA VERTEBRAL' },
        { id: 'groinPerineum', label: '13R INGLE-PERINE' },
        { id: 'upperLimbs', label: '14R MIEMBROS SUPERIORES' },
        { id: 'lowerLimbs', label: '15R MIEMBROS INFERIORES' }
    ];

    const labelStyle: React.CSSProperties = {
        fontSize: '10px',
        fontWeight: '700',
        color: '#475569',
        textTransform: 'uppercase',
        marginBottom: '6px',
        display: 'block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    };

    const radioBtnStyle = (active: boolean, type: 'CP' | 'SP'): React.CSSProperties => ({
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        borderRadius: '5px',
        border: '1px solid',
        borderColor: active ? (type === 'CP' ? '#ef4444' : '#3b82f6') : '#f1f5f9',
        backgroundColor: active ? (type === 'CP' ? '#fef2f2' : '#eff6ff') : 'white',
        color: active ? (type === 'CP' ? '#b91c1c' : '#1d4ed8') : '#94a3b8',
        fontSize: '11px',
        fontWeight: '700',
        cursor: readOnly ? 'default' : 'pointer',
        transition: 'all 0.2s',
        flex: 1,
        justifyContent: 'center'
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Areas Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {areasList.map((area) => (
                    <div key={area.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px', borderRadius: '10px', border: '1px solid #f8fafc', backgroundColor: '#fafafa' }}>
                        <span style={labelStyle} title={area.label}>{area.label}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => handleUpdateArea(area.id, 'SP')}
                                style={radioBtnStyle(safeData.areas[area.id] === 'SP', 'SP')}
                            >
                                SP
                            </button>
                            <button
                                onClick={() => handleUpdateArea(area.id, 'CP')}
                                style={radioBtnStyle(safeData.areas[area.id] === 'CP', 'CP')}
                            >
                                CP
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Description Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ ...labelStyle, fontSize: '11px', color: '#1e293b' }}>OBSERVACIONES Y HALLAZGOS</label>
                <textarea
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '10px',
                        border: '1.5px solid #e2e8f0',
                        minHeight: '150px',
                        fontSize: '15px',
                        lineHeight: '1.6',
                        transition: 'all 0.2s',
                        outline: 'none',
                        backgroundColor: readOnly ? '#f8fafc' : 'white',
                        resize: 'vertical'
                    }}
                    value={safeData.description}
                    onChange={(e) => handleUpdateDescription(e.target.value)}
                    disabled={readOnly}
                    placeholder="Ingrese la descripción en caso de haberla."
                    onFocus={(e) => !readOnly && (e.target.style.borderColor = '#3b82f6')}
                    onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                />
            </div>
        </div>
    );
}
