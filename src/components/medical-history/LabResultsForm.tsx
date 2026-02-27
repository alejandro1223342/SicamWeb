import { useState } from 'react';
import { Plus, X, Trash2, Image as ImageIcon } from 'lucide-react';

interface LabResult {
    id: string;
    exam: string;
    observations: string;
    value: string;
    date: string;
    file?: string;
}

interface Props {
    data: LabResult[];
    onChange: (data: LabResult[]) => void;
    onSave?: () => void;
}

export default function LabResultsForm({ data = [], onChange, onSave }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState<Partial<LabResult>>({
        exam: '', observations: '', value: '', date: '', file: ''
    });

    const handleAddItem = () => {
        if (!newItem.exam || !newItem.observations || !newItem.value || !newItem.date) {
            alert('Por favor llene todos los campos obligatorios (*)');
            return;
        }
        const result: LabResult = {
            id: Date.now().toString(),
            exam: newItem.exam!,
            observations: newItem.observations!,
            value: newItem.value!,
            date: newItem.date!,
            file: newItem.file
        };
        onChange([...data, result]);
        setNewItem({ exam: '', observations: '', value: '', date: '', file: '' });
        setShowModal(false);
    };

    const handleRemove = (id: string) => {
        onChange(data.filter(item => item.id !== id));
    };

    return (
        <div className="section-container" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                    Resultados de laboratorio e imágenes
                </h3>
                <button
                    onClick={() => setShowModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ecfdf5', color: '#10b981', border: '1px solid #10b981', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#10b981'; e.currentTarget.style.color = 'white'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ecfdf5'; e.currentTarget.style.color = '#10b981'; }}
                >
                    Agregar resultado <Plus size={16} />
                </button>
            </div>

            {/* Table */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead style={{ backgroundColor: '#f8fafc', color: '#475569', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '12px 16px' }}>EXAMEN</th>
                            <th style={{ padding: '12px 16px' }}>OBSERVACIONES</th>
                            <th style={{ padding: '12px 16px' }}>VALOR/NSH</th>
                            <th style={{ padding: '12px 16px' }}>FECHA</th>
                            <th style={{ padding: '12px 16px', width: '80px' }}>VER</th>
                            <th style={{ padding: '12px 16px', width: '80px' }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', backgroundColor: '#f8fafc' }}>
                                    Este resultados de exámenes registrados
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '12px 16px', color: '#1e293b' }}>{item.exam}</td>
                                    <td style={{ padding: '12px 16px', color: '#475569' }}>{item.observations}</td>
                                    <td style={{ padding: '12px 16px', color: '#475569' }}>{item.value}</td>
                                    <td style={{ padding: '12px 16px', color: '#475569' }}>{item.date}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        {item.file ? <button style={{ border: 'none', background: 'none', color: '#3b82f6', cursor: 'pointer' }}><ImageIcon size={20} /></button> : <span style={{ color: '#cbd5e1' }}>—</span>}
                                    </td>
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
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column' }}>

                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0 }}>Resultados de laboratorio e imágenes</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>Examen(*)</label>
                                <textarea
                                    value={newItem.exam} onChange={(e) => setNewItem({ ...newItem, exam: e.target.value })}
                                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', resize: 'vertical', minHeight: '80px', outlineColor: '#3b82f6' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>Observaciones(*)</label>
                                <textarea
                                    value={newItem.observations} onChange={(e) => setNewItem({ ...newItem, observations: e.target.value })}
                                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', resize: 'vertical', minHeight: '80px', outlineColor: '#3b82f6' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>Valor/NSH(*)</label>
                                    <input type="text" value={newItem.value} onChange={(e) => setNewItem({ ...newItem, value: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', outlineColor: '#3b82f6' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>Fecha(*)</label>
                                    <input type="date" value={newItem.date} onChange={(e) => setNewItem({ ...newItem, date: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', outlineColor: '#3b82f6', backgroundColor: 'transparent' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '500', color: '#475569', marginBottom: '8px', fontSize: '13px' }}>Documento, imagen o video (*)</label>
                                    <div style={{ border: '1px dashed #cbd5e1', borderRadius: '6px', padding: '6px', display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                                        <label style={{ backgroundColor: '#e2e8f0', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#475569' }}>
                                            Seleccionar archivo
                                            <input type="file" style={{ display: 'none' }} onChange={(e) => setNewItem({ ...newItem, file: e.target.files?.[0]?.name || 'simulated-file.pdf' })} />
                                        </label>
                                        <span style={{ fontSize: '12px', marginLeft: '8px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {newItem.file || 'Ningún ar...onado'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '20px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
                            <button
                                onClick={handleAddItem}
                                style={{ backgroundColor: '#4f46e5', color: 'white', padding: '10px 40px', borderRadius: '6px', fontWeight: '500', border: 'none', cursor: 'pointer' }}
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
