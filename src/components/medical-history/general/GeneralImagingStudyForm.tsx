import React from 'react';

interface StudyData {
    service: string;
    room: string;
    bed: string;
    priority: string;
    collectionDate: string;
    studyType: string;
    description: string;
    mobilityState: string;
}

interface GeneralImagingStudyFormProps {
    data: StudyData;
    onChange: (data: StudyData) => void;
    readOnly?: boolean;
}

const GeneralImagingStudyForm: React.FC<GeneralImagingStudyFormProps> = ({ data, onChange, readOnly }) => {
    const handleChange = (field: keyof StudyData, value: string) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const handleToggle = (field: keyof StudyData, value: string) => {
        if (readOnly) return;
        if (data[field] === value) {
            handleChange(field, '');
        } else {
            handleChange(field, value);
        }
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

    const labelStyle = {
        fontSize: '12px',
        fontWeight: '700',
        color: '#475569',
        marginBottom: '6px',
        display: 'block',
        textTransform: 'uppercase' as const
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={labelStyle}>Servicio(*)</label>
                    <input 
                        type="text" 
                        placeholder="Ingrese servicio" 
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
                        placeholder="Ingrese sala" 
                        style={inputStyle}
                        value={data.room || ''}
                        onChange={(e) => handleChange('room', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Cama(*)</label>
                    <input 
                        type="text" 
                        placeholder="Ingrese cama" 
                        style={inputStyle}
                        value={data.bed || ''}
                        onChange={(e) => handleChange('bed', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
            </div>

            <div>
                <label style={labelStyle}>Prioridad(*)</label>
                <div style={radioGroupStyle}>
                    {['URGENTE', 'NORMAL', 'CONTROL'].map(p => (
                        <label key={p} style={radioItemStyle}>
                            <input 
                                type="radio" 
                                name="priority" 
                                checked={data.priority === p}
                                onClick={() => handleToggle('priority', p)}
                                onChange={() => {}} // React requires onChange for checked
                                disabled={readOnly}
                                style={{ accentColor: '#3b82f6' }}
                            />
                            {p}
                        </label>
                    ))}
                </div>
            </div>

            <div style={{ width: '300px' }}>
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
                <div style={radioGroupStyle}>
                    {['R-X CONVENCIONAL', 'TOMOGRAFIA', 'RESONANCIA', 'ECOGRAFIA', 'PROCEDIMIENTOS', 'OTROS'].map(s => (
                        <label key={s} style={radioItemStyle}>
                            <input 
                                type="radio" 
                                name="studyType" 
                                checked={data.studyType === s}
                                onClick={() => handleToggle('studyType', s)}
                                onChange={() => {}} 
                                disabled={readOnly}
                                style={{ accentColor: '#3b82f6' }}
                            />
                            {s}
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label style={labelStyle}>Describir(*)</label>
                <textarea 
                    placeholder="Describa detalladamente el estudio solicitado, la región anatómica y cualquier observación técnica necesaria..." 
                    style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                    value={data.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    disabled={readOnly}
                />
            </div>

            <div>
                <label style={labelStyle}>Seleccione movilidad(*)</label>
                <div style={{ ...radioGroupStyle, flexDirection: 'column', gap: '12px' }}>
                    {[
                        'PUEDE MOVILIZARSE', 
                        'PUEDE RETIRARSE VENDAS, APOSITOS O YESOS', 
                        'EL MEDICO ESTARÁ PRESENTE EN EL EXAMEN', 
                        'TOMA DE RADIOGRAFÍA EN LA CAMA'
                    ].map(m => (
                        <label key={m} style={radioItemStyle}>
                            <input 
                                type="radio" 
                                name="mobilityState" 
                                checked={data.mobilityState === m}
                                onClick={() => handleToggle('mobilityState', m)}
                                onChange={() => {}} 
                                disabled={readOnly}
                                style={{ accentColor: '#3b82f6' }}
                            />
                            {m}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GeneralImagingStudyForm;
