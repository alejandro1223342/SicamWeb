import { useState } from 'react';
import { 
    Utensils, Calendar, Scale, Activity, Ruler, Zap, Compass, 
    Plus, Trash2, Edit2, X, Check, Coffee, Apple, Clock, AlertCircle, Printer, FileText 
} from 'lucide-react';
import { useParams } from 'react-router-dom';

interface MealPlanDetail {
    id: string;
    mealTime: string;
    schedule: string;
    foodGroups: string[];
    menu1: string;
    menu2: string;
    menu3: string;
    menu4: string;
    menu5: string;
}

interface MealPlanFormProps {
    data: {
        id?: string;
        summary: {
            height: string;
            currentWeight: string;
            minWeight: string;
            maxWeight: string;
            idealWeight: string;
            bmi: string;
            obesityType: string;
            recommendedCalories: string;
            nextControlDate: string;
        };
        details: MealPlanDetail[];
        recommendations?: string;
    };
    mealTimes?: string[];
    foodGroupsList?: string[];
    onChange: (data: any) => void;
    readOnly?: boolean;
}


export default function MealPlanForm({ data, onChange, readOnly, mealTimes = [], foodGroupsList = [] }: MealPlanFormProps) {
    const { patientId } = useParams<{ patientId: string }>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDetail, setEditingDetail] = useState<MealPlanDetail | null>(null);

    const handlePrint = () => {
        const recordId = data.id; 
        if (!recordId) {
            alert('Por favor guarde los cambios antes de imprimir para asegurar que el PDF tenga la información más reciente.');
            return;
        }
        window.open(`/print/meal-plan/${patientId}/${recordId}`, '_blank');
    };

    const handleSummaryChange = (field: string, value: string) => {
        if (readOnly) return;
        onChange({
            ...data,
            summary: { ...data.summary, [field]: value }
        });
    };

    const handleOpenModal = (detail?: MealPlanDetail) => {
        if (readOnly) return;
        setEditingDetail(detail || {
            id: Math.random().toString(36).substr(2, 9),
            mealTime: '',
            schedule: '',
            foodGroups: [],
            menu1: '',
            menu2: '',
            menu3: '',
            menu4: '',
            menu5: ''
        });
        setIsModalOpen(true);
    };

    const handleSaveDetail = () => {
        if (!editingDetail) return;
        const exists = data.details.find(d => d.id === editingDetail.id);
        const newDetails = exists
            ? data.details.map(d => d.id === editingDetail.id ? editingDetail : d)
            : [...data.details, editingDetail];
        
        onChange({ ...data, details: newDetails });
        setIsModalOpen(false);
    };

    const handleDeleteDetail = (id: string) => {
        if (readOnly) return;
        onChange({ ...data, details: data.details.filter(d => d.id !== id) });
    };

    const toggleFoodGroup = (group: string) => {
        if (!editingDetail) return;
        const newGroups = editingDetail.foodGroups.includes(group)
            ? editingDetail.foodGroups.filter(g => g !== group)
            : [...editingDetail.foodGroups, group];
        setEditingDetail({ ...editingDetail, foodGroups: newGroups });
    };

    const sharedInputStyle = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: readOnly ? '#f8fafc' : 'white',
        color: '#334155'
    };

    const labelStyle = {
        fontSize: '12px',
        fontWeight: '700',
        color: '#64748b',
        marginBottom: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        textTransform: 'uppercase' as const
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Header Section */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                        <Utensils size={24} color="#10b981" /> Plan de Alimentación Personalizado
                    </h3>
                    <button 
                        onClick={handlePrint}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: '#f8fafc', color: '#10b981', border: '1px solid #10b981', borderRadius: '12px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        <Printer size={16} /> Imprimir Plan
                    </button>
                </div>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Gestión de objetivos nutricionales y distribución de comidas.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', backgroundColor: '#f8fafc', padding: '24px', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                    <div>
                        <label style={labelStyle}><Ruler size={14} color="#3b82f6" /> Talla (cm) (*)</label>
                        <input type="text" value={data.summary.height} onChange={(e) => handleSummaryChange('height', e.target.value)} style={sharedInputStyle} placeholder="Ej: 175" disabled={readOnly} />
                    </div>
                    <div>
                        <label style={labelStyle}><Scale size={14} color="#10b981" /> Peso Actual (kg) (*)</label>
                        <input type="text" value={data.summary.currentWeight} onChange={(e) => handleSummaryChange('currentWeight', e.target.value)} style={sharedInputStyle} placeholder="Ej: 75.5" disabled={readOnly} />
                    </div>
                    <div>
                        <label style={labelStyle}><Compass size={14} color="#8b5cf6" /> Peso Mín - Máx (*)</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input type="text" value={data.summary.minWeight} onChange={(e) => handleSummaryChange('minWeight', e.target.value)} style={sharedInputStyle} placeholder="Min" disabled={readOnly} />
                            <input type="text" value={data.summary.maxWeight} onChange={(e) => handleSummaryChange('maxWeight', e.target.value)} style={sharedInputStyle} placeholder="Max" disabled={readOnly} />
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}><Activity size={14} color="#ec4899" /> Peso Ideal (*)</label>
                        <input type="text" value={data.summary.idealWeight} onChange={(e) => handleSummaryChange('idealWeight', e.target.value)} style={sharedInputStyle} placeholder="Ej: 70" disabled={readOnly} />
                    </div>
                    <div>
                        <label style={labelStyle}><Activity size={14} color="#f59e0b" /> IMC (*)</label>
                        <input type="text" value={data.summary.bmi} onChange={(e) => handleSummaryChange('bmi', e.target.value)} style={sharedInputStyle} placeholder="Calcular IMC" disabled={readOnly} />
                    </div>
                    <div>
                        <label style={labelStyle}><AlertCircle size={14} color="#ef4444" /> Obesidad (*)</label>
                        <input type="text" value={data.summary.obesityType} onChange={(e) => handleSummaryChange('obesityType', e.target.value)} style={sharedInputStyle} placeholder="Tipo" disabled={readOnly} />
                    </div>
                    <div>
                        <label style={labelStyle}><Zap size={14} color="#eab308" /> Calorías Rec. (*)</label>
                        <input type="text" value={data.summary.recommendedCalories} onChange={(e) => handleSummaryChange('recommendedCalories', e.target.value)} style={sharedInputStyle} placeholder="kcal/día" disabled={readOnly} />
                    </div>
                    <div>
                        <label style={labelStyle}><Calendar size={14} color="#6366f1" /> Próximo Control (*)</label>
                        <input type="date" value={data.summary.nextControlDate} onChange={(e) => handleSummaryChange('nextControlDate', e.target.value)} style={sharedInputStyle} disabled={readOnly} />
                    </div>
                </div>
            </div>

            {/* Meal Plan Details Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                        <Clock size={20} color="#10b981" /> Distribución de Tiempos
                    </h4>
                    {!readOnly && (
                        <button 
                            onClick={() => handleOpenModal()} 
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)', transition: 'all 0.2s' }}
                        >
                            <Plus size={16} /> Agregar plan alimentación
                        </button>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                    {data.details.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0', color: '#94a3b8' }}>
                            <Utensils size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <p style={{ fontSize: '16px', fontWeight: '600' }}>No hay tiempos de comida registrados</p>
                            <p style={{ fontSize: '14px' }}>Haga clic en el botón superior para agregar un nuevo tiempo.</p>
                        </div>
                    ) : (
                        data.details.map((detail) => (
                            <div key={detail.id} style={{ backgroundColor: 'white', border: '1px solid #f1f5f9', borderRadius: '24px', padding: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '4px solid #10b981' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <h5 style={{ fontSize: '17px', fontWeight: '800', color: '#1e293b', margin: 0 }}>{detail.mealTime}</h5>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                                            <Clock size={14} color="#10b981" /> {detail.schedule}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => handleOpenModal(detail)} title="Editar" style={{ padding: '8px', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#3b82f6', cursor: 'pointer', backgroundColor: 'white' }}><Edit2 size={15} /></button>
                                        {!readOnly && <button onClick={() => handleDeleteDetail(detail.id)} title="Eliminar" style={{ padding: '8px', borderRadius: '10px', border: '1px solid #fee2e2', color: '#ef4444', cursor: 'pointer', backgroundColor: 'white' }}><Trash2 size={15} /></button>}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {detail.foodGroups.map((g, idx) => (
                                        <span key={idx} style={{ padding: '4px 10px', backgroundColor: '#f0fdf4', color: '#166534', borderRadius: '8px', fontSize: '10px', fontWeight: '800', border: '1px solid #dcfce7', textTransform: 'uppercase' }}>{g}</span>
                                    ))}
                                </div>

                                <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {[1, 2, 3, 4, 5].map(idx => {
                                        const menuText = (detail as any)[`menu${idx}`];
                                        if (!menuText) return null;
                                        return (
                                            <div key={idx} style={{ paddingBottom: idx < 5 ? '10px' : 0, borderBottom: idx < 5 ? '1px solid #edf2f7' : 'none' }}>
                                                <div style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                                                    Opción {idx}
                                                </div>
                                                <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                                                    {menuText}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* General Recommendations Section */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={18} color="#10b981" /> Recomendaciones Generales (PDF)
                </h4>
                <textarea 
                    value={data.recommendations || ''} 
                    onChange={(e) => onChange({ ...data, recommendations: e.target.value })}
                    placeholder="Ingrese las recomendaciones que aparecerán en el PDF impreso..."
                    style={{ ...sharedInputStyle, height: '120px', resize: 'vertical', textAlign: 'left', padding: '12px' }}
                    disabled={readOnly}
                />
            </div>

            {/* Details Modal */}
            {isModalOpen && editingDetail && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '850px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>Detalle plan de alimentación</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        
                        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', maxHeight: '75vh', overflowY: 'auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div>
                                    <label style={labelStyle}><Coffee size={14} /> Tiempos de comida(*)</label>
                                    <select 
                                        style={sharedInputStyle} 
                                        value={editingDetail.mealTime}
                                        onChange={(e) => setEditingDetail({ ...editingDetail, mealTime: e.target.value })}
                                    >
                                        <option value="">seleccione</option>
                                        {mealTimes.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}><Clock size={14} /> Horario(*)</label>
                                    <input 
                                        type="text" 
                                        style={sharedInputStyle} 
                                        placeholder="Ej: 08:30"
                                        value={editingDetail.schedule}
                                        onChange={(e) => setEditingDetail({ ...editingDetail, schedule: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}><Apple size={14} /> Grupo de alimentos(*)</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {foodGroupsList.map(group => (
                                        <button
                                            key={group}
                                            onClick={() => toggleFoodGroup(group)}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '10px',
                                                border: '1px solid',
                                                borderColor: editingDetail.foodGroups.includes(group) ? '#10b981' : '#e2e8f0',
                                                backgroundColor: editingDetail.foodGroups.includes(group) ? '#f0fdf4' : 'white',
                                                color: editingDetail.foodGroups.includes(group) ? '#166534' : '#64748b',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {group}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                {[1, 2, 3, 4, 5].map(idx => (
                                    <div key={idx} style={{ gridColumn: idx === 5 ? '1 / span 2' : 'auto' }}>
                                        <label style={labelStyle}>Ejemplo de menú {idx}(*)</label>
                                        <textarea 
                                            style={{ ...sharedInputStyle, height: '80px', textAlign: 'left' }} 
                                            placeholder={`Describa la opción ${idx}...`}
                                            value={(editingDetail as any)[`menu${idx}`]}
                                            onChange={(e) => setEditingDetail({ ...editingDetail, [`menu${idx}`]: e.target.value })}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button onClick={() => setIsModalOpen(false)} style={{ padding: '12px 24px', backgroundColor: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={handleSaveDetail} style={{ padding: '12px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Check size={18} /> Guardar detalle
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
