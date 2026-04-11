import { useState } from 'react';
import { Plus, X, Trash2, Edit2, Pill, Clipboard, Clock, MapPin, Hash } from 'lucide-react';
import { useToast } from '../../Toast';

interface PrescriptionItem {
    id: string;
    cantidad: string;
    farmaco: string;
    presentacion: string;
    medidas: string;
    dosis: string;
    via: string;
    dias: string;
    notas: string;
}

interface GeneralFinalDataFormProps {
    data: PrescriptionItem[];
    onChange: (data: PrescriptionItem[]) => void;
    readOnly?: boolean;
}

export default function GeneralFinalDataForm({ data = [], onChange, readOnly = false }: GeneralFinalDataFormProps) {
    const { showToast } = useToast();
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newItem, setNewItem] = useState<Partial<PrescriptionItem>>({
        cantidad: '', farmaco: '', presentacion: '', medidas: '', dosis: '', via: '', dias: '', notas: ''
    });

    const handleAddItem = () => {
        if (!newItem.farmaco || !newItem.cantidad) {
            showToast('Fármaco y Cantidad son obligatorios (*)', 'warning');
            return;
        }

        if (editingId) {
            const updatedData = data.map(item => 
                item.id === editingId ? { ...item, ...newItem } as PrescriptionItem : item
            );
            onChange(updatedData);
            showToast('Receta actualizada', 'success');
        } else {
            const result: PrescriptionItem = {
                id: Date.now().toString(),
                ...(newItem as Omit<PrescriptionItem, 'id'>)
            };
            onChange([...data, result]);
        }

        setNewItem({ cantidad: '', farmaco: '', presentacion: '', medidas: '', dosis: '', via: '', dias: '', notas: '' });
        setEditingId(null);
        setShowModal(false);
    };

    const handleEdit = (item: PrescriptionItem) => {
        if (readOnly) return;
        setNewItem(item);
        setEditingId(item.id);
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
                    <span style={{ fontSize: '10px' }}>▼</span> 10-Datos finales
                </h3>
                {!readOnly && (
                    <button
                        onClick={() => {
                            setNewItem({ cantidad: '', farmaco: '', presentacion: '', medidas: '', dosis: '', via: '', dias: '', notas: '' });
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
                        Ingresar datos <Plus size={18} />
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {data.length === 0 ? (
                    <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                        No hay recetas o datos registrados.
                    </div>
                ) : (
                    data.map((item) => (
                        <div key={item.id} style={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e2e8f0', 
                            borderRadius: '16px', 
                            padding: '20px', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '16px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                            transition: 'all 0.2s',
                            position: 'relative'
                        }}
                        onMouseOver={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                        onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ width: '40px', height: '40px', backgroundColor: '#f5f3ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
                                        <Pill size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>{item.farmaco}</h4>
                                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Cantidad: {item.cantidad}</span>
                                    </div>
                                </div>
                                {!readOnly && (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => handleEdit(item)} style={{ border: 'none', background: '#eff6ff', color: '#3b82f6', cursor: 'pointer', padding: '8px', borderRadius: '8px' }} title="Editar"><Edit2 size={16} /></button>
                                        <button onClick={() => handleRemove(item.id)} style={{ border: 'none', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', padding: '8px', borderRadius: '8px' }} title="Eliminar"><Trash2 size={16} /></button>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Presentación</span>
                                    <span style={{ fontSize: '14px', color: '#334155', whiteSpace: 'pre-wrap' }}>{item.presentacion || 'N/A'}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Dosificación</span>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569' }}>
                                            <Hash size={14} style={{ color: '#94a3b8' }} /> {item.medidas || '-'} (Medidas)
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569' }}>
                                            <Clipboard size={14} style={{ color: '#94a3b8' }} /> {item.dosis || '-'} (Dosis)
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569' }}>
                                            <MapPin size={14} style={{ color: '#94a3b8' }} /> Vía: {item.via || '-'}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569' }}>
                                            <Clock size={14} style={{ color: '#94a3b8' }} /> {item.dias || '-'} días
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {item.notas && (
                                <div style={{ borderLeft: '3px solid #e2e8f0', paddingLeft: '12px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Notas</span>
                                    <span style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>"{item.notas}"</span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                                {editingId ? 'Editar Datos Finales' : 'Ingresar Datos Finales'}
                            </h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
                        </div>
                        
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontWeight: '600', color: '#475569', fontSize: '13px' }}>Fármaco(*)</label>
                                    <input type="text" value={newItem.farmaco} onChange={e => setNewItem({...newItem, farmaco: e.target.value})} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }} placeholder="Nombre del medicamento" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontWeight: '600', color: '#475569', fontSize: '13px' }}>Cantidad(*)</label>
                                    <input type="text" value={newItem.cantidad} onChange={e => setNewItem({...newItem, cantidad: e.target.value})} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }} placeholder="Ej: 1 caja" />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontWeight: '600', color: '#475569', fontSize: '13px' }}>Presentación(*)</label>
                                <textarea value={newItem.presentacion} onChange={e => setNewItem({...newItem, presentacion: e.target.value})} rows={2} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', resize: 'vertical' }} placeholder="Ej: Tabletas de 500mg" />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontWeight: '600', color: '#475569', fontSize: '13px' }}>Medidas</label>
                                    <input type="text" value={newItem.medidas} onChange={e => setNewItem({...newItem, medidas: e.target.value})} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }} placeholder="Ej: 500 mg o 10 ml" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontWeight: '600', color: '#475569', fontSize: '13px' }}>Dosis</label>
                                    <input type="text" value={newItem.dosis} onChange={e => setNewItem({...newItem, dosis: e.target.value})} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }} placeholder="Ej: 1 tableta cada 8 horas" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontWeight: '600', color: '#475569', fontSize: '13px' }}>Vía</label>
                                    <input type="text" value={newItem.via} onChange={e => setNewItem({...newItem, via: e.target.value})} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }} placeholder="Ej: Oral / Intravenosa" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontWeight: '600', color: '#475569', fontSize: '13px' }}>Días</label>
                                    <input type="text" value={newItem.dias} onChange={e => setNewItem({...newItem, dias: e.target.value})} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }} placeholder="Ej: 5 o 7" />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontWeight: '600', color: '#475569', fontSize: '13px' }}>Notas</label>
                                <textarea value={newItem.notas} onChange={e => setNewItem({...newItem, notas: e.target.value})} rows={2} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', resize: 'vertical' }} placeholder="Indicaciones adicionales..." />
                            </div>
                        </div>

                        <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center' }}>
                            <button 
                                onClick={handleAddItem} 
                                style={{ padding: '12px 64px', borderRadius: '8px', border: 'none', backgroundColor: '#5865f2', color: 'white', fontWeight: '700', cursor: 'pointer' }}
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
