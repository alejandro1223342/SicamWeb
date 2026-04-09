import React from 'react';

interface CytologyData {
    material: string;
    contraception: string;
    hormonalTherapy: string;
    ages: {
        menarche: string;
        menopause: string;
        sexualDebut: string;
    };
    parity: {
        gestations: string;
        births: string;
        abortions: string;
        cesareans: string;
    };
    dates: {
        lastMenstruation: string;
        lastBirth: string;
        lastCytology: string;
    };
    description: string;
}

interface GeneralVaginalCytologyFormProps {
    data: CytologyData;
    onChange: (data: CytologyData) => void;
    readOnly?: boolean;
}

const GeneralVaginalCytologyForm: React.FC<GeneralVaginalCytologyFormProps> = ({ data, onChange, readOnly }) => {
    const handleChange = (field: string, value: any) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const handleNestedChange = (parent: keyof CytologyData, field: string, value: string) => {
        if (readOnly) return;
        
        // Prevent negative numbers for numerical fields
        if (parent === 'ages' || parent === 'parity') {
            const numValue = parseInt(value);
            if (!isNaN(numValue) && numValue < 0) return;
        }

        const parentData = (data[parent] as any) || {};
        onChange({
            ...data,
            [parent]: { ...parentData, [field]: value }
        });
    };

    const handleToggle = (field: keyof CytologyData, value: string) => {
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

    const sectionHeaderStyle = {
        fontSize: '14px',
        fontWeight: '800',
        color: '#1e293b',
        borderBottom: '1.5px solid #f1f5f9',
        paddingBottom: '8px',
        marginBottom: '16px'
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

    const radioGroupStyle = {
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap' as const,
        marginTop: '8px'
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Section: Material */}
            <div>
                <label style={labelStyle}>Material(*)</label>
                <div style={radioGroupStyle}>
                    {['ENDOCERVIX', 'ECOCERVIX', 'PARED VAGINAL', 'UNIÓN ESCAMO COLUMNAR', 'MUÑÓN CERVICAL', 'OTRO'].map(opt => (
                        <label key={opt} style={radioItemStyle}>
                            <input 
                                type="radio" 
                                checked={data.material === opt}
                                onClick={() => handleToggle('material', opt)}
                                onChange={() => {}}
                                disabled={readOnly}
                                style={{ accentColor: '#6366f1' }}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            </div>

            {/* Section: Anticoncepción */}
            <div>
                <label style={labelStyle}>Anticoncepción(*)</label>
                <div style={radioGroupStyle}>
                    {['ORAL O INYECTABLE', 'DIU', 'LIGADURA', 'OTRO'].map(opt => (
                        <label key={opt} style={radioItemStyle}>
                            <input 
                                type="radio" 
                                checked={data.contraception === opt}
                                onClick={() => handleToggle('contraception', opt)}
                                onChange={() => {}}
                                disabled={readOnly}
                                style={{ accentColor: '#6366f1' }}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            </div>

            {/* Section: Terapia Hormonal */}
            <div>
                <label style={labelStyle}>Terapia Hormonal(*)</label>
                <div style={radioGroupStyle}>
                    {['SI', 'NO'].map(opt => (
                        <label key={opt} style={radioItemStyle}>
                            <input 
                                type="radio" 
                                checked={data.hormonalTherapy === opt}
                                onClick={() => handleToggle('hormonalTherapy', opt)}
                                onChange={() => {}}
                                disabled={readOnly}
                                style={{ accentColor: '#6366f1' }}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            </div>

            {/* Section: Edades */}
            <div>
                <h4 style={sectionHeaderStyle}>Edades de(*)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    <div>
                        <label style={{ ...labelStyle, textTransform: 'none' }}>Menarquia</label>
                        <input 
                            type="number" 
                            min={0}
                            placeholder="Ej. 12"
                            style={inputStyle}
                            value={data.ages?.menarche || ''}
                            onChange={(e) => handleNestedChange('ages', 'menarche', e.target.value)}
                            disabled={readOnly}
                        />
                    </div>
                    <div>
                        <label style={{ ...labelStyle, textTransform: 'none' }}>Menopausia</label>
                        <input 
                            type="number" 
                            min={0}
                            placeholder="Ej. 45"
                            style={inputStyle}
                            value={data.ages?.menopause || ''}
                            onChange={(e) => handleNestedChange('ages', 'menopause', e.target.value)}
                            disabled={readOnly}
                        />
                    </div>
                    <div>
                        <label style={{ ...labelStyle, textTransform: 'none' }}>Inicio de relaciones sexuales</label>
                        <input 
                            type="number" 
                            min={0}
                            placeholder="Ej. 18"
                            style={inputStyle}
                            value={data.ages?.sexualDebut || ''}
                            onChange={(e) => handleNestedChange('ages', 'sexualDebut', e.target.value)}
                            disabled={readOnly}
                        />
                    </div>
                </div>
            </div>

            {/* Section: Paridad */}
            <div>
                <h4 style={sectionHeaderStyle}>Paridad(*)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                    <div>
                        <label style={{ ...labelStyle, textTransform: 'none' }}>Gestaciones</label>
                        <input 
                            type="number" 
                            min={0}
                            style={inputStyle}
                            placeholder="Ej. 1"
                            value={data.parity?.gestations || ''}
                            onChange={(e) => handleNestedChange('parity', 'gestations', e.target.value)}
                            disabled={readOnly}
                        />
                    </div>
                    <div>
                        <label style={{ ...labelStyle, textTransform: 'none' }}>Partos</label>
                        <input 
                            type="number" 
                            min={0}
                            style={inputStyle}
                            placeholder="Ej. 1"
                            value={data.parity?.births || ''}
                            onChange={(e) => handleNestedChange('parity', 'births', e.target.value)}
                            disabled={readOnly}
                        />
                    </div>
                    <div>
                        <label style={{ ...labelStyle, textTransform: 'none' }}>Abortos</label>
                        <input 
                            type="number" 
                            min={0}
                            style={inputStyle}
                            placeholder="Ej. 0"
                            value={data.parity?.abortions || ''}
                            onChange={(e) => handleNestedChange('parity', 'abortions', e.target.value)}
                            disabled={readOnly}
                        />
                    </div>
                    <div>
                        <label style={{ ...labelStyle, textTransform: 'none' }}>Cesáreas</label>
                        <input 
                            type="number" 
                            min={0}
                            style={inputStyle}
                            placeholder="Ej. 0"
                            value={data.parity?.cesareans || ''}
                            onChange={(e) => handleNestedChange('parity', 'cesareans', e.target.value)}
                            disabled={readOnly}
                        />
                    </div>
                </div>
            </div>

            {/* Section: Fechas */}
            <div>
                <h4 style={sectionHeaderStyle}>Fechas(*)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    <div>
                        <label style={{ ...labelStyle, textTransform: 'none' }}>Última menstruación</label>
                        <input 
                            type="date" 
                            style={inputStyle}
                            value={data.dates?.lastMenstruation || ''}
                            onChange={(e) => handleNestedChange('dates', 'lastMenstruation', e.target.value)}
                            disabled={readOnly}
                        />
                    </div>
                    <div>
                        <label style={{ ...labelStyle, textTransform: 'none' }}>Último parto</label>
                        <input 
                            type="date" 
                            style={inputStyle}
                            value={data.dates?.lastBirth || ''}
                            onChange={(e) => handleNestedChange('dates', 'lastBirth', e.target.value)}
                            disabled={readOnly}
                        />
                    </div>
                    <div>
                        <label style={{ ...labelStyle, textTransform: 'none' }}>Última citología</label>
                        <input 
                            type="date" 
                            style={inputStyle}
                            value={data.dates?.lastCytology || ''}
                            onChange={(e) => handleNestedChange('dates', 'lastCytology', e.target.value)}
                            disabled={readOnly}
                        />
                    </div>
                </div>
            </div>

            {/* Section: Descripción */}
            <div>
                <label style={labelStyle}>Descripción</label>
                <textarea 
                    placeholder="Ingrese la descripción en caso de haberla"
                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
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

export default GeneralVaginalCytologyForm;
