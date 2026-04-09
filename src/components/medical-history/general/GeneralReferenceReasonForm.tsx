import React from 'react';

interface ReasonData {
    targetInstitution: string;
    referringService: string;
    detailedReason: string;
}

interface GeneralReferenceReasonFormProps {
    data: ReasonData;
    onChange: (data: ReasonData) => void;
    readOnly?: boolean;
}

const GeneralReferenceReasonForm: React.FC<GeneralReferenceReasonFormProps> = ({ data, onChange, readOnly }) => {
    const handleChange = (field: keyof ReasonData, value: string) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1.5px solid #e2e8f0',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s',
        backgroundColor: readOnly ? '#f8fafc' : 'white'
    };

    const textAreaStyle = {
        ...inputStyle,
        minHeight: '120px',
        resize: 'vertical' as const,
        lineHeight: '1.6'
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
                <label style={labelStyle}>Establecimiento al que se hace referencia(*)</label>
                <textarea 
                    placeholder="Ingrese el establecimiento al que se hace referencia" 
                    style={textAreaStyle}
                    value={data.targetInstitution || ''}
                    onChange={(e) => handleChange('targetInstitution', e.target.value)}
                    disabled={readOnly}
                    onFocus={(e) => !readOnly && (e.target.style.borderColor = '#a855f7')}
                    onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                />
            </div>
            <div>
                <label style={labelStyle}>Servicio que refiere(*)</label>
                <textarea 
                    placeholder="Ingrese servicio que se refiere" 
                    style={textAreaStyle}
                    value={data.referringService || ''}
                    onChange={(e) => handleChange('referringService', e.target.value)}
                    disabled={readOnly}
                    onFocus={(e) => !readOnly && (e.target.style.borderColor = '#a855f7')}
                    onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                />
            </div>

            <div>
                <label style={labelStyle}>Motivo de referencia(*)</label>
                <textarea 
                    placeholder="Ingrese el motivo de referencia" 
                    style={textAreaStyle}
                    value={data.detailedReason || ''}
                    onChange={(e) => handleChange('detailedReason', e.target.value)}
                    disabled={readOnly}
                    onFocus={(e) => !readOnly && (e.target.style.borderColor = '#a855f7')}
                    onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                />
            </div>
        </div>
    );
};

export default GeneralReferenceReasonForm;
