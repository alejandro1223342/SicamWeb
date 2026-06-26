import { useState, useEffect } from 'react';
import api from '../../api';

export interface VaccinesData {
    selected: string[];
    details: string;
}

interface Props {
    data: VaccinesData | string[];
    onChange: (data: VaccinesData) => void;
    readOnly?: boolean;
}

export default function CabinRecentVaccinesForm({ data, onChange, readOnly = false }: Props) {
    const [options, setOptions] = useState<{ id: string, name: string }[]>([]);
    const [loading, setLoading] = useState(true);

    const normalizedData: VaccinesData = Array.isArray(data) 
        ? { selected: data, details: '' }
        : { selected: data?.selected || [], details: data?.details || '' };

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await api.get('/catalogs/type/VACCINE');
                setOptions(response.data);
            } catch (error) {
                console.error("Error fetching vaccines options:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOptions();
    }, []);

    const toggleOption = (option: string) => {
        if (readOnly) return;
        
        if (option === 'NINGUNO') {
            onChange({ 
                ...normalizedData, 
                selected: normalizedData.selected.includes('NINGUNO') ? [] : ['NINGUNO'] 
            });
            return;
        }

        let newSelected = [...normalizedData.selected];
        if (newSelected.includes('NINGUNO')) {
            newSelected = newSelected.filter(item => item !== 'NINGUNO');
        }

        if (newSelected.includes(option)) {
            newSelected = newSelected.filter(item => item !== option);
        } else {
            newSelected.push(option);
        }
        onChange({ ...normalizedData, selected: newSelected });
    };

    return (
        <div className="section-container" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
                Vacunas recientes
            </h3>

            <label style={{ fontWeight: '500', color: '#475569', marginBottom: '16px', display: 'block' }}>
                {readOnly ? 'Registradas:' : 'Seleccione(*)'}
            </label>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                {loading ? (
                    <div style={{ padding: '8px 16px', color: '#64748b', fontSize: '14px', fontStyle: 'italic' }}>Cargando catálogo...</div>
                ) : (
                    options.map((optItem) => {
                        const opt = optItem.name;
                        const isSelected = normalizedData.selected.includes(opt);
                        
                        if (readOnly && !isSelected) return null;

                        return (
                            <div
                                key={optItem.id}
                                onClick={() => toggleOption(opt)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: `1px solid ${isSelected ? (readOnly ? '#94a3b8' : '#3b82f6') : '#cbd5e1'}`,
                                    backgroundColor: isSelected ? (readOnly ? '#f1f5f9' : '#eff6ff') : 'white',
                                    color: isSelected ? (readOnly ? '#475569' : '#1d4ed8') : '#475569',
                                    cursor: readOnly ? 'default' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontWeight: '500',
                                    transition: 'all 0.2s ease',
                                    userSelect: 'none'
                                }}
                            >
                                <div style={{
                                    width: '18px', height: '18px', borderRadius: '4px', border: `2px solid ${isSelected ? (readOnly ? '#94a3b8' : '#3b82f6') : '#cbd5e1'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isSelected ? (readOnly ? '#94a3b8' : '#3b82f6') : 'transparent'
                                }}>
                                    {isSelected && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px' }}><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                </div>
                                {opt}
                            </div>
                        );
                    })
                )}

                {readOnly && !loading && normalizedData.selected.length === 0 && (
                    <div style={{ padding: '8px 16px', color: '#64748b', fontSize: '14px', fontStyle: 'italic' }}>Ninguna registrada.</div>
                )}
            </div>

            <div style={{ marginTop: '16px', animation: 'fadeIn 0.3s ease-in-out' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
                    Detalle de Vacunas / Observaciones:
                </label>
                <textarea
                    value={normalizedData.details}
                    onChange={(e) => onChange({ ...normalizedData, details: e.target.value })}
                    readOnly={readOnly}
                    placeholder="Especifique fechas, dosis o vacunas adicionales..."
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        minHeight: '80px',
                        outline: 'none',
                        backgroundColor: readOnly ? '#f8fafc' : 'white'
                    }}
                />
            </div>
        </div>
    );
}
