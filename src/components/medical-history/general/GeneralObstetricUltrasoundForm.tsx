import React from 'react';

interface Measurement {
    value: string;
    age: string;
    weight: string;
}

interface ObstetricData {
    biparietalDiameter: Measurement;
    femurLength: Measurement;
    abdominalPerimeter: Measurement;
    placentaLocation: string;
    fetusGender: string;
    maturityGrade: string;
}

interface GeneralObstetricUltrasoundFormProps {
    data: ObstetricData;
    onChange: (data: ObstetricData) => void;
    readOnly?: boolean;
}

const GeneralObstetricUltrasoundForm: React.FC<GeneralObstetricUltrasoundFormProps> = ({ data, onChange, readOnly }) => {
    const handleChange = (field: keyof ObstetricData, value: any) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const handleMeasurementChange = (measurement: keyof ObstetricData, field: keyof Measurement, value: string) => {
        if (readOnly) return;
        const current = data[measurement] as Measurement;
        onChange({
            ...data,
            [measurement]: { ...current, [field]: value }
        });
    };

    const handleToggle = (field: keyof ObstetricData, value: string) => {
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

    const headerStyle = {
        fontSize: '12px',
        fontWeight: '700',
        color: '#475569',
        padding: '12px',
        textAlign: 'left' as const,
        textTransform: 'uppercase' as const
    };

    const cellStyle = {
        padding: '8px 12px'
    };

    const labelStyle = {
        fontSize: '12px',
        fontWeight: '700',
        color: '#475569',
        marginBottom: '6px',
        display: 'block',
        textTransform: 'uppercase' as const
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

    const renderRow = (label: string, field: keyof ObstetricData) => (
        <tr>
            <td style={{ ...cellStyle, fontWeight: '700', color: '#1e293b', width: '25%' }}>{label}</td>
            <td style={cellStyle}>
                <input 
                    type="text" 
                    style={inputStyle} 
                    value={(data[field] as Measurement).value} 
                    onChange={(e) => handleMeasurementChange(field as any, 'value', e.target.value)}
                    disabled={readOnly}
                />
            </td>
            <td style={cellStyle}>
                <input 
                    type="text" 
                    style={inputStyle} 
                    value={(data[field] as Measurement).age} 
                    onChange={(e) => handleMeasurementChange(field as any, 'age', e.target.value)}
                    disabled={readOnly}
                />
            </td>
            <td style={cellStyle}>
                <input 
                    type="text" 
                    style={inputStyle} 
                    value={(data[field] as Measurement).weight} 
                    onChange={(e) => handleMeasurementChange(field as any, 'weight', e.target.value)}
                    disabled={readOnly}
                />
            </td>
        </tr>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <label style={labelStyle}>Ingrese(*)</label>
                <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#f8fafc' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={headerStyle}>Medida</th>
                                <th style={headerStyle}>Valor</th>
                                <th style={headerStyle}>Edad Gest.</th>
                                <th style={headerStyle}>Peso</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderRow('Diametro Biparietal', 'biparietalDiameter')}
                            {renderRow('Logitud Femur', 'femurLength')}
                            {renderRow('Perímetro Abdominal', 'abdominalPerimeter')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <div>
                    <label style={labelStyle}>Placenta(*)</label>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                        {['FUNDICA', 'MARGINAL', 'PREVIA'].map(loc => (
                            <label key={loc} style={radioItemStyle}>
                                <input 
                                    type="radio" 
                                    name="placenta" 
                                    checked={data.placentaLocation === loc}
                                    onClick={() => handleToggle('placentaLocation', loc)}
                                    onChange={() => {}}
                                    disabled={readOnly}
                                    style={{ accentColor: '#22c55e' }}
                                />
                                {loc}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label style={labelStyle}>Seleccione(*)</label>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                        {['MASCULINO', 'FEMENINO', 'MULTIPLE'].map(gen => (
                            <label key={gen} style={radioItemStyle}>
                                <input 
                                    type="radio" 
                                    name="gender" 
                                    checked={data.fetusGender === gen}
                                    onClick={() => handleToggle('fetusGender', gen)}
                                    onChange={() => {}}
                                    disabled={readOnly}
                                    style={{ accentColor: '#22c55e' }}
                                />
                                {gen}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <label style={labelStyle}>Grado de madurez(*)</label>
                <input 
                    type="text" 
                    placeholder="Ingrese el grado de madurez" 
                    style={inputStyle}
                    value={data.maturityGrade || ''}
                    onChange={(e) => handleChange('maturityGrade', e.target.value)}
                    disabled={readOnly}
                    onFocus={(e) => !readOnly && (e.target.style.borderColor = '#22c55e')}
                    onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                />
            </div>
        </div>
    );
};

export default GeneralObstetricUltrasoundForm;
