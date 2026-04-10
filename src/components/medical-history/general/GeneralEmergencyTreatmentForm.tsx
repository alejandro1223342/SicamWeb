import { useState } from 'react';
import { Plus, Trash2, Edit2, X, AlertTriangle } from 'lucide-react';

interface Medicine {
    id: string;
    name: string;
    route: string;
    dose: string;
    posology: string;
    days: string;
}

interface TreatmentData {
    description: string;
    medicines: Medicine[];
}

interface GeneralEmergencyTreatmentFormProps {
    data: TreatmentData | string | undefined;
    onChange: (data: TreatmentData) => void;
    readOnly?: boolean;
}

export default function GeneralEmergencyTreatmentForm({ data, onChange, readOnly = false }: GeneralEmergencyTreatmentFormProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [medicineToDelete, setMedicineToDelete] = useState<string | null>(null);
    const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
    const [formData, setFormData] = useState<Omit<Medicine, 'id'>>({
        name: '',
        route: '',
        dose: '',
        posology: '',
        days: ''
    });

    const isObject = (val: any) => val !== null && typeof val === 'object' && !Array.isArray(val);
    
    // Normalization of data from legacy or initial state
    const safeData: TreatmentData = isObject(data)
        ? { 
            description: (data as any).description || '', 
            medicines: Array.isArray((data as any).medicines) ? (data as any).medicines : [] 
        }
        : { 
            description: typeof data === 'string' ? data : '', 
            medicines: [] 
        };

    const handleUpdate = (updatedData: Partial<TreatmentData>) => {
        if (readOnly) return;
        onChange({ ...safeData, ...updatedData });
    };

    const openAddModal = () => {
        setEditingMedicine(null);
        setFormData({ name: '', route: '', dose: '', posology: '', days: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (medicine: Medicine) => {
        setEditingMedicine(medicine);
        setFormData({ ...medicine });
        setIsModalOpen(true);
    };

    const saveMedicine = () => {
        if (!formData.name) return alert('El nombre del medicamento es obligatorio');
        
        let newMedicines;
        if (editingMedicine) {
            newMedicines = safeData.medicines.map(m => m.id === editingMedicine.id ? { ...formData, id: m.id } : m);
        } else {
            newMedicines = [...safeData.medicines, { ...formData, id: Math.random().toString(36).substr(2, 9) }];
        }
        
        handleUpdate({ medicines: newMedicines });
        setIsModalOpen(false);
    };

    const deleteMedicine = (id: string) => {
        if (readOnly) return;
        setMedicineToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (medicineToDelete) {
            handleUpdate({ medicines: safeData.medicines.filter(m => m.id !== medicineToDelete) });
            setShowDeleteConfirm(false);
            setMedicineToDelete(null);
        }
    };

    const handleNumericUpdate = (field: keyof Omit<Medicine, 'id'>, value: string) => {
        const cleanValue = value.replace(/[^0-9]/g, '');
        setFormData({ ...formData, [field]: cleanValue });
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1.5px solid #e2e8f0',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s',
        backgroundColor: 'white',
        color: '#334155'
    };

    const labelStyle = {
        fontSize: '11px',
        fontWeight: '700',
        color: '#475569',
        marginBottom: '6px',
        display: 'block'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Legend & Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '16px', 
                    border: '1px solid #e2e8f0', 
                    padding: '24px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}>
                    {[
                        { id: 1, label: 'INDICACIONES GENERALES' },
                        { id: 2, label: 'PROCEDIMIENTOS' },
                        { id: 3, label: 'CONSENTIMIENTO CARDIACO' },
                        { id: 4, label: 'OTROS' }
                    ].map(item => (
                        <div key={item.id} style={{ fontSize: '11px', color: '#475569', fontWeight: '700' }}>
                            <span style={{ color: '#3b82f6', marginRight: '4px' }}>{item.id}.</span> {item.label}
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                        Describir abajo anotando el número correspondiente
                    </h4>
                    <textarea
                        style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '12px',
                            border: '1.5px solid #e2e8f0',
                            minHeight: '200px',
                            fontSize: '15px',
                            lineHeight: '1.6',
                            outline: 'none',
                            backgroundColor: readOnly ? '#f8fafc' : 'white',
                            color: '#334155',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => !readOnly && (e.target.style.borderColor = '#3b82f6')}
                        onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                        value={safeData.description}
                        onChange={(e) => handleUpdate({ description: e.target.value })}
                        disabled={readOnly}
                        placeholder="Ingresar anotando el número correspondiente..."
                    />
                </div>
            </div>

            {/* Medicines Cards Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Medicamentos Registrados</h4>
                    <button 
                        onClick={openAddModal}
                        disabled={readOnly}
                        style={{
                            padding: '8px 16px', backgroundColor: '#ecfdf5', color: '#059669', border: '1.5px solid #10b981',
                            borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px', opacity: readOnly ? 0.6 : 1,
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={e => !readOnly && (e.currentTarget.style.backgroundColor = '#d1fae5')}
                        onMouseOut={e => !readOnly && (e.currentTarget.style.backgroundColor = '#ecfdf5')}
                    >
                        <Plus size={16} /> Agregar datos
                    </button>
                </div>

                {safeData.medicines.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '16px', border: '2px dashed #e2e8f0' }}>
                        <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>No hay medicamentos registrados todavía.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {safeData.medicines.map((med) => (
                            <div key={med.id} style={{ 
                                backgroundColor: 'white', borderRadius: '16px', border: '1.5px solid #f1f5f9', 
                                padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h4 style={{ 
                                            fontSize: '14px', fontWeight: '800', color: '#1e293b', margin: 0, 
                                            wordBreak: 'break-word', overflowWrap: 'anywhere'
                                        }}>
                                            {med.name}
                                        </h4>
                                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', wordBreak: 'break-word' }}>
                                            {med.route}
                                        </span>
                                    </div>
                                    {!readOnly && (
                                        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                                            <button onClick={() => openEditModal(med)} style={{ width: '30px', height: '30px', borderRadius: '8px', border: 'none', background: '#eff6ff', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit2 size={14} /></button>
                                            <button onClick={() => deleteMedicine(med.id)} style={{ width: '30px', height: '30px', borderRadius: '8px', border: 'none', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={14} /></button>
                                        </div>
                                    )}
                                </div>
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
                                    gap: '12px', 
                                    backgroundColor: '#f8fafc', 
                                    padding: '12px', 
                                    borderRadius: '12px' 
                                }}>
                                    <div style={{ minWidth: 0 }}>
                                        <span style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', display: 'block' }}>Dosis</span>
                                        <span style={{ fontSize: '12px', color: '#475569', fontWeight: '700', wordBreak: 'break-word' }}>{med.dose || '-'}</span>
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <span style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', display: 'block' }}>Posología</span>
                                        <span style={{ fontSize: '12px', color: '#475569', fontWeight: '700', wordBreak: 'break-word' }}>{med.posology || '-'}</span>
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <span style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', display: 'block' }}>Días</span>
                                        <span style={{ fontSize: '12px', color: '#475569', fontWeight: '700', wordBreak: 'break-word' }}>{med.days || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal for Add/Edit Medicine */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
                }}>
                    <div style={{ width: '100%', maxWidth: '450px', backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: 0 }}>{editingMedicine ? 'Editar Medicamento' : 'Agregar Medicamento'}</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>Medicamento genérico(*)</label>
                                <input style={inputStyle} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Ej: Paracetamol 500mg" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Vía(*)</label>
                                    <input style={inputStyle} value={formData.route} onChange={(e) => setFormData({...formData, route: e.target.value})} placeholder="Ej: Oral" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Dosis(*)</label>
                                    <input style={inputStyle} value={formData.dose} onChange={(e) => setFormData({...formData, dose: e.target.value})} placeholder="Ej: 500 mg" />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Posología(*)</label>
                                    <input style={inputStyle} value={formData.posology} onChange={(e) => setFormData({...formData, posology: e.target.value})} placeholder="Ej: Cada 8 horas" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Días(*)</label>
                                    <input 
                                        style={inputStyle} 
                                        value={formData.days} 
                                        onChange={(e) => handleNumericUpdate('days', e.target.value)} 
                                        placeholder="Ej: 5" 
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '20px 24px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', fontWeight: '700', cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={saveMedicine} style={{ padding: '10px 30px', borderRadius: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer' }}>Guardar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Confirmation Modal */}
            {showDeleteConfirm && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10001, padding: '20px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                <AlertTriangle size={28} color="#ef4444" />
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>¿Eliminar medicamento?</h3>
                            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', marginBottom: '28px' }}>
                                Esta acción eliminará el medicamento del plan de tratamiento de forma permanente.
                            </p>
                            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                                <button
                                    onClick={() => { setShowDeleteConfirm(false); setMedicineToDelete(null); }}
                                    style={{ flex: 1, backgroundColor: 'white', border: '1.5px solid #e2e8f0', color: '#64748b', padding: '12px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    style={{ flex: 1, backgroundColor: '#ef4444', border: 'none', color: 'white', padding: '12px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)' }}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
