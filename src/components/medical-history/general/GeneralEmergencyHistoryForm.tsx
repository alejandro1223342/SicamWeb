
interface HistoryData {
    selectedTypes: string[];
    details: string;
}

interface GeneralEmergencyHistoryFormProps {
    data: HistoryData;
    onChange: (data: HistoryData) => void;
    readOnly?: boolean;
}

const HISTORY_OPTIONS = [
    '1.ALERGICOS',
    '2.CLINICOS',
    '3.GINECOLOGICOS',
    '4.TRAUMATOLOGICOS',
    '5.PEDIATRICOS',
    '6.QUIRURGICOS',
    '7.FARMACOLOGICOS',
    '8.OTROS'
];

export default function GeneralEmergencyHistoryForm({ data, onChange, readOnly = false }: GeneralEmergencyHistoryFormProps) {
    const safeData: HistoryData = {
        selectedTypes: Array.isArray(data?.selectedTypes) ? data.selectedTypes : [],
        details: data?.details || ''
    };

    const handleToggleType = (type: string) => {
        if (readOnly) return;
        const newTypes = safeData.selectedTypes.includes(type)
            ? safeData.selectedTypes.filter(t => t !== type)
            : [...safeData.selectedTypes, type];
        onChange({ ...safeData, selectedTypes: newTypes });
    };

    const handleChangeDetails = (value: string) => {
        if (readOnly) return;
        onChange({ ...safeData, details: value });
    };

    const labelStyle = {
        fontSize: '13px',
        fontWeight: '700',
        color: '#475569',
        marginBottom: '10px',
        display: 'block',
        textTransform: 'uppercase' as const
    };

    const checkboxGroupStyle = {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '12px',
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '1.5px solid #e2e8f0'
    };

    const getOptionStyle = (isSelected: boolean) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 14px',
        borderRadius: '8px',
        border: '1.5px solid',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: isSelected ? '#fef2f2' : 'white',
        borderColor: isSelected ? '#ef4444' : '#e2e8f0',
        color: isSelected ? '#ef4444' : '#64748b',
        boxShadow: isSelected ? '0 2px 4px rgba(239, 68, 68, 0.1)' : 'none'
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
                <label style={labelStyle}>Seleccione categorías relevantes(*)</label>
                <div style={checkboxGroupStyle}>
                    {HISTORY_OPTIONS.map(opt => (
                        <div 
                            key={opt} 
                            onClick={() => handleToggleType(opt)}
                            style={getOptionStyle(safeData.selectedTypes.includes(opt))}
                        >
                            <div style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '4px',
                                border: '2px solid',
                                borderColor: safeData.selectedTypes.includes(opt) ? '#ef4444' : '#cbd5e1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: safeData.selectedTypes.includes(opt) ? '#ef4444' : 'white',
                                color: 'white',
                                fontSize: '12px',
                                transition: 'all 0.2s'
                            }}>
                                {safeData.selectedTypes.includes(opt) && '✓'}
                            </div>
                            {opt}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label style={labelStyle}>Descripción de antecedentes personales y familiares relevante(*)</label>
                <textarea
                    placeholder="Ingrese los antecedentes personales y familiares relevantes..."
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1.5px solid #e2e8f0',
                        minHeight: '250px',
                        fontSize: '16px',
                        lineHeight: '1.6',
                        transition: 'all 0.2s',
                        outline: 'none',
                        backgroundColor: readOnly ? '#f8fafc' : 'white',
                        resize: 'vertical'
                    }}
                    value={safeData.details}
                    onChange={(e) => handleChangeDetails(e.target.value)}
                    disabled={readOnly}
                    onFocus={(e) => !readOnly && (e.target.style.borderColor = '#ef4444')}
                    onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                />
            </div>
        </div>
    );
}
