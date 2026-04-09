import React from 'react';

interface OrgansReviewData {
    description: string;
    systems: {
        senses: 'CP' | 'SP' | null;
        respiratory: 'CP' | 'SP' | null;
        cardiovascular: 'CP' | 'SP' | null;
        digestive: 'CP' | 'SP' | null;
        genital: 'CP' | 'SP' | null;
        urinary: 'CP' | 'SP' | null;
        musculoskeletal: 'CP' | 'SP' | null;
        endocrine: 'CP' | 'SP' | null;
        hemolymphatic: 'CP' | 'SP' | null;
        nervous: 'CP' | 'SP' | null;
    }
}

interface GeneralOrgansReviewFormProps {
    data: OrgansReviewData | string;
    onChange: (data: OrgansReviewData) => void;
    readOnly?: boolean;
}

export default function GeneralOrgansReviewForm({ data, onChange, readOnly = false }: GeneralOrgansReviewFormProps) {
    const safeData: OrgansReviewData = typeof data === 'string'
        ? { description: data, systems: { senses: null, respiratory: null, cardiovascular: null, digestive: null, genital: null, urinary: null, musculoskeletal: null, endocrine: null, hemolymphatic: null, nervous: null } }
        : data || { description: '', systems: { senses: null, respiratory: null, cardiovascular: null, digestive: null, genital: null, urinary: null, musculoskeletal: null, endocrine: null, hemolymphatic: null, nervous: null } };

    const handleUpdateSystem = (system: keyof OrgansReviewData['systems'], value: 'CP' | 'SP') => {
        if (readOnly) return;
        const newValue = safeData.systems[system] === value ? null : value;
        onChange({
            ...safeData,
            systems: { ...safeData.systems, [system]: newValue }
        });
    };

    const handleUpdateDescription = (val: string) => {
        if (readOnly) return;
        onChange({ ...safeData, description: val });
    };

    const systemsList: { id: keyof OrgansReviewData['systems'], label: string }[] = [
        { id: 'senses', label: '1. ORGANOS DE LOS SENTIDOS' },
        { id: 'respiratory', label: '2. RESPIRATORIO' },
        { id: 'cardiovascular', label: '3. CARDIO VASCULAR' },
        { id: 'digestive', label: '4. DIGESTIVO' },
        { id: 'genital', label: '5. GENITAL' },
        { id: 'urinary', label: '6. URINARIO' },
        { id: 'musculoskeletal', label: '7. MUSCULO ESQUELETICO' },
        { id: 'endocrine', label: '8. ENDOCRINO' },
        { id: 'hemolymphatic', label: '9. HEMO LINFATICO' },
        { id: 'nervous', label: '10. NERVIOSO' }
    ];

    const labelStyle: React.CSSProperties = {
        fontSize: '11px',
        fontWeight: '700',
        color: '#475569',
        textTransform: 'uppercase',
        marginBottom: '8px',
        display: 'block'
    };

    const radioBtnStyle = (active: boolean, type: 'CP' | 'SP'): React.CSSProperties => ({
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '6px',
        border: '1px solid',
        borderColor: active ? (type === 'CP' ? '#3b82f6' : '#10b981') : '#e2e8f0',
        backgroundColor: active ? (type === 'CP' ? '#eff6ff' : '#f0fdf4') : 'white',
        color: active ? (type === 'CP' ? '#1d4ed8' : '#15803d') : '#64748b',
        fontSize: '13px',
        fontWeight: '700',
        cursor: readOnly ? 'default' : 'pointer',
        transition: 'all 0.2s'
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Systems Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                {systemsList.map((system) => (
                    <div key={system.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span style={labelStyle}>{system.label}</span>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => handleUpdateSystem(system.id, 'CP')}
                                style={radioBtnStyle(safeData.systems[system.id] === 'CP', 'CP')}
                            >
                                <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid', borderColor: safeData.systems[system.id] === 'CP' ? '#3b82f6' : '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {safeData.systems[system.id] === 'CP' && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />}
                                </div>
                                CP
                            </button>
                            <button
                                onClick={() => handleUpdateSystem(system.id, 'SP')}
                                style={radioBtnStyle(safeData.systems[system.id] === 'SP', 'SP')}
                            >
                                <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid', borderColor: safeData.systems[system.id] === 'SP' ? '#10b981' : '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {safeData.systems[system.id] === 'SP' && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />}
                                </div>
                                SP
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Description Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ ...labelStyle, fontSize: '12px' }}>Descripción(*)</label>
                <textarea
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1.5px solid #e2e8f0',
                        minHeight: '120px',
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
                    placeholder="Ingrese la descripción."
                    onFocus={(e) => !readOnly && (e.target.style.borderColor = '#3b82f6')}
                    onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                />
            </div>
        </div>
    );
}
