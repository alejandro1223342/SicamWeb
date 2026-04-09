import React from 'react';

interface SummaryData {
    targetInstitution: string;
    referringService: string;
    detailedSummary: string;
}

interface GeneralCounterReferenceSummaryFormProps {
    data: SummaryData;
    onChange: (data: SummaryData) => void;
    readOnly?: boolean;
}

const GeneralCounterReferenceSummaryForm: React.FC<GeneralCounterReferenceSummaryFormProps> = ({ data, onChange, readOnly }) => {
    const handleChange = (field: keyof SummaryData, value: string) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const textAreaStyle = {
        width: '100%',
        padding: '16px',
        borderRadius: '12px',
        border: '1.5px solid #e2e8f0',
        minHeight: '120px',
        fontSize: '16px',
        lineHeight: '1.6',
        transition: 'all 0.2s',
        outline: 'none',
        backgroundColor: readOnly ? '#f8fafc' : 'white',
        resize: 'vertical' as const
    };

    const labelStyle = {
        fontSize: '12px',
        fontWeight: '700',
        color: '#475569',
        marginBottom: '6px',
        display: 'block',
        textTransform: 'uppercase' as const
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
                <label style={labelStyle}>Establecimiento al que contrarrefiere(*)</label>
                <textarea 
                    placeholder="Ingrese el establecimiento al contrarrefiere" 
                    style={textAreaStyle}
                    value={data.targetInstitution || ''}
                    onChange={(e) => handleChange('targetInstitution', e.target.value)}
                    disabled={readOnly}
                    onFocus={(e) => !readOnly && (e.target.style.borderColor = '#22c55e')}
                    onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                />
            </div>
            <div>
                <label style={labelStyle}>Servicio que contrarrefiere(*)</label>
                <textarea 
                    placeholder="Ingrese servicio que se contrarrefiere" 
                    style={textAreaStyle}
                    value={data.referringService || ''}
                    onChange={(e) => handleChange('referringService', e.target.value)}
                    disabled={readOnly}
                    onFocus={(e) => !readOnly && (e.target.style.borderColor = '#22c55e')}
                    onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                />
            </div>

            <div>
                <label style={labelStyle}>Cuadro clínico(*)</label>
                <textarea 
                    placeholder="Ingrese el cuadro clínico" 
                    style={textAreaStyle}
                    value={data.detailedSummary || ''}
                    onChange={(e) => handleChange('detailedSummary', e.target.value)}
                    disabled={readOnly}
                    onFocus={(e) => !readOnly && (e.target.style.borderColor = '#22c55e')}
                    onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                />
            </div>
        </div>
    );
};

export default GeneralCounterReferenceSummaryForm;
