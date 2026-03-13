import { Ruler, MoveHorizontal, PersonStanding, CircleDot } from 'lucide-react';

interface PerimetersFormProps {
    data: {
        cephalic: string;
        neck: string;
        midArmRelaxed: string;
        midArmContracted: string;
        forearm: string;
        wrist: string;
        mesosternal: string;
        umbilical: string;
        waist: string;
        hip: string;
        thigh1cm: string;
        midThigh: string;
        calf: string;
        ankle: string;
    };
    onChange: (data: any) => void;
    readOnly?: boolean;
}

export default function PerimetersForm({ data, onChange, readOnly }: PerimetersFormProps) {
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

    const groupTitleStyle = {
        fontSize: '14px',
        fontWeight: '800',
        color: '#334155',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '2px solid #f1f5f9',
        paddingBottom: '8px'
    };


    const renderField = (field: string, label: string, placeholder: string, icon: any) => (
        <div key={field} style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>{icon} {label} (*)</label>
            <input 
                type="text"
                value={(data as any)[field]} 
                onChange={(e) => handleChange(field, e.target.value)} 
                disabled={readOnly} 
                style={inputStyle} 
                placeholder={placeholder} 
            />
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Ruler size={24} color="#0ea5e9" /> Mediciones de Perímetros (cm)
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                    
                    {/* Superior Trunk & Head */}
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h4 style={groupTitleStyle}><CircleDot size={18} color="#6366f1" /> Cabeza y Cuello</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {renderField('cephalic', 'Cefálico', 'cm', null)}
                            {renderField('neck', 'Cuello', 'cm', null)}
                        </div>
                    </div>

                    {/* Arms */}
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h4 style={groupTitleStyle}><PersonStanding size={18} color="#10b981" /> Extremidades Superiores</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {renderField('midArmRelaxed', 'Brazo relajado', 'cm', null)}
                            {renderField('midArmContracted', 'Brazo contraído', 'cm', null)}
                            {renderField('forearm', 'Antebrazo', 'cm', null)}
                            {renderField('wrist', 'Muñeca', 'cm', null)}
                        </div>
                    </div>

                    {/* Trunk */}
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h4 style={groupTitleStyle}><MoveHorizontal size={18} color="#f59e0b" /> Tronco</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {renderField('mesosternal', 'Mesoesternal', 'cm', null)}
                            {renderField('umbilical', 'Umbilical', 'cm', null)}
                            {renderField('waist', 'Cintura', 'cm', null)}
                            {renderField('hip', 'Cadera', 'cm', null)}
                        </div>
                    </div>

                    {/* Lower Limbs */}
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h4 style={groupTitleStyle}><PersonStanding size={18} color="#ec4899" /> Extremidades Inferiores</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {renderField('thigh1cm', 'Muslo (1cm)', 'cm', null)}
                            {renderField('midThigh', 'Muslo medio', 'cm', null)}
                            {renderField('calf', 'Pantorrilla', 'cm', null)}
                            {renderField('ankle', 'Tobillo', 'cm', null)}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
