import { Dumbbell, Activity } from 'lucide-react';

interface PhysicalActivityFormProps {
    data: {
        activities: string;
    };
    onChange: (data: any) => void;
    readOnly?: boolean;
}

export default function PhysicalActivityForm({ data, onChange, readOnly }: PhysicalActivityFormProps) {
    const handleChange = (field: string, value: string) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const textareaStyle = {
        width: '100%',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        fontSize: '15px',
        marginTop: '8px',
        outline: 'none',
        backgroundColor: readOnly ? '#f8fafc' : 'white',
        transition: 'all 0.2s ease',
        minHeight: '180px',
        resize: 'vertical' as const,
        color: '#334155'
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
                    <Activity size={24} color="#3b82f6" /> Actividades Físicas
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Main Description */}
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ backgroundColor: '#eff6ff', padding: '8px', borderRadius: '8px' }}>
                                <Dumbbell size={20} color="#3b82f6" />
                            </div>
                            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#334155' }}>ACTIVIDADES DEPORTIVAS</h4>
                        </div>
                        <label style={labelStyle}>Ingrese las actividades deportivas(*)</label>
                        <textarea 
                            value={data.activities} 
                            onChange={(e) => handleChange('activities', e.target.value)} 
                            disabled={readOnly} 
                            style={textareaStyle} 
                            placeholder="Ingrese las actividades deportivas..." 
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}
