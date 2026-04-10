import React, { useState, useRef } from 'react';
import { Undo2, Eraser, Map as MapIcon, X, Maximize2, CheckCircle2, AlertTriangle } from 'lucide-react';
import bodyMapImg from '../../../assets/body-map/cuerpoHumano.png';

interface Marker {
    x: number;
    y: number;
    type: number;
}

interface TopographyData {
    markers: Marker[];
    comments: string;
}

interface GeneralEmergencyTopographyFormProps {
    data: TopographyData;
    onChange: (data: TopographyData) => void;
    readOnly?: boolean;
}

const INJURY_TYPES = [
    { id: 1, label: 'Herida penetrante', color: '#ef4444' },
    { id: 2, label: 'Herida no penetrante', color: '#f97316' },
    { id: 3, label: 'Fractura expuesta', color: '#dc2626' },
    { id: 4, label: 'Fractura cerrada', color: '#ea580c' },
    { id: 5, label: 'Amputación', color: '#991b1b' },
    { id: 6, label: 'Hemorragia', color: '#b91c1c' },
    { id: 7, label: 'Mordedura', color: '#854d0e' },
    { id: 8, label: 'Picadura', color: '#713f12' },
    { id: 9, label: 'Excoriación', color: '#eab308' },
    { id: 10, label: 'Deformidad o masa', color: '#6366f1' },
    { id: 11, label: 'Hematoma', color: '#8b5cf6' },
    { id: 12, label: 'Quemadura G-I', color: '#fbbf24' },
    { id: 13, label: 'Quemadura G-II', color: '#f59e0b' },
    { id: 14, label: 'Quemadura G-III', color: '#d97706' }
];

