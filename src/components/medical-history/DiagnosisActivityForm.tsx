import { useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';

interface DiagnosisItem {
    id: string;
    description: string;
    p: string;
    d: string;
    r: string;
    cieCode: string;
}

interface Props {
    data: DiagnosisItem[];
    onChange: (data: DiagnosisItem[]) => void;
    onSave?: () => void;
}

export default function DiagnosisActivityForm({ data = [], onChange, onSave }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState<Partial<DiagnosisItem>>({
        description: '', p: '', d: '', r: '', cieCode: ''
    });

    const handleAddItem = () => {
        if (!newItem.description || !newItem.p || !newItem.d || !newItem.r || !newItem.cieCode) {
            alert('Por favor llene todos los campos obligatorios (*)');
            return;
        }
        const result: DiagnosisItem = {
            id: Date.now().toString(),
            description: newItem.description!,
            p: newItem.p!,
            d: newItem.d!,
            r: newItem.r!,
            cieCode: newItem.cieCode!
        };
        onChange([...data, result]);
        setNewItem({ description: '', p: '', d: '', r: '', cieCode: '' });
        setShowModal(false);
    };

    const handleRemove = (id: string) => {
        onChange(data.filter(item => item.id !== id));
    };

    return (
        <div className="section-container" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                    Diagnóstico/Actividad
                </h3>
                <button
                    onClick={() => setShowModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', color: '#22c55e', border: '1px solid #22c55e', padding: '8px 16px', borderRadius: '4px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    Agregar Diagnóstico/actividad <Plus size={16} />
                </button>
            </div>

            <h4 style={{ textAlign: 'center', color: '#475569', fontWeight: '600', fontSize: '16px', marginBottom: '16px', textTransform: 'uppercase' }}>
                DIAGNOSTICO / ACTIVIDAD
            </h4>

            {/* Table */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead style={{ backgroundColor: '#f8fafc', color: '#475569', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '12px 16px' }}>DIAGNOSTICO / ACTIVIDAD</th>
                            <th style={{ padding: '12px 16px', width: '50px' }}>P</th>
                            <th style={{ padding: '12px 16px', width: '50px' }}>D</th>
                            <th style={{ padding: '12px 16px', width: '50px' }}>R</th>
                            <th style={{ padding: '12px 16px', width: '150px' }}>COD CIE</th>
                            <th style={{ padding: '12px 16px', width: '80px' }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', backgroundColor: '#f8fafc' }}>
                                    No hay datos
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '12px 16px', color: '#1e293b' }}>{item.description}</td>
                                    <td style={{ padding: '12px 16px', color: '#475569' }}>{item.p}</td>
                                    <td style={{ padding: '12px 16px', color: '#475569' }}>{item.d}</td>
                                    <td style={{ padding: '12px 16px', color: '#475569' }}>{item.r}</td>
                                    <td style={{ padding: '12px 16px', color: '#475569' }}>{item.cieCode}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <button onClick={() => handleRemove(item.id)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
                <button
                    onClick={(e) => { e.preventDefault(); onSave && onSave(); }}
                    style={{ backgroundColor: '#22c55e', color: 'white', padding: '10px 32px', borderRadius: '6px', fontWeight: '500', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                >
                    Guardar sección
                </button>
            </div>

            {/* Fake Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>

                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#334155', margin: 0 }}>Diagnostico y actividad</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: '600', fontSize: '16px', color: '#64748b', marginBottom: '8px' }}>Descripción(*)</label>
                                <textarea
                                    value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', resize: 'vertical', minHeight: '100px', outlineColor: '#3b82f6' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '600', fontSize: '16px', color: '#64748b', marginBottom: '8px' }}>P(*)</label>
                                    <input type="text" value={newItem.p} onChange={(e) => setNewItem({ ...newItem, p: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', outlineColor: '#3b82f6' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '600', fontSize: '16px', color: '#64748b', marginBottom: '8px' }}>D(*)</label>
                                    <input type="text" value={newItem.d} onChange={(e) => setNewItem({ ...newItem, d: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', outlineColor: '#3b82f6' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '600', fontSize: '16px', color: '#64748b', marginBottom: '8px' }}>R(*)</label>
                                    <input type="text" value={newItem.r} onChange={(e) => setNewItem({ ...newItem, r: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', outlineColor: '#3b82f6' }} />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontWeight: '600', fontSize: '16px', color: '#64748b', marginBottom: '8px' }}>COD CIE(*)</label>
                                <select
                                    value={newItem.cieCode} onChange={(e) => setNewItem({ ...newItem, cieCode: e.target.value })}
                                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', outlineColor: '#3b82f6', backgroundColor: 'white' }}
                                >
                                    <option value="">SELECCIONE</option>
                                    <option value="L64.X">L64.X - Alopecia androgénica</option>
                                    <option value="L65.9">L65.9 - Alopecia de tipo no especificado</option>
                                    <option value="L66.1">L66.1 - Liquen planopilaris</option>
                                    <option value="L63.0">L63.0 - Alopecia total</option>
                                    <option value="L63.1">L63.1 - Alopecia universal</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'center' }}>
                            <button
                                onClick={handleAddItem}
                                style={{ backgroundColor: '#4f46e5', color: 'white', padding: '12px 48px', borderRadius: '4px', fontSize: '16px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
