import { useState, useEffect } from 'react';
import api from '../../../api';

interface PainEntry {
    id: string;
    region: string;
    point: string;
    evolution: string;
    type: string;
    modifications: string;
    relievedBy: string;
    intensity: string;
}

interface GeneralEmergencyPainFormProps {
    data: PainEntry[];
    onChange: (data: PainEntry[]) => void;
    readOnly?: boolean;
}

export default function GeneralEmergencyPainForm({ data = [], onChange, readOnly = false }: GeneralEmergencyPainFormProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [intensityOptions, setIntensityOptions] = useState<string[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [currentEntry, setCurrentEntry] = useState<Partial<PainEntry>>({
        region: '',
        point: '',
        evolution: '',
        type: '',
        modifications: '',
        relievedBy: '',
        intensity: ''
    });

    useEffect(() => {
        const fetchIntensities = async () => {
            setLoadingOptions(true);
            try {
                const response = await api.get('/catalogs/type/PAIN_INTENSITY');

                if (Array.isArray(response.data)) {
                    setIntensityOptions(response.data.map((item: any) => item.name));
                } else {
                    console.warn("PAIN_INTENSITY Response is not an array:", response.data);
                }
            } catch (err) {
                console.error("Error fetching intensities:", err);
            } finally {
                setLoadingOptions(false);
            }
        };
        fetchIntensities();
    }, []);

    const safeData = Array.isArray(data) ? data : [];

    const handleSave = () => {
        if (!currentEntry.region || !currentEntry.point) return;
        
        const newEntry: PainEntry = {
            id: Date.now().toString(),
            region: currentEntry.region || '',
            point: currentEntry.point || '',
            evolution: currentEntry.evolution || '',
            type: currentEntry.type || '',
            modifications: currentEntry.modifications || '',
            relievedBy: currentEntry.relievedBy || '',
            intensity: currentEntry.intensity || ''
        };

        onChange([...safeData, newEntry]);
        setIsAdding(false);
        setCurrentEntry({
            region: '', point: '', evolution: '', type: '', 
            modifications: '', relievedBy: '', intensity: ''
        });
    };

    const handleDelete = (id: string) => {
        if (readOnly) return;
        onChange(safeData.filter(e => e.id !== id));
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1.5px solid #e2e8f0',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s'
    };

    const labelStyle = {
        fontSize: '12px',
        fontWeight: '700',
        color: '#475569',
        marginBottom: '6px',
        display: 'block',
        textTransform: 'uppercase' as const
    };

    const getButtonStyle = (isSelected: boolean) => ({
        flex: 1,
        padding: '8px',
        borderRadius: '6px',
        border: '1.5px solid',
        fontWeight: '700',
        fontSize: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: isSelected ? '#fef2f2' : 'white',
        borderColor: isSelected ? '#ef4444' : '#e2e8f0',
        color: isSelected ? '#ef4444' : '#64748b'
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: '#64748b', fontSize: '14px' }}>
                    Registro detallado de los caracteres del dolor referidos por el paciente
                </p>
                {!readOnly && !isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        style={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            fontWeight: '700',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)'
                        }}
                    >
                        <span>+</span> AGREGAR DATOS
                    </button>
                )}
            </div>

            {isAdding && (
                <div style={{ 
                    backgroundColor: 'white', 
                    padding: '24px', 
                    borderRadius: '16px', 
                    border: '2px solid #ef4444',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}>
                    <h4 style={{ margin: 0, color: '#ef4444', fontSize: '16px', fontWeight: '800' }}>NUEVO REGISTRO DE DOLOR</h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={labelStyle}>Región anatómica(*)</label>
                            <input 
                                type="text" placeholder="Ej: Abdomen, Tórax..." style={inputStyle}
                                value={currentEntry.region} onChange={e => setCurrentEntry({...currentEntry, region: e.target.value})}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Punto de dolor(*)</label>
                            <input 
                                type="text" placeholder="Ej: Epigastrio, Mesogastrio..." style={inputStyle}
                                value={currentEntry.point} onChange={e => setCurrentEntry({...currentEntry, point: e.target.value})}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Evolución(*)</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {['AGUDO', 'SUB AGUDO', 'CRÓNICO'].map(opt => (
                                    <button key={opt} onClick={() => setCurrentEntry({...currentEntry, evolution: opt})} style={getButtonStyle(currentEntry.evolution === opt)}>{opt}</button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Tipo de dolor(*)</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {['EPISÓDICO', 'CONTINUO', 'CÓLICO'].map(opt => (
                                    <button key={opt} onClick={() => setCurrentEntry({...currentEntry, type: opt})} style={getButtonStyle(currentEntry.type === opt)}>{opt}</button>
                                ))}
                            </div>
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={labelStyle}>Modificaciones (Se presenta con:)(*)</label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {['POSICIÓN', 'INGESTA', 'ESFUERZO', 'DIGESTIÓN PRESIÓN', 'SE IRRADIA'].map(opt => (
                                    <button key={opt} onClick={() => setCurrentEntry({...currentEntry, modifications: opt})} style={getButtonStyle(currentEntry.modifications === opt)}>{opt}</button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Alivia con(*)</label>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                {['ANTIESPASMÓDICO', 'OPIÁCEO', 'AINE', 'NO ALIVIA', 'OTRO'].map(opt => (
                                    <button key={opt} onClick={() => setCurrentEntry({...currentEntry, relievedBy: opt})} style={{...getButtonStyle(currentEntry.relievedBy === opt), fontSize: '10px'}}>{opt}</button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Intensidad(*)</label>
                            <select 
                                style={inputStyle} 
                                value={currentEntry.intensity} 
                                onChange={e => setCurrentEntry({...currentEntry, intensity: e.target.value})}
                                disabled={loadingOptions}
                            >
                                <option value="">{loadingOptions ? 'Cargando...' : 'Seleccione intensidad'}</option>
                                {intensityOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                        <button onClick={() => setIsAdding(false)} style={{ padding: '10px 20px', border: 'none', background: 'none', color: '#64748b', fontWeight: '700', cursor: 'pointer' }}>CANCELAR</button>
                        <button 
                            onClick={handleSave}
                            style={{ 
                                padding: '10px 30px', 
                                backgroundColor: '#ef4444', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '10px', 
                                fontWeight: '700', 
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)'
                            }}
                        >
                            GUARDAR REGISTRO
                        </button>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {safeData.length === 0 ? (
                    <div style={{ 
                        padding: '40px', 
                        textAlign: 'center', 
                        backgroundColor: '#f8fafc', 
                        borderRadius: '16px', 
                        border: '2px dashed #e2e8f0',
                        color: '#94a3b8'
                    }}>
                        No hay registros de dolor guardados. Haga clic en "+ AGREGAR DATOS" para iniciar.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                        {safeData.map((entry) => (
                            <div key={entry.id} style={{ 
                                backgroundColor: 'white', 
                                padding: '20px', 
                                borderRadius: '16px', 
                                border: '1.5px solid #e2e8f0',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                transition: 'all 0.2s',
                                hover: {
                                    borderColor: '#ef4444',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
                                }
                            } as any}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h5 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>{entry.region}</h5>
                                    {!readOnly && (
                                        <button 
                                            onClick={() => handleDelete(entry.id)}
                                            style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', padding: '4px', fontSize: '18px' }}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}><strong>Punto:</strong> {entry.point}</p>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: '700' }}>{entry.evolution}</span>
                                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: '700' }}>{entry.type}</span>
                                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#fff1f2', color: '#e11d48', fontWeight: '800' }}>INTENSIDAD: {entry.intensity}</span>
                                </div>
                                <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '12px' }}>
                                    <div style={{ color: '#64748b', marginBottom: '2px' }}><strong>Modifica:</strong> {entry.modifications}</div>
                                    <div style={{ color: '#64748b' }}><strong>Alivia:</strong> {entry.relievedBy}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
