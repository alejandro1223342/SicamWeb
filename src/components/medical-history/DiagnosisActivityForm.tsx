import { useState } from 'react';
import { Plus, X, Trash2, ClipboardList } from 'lucide-react';

interface DiagnosisItem {
    id: string;
    description: string;
    p: boolean;
    d: boolean;
    r: boolean;
    cieCode: string;
}

interface Props {
    data: DiagnosisItem[];
    onChange: (data: DiagnosisItem[]) => void;
    readOnly?: boolean;
}

export default function DiagnosisActivityForm({ data = [], onChange, readOnly = false }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState<Partial<DiagnosisItem>>({
        description: '', p: false, d: false, r: false, cieCode: ''
    });

    const handleAddItem = () => {
        if (!newItem.description || (!newItem.p && !newItem.d && !newItem.r) || !newItem.cieCode) {
            alert('Por favor llene todos los campos obligatorios (*) y seleccione al menos una opción (P, D o R)');
            return;
        }
        const result: DiagnosisItem = {
            id: Date.now().toString(),
            description: newItem.description!,
            p: !!newItem.p,
            d: !!newItem.d,
            r: !!newItem.r,
            cieCode: newItem.cieCode!
        };
        onChange([...data, result]);
        setNewItem({ description: '', p: false, d: false, r: false, cieCode: '' });
        setShowModal(false);
    };

    const handleRemove = (id: string) => {
        if (readOnly) return;
        onChange(data.filter(item => item.id !== id));
    };

    return (
        <div className="section-container" style={{ animation: 'fadeIn 0.3s ease-in-out', backgroundColor: '#fcfcfd', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '2px solid #f1f5f9', paddingBottom: '16px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', backgroundColor: '#ecfdf5', borderRadius: '12px', color: '#10b981', display: 'flex' }}>
                        <ClipboardList size={24} />
                    </div>
                    Diagnóstico / Actividad
                </h3>
                {!readOnly && (
                    <button
                        onClick={() => setShowModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)' }}
                    >
                        Agregar diagnóstico <Plus size={18} />
                    </button>
                )}
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead style={{ backgroundColor: '#f8fafc', color: '#64748b', fontWeight: '700', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '16px 20px' }}>DIAGNÓSTICO / ACTIVIDAD</th>
                            <th style={{ padding: '16px 20px', width: '60px', textAlign: 'center' }}>P</th>
                            <th style={{ padding: '16px 20px', width: '60px', textAlign: 'center' }}>D</th>
                            <th style={{ padding: '16px 20px', width: '60px', textAlign: 'center' }}>R</th>
                            <th style={{ padding: '16px 20px', width: '180px' }}>COD CIE</th>
                            {!readOnly && <th style={{ padding: '16px 20px', width: '80px', textAlign: 'center' }}>ACCIONES</th>}
                        </tr>
                    </thead>
                    <tbody style={{ color: '#334155' }}>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={readOnly ? 5 : 6} style={{ padding: '60px 40px', textAlign: 'center', color: '#94a3b8', backgroundColor: '#f8fafc' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '64px', height: '64px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                                            <ClipboardList size={32} />
                                        </div>
                                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#475569' }}>Sin diagnósticos registrados</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
                                    <td style={{ padding: '16px 20px' }}>
                                        <span style={{ fontWeight: '600', color: '#1e293b' }}>{item.description}</span>
                                    </td>
                                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                        {item.p && <span style={{ backgroundColor: '#eef2ff', color: '#4f46e5', padding: '4px 8px', borderRadius: '6px', fontWeight: '800', fontSize: '12px' }}>P</span>}
                                    </td>
                                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                        {item.d && <span style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '4px 8px', borderRadius: '6px', fontWeight: '800', fontSize: '12px' }}>D</span>}
                                    </td>
                                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                        {item.r && <span style={{ backgroundColor: '#fff7ed', color: '#ea580c', padding: '4px 8px', borderRadius: '6px', fontWeight: '800', fontSize: '12px' }}>R</span>}
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <span style={{ fontWeight: '700', color: '#475569', backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '13px' }}>{item.cieCode}</span>
                                    </td>
                                    {!readOnly && (
                                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                            <button 
                                                onClick={() => handleRemove(item.id)} 
                                                style={{ border: '1.5px solid #fee2e2', background: 'transparent', color: '#ef4444', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(4px)' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '600px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', animation: 'modalFadeIn 0.3s ease-out' }}>
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Nuevo Diagnóstico / Actividad</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
                        </div>
                        
                        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>Descripción(*)</label>
                                <textarea 
                                    placeholder="Describa el diagnóstico o actividad..." 
                                    value={newItem.description} 
                                    onChange={e => setNewItem({...newItem, description: e.target.value})}
                                    rows={3}
                                    style={{ width: '100%', padding: '14px 18px', border: '1.5px solid #e2e8f0', borderRadius: '12px', outline: 'none', transition: 'all 0.2s', fontSize: '15px', resize: 'vertical' }}
                                    onFocus={e => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>Tipo de diagnóstico (Seleccione al menos uno)</label>
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                    {(['p', 'd', 'r'] as const).map(key => (
                                        <button
                                            key={key}
                                            onClick={() => setNewItem({ ...newItem, [key]: !newItem[key] })}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                borderRadius: '12px',
                                                border: '2px solid',
                                                borderColor: newItem[key] ? '#4f46e5' : '#cbd5e1',
                                                backgroundColor: newItem[key] ? '#f5f3ff' : 'white',
                                                color: newItem[key] ? '#4f46e5' : '#64748b',
                                                fontWeight: '800',
                                                fontSize: '18px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {key.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>Código CIE-10 (*)</label>
                                <select 
                                    value={newItem.cieCode} 
                                    onChange={e => setNewItem({...newItem, cieCode: e.target.value})}
                                    style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: '12px', outline: 'none', transition: 'all 0.2s', fontSize: '15px', backgroundColor: 'white' }}
                                    onFocus={e => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                >
                                    <option value="">Seleccione un código...</option>
                                    <option value="L64.X">L64.X - Alopecia androgénica</option>
                                    <option value="L65.9">L65.9 - Alopecia de tipo no especificado</option>
                                    <option value="L66.1">L66.1 - Liquen planopilaris</option>
                                    <option value="L63.0">L63.0 - Alopecia total</option>
                                    <option value="L63.1">L63.1 - Alopecia universal</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ padding: '24px 32px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#f8fafc', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
                            <button onClick={() => setShowModal(false)} style={{ padding: '10px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={handleAddItem} style={{ padding: '10px 32px', borderRadius: '12px', border: 'none', backgroundColor: '#10b981', color: 'white', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>Guardar</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes modalFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
}
