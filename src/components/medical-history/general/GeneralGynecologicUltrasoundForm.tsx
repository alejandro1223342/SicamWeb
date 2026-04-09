import React from 'react';

interface GynecologicData {
    uterus: string;
    annexes: string;
    uterineCavity: string;
    douglasPouch: string;
}

interface GeneralGynecologicUltrasoundFormProps {
    data: GynecologicData;
    onChange: (data: GynecologicData) => void;
    readOnly?: boolean;
}

const GeneralGynecologicUltrasoundForm: React.FC<GeneralGynecologicUltrasoundFormProps> = ({ data, onChange, readOnly }) => {
    const handleChange = (field: keyof GynecologicData, value: string) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const handleToggle = (field: keyof GynecologicData, value: string) => {
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
        marginBottom: '12px',
        display: 'block',
        textTransform: 'uppercase' as const
    };

    const radioGroupStyle = {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '24px',
        marginBottom: '24px'
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Uterus Section */}
            <div>
                <label style={labelStyle}>Utero(*)</label>
                <div style={radioGroupStyle}>
                    {['ANTEVERSION', 'RETROVERSION', 'DIU', 'FIBROMA', 'MIOMA', 'AUSENTE'].map(opt => (
                        <label key={opt} style={radioItemStyle}>
                            <input 
                                type="radio" 
                                name="uterus" 
                                checked={data.uterus === opt}
                                onClick={() => handleToggle('uterus', opt)}
                                onChange={() => {}}
                                disabled={readOnly}
                                style={{ accentColor: '#22c55e' }}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            </div>

            {/* Annexes Section */}
            <div>
                <label style={labelStyle}>Anexos(*)</label>
                <div style={radioGroupStyle}>
                    {['HIDROSALPIX', 'QUISTE'].map(opt => (
                        <label key={opt} style={radioItemStyle}>
                            <input 
                                type="radio" 
                                name="annexes" 
                                checked={data.annexes === opt}
                                onClick={() => handleToggle('annexes', opt)}
                                onChange={() => {}}
                                disabled={readOnly}
                                style={{ accentColor: '#22c55e' }}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            </div>

            {/* Uterine Cavity Section */}
            <div>
                <label style={labelStyle}>Cavidad uterina(*)</label>
                <div style={radioGroupStyle}>
                    {['VACIA', 'OCUPADA'].map(opt => (
                        <label key={opt} style={radioItemStyle}>
                            <input 
                                type="radio" 
                                name="uterineCavity" 
                                checked={data.uterineCavity === opt}
                                onClick={() => handleToggle('uterineCavity', opt)}
                                onChange={() => {}}
                                disabled={readOnly}
                                style={{ accentColor: '#22c55e' }}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            </div>

            {/* Douglas Pouch Section */}
            <div>
                <label style={labelStyle}>Fondo de saco de douglas(*)</label>
                <input 
                    type="text" 
                    placeholder="Ingres el fondo de saco de douglas." 
                    style={inputStyle}
                    value={data.douglasPouch || ''}
                    onChange={(e) => handleChange('douglasPouch', e.target.value)}
                    disabled={readOnly}
                    onFocus={(e) => !readOnly && (e.target.style.borderColor = '#22c55e')}
                    onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                />
            </div>
        </div>
    );
};

export default GeneralGynecologicUltrasoundForm;
