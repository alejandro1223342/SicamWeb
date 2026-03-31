import { useState } from 'react';
import { Info, User, Layers } from 'lucide-react';

// Import assets
import maleBodyFront from '../../assets/body-map/male_body_front.png';
import maleBodyBack from '../../assets/body-map/male_body_back.png';
import femaleBodyFront from '../../assets/body-map/female_body_front.png';
import femaleBodyBack from '../../assets/body-map/female_body_back.png';
import faceMuscles from '../../assets/body-map/face_muscles.png';
import maleFace from '../../assets/body-map/male_face.png';
import femaleFace from '../../assets/body-map/female_face.png';

interface BodyMapFormProps {
    data: Record<string, number>;
    onChange: (data: Record<string, number>) => void;
    readOnly?: boolean;
    gender?: 'male' | 'female' | 'face' | 'face_male' | 'face_female';
}

const ROWS = 30;
const COLS = 20;

export default function BodyMapForm({ data, onChange, readOnly, gender = 'male' }: BodyMapFormProps) {
    const [view, setView] = useState<'front' | 'back'>('front');
    const [selectedCell, setSelectedCell] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');

    const handleCellClick = (row: number, col: number) => {
        if (readOnly) return;
        const cellId = `${view}-${row}-${col}`;
        setSelectedCell(cellId);
        setInputValue(data[cellId]?.toString() || '');
    };

    const handleSaveValue = () => {
        if (!selectedCell) return;
        const newValue = parseFloat(inputValue);
        const newData = { ...data };
        
        if (isNaN(newValue) || inputValue === '') {
            delete newData[selectedCell];
        } else {
            newData[selectedCell] = newValue;
        }
        
        onChange(newData);
        setSelectedCell(null);
    };

    const getBackgroundImage = () => {
        if (gender === 'male') return view === 'front' ? maleBodyFront : maleBodyBack;
        if (gender === 'female') return view === 'front' ? femaleBodyFront : femaleBodyBack;
        if (gender === 'face') return faceMuscles;
        if (gender === 'face_male') return maleFace;
        if (gender === 'face_female') return femaleFace;
        return maleBodyFront;
    };

    const renderGrid = () => {
        const cells = [];
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const cellId = `${view}-${r}-${c}`;
                const hasValue = data[cellId] !== undefined;
                
                cells.push(
                    <div
                        key={cellId}
                        onClick={() => handleCellClick(r, c)}
                        style={{
                            border: '1px solid rgba(0,0,0,0.03)',
                            backgroundColor: hasValue ? 'rgba(59, 130, 246, 0.5)' : 'transparent',
                            cursor: readOnly ? 'default' : 'pointer',
                            transition: 'all 0.1s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '9px',
                            fontWeight: '700',
                            color: '#1e3a8a',
                            zIndex: 2,
                            pointerEvents: 'auto'
                        }}
                        onMouseEnter={(e) => {
                            if (!readOnly && !hasValue) e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            if (!readOnly && !hasValue) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        {hasValue ? data[cellId] : ''}
                    </div>
                );
            }
        }
        return cells;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                    Mapa de Análisis {gender.includes('face') ? `Facial (${gender === 'face' ? 'Músculos' : (gender === 'face_male' ? 'Caballero' : 'Dama')})` : `Corporal (${gender === 'male' ? 'Hombre' : 'Mujer'})`}
                </h3>
                {!gender.includes('face') && (
                    <div style={{ display: 'flex', gap: '8px', padding: '4px', backgroundColor: '#f1f5f9', borderRadius: '12px' }}>
                        <button 
                            onClick={() => setView('front')}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '8px',
                                backgroundColor: view === 'front' ? 'white' : 'transparent',
                                boxShadow: view === 'front' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                color: view === 'front' ? '#3b82f6' : '#64748b',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <User size={16} /> Vista Frontal
                        </button>
                        <button 
                            onClick={() => setView('back')}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '8px',
                                backgroundColor: view === 'back' ? 'white' : 'transparent',
                                boxShadow: view === 'back' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                color: view === 'back' ? '#3b82f6' : '#64748b',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <Layers size={16} /> Vista Posterior
                        </button>
                    </div>
                )}
            </div>

            <div style={{ 
                position: 'relative', 
                width: '100%', 
                maxWidth: '100%', 
                height: '700px',
                minHeight: '600px',
                margin: '0 auto',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '0',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
            }}>
                {/* Visual Background */}
                <div style={{ 
                    position: 'absolute', 
                    top: '0', 
                    left: '0', 
                    right: '0', 
                    bottom: '0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <img 
                        src={getBackgroundImage()} 
                        alt="Background" 
                        style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'fill',
                            opacity: 1
                        }} 
                    />
                </div>

                {/* Grid Overlay */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                    gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    zIndex: 5
                }}>
                    {renderGrid()}
                </div>

                {/* Popover for value entry */}
                {selectedCell && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '16px',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                        border: '1px solid #e2e8f0',
                        zIndex: 100,
                        width: '200px'
                    }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>
                            Ingresar Valor
                        </div>
                        <input 
                            autoFocus
                            type="number" 
                            step="0.1"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveValue()}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '2px solid #3b82f6',
                                fontSize: '18px',
                                fontWeight: '700',
                                outline: 'none',
                                marginBottom: '12px'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                                onClick={() => setSelectedCell(null)}
                                style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer' }}
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleSaveValue}
                                style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: 'white', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ 
                display: 'flex', 
                gap: '12px', 
                padding: '16px', 
                backgroundColor: '#f8fafc', 
                borderRadius: '12px',
                fontSize: '13px',
                color: '#64748b',
                alignItems: 'center'
            }}>
                <Info size={18} color="#3b82f6" />
                <span>Haga clic en una celda para registrar un valor. Las zonas marcadas se guardarán automáticamente en la historia clínica.</span>
            </div>
        </div>
    );
}
