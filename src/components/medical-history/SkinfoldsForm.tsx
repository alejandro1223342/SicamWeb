import { Layers, Activity, Target, Zap } from 'lucide-react';

interface SkinfoldsFormProps {
    data: {
        subscapular: string;
        triceps: string;
        biceps: string;
        iliacCrest: string;
        supraspinal: string;
        abdominal: string;
        frontThigh: string;
        medialCalf: string;
        medialAxillary: string;
        pectoral: string;
    };
    onChange: (data: any) => void;
    readOnly?: boolean;
}

export default function SkinfoldsForm({ data, onChange, readOnly }: SkinfoldsFormProps) {
    const handleChange = (field: string, value: string) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        fontSize: '13px',
        marginTop: '6px',
        outline: 'none',
        backgroundColor: readOnly ? '#f8fafc' : 'white',
        transition: 'all 0.2s',
        color: '#334155'
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

    const cardStyle = {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '4px'
    };

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

    const renderCard = (field: string, label: string, color: string, icon: any) => (
        <div key={field} style={cardStyle}>
            <div style={iconContainerStyle(color)}>
                {icon}
            </div>
            <label style={labelStyle}>{label} (*)</label>
            <input 
                type="text"
                value={(data as any)[field]} 
                onChange={(e) => handleChange(field, e.target.value)} 
                disabled={readOnly} 
                style={inputStyle} 
                placeholder="mm" 
            />
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Layers size={24} color="#6366f1" /> Pliegues Cutáneos (mm)
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    {renderCard('subscapular', 'Subescapular', '#f59e0b', <Target size={18} color="#f59e0b" />)}
                    {renderCard('triceps', 'Tríceps', '#3b82f6', <Activity size={18} color="#3b82f6" />)}
                    {renderCard('biceps', 'Bíceps', '#3b82f6', <Zap size={18} color="#3b82f6" />)}
                    {renderCard('iliacCrest', 'Cresta ilíaca', '#10b981', <Layers size={18} color="#10b981" />)}
                    {renderCard('supraspinal', 'Supraespinal', '#10b981', <Layers size={18} color="#10b981" />)}
                    {renderCard('abdominal', 'Abdominal', '#ef4444', <Activity size={18} color="#ef4444" />)}
                    {renderCard('frontThigh', 'Muslo frontal', '#8b5cf6', <Activity size={18} color="#8b5cf6" />)}
                    {renderCard('medialCalf', 'Pantorrilla medial', '#8b5cf6', <Activity size={18} color="#8b5cf6" />)}
                    {renderCard('medialAxillary', 'Axilar medial', '#64748b', <Layers size={18} color="#64748b" />)}
                    {renderCard('pectoral', 'Pectoral', '#64748b', <Layers size={18} color="#64748b" />)}
                </div>
            </div>
        </div>
    );
}
