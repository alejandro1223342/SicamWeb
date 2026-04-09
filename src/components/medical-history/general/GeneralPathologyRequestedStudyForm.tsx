import React from 'react';

interface RequestedStudyData {
    service: string;
    room: string;
    bed: string;
    collectionDate: string;
    priority: string;
    studyType: string;
    otherStudyDetails: string;
}

interface GeneralPathologyRequestedStudyFormProps {
    data: RequestedStudyData;
    onChange: (data: RequestedStudyData) => void;
    readOnly?: boolean;
}

const GeneralPathologyRequestedStudyForm: React.FC<GeneralPathologyRequestedStudyFormProps> = ({ data, onChange, readOnly }) => {
    const handleChange = (field: keyof RequestedStudyData, value: string) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const handleToggle = (field: keyof RequestedStudyData, value: string) => {
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
            {/* Row 1: Servicio and Sala */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div>
                    <label style={labelStyle}>Servicio(*)</label>
                    <input 
                        type="text" 
                        placeholder="Ej. Medicina Interna, Cirugía..." 
                        style={inputStyle}
                        value={data.service || ''}
                        onChange={(e) => handleChange('service', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Sala(*)</label>
                    <input 
                        type="text" 
                        placeholder="Ej. Sala A, Unidad 4..." 
                        style={inputStyle}
                        value={data.room || ''}
                        onChange={(e) => handleChange('room', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
            </div>

            {/* Row 2: Cama and Prioridad */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div>
                    <label style={labelStyle}>Cama(*)</label>
                    <input 
                        type="text" 
                        placeholder="Ej. 102, C-05..." 
                        style={inputStyle}
                        value={data.bed || ''}
                        onChange={(e) => handleChange('bed', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Prioridad(*)</label>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                        {['URGENTE', 'NORMAL', 'CONTROL'].map(opt => (
                            <label key={opt} style={radioItemStyle}>
                                <input 
                                    type="radio" 
                                    name="priority" 
                                    checked={data.priority === opt}
                                    onClick={() => handleToggle('priority', opt)}
                                    onChange={() => {}}
                                    disabled={readOnly}
                                    style={{ accentColor: '#6366f1', cursor: 'pointer' }}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Row 3: Fecha and Tipo de Estudio */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div>
                    <label style={labelStyle}>Fecha toma(*)</label>
                    <input 
                        type="date" 
                        style={inputStyle}
                        value={data.collectionDate || ''}
                        onChange={(e) => handleChange('collectionDate', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Seleccione(*)</label>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '10px', flexWrap: 'wrap' }}>
                        {['HISTOPATOLOGIA', 'CITOLOGIA', 'OTRO'].map(opt => (
                            <label key={opt} style={radioItemStyle}>
                                <input 
                                    type="radio" 
                                    name="studyType" 
                                    checked={data.studyType === opt}
                                    onClick={() => handleToggle('studyType', opt)}
                                    onChange={() => {}}
                                    disabled={readOnly}
                                    style={{ accentColor: '#6366f1', cursor: 'pointer' }}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {data.studyType === 'OTRO' && (
                <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                    <label style={labelStyle}>Especifique el estudio solicitado(*)</label>
                    <textarea 
                        placeholder="Describa el estudio requerido..."
                        style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                        value={data.otherStudyDetails || ''}
                        onChange={(e) => handleChange('otherStudyDetails', e.target.value)}
                        disabled={readOnly}
                        onFocus={(e) => !readOnly && (e.target.style.borderColor = '#6366f1')}
                        onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                    />
                </div>
            )}
        </div>
    );
};

export default GeneralPathologyRequestedStudyForm;
