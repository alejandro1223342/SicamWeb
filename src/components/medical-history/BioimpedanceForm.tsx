import { Activity, Zap, Droplets, Target, Layers, TrendingUp, UserCheck, Flame } from 'lucide-react';

interface BioimpedanceFormProps {
    data: {
        totalFat: string;
        upperFat: string;
        lowerFat: string;
        visceralFat: string;
        fatFreeMass: string;
        muscleMass: string;
        boneWeight: string;
        bodyWater: string;
        metabolicAge: string;
    };
    onChange: (data: any) => void;
    readOnly?: boolean;
}

export default function BioimpedanceForm({ data, onChange, readOnly }: BioimpedanceFormProps) {
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
        color: '#334155'
    };

    const labelStyle = {
        fontSize: '12px',
        fontWeight: '700',
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
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
        padding: '8px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '12px',
        width: 'fit-content'
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Activity size={24} color="#6366f1" /> Análisis de Bioimpedancia
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                    
                    {/* Total Fat */}
                    <div style={cardStyle}>
                        <div style={iconContainerStyle('#f59e0b')}>
                            <Target size={20} color="#f59e0b" />
                        </div>
                        <label style={labelStyle}>Grasa total (*)</label>
                        <input 
                            type="text"
                            value={data.totalFat} 
                            onChange={(e) => handleChange('totalFat', e.target.value)} 
                            disabled={readOnly} 
                            style={inputStyle} 
                            placeholder="Grasa total %" 
                        />
                    </div>

                    {/* Upper Fat */}
                    <div style={cardStyle}>
                        <div style={iconContainerStyle('#f59e0b')}>
                            <Layers size={20} color="#f59e0b" />
                        </div>
                        <label style={labelStyle}>Grasa sección superior (*)</label>
                        <input 
                            type="text"
                            value={data.upperFat} 
                            onChange={(e) => handleChange('upperFat', e.target.value)} 
                            disabled={readOnly} 
                            style={inputStyle} 
                            placeholder="Grasa superior %" 
                        />
                    </div>

                    {/* Lower Fat */}
                    <div style={cardStyle}>
                        <div style={iconContainerStyle('#f59e0b')}>
                            <Layers size={20} color="#f59e0b" />
                        </div>
                        <label style={labelStyle}>Grasa sección inferior (*)</label>
                        <input 
                            type="text"
                            value={data.lowerFat} 
                            onChange={(e) => handleChange('lowerFat', e.target.value)} 
                            disabled={readOnly} 
                            style={inputStyle} 
                            placeholder="Grasa inferior %" 
                        />
                    </div>

                    {/* Visceral Fat */}
                    <div style={cardStyle}>
                        <div style={iconContainerStyle('#ef4444')}>
                            <Activity size={20} color="#ef4444" />
                        </div>
                        <label style={labelStyle}>Grasa visceral (*)</label>
                        <input 
                            type="text"
                            value={data.visceralFat} 
                            onChange={(e) => handleChange('visceralFat', e.target.value)} 
                            disabled={readOnly} 
                            style={inputStyle} 
                            placeholder="Nivel grasa visceral" 
                        />
                    </div>

                    {/* Fat Free Mass */}
                    <div style={cardStyle}>
                        <div style={iconContainerStyle('#10b981')}>
                            <TrendingUp size={20} color="#10b981" />
                        </div>
                        <label style={labelStyle}>Masa libre de grasa (*)</label>
                        <input 
                            type="text"
                            value={data.fatFreeMass} 
                            onChange={(e) => handleChange('fatFreeMass', e.target.value)} 
                            disabled={readOnly} 
                            style={inputStyle} 
                            placeholder="Masa libre de grasa kg" 
                        />
                    </div>

                    {/* Muscle Mass */}
                    <div style={cardStyle}>
                        <div style={iconContainerStyle('#10b981')}>
                            <Zap size={20} color="#10b981" />
                        </div>
                        <label style={labelStyle}>Masa muscular (*)</label>
                        <input 
                            type="text"
                            value={data.muscleMass} 
                            onChange={(e) => handleChange('muscleMass', e.target.value)} 
                            disabled={readOnly} 
                            style={inputStyle} 
                            placeholder="Masa muscular kg" 
                        />
                    </div>

                    {/* Bone Weight */}
                    <div style={cardStyle}>
                        <div style={iconContainerStyle('#64748b')}>
                            <UserCheck size={20} color="#64748b" />
                        </div>
                        <label style={labelStyle}>Peso óseo (*)</label>
                        <input 
                            type="text"
                            value={data.boneWeight} 
                            onChange={(e) => handleChange('boneWeight', e.target.value)} 
                            disabled={readOnly} 
                            style={inputStyle} 
                            placeholder="Peso óseo kg" 
                        />
                    </div>

                    {/* Body Water */}
                    <div style={cardStyle}>
                        <div style={iconContainerStyle('#0ea5e9')}>
                            <Droplets size={20} color="#0ea5e9" />
                        </div>
                        <label style={labelStyle}>Agua corporal (*)</label>
                        <input 
                            type="text"
                            value={data.bodyWater} 
                            onChange={(e) => handleChange('bodyWater', e.target.value)} 
                            disabled={readOnly} 
                            style={inputStyle} 
                            placeholder="Agua corporal %" 
                        />
                    </div>

                    {/* Metabolic Age */}
                    <div style={cardStyle}>
                        <div style={iconContainerStyle('#ec4899')}>
                            <Flame size={20} color="#ec4899" />
                        </div>
                        <label style={labelStyle}>Edad metabólica (*)</label>
                        <input 
                            type="text"
                            value={data.metabolicAge} 
                            onChange={(e) => handleChange('metabolicAge', e.target.value)} 
                            disabled={readOnly} 
                            style={inputStyle} 
                            placeholder="Años" 
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}
