import { ClipboardList, Utensils, AlertTriangle, Brain, Stethoscope, Pizza } from 'lucide-react';

interface OtherNutritionDataFormProps {
    data: {
        giSymptoms: string;
        physicalSigns: string;
        foodAllergies: string;
        foodIntolerances: string;
        mealCount: string;
        mealSchedules: string;
        habitualDiet: string;
        foodFeelings: string;
    };
    onChange: (data: any) => void;
    readOnly?: boolean;
}

export default function OtherNutritionDataForm({ data, onChange, readOnly }: OtherNutritionDataFormProps) {
    const handleChange = (field: string, value: string) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const sharedStyle = {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        fontSize: '13px',
        marginTop: '6px',
        outline: 'none',
        backgroundColor: readOnly ? '#f8fafc' : 'white',
        transition: 'all 0.2s',
        color: '#334155',
        fontFamily: 'inherit'
    };

    const labelStyle = {
        fontSize: '11px',
        fontWeight: '700',
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.025em'
    };

    const cardStyle = (fullWidth: boolean = false) => ({
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '4px',
        gridColumn: fullWidth ? '1 / -1' : 'auto'
    });

    const iconContainerStyle = (color: string) => ({
        backgroundColor: `${color}10`,
        padding: '6px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '8px',
        width: 'fit-content'
    });

    const renderField = (field: string, label: string, placeholder: string, color: string, icon: any, type: 'input' | 'textarea' = 'textarea', fullWidth: boolean = false) => (
        <div key={field} style={cardStyle(fullWidth)}>
            <div style={iconContainerStyle(color)}>
                {icon}
            </div>
            <label style={labelStyle}>{label} (*)</label>
            {type === 'textarea' ? (
                <textarea 
                    value={(data as any)[field] || ''} 
                    onChange={(e) => handleChange(field, e.target.value)} 
                    disabled={readOnly} 
                    style={{ ...sharedStyle, minHeight: '80px', resize: 'vertical' } as any} 
                    placeholder={placeholder} 
                />
            ) : (
                <input 
                    type="text"
                    value={(data as any)[field] || ''} 
                    onChange={(e) => handleChange(field, e.target.value)} 
                    disabled={readOnly} 
                    style={sharedStyle} 
                    placeholder={placeholder} 
                />
            )}
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ClipboardList size={24} color="#3b82f6" /> Otros Datos Clínicos y Dietéticos
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                    {renderField('giSymptoms', 'Síntomas gastrointestinales', 'Describa cualquier síntoma gastrointestinal...', '#ef4444', <Stethoscope size={18} color="#ef4444" />)}
                    {renderField('physicalSigns', 'Signos físicos', 'Describa signos físicos observados...', '#f59e0b', <ClipboardList size={18} color="#f59e0b" />)}
                    {renderField('foodAllergies', 'Alergias alimentarias', 'Liste alergias alimentarias...', '#ef4444', <AlertTriangle size={18} color="#ef4444" />)}
                    {renderField('foodIntolerances', 'Intolerancias alimentarias', 'Liste intolerancias alimentarias...', '#f59e0b', <AlertTriangle size={18} color="#f59e0b" />)}
                    
                    {renderField('mealCount', 'Número de comidas', 'Ej: 5 comidas al día', '#10b981', <Utensils size={18} color="#10b981" />, 'input')}
                    {renderField('mealSchedules', 'Horarios fijos o variados', 'Describa sus horarios habituales...', '#3b82f6', <ClipboardList size={18} color="#3b82f6" />, 'input')}
                    
                    {renderField('habitualDiet', 'Dieta habitual', 'Describa su dieta diaria típica...', '#10b981', <Pizza size={18} color="#10b981" />, 'textarea', true)}
                    {renderField('foodFeelings', 'Sentimientos relacionados con la comida', '¿Cómo se siente emocionalmente respecto a la comida?', '#6366f1', <Brain size={18} color="#6366f1" />, 'textarea', true)}
                </div>
            </div>
        </div>
    );
}
