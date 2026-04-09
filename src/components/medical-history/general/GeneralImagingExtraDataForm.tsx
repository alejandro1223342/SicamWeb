import React from 'react';

interface ExtraData {
    platesSent: string;
    size30x40: string;
    size8x10: string;
    size14x14: string;
    size14x17: string;
    size18x24: string;
    odont: string;
    damagedPlates: string;
    withContrast: string;
}

interface GeneralImagingExtraDataFormProps {
    data: ExtraData;
    onChange: (data: ExtraData) => void;
    readOnly?: boolean;
}

const GeneralImagingExtraDataForm: React.FC<GeneralImagingExtraDataFormProps> = ({ data, onChange, readOnly }) => {
    const handleChange = (field: keyof ExtraData, value: string) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const handleToggle = (field: keyof ExtraData, value: string) => {
        if (readOnly) return;
        if (data[field] === value) {
            handleChange(field, '');
        } else {
            handleChange(field, value);
        }
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
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1.5px solid #e2e8f0',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s',
        backgroundColor: readOnly ? '#f8fafc' : 'white'
    };

    const gridContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
        marginBottom: '32px'
    };

    const radioItemStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: readOnly ? 'default' : 'pointer',
        fontSize: '13px',
        fontWeight: '600',
        color: '#475569'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={gridContainerStyle}>
                <div>
                    <label style={labelStyle}>Placas enviadas(*)</label>
                    <input 
                        type="text" 
                        style={inputStyle} 
                        value={data.platesSent || ''} 
                        onChange={(e) => handleChange('platesSent', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>30 X 40(*)</label>
                    <input 
                        type="text" 
                        style={inputStyle} 
                        value={data.size30x40 || ''} 
                        onChange={(e) => handleChange('size30x40', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>8 X 10(*)</label>
                    <input 
                        type="text" 
                        style={inputStyle} 
                        value={data.size8x10 || ''} 
                        onChange={(e) => handleChange('size8x10', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>14 X 14(*)</label>
                    <input 
                        type="text" 
                        style={inputStyle} 
                        value={data.size14x14 || ''} 
                        onChange={(e) => handleChange('size14x14', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>14 X 17(*)</label>
                    <input 
                        type="text" 
                        style={inputStyle} 
                        value={data.size14x17 || ''} 
                        onChange={(e) => handleChange('size14x17', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>18 X 24(*)</label>
                    <input 
                        type="text" 
                        style={inputStyle} 
                        value={data.size18x24 || ''} 
                        onChange={(e) => handleChange('size18x24', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>ODONT(*)</label>
                    <input 
                        type="text" 
                        style={inputStyle} 
                        value={data.odont || ''} 
                        onChange={(e) => handleChange('odont', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>PLACAS DAÑADAS(*)</label>
                    <input 
                        type="text" 
                        style={inputStyle} 
                        value={data.damagedPlates || ''} 
                        onChange={(e) => handleChange('damagedPlates', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
            </div>

            <div>
                <label style={labelStyle}>Con medio de contraste(*)</label>
                <div style={{ display: 'flex', gap: '32px', marginTop: '8px' }}>
                    {['SI', 'NO'].map(opt => (
                        <label key={opt} style={radioItemStyle}>
                            <input 
                                type="radio" 
                                name="contrast" 
                                checked={data.withContrast === opt}
                                onClick={() => handleToggle('withContrast', opt)}
                                onChange={() => {}}
                                disabled={readOnly}
                                style={{ accentColor: '#22c55e' }}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GeneralImagingExtraDataForm;
