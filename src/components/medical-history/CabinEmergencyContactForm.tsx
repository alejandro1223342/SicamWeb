import { useState, useEffect } from 'react';
import api from '../../api';

interface Props {
    data: {
        name: string;
        relation: string;
        phone: string;
        address: string;
    };
    onChange: (data: any) => void;
    readOnly?: boolean;
}

export default function CabinEmergencyContactForm({ data, onChange, readOnly = false }: Props) {
    const [options, setOptions] = useState<{ id: string, name: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await api.get('/catalogs/type/RELATION');
                setOptions(response.data);
            } catch (error) {
                console.error("Error fetching relationship options:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOptions();
    }, []);

    const handleChange = (field: string, value: string) => {
        if (readOnly) return;
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
                        readOnly={readOnly}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', transition: 'border-color 0.2s', backgroundColor: readOnly ? '#f8fafc' : 'white' }}
                        onFocus={(e) => { if (!readOnly) e.target.style.borderColor = '#3b82f6'; }}
                        onBlur={(e) => { if (!readOnly) e.target.style.borderColor = '#cbd5e1'; }}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '500', color: '#475569', marginBottom: '8px', display: 'block' }}>Parentesco(*)</label>
                    <select
                        className="form-input"
                        value={data?.relation || ''}
                        onChange={(e) => handleChange('relation', e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', backgroundColor: readOnly ? '#f8fafc' : 'white', transition: 'border-color 0.2s' }}
                        onFocus={(e) => { if (!readOnly) e.target.style.borderColor = '#3b82f6'; }}
                        onBlur={(e) => { if (!readOnly) e.target.style.borderColor = '#cbd5e1'; }}
                        disabled={loading || readOnly}
                    >
                        <option value="">{loading ? 'Cargando...' : 'Seleccione'}</option>
                        {options.map((opt) => (
                            <option key={opt.id} value={opt.name}>
                                {opt.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '500', color: '#475569', marginBottom: '8px', display: 'block' }}>Teléfono(*)</label>
                    <input
                        type="tel"
                        className="form-input"
                        value={data?.phone || ''}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        readOnly={readOnly}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', transition: 'border-color 0.2s', backgroundColor: readOnly ? '#f8fafc' : 'white' }}
                        onFocus={(e) => { if (!readOnly) e.target.style.borderColor = '#3b82f6'; }}
                        onBlur={(e) => { if (!readOnly) e.target.style.borderColor = '#cbd5e1'; }}
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
                    readOnly={readOnly}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', transition: 'border-color 0.2s', backgroundColor: readOnly ? '#f8fafc' : 'white' }}
                    onFocus={(e) => { if (!readOnly) e.target.style.borderColor = '#3b82f6'; }}
                    onBlur={(e) => { if (!readOnly) e.target.style.borderColor = '#cbd5e1'; }}
                />
            </div>
        </div>
    );
}
