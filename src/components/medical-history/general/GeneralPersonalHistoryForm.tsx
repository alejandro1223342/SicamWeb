import React from 'react';
import { ClipboardList, Activity } from 'lucide-react';

interface PersonalHistoryData {
    description: string;
    datos: {
        menarquiaEdad: string;
        menopausiaEdad: string;
        ciclos: string;
        vidaSexualActiva: boolean | null;
        gesta: string;
        partos: string;
        abortos: string;
        cesareas: string;
        hijosVivos: string;
        fum: string;
        fup: string;
        fuc: string;
        biopsia: boolean | null;
        terapiaHormonal: boolean | null;
        colposcopia: boolean | null;
        mamografia: boolean | null;
        metodoPlanificacion: string;
    }
}

interface GeneralPersonalHistoryFormProps {
    data: PersonalHistoryData | string;
    onChange: (data: PersonalHistoryData) => void;
    readOnly?: boolean;
}

export default function GeneralPersonalHistoryForm({ data, onChange, readOnly = false }: GeneralPersonalHistoryFormProps) {
    // Handle legacy string data if exists
    const safeData: PersonalHistoryData = typeof data === 'string' 
        ? { description: data, datos: { menarquiaEdad: '', menopausiaEdad: '', ciclos: '', vidaSexualActiva: null, gesta: '', partos: '', abortos: '', cesareas: '', hijosVivos: '', fum: '', fup: '', fuc: '', biopsia: null, terapiaHormonal: null, colposcopia: null, mamografia: null, metodoPlanificacion: '' } }
        : data || { description: '', datos: { menarquiaEdad: '', menopausiaEdad: '', ciclos: '', vidaSexualActiva: null, gesta: '', partos: '', abortos: '', cesareas: '', hijosVivos: '', fum: '', fup: '', fuc: '', biopsia: null, terapiaHormonal: null, colposcopia: null, mamografia: null, metodoPlanificacion: '' } };

    const handleUpdateDatos = (field: keyof PersonalHistoryData['datos'], value: any) => {
        if (readOnly) return;
        onChange({
            ...safeData,
            datos: { ...safeData.datos, [field]: value }
        });
    };

    const handleNumericUpdate = (field: keyof PersonalHistoryData['datos'], value: string) => {
        if (readOnly) return;
        // Allow only digits
        const cleanValue = value.replace(/\D/g, '');
        handleUpdateDatos(field, cleanValue);
    };

    const handleUpdateDescription = (val: string) => {
        if (readOnly) return;
        onChange({ ...safeData, description: val });
    };

    const categories = [
        "1.VACUNAS", "2.ENF. PERINATAL", "3.ENF. INFANCIA", "4.ENF. ADOLESCENCIA",
        "5.ENF ALERGICA", "6.ENF. CARDIACA", "7.ENF. RESPIRATORIA", "8.ENF. DIGESTIVA",
        "9.ENF NEUROLOGICA", "10.ENF. METABOLICA", "11.ENF. HEMOLINF", "12.ENF. URINARIA",
        "13.ENF TRAUMATICA", "14.ENF. QUIRURGICA", "15.ENF. MENTAL", "16.ENF. TRANSM.SEX",
        "17.TENDENCIA SEXUAL", "18.RIESGO SOCIAL", "19.RIESGO LABORAL", "20.RIESGO FAMILIAR",
        "21.ACTIVIDAD FISICA", "22.DIETA Y HABITOS", "23.RELIGION Y CULTURA", "24.OTRO"
    ];

    const inputStyle: React.CSSProperties = {
        padding: '10px 14px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        width: '100%',
        backgroundColor: readOnly ? '#f8fafc' : 'white',
        transition: 'border-color 0.2s'
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '11px',
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        marginBottom: '4px',
        display: 'block'
    };

    const renderRadioGroup = (label: string, field: keyof PersonalHistoryData['datos']) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={labelStyle}>{label}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    onClick={() => handleUpdateDatos(field, true)}
                    style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: safeData.datos[field] === true ? '#3b82f6' : '#e2e8f0',
                        backgroundColor: safeData.datos[field] === true ? '#eff6ff' : 'white',
                        color: safeData.datos[field] === true ? '#1d4ed8' : '#64748b',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: readOnly ? 'default' : 'pointer'
                    }}
                >
                    Si
                </button>
                <button
                    onClick={() => handleUpdateDatos(field, false)}
                    style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: safeData.datos[field] === false ? '#ef4444' : '#e2e8f0',
                        backgroundColor: safeData.datos[field] === false ? '#fef2f2' : 'white',
                        color: safeData.datos[field] === false ? '#b91c1c' : '#64748b',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: readOnly ? 'default' : 'pointer'
                    }}
                >
                    No
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Guide Section */}
            <div style={{ backgroundColor: '#fcfcfc', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ClipboardList size={16} color="#3b82f6" /> Describir abajo anotando el número correspondiente
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {categories.map((cat, idx) => (
                        <div key={idx} style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8' }}>{cat}</div>
                    ))}
                </div>
            </div>

            {/* Description Area */}
            <textarea
                style={{ 
                    ...inputStyle, 
                    minHeight: '120px', 
                    fontSize: '15px', 
                    lineHeight: '1.6', 
                    resize: 'vertical'
                }}
                value={safeData.description}
                onChange={(e) => handleUpdateDescription(e.target.value)}
                placeholder="Ingrese el numero, más la descripción..."
                disabled={readOnly}
            />

            {/* Datos Section */}
            <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={18} color="#10b981" /> Datos
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={labelStyle}>MENARQUIA EDAD</span>
                        <input type="text" style={inputStyle} value={safeData.datos.menarquiaEdad} onChange={e => handleNumericUpdate('menarquiaEdad', e.target.value)} disabled={readOnly} placeholder="Ej: 12" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={labelStyle}>MENOPAUSIA EDAD</span>
                        <input type="text" style={inputStyle} value={safeData.datos.menopausiaEdad} onChange={e => handleNumericUpdate('menopausiaEdad', e.target.value)} disabled={readOnly} placeholder="Ej: 48" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={labelStyle}>CICLOS</span>
                        <input type="text" style={inputStyle} value={safeData.datos.ciclos} onChange={e => handleNumericUpdate('ciclos', e.target.value)} disabled={readOnly} placeholder="Ej: 28" />
                    </div>
                    {renderRadioGroup("VIDA SEXUAL ACT.", "vidaSexualActiva")}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={labelStyle}>GESTA</span>
                        <input type="text" style={inputStyle} value={safeData.datos.gesta} onChange={e => handleNumericUpdate('gesta', e.target.value)} disabled={readOnly} placeholder="0" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={labelStyle}>PARTOS</span>
                        <input type="text" style={inputStyle} value={safeData.datos.partos} onChange={e => handleNumericUpdate('partos', e.target.value)} disabled={readOnly} placeholder="0" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={labelStyle}>ABORTOS</span>
                        <input type="text" style={inputStyle} value={safeData.datos.abortos} onChange={e => handleNumericUpdate('abortos', e.target.value)} disabled={readOnly} placeholder="0" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={labelStyle}>CESAREAS</span>
                        <input type="text" style={inputStyle} value={safeData.datos.cesareas} onChange={e => handleNumericUpdate('cesareas', e.target.value)} disabled={readOnly} placeholder="0" />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={labelStyle}>HIJOS VIVOS</span>
                        <input type="text" style={inputStyle} value={safeData.datos.hijosVivos} onChange={e => handleNumericUpdate('hijosVivos', e.target.value)} disabled={readOnly} placeholder="0" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={labelStyle}>FUM</span>
                        <input type="date" style={inputStyle} value={safeData.datos.fum} onChange={e => handleUpdateDatos('fum', e.target.value)} disabled={readOnly} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={labelStyle}>FUP</span>
                        <input type="date" style={inputStyle} value={safeData.datos.fup} onChange={e => handleUpdateDatos('fup', e.target.value)} disabled={readOnly} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={labelStyle}>FUC</span>
                        <input type="date" style={inputStyle} value={safeData.datos.fuc} onChange={e => handleUpdateDatos('fuc', e.target.value)} disabled={readOnly} />
                    </div>

                    {renderRadioGroup("BIOPSIA", "biopsia")}
                    {renderRadioGroup("TERAPIA HORMONAL", "terapiaHormonal")}
                    {renderRadioGroup("COLPOSCOPIA", "colposcopia")}
                    {renderRadioGroup("MAMOGRAFIA", "mamografia")}
                </div>

                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={labelStyle}>METODO DE P. FAMILIAR</span>
                    <textarea 
                        style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} 
                        value={safeData.datos.metodoPlanificacion} 
                        onChange={e => handleUpdateDatos('metodoPlanificacion', e.target.value)} 
                        disabled={readOnly} 
                        placeholder="Ej: Anticonceptivos orales, preservativos..."
                    />
                </div>
            </div>
        </div>
    );
}
