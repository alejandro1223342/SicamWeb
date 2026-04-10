import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Trash2, Search, Edit2 } from 'lucide-react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { debounce } from '@mui/material/utils';
import api from '../../../api';
import { useToast } from '../../Toast';

interface DiagnosisItem {
    id: string;
    description: string;
    cieCode: string;
    type: 'PRE' | 'DEF';
}

interface GeneralDiagnosisFormProps {
    data: DiagnosisItem[];
    onChange: (data: DiagnosisItem[]) => void;
    readOnly?: boolean;
}

interface CieOption {
    code: string;
    description: string;
}

export default function GeneralDiagnosisForm({ data = [], onChange, readOnly = false }: GeneralDiagnosisFormProps) {
    const { showToast } = useToast();
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newItem, setNewItem] = useState<Partial<DiagnosisItem>>({
        description: '', 
        cieCode: '', 
        type: 'PRE'
    });
    
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<CieOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const fetchCieCodes = useCallback(
        debounce(async (searchValue: string) => {
            if (searchValue.length < 2) {
                setOptions([]);
                return;
            }
            setLoading(true);
            try {
                const response = await api.get('/catalogs/cie-codes', {
                    params: { search: searchValue }
                });
                setOptions(response.data);
            } catch (error) {
                console.error('Error fetching CIE codes:', error);
            } finally {
                setLoading(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        if (open) {
            fetchCieCodes(inputValue);
        }
    }, [inputValue, fetchCieCodes, open]);

    const handleAddItem = () => {
        if (!newItem.cieCode) {
            showToast('Por favor seleccione un código CIE-10 (*)', 'warning');
            return;
        }
        if (!newItem.description) {
            showToast('Por favor ingrese una descripción para el diagnóstico (*)', 'warning');
            return;
        }

        if (editingId) {
            const updatedData = data.map(item => 
                item.id === editingId 
                    ? { ...item, description: newItem.description!, cieCode: newItem.cieCode!, type: newItem.type as 'PRE' | 'DEF' } 
                    : item
            );
            onChange(updatedData);
            showToast('Diagnóstico actualizado', 'success');
        } else {
            const result: DiagnosisItem = {
                id: Date.now().toString(),
                description: newItem.description!,
                cieCode: newItem.cieCode!,
                type: newItem.type as 'PRE' | 'DEF'
            };
            onChange([...data, result]);
        }

        setNewItem({ description: '', cieCode: '', type: 'PRE' });
        setEditingId(null);
        setInputValue('');
        setShowModal(false);
    };

    const handleEdit = (item: DiagnosisItem) => {
        if (readOnly) return;
        setNewItem({ description: item.description, cieCode: item.cieCode, type: item.type });
        setEditingId(item.id);
        setInputValue(item.cieCode);
        setShowModal(true);
    };

    const handleRemove = (id: string) => {
        if (readOnly) return;
        onChange(data.filter(item => item.id !== id));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#9d174d', margin: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '10px' }}>▼</span> 08-Diagnóstico
                </h3>
                {!readOnly && (
                    <button
                        onClick={() => {
                            setNewItem({ description: '', cieCode: '', type: 'PRE' });
                            setEditingId(null);
                            setShowModal(true);
                        }}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            backgroundColor: 'white', 
                            color: '#10b981', 
                            border: '1px solid #10b981', 
                            padding: '8px 16px', 
                            borderRadius: '8px', 
                            fontWeight: '600', 
                            fontSize: '14px',
                            cursor: 'pointer', 
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#f0fdf4'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}
                    >
                        Ingresar diagnóstico <Plus size={18} />
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.length === 0 ? (
                    <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                        No hay diagnósticos registrados.
                    </div>
                ) : (
                    data.map((item) => (
                        <div key={item.id} style={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e2e8f0', 
                            borderRadius: '16px', 
                            padding: '16px 20px', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '12px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                        onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{ 
                                    flex: 1,
                                    fontSize: '15px', 
                                    lineHeight: '1.6', 
                                    color: '#1e293b', 
                                    fontWeight: '500',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word'
                                }}>
                                    {item.description}
                                </div>
                                {!readOnly && (
                                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                        <button onClick={() => handleEdit(item)} style={{ border: 'none', background: '#eff6ff', color: '#3b82f6', cursor: 'pointer', padding: '8px', borderRadius: '8px' }} title="Editar"><Edit2 size={16} /></button>
                                        <button onClick={() => handleRemove(item.id)} style={{ border: 'none', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', padding: '8px', borderRadius: '8px' }} title="Eliminar"><Trash2 size={16} /></button>
                                    </div>
                                )}
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>
                                    <Search size={14} style={{ color: '#64748b' }} />
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>CIE: {item.cieCode}</span>
                                </div>
                                <div style={{ 
                                    backgroundColor: item.type === 'DEF' ? '#fee2e2' : '#e0f2fe', 
                                    color: item.type === 'DEF' ? '#ef4444' : '#0ea5e9', 
                                    padding: '4px 10px', 
                                    borderRadius: '6px', 
                                    fontSize: '11px', 
                                    fontWeight: '800',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    {item.type === 'DEF' ? 'Definitivo' : 'Presuntivo'} ({item.type})
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '500px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                                {editingId ? 'Editar Diagnóstico' : 'Nuevo Diagnóstico'}
                            </h2>
                            <button onClick={() => { setShowModal(false); setEditingId(null); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
                        </div>
                        
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>Diagnóstico(*)</label>
                                <textarea 
                                    placeholder="Ingrese el diagnóstico" 
                                    value={newItem.description} 
                                    onChange={e => setNewItem({...newItem, description: e.target.value})}
                                    rows={3}
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', fontSize: '15px', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>COD CIE(*)</label>
                                <Autocomplete
                                    open={open}
                                    onOpen={() => setOpen(true)}
                                    onClose={() => setOpen(false)}
                                    isOptionEqualToValue={(option, value) => option.code === value.code}
                                    getOptionLabel={(option) => `${option.code} - ${option.description}`}
                                    options={options}
                                    loading={loading}
                                    onInputChange={(_, val) => setInputValue(val)}
                                    onChange={(_, newValue) => {
                                        if (newValue) {
                                            setNewItem(prev => ({ 
                                                ...prev, 
                                                cieCode: newValue.code,
                                                description: prev.description || newValue.description 
                                            }));
                                        } else {
                                            setNewItem(prev => ({ ...prev, cieCode: '' }));
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="SELECCIONE"
                                            variant="outlined"
                                            size="small"
                                            InputProps={{
                                                ...params.InputProps,
                                                style: { borderRadius: '8px', fontSize: '14px' },
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {loading ? <CircularProgress color="inherit" size={16} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>Opciones(*)</label>
                                <div style={{ display: 'flex', gap: '24px' }}>
                                    {['PRE', 'DEF'].map(type => (
                                        <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px', color: '#334155' }}>
                                            <input 
                                                type="radio" 
                                                name="diagType" 
                                                checked={newItem.type === type} 
                                                onClick={() => {
                                                    if (newItem.type === type) {
                                                        setNewItem({...newItem, type: undefined});
                                                    } else {
                                                        setNewItem({...newItem, type: type as 'PRE' | 'DEF'});
                                                    }
                                                }}
                                                onChange={() => {}}
                                                style={{ width: '18px', height: '18px', accentColor: '#4f46e5' }}
                                            />
                                            {type}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center' }}>
                            <button 
                                onClick={handleAddItem} 
                                style={{ padding: '10px 48px', borderRadius: '4px', border: 'none', backgroundColor: '#5865f2', color: 'white', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#4752c4'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = '#5865f2'}
                            >
                                {editingId ? 'Actualizar' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
