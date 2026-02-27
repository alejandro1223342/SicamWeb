
interface Props {
    data: any;
    onChange: (data: any) => void;
    onSave?: () => void;
}

export default function EmergencyContactForm({ data, onChange, onSave }: Props) {
    const handleChange = (field: string, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="section-container" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
                Contactos de emergencia
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '500', color: '#475569', marginBottom: '8px', display: 'block' }}>Nombre contacto de emergencia(*)</label>
                    <input
                        type="text"
                        className="form-input"
                        value={data?.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', transition: 'border-color 0.2s' }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '500', color: '#475569', marginBottom: '8px', display: 'block' }}>Parentesco(*)</label>
                    <select
                        className="form-input"
                        value={data?.relation || ''}
                        onChange={(e) => handleChange('relation', e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', backgroundColor: 'white', transition: 'border-color 0.2s' }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                    >
                        <option value="">Seleccione</option>
                        <option value="Padre/Madre">Padre/Madre</option>
                        <option value="Esposo(a)">Esposo(a)</option>
                        <option value="Hijo(a)">Hijo(a)</option>
                        <option value="Hermano(a)">Hermano(a)</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '500', color: '#475569', marginBottom: '8px', display: 'block' }}>Teléfono(*)</label>
                    <input
                        type="tel"
                        className="form-input"
                        value={data?.phone || ''}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', transition: 'border-color 0.2s' }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                    />
                </div>
            </div>

            <div className="form-group" style={{ marginTop: '20px' }}>
                <label className="form-label" style={{ fontWeight: '500', color: '#475569', marginBottom: '8px', display: 'block' }}>Dirección(*)</label>
                <input
                    type="text"
                    className="form-input"
                    value={data?.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
            </div>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
                <button
                    onClick={(e) => { e.preventDefault(); onSave && onSave(); }}
                    style={{ backgroundColor: '#22c55e', color: 'white', padding: '10px 32px', borderRadius: '6px', fontWeight: '500', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#22c55e'}
                >
                    Guardar sección
                </button>
            </div>
        </div>
    );
}
