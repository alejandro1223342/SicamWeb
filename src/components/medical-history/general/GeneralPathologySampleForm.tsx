import React from 'react';

interface SampleDetails {
    anatomicalSite: string;
    procedureType: string;
    description: string;
}

interface GeneralPathologySampleFormProps {
    data: SampleDetails;
    onChange: (data: SampleDetails) => void;
    readOnly?: boolean;
}

const GeneralPathologySampleForm: React.FC<GeneralPathologySampleFormProps> = ({ data, onChange, readOnly }) => {
    const handleChange = (field: keyof SampleDetails, value: string) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const labelStyle = {
        fontSize: '12px',
        fontWeight: '700',
        color: '#475569',
        marginBottom: '8px',
        display: 'block',
        textTransform: 'uppercase' as const
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '12px',
        border: '1.5px solid #e2e8f0',
        fontSize: '15px',
        outline: 'none',
        transition: 'all 0.2s',
        backgroundColor: readOnly ? '#f8fafc' : 'white'
    };

    const textAreaStyle = {
        ...inputStyle,
        minHeight: '120px',
        resize: 'vertical' as const
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <label style={labelStyle}>Sitio anatómico de la muestra(*)</label>
                <textarea 
                    placeholder="Ej. Mama derecha, cuadrante superior externo..."
                    style={{ ...textAreaStyle, minHeight: '80px' }}
                    value={data.anatomicalSite || ''}
                    onChange={(e) => handleChange('anatomicalSite', e.target.value)}
                    disabled={readOnly}
                    onFocus={(e) => !readOnly && (e.target.style.borderColor = '#6366f1')}
                    onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                />
            </div>
            <div>
                <label style={labelStyle}>Tipo de procedimiento(*)</label>
                <textarea 
                    placeholder="Ej. Biopsia por aspiración, Resección tumoral..."
                    style={{ ...textAreaStyle, minHeight: '80px' }}
                    value={data.procedureType || ''}
                    onChange={(e) => handleChange('procedureType', e.target.value)}
                    disabled={readOnly}
                    onFocus={(e) => !readOnly && (e.target.style.borderColor = '#6366f1')}
                    onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                />
            </div>
            <div>
                <label style={labelStyle}>Descripción macroscópica / Detalles adicionales(*)</label>
                <textarea 
                    placeholder="Detalle características físicas, tamaño, consistencia de la muestra enviada..."
                    style={textAreaStyle}
                    value={data.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    disabled={readOnly}
                    onFocus={(e) => !readOnly && (e.target.style.borderColor = '#6366f1')}
                    onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                />
            </div>
        </div>
    );
};

export default GeneralPathologySampleForm;
