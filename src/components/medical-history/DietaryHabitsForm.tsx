import { Utensils, Clock, MapPin, Heart, XOctagon } from 'lucide-react';

interface DietaryHabitsFormProps {
    data: {
        unwantedFoods: string;
        favoriteFoods: string;
        breakfastLocation: string;
        breakfastTime: string;
        lunchLocation: string;
        lunchTime: string;
        dinnerLocation: string;
        dinnerTime: string;
    };
    onChange: (data: any) => void;
    readOnly?: boolean;
}

export default function DietaryHabitsForm({ data, onChange, readOnly }: DietaryHabitsFormProps) {
    const handleChange = (field: string, value: string) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        fontSize: '14px',
        marginTop: '8px',
        outline: 'none',
        backgroundColor: readOnly ? '#f8fafc' : 'white',
        transition: 'border-color 0.2s',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
    };

    const textareaStyle = {
        ...inputStyle,
        minHeight: '120px',
        resize: 'vertical' as const,
        lineHeight: '1.5'
    };

    const labelStyle = {
        fontSize: '13px',
        fontWeight: '700',
        color: '#475569',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.025em'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Utensils size={24} color="#10b981" /> Hábitos Dietéticos y Preferencias
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                    <div style={{ gridColumn: 'span 1' }}>
                        <label style={labelStyle}><XOctagon size={16} color="#ef4444" /> Alimentos no deseados(*)</label>
                        <textarea 
                            value={data.unwantedFoods} 
                            onChange={(e) => handleChange('unwantedFoods', e.target.value)} 
                            disabled={readOnly} 
                            style={textareaStyle} 
                            placeholder="Ingrese los alimentos que prefiere evitar" 
                        />
                    </div>

                    <div style={{ gridColumn: 'span 1' }}>
                        <label style={labelStyle}><Heart size={16} color="#ec4899" /> Alimentos favoritos(*)</label>
                        <textarea 
                            value={data.favoriteFoods} 
                            onChange={(e) => handleChange('favoriteFoods', e.target.value)} 
                            disabled={readOnly} 
                            style={textareaStyle} 
                            placeholder="Ingrese sus alimentos preferidos" 
                        />
                    </div>
                </div>
            </div>

            <div style={{ height: '1px', backgroundColor: '#f1f5f9' }}></div>

            {/* Meals Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {/* Breakfast */}
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#334155', marginBottom: '16px', borderLeft: '4px solid #fbbf24', paddingLeft: '12px' }}>DESAYUNO</h4>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}><MapPin size={14} /> Dónde desayuna(*)</label>
                        <input 
                            type="text"
                            value={data.breakfastLocation} 
                            onChange={(e) => handleChange('breakfastLocation', e.target.value)} 
                            disabled={readOnly} 
                            style={inputStyle} 
                            placeholder="Lugar del desayuno" 
                        />
                    </div>
                    <div>
                        <label style={labelStyle}><Clock size={14} /> Hora desayuna(*)</label>
                        <input 
                            type="time" 
                            value={data.breakfastTime} 
                            onChange={(e) => handleChange('breakfastTime', e.target.value)} 
                            disabled={readOnly} 
                            style={inputStyle} 
                        />
                    </div>
                </div>

                {/* Lunch */}
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#334155', marginBottom: '16px', borderLeft: '4px solid #3b82f6', paddingLeft: '12px' }}>ALMUERZO</h4>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}><MapPin size={14} /> Dónde almuerza(*)</label>
                        <input 
                            type="text"
                            value={data.lunchLocation} 
                            onChange={(e) => handleChange('lunchLocation', e.target.value)} 
                            disabled={readOnly} 
                            style={inputStyle} 
                            placeholder="Lugar del almuerzo" 
                        />
                    </div>
                    <div>
                        <label style={labelStyle}><Clock size={14} /> Hora almuerzo(*)</label>
                        <input 
                            type="time" 
                            value={data.lunchTime} 
                            onChange={(e) => handleChange('lunchTime', e.target.value)} 
                            disabled={readOnly} 
                            style={inputStyle} 
                        />
                    </div>
                </div>

                {/* Dinner */}
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#334155', marginBottom: '16px', borderLeft: '4px solid #1e293b', paddingLeft: '12px' }}>CENA</h4>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}><MapPin size={14} /> Dónde cena(*)</label>
                        <input 
                            type="text"
                            value={data.dinnerLocation} 
                            onChange={(e) => handleChange('dinnerLocation', e.target.value)} 
                            disabled={readOnly} 
                            style={inputStyle} 
                            placeholder="Lugar de la cena" 
                        />
                    </div>
                    <div>
                        <label style={labelStyle}><Clock size={14} /> Hora cena(*)</label>
                        <input 
                            type="time" 
                            value={data.dinnerTime} 
                            onChange={(e) => handleChange('dinnerTime', e.target.value)} 
                            disabled={readOnly} 
                            style={inputStyle} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