export default function GeneralEmergencyTopographyForm({ data, onChange, readOnly = false }: GeneralEmergencyTopographyFormProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<number>(1);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const safeData: TopographyData = {
        markers: Array.isArray(data?.markers) ? data.markers : [],
        comments: data?.comments || ''
    };

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (readOnly || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const newMarker: Marker = { x, y, type: selectedType };
        onChange({
            ...safeData,
            markers: [...safeData.markers, newMarker]
        });
    };

    const removeLastMarker = () => {
        if (readOnly || safeData.markers.length === 0) return;
        onChange({
            ...safeData,
            markers: safeData.markers.slice(0, -1)
        });
    };

    const clearMarkers = () => {
        if (readOnly) return;
        setShowDeleteConfirm(true);
    };

    const confirmClear = () => {
        onChange({ ...safeData, markers: [] });
        setShowDeleteConfirm(false);
    };

    const BodyMapCanvas = ({ 
        markers, 
        onCanvasClick, 
        canvasRef, 
        isReadOnly = false,
        maxWidth = '100%',
        padding = '40px'
    }: { 
        markers: Marker[], 
        onCanvasClick?: (e: React.MouseEvent) => void, 
        canvasRef?: React.RefObject<HTMLDivElement | null>,
        isReadOnly?: boolean,
        maxWidth?: string,
        padding?: string
    }) => (
        <div style={{ 
            backgroundColor: 'white', padding: padding, borderRadius: '32px', border: '1px solid #e2e8f0', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)', width: '100%', maxWidth: maxWidth, display: 'flex', justifyContent: 'center',
            margin: '0 auto'
        }}>
            <div 
                ref={canvasRef} 
                onClick={onCanvasClick} 
                style={{ position: 'relative', width: '100%', aspectRatio: '1.2 / 1', cursor: isReadOnly ? 'default' : 'crosshair' }}
            >
                {/* Grid background */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#f1f5f9 1px, transparent 1px), linear-gradient(90deg, #f1f5f9 1px, transparent 1px)', backgroundSize: '15px 15px', pointerEvents: 'none', opacity: isReadOnly ? 0.3 : 1 }} />
                
                {/* SILHOUETTE SVG */}
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={bodyMapImg} alt="Body Chart" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.9, pointerEvents: 'none' }} />
                </div>

                {/* Markers */}
                {markers.map((marker, index) => {
                    const typeInfo = INJURY_TYPES.find(t => t.id === marker.type);
                    const size = isReadOnly ? '18px' : '28px';
                    return (
                        <div key={index} style={{
                            position: 'absolute', left: `${marker.x}%`, top: `${marker.y}%`, transform: 'translate(-50%, -50%)',
                            width: size, height: size, borderRadius: '50%', backgroundColor: typeInfo?.color || '#000',
                            color: 'white', fontSize: isReadOnly ? '8px' : '12px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 0 2px white, 0 4px 8px rgba(0,0,0,0.2)', pointerEvents: 'none', zIndex: index + 1
                        }}>
                            {marker.type}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* COLLAPSED VIEW: Professional Summary Card */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                border: '1.5px solid #f1f5f9',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                animation: 'fadeIn 0.4s ease-out'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '16px',
                        backgroundColor: '#eff6ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#3b82f6'
                    }}>
                        <MapIcon size={32} />
                    </div>
                    <div>
                        <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' }}>Editor de Diagrama Topográfico</h4>
                        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                            {safeData.markers.length > 0 
                                ? `✅ Se han registrado ${safeData.markers.length} marcaciones en el diagrama.`
                                : '📍 Sin marcaciones registradas todavía.'}
                        </p>
                    </div>
                </div>
                
                <button 
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        padding: '12px 24px',
                        borderRadius: '14px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#2563eb'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = '#3b82f6'}
                >
                    <Maximize2 size={18} /> {safeData.markers.length > 0 ? 'Editar Diagrama' : 'Abrir Editor'}
                </button>
            </div>

            {/* PREVIEW IMAGE AND NOTES - VISIBLE IN MAIN FORM */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.6s ease-out' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>VISTA PREVIA DEL DIAGRAMA</h4>
                    <BodyMapCanvas 
                        markers={safeData.markers} 
                        isReadOnly={true} 
                        maxWidth="450px" 
                        padding="20px"
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>NOTAS ACLARATORIAS DEL DIAGRAMA</h4>
                    <textarea
                        style={{ 
                            width: '100%', padding: '20px', borderRadius: '20px', border: '2px solid #e2e8f0', 
                            minHeight: '120px', fontSize: '15px', outline: 'none', backgroundColor: 'white', color: '#334155',
                            transition: 'all 0.2s', resize: 'vertical'
                        }}
                        value={safeData.comments}
                        onChange={(e) => onChange({ ...safeData, comments: e.target.value })}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        placeholder="Detalle hallazgos específicos analizados en el diagrama..."
                        disabled={readOnly}
                    />
                </div>
            </div>

            {/* MODAL EDITOR */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    padding: '20px',
                    animation: 'modalFadeIn 0.3s ease-out'
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '1200px',
                        height: '95vh',
                        backgroundColor: '#f8fafc',
                        borderRadius: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            padding: '24px 32px',
                            backgroundColor: 'white',
                            borderBottom: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ backgroundColor: '#eff6ff', padding: '8px', borderRadius: '10px', color: '#3b82f6' }}>
                                    <MapIcon size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Editor de Diagrama</h3>
                                    <span style={{ fontSize: '13px', color: '#64748b' }}>Haga clic en el diagrama para marcar las zonas afectadas</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: '#f1f5f9',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#64748b'
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            {/* Legend - Responsive Grid at TOP */}
                            <div style={{ backgroundColor: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px' }}>
                                <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>LEYENDA DE LESIONES</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                                    {INJURY_TYPES.map(type => (
                                        <div 
                                            key={type.id}
                                            onClick={() => {
                                                if (selectedType === type.id) {
                                                    setSelectedType(0);
                                                } else {
                                                    setSelectedType(type.id);
                                                }
                                            }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '12px',
                                                cursor: 'pointer', transition: 'all 0.2s',
                                                backgroundColor: selectedType === type.id ? `${type.color}15` : '#f8fafc',
                                                border: `2px solid ${selectedType === type.id ? type.color : 'transparent'}`,
                                            }}
                                        >
                                            <div style={{ minWidth: '24px', height: '24px', borderRadius: '50%', backgroundColor: type.color, color: 'white', fontSize: '11px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{type.id}</div>
                                            <span style={{ fontSize: '13px', fontWeight: selectedType === type.id ? '700' : '500', color: '#1e293b' }}>{type.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Canvas Section */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button onClick={removeLastMarker} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: 'white', fontSize: '14px', fontWeight: '700', color: '#475569', cursor: 'pointer' }}>
                                        <Undo2 size={18} /> Deshacer última
                                    </button>
                                    <button onClick={clearMarkers} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', border: '1px solid #fee2e2', backgroundColor: '#fff', fontSize: '14px', fontWeight: '700', color: '#ef4444', cursor: 'pointer' }}>
                                        <Eraser size={18} /> Limpiar todo
                                    </button>
                                </div>

                                <BodyMapCanvas 
                                    markers={safeData.markers} 
                                    onCanvasClick={handleCanvasClick} 
                                    canvasRef={containerRef} 
                                    maxWidth="650px" 
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{ padding: '24px 32px', backgroundColor: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                style={{
                                    padding: '14px 40px', borderRadius: '16px', backgroundColor: '#10b981', color: 'white',
                                    border: 'none', fontSize: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'
                                }}
                            >
                                <CheckCircle2 size={20} /> Guardar y Regresar
                            </button>
                        </div>
                    </div>

                    <style>{`
                        @keyframes modalFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                    `}</style>
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
                            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>¿Limpiar diagrama?</h3>
                            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', marginBottom: '28px' }}>
                                Esta acción eliminará permanentemente todas las marcas registradas en el mapa corporal.
                            </p>
                            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    style={{ flex: 1, backgroundColor: 'white', border: '1.5px solid #e2e8f0', color: '#64748b', padding: '12px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmClear}
                                    style={{ flex: 1, backgroundColor: '#ef4444', border: 'none', color: 'white', padding: '12px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)' }}
                                >
                                    Limpiar todo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
