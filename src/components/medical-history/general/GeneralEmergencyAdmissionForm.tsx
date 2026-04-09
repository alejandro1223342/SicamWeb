import React from 'react';
import api from '../../../api';

interface AdmissionData {
    date: string;
    time: string;
    age: string;
    civilStatus: string;
    occupation: string;
    insuranceType: 'IESS' | 'OTRO' | null;
    companionName: string;
    companionId: string;
    address: string;
    phone: string;
    arrivalMethod: 'AMBULATORIO' | 'SILLA DE RUEDAS' | 'CAMILLA' | null;
    informationSource: string;
    deliveryPerson: string;
    deliveryPhone: string;
}

interface GeneralEmergencyAdmissionFormProps {
    data: AdmissionData;
    onChange: (data: AdmissionData) => void;
    readOnly?: boolean;
    patient?: any;
}

const calculateAge = (birthDate: string | Date | null): string => {
    if (!birthDate) return '';
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age.toString();
};

export default function GeneralEmergencyAdmissionForm({ data, onChange, readOnly = false, patient }: GeneralEmergencyAdmissionFormProps) {
    const [civilStatusOptions, setCivilStatusOptions] = React.useState<string[]>([]);
    const [loadingOptions, setLoadingOptions] = React.useState(true);

    const isObject = (val: any) => val !== null && typeof val === 'object' && !Array.isArray(val);
    const safeData: AdmissionData = {
        date: '',
        time: '',
        age: '',
        civilStatus: '',
        occupation: '',
        insuranceType: null,
        companionName: '',
        companionId: '',
        address: '',
        phone: '',
        arrivalMethod: null,
        informationSource: '',
        deliveryPerson: '',
        deliveryPhone: '',
        ...(isObject(data) ? data : {})
    };

    // Fetch Catalogs
    React.useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                // Using relative path as the API instance usually has baseURL
                const response = await api.get('/catalogs/type/CIVIL_STATUS');
                const items = response.data?.data || response.data;
                if (Array.isArray(items)) {
                    setCivilStatusOptions(items.map(i => i.name));
                }
            } catch (error) {
                console.error('Error fetching civil status catalogs:', error);
                // Fallback to basic options if API fails
                setCivilStatusOptions(['SOLTERO/A', 'CASADO/A', 'DIVORCIADO/A', 'VIUDO/A', 'UNIÓN LIBRE']);
            } finally {
                setLoadingOptions(false);
            }
        };
        fetchCatalogs();
    }, []);

    // Auto-fill effect
    React.useEffect(() => {
        if (readOnly || !patient) return;

        const isNew = !safeData.date && !safeData.time;
        const updates: Partial<AdmissionData> = {};

        if (isNew) {
            const now = new Date();
            updates.date = now.toISOString().split('T')[0];
            updates.time = now.toTimeString().split(' ')[0].substring(0, 5);
        }

        // Fill fields if they are empty
        if (!safeData.age && patient.birthDate) updates.age = calculateAge(patient.birthDate);
        if (!safeData.civilStatus && patient.civilStatus) updates.civilStatus = patient.civilStatus;
        if (!safeData.occupation && (patient.jobDescription || patient.jobActivity)) {
            updates.occupation = patient.jobDescription || patient.jobActivity;
        }
        if (!safeData.address && patient.address) updates.address = patient.address;
        if (!safeData.phone && patient.phone) updates.phone = patient.phone;

        if (Object.keys(updates).length > 0) {
            onChange({ ...safeData, ...updates });
        }
    }, [patient, readOnly]);

    const handleChange = (field: keyof AdmissionData, value: any) => {
        if (readOnly) return;
        onChange({ ...safeData, [field]: value });
    };

    const handleToggle = (field: 'insuranceType' | 'arrivalMethod', value: string) => {
        if (readOnly) return;
        const newValue = safeData[field] === value ? null : value;
        onChange({ ...safeData, [field]: newValue });
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '10px',
        border: '1.5px solid #e2e8f0',
        fontSize: '15px',
        outline: 'none',
        transition: 'all 0.2s',
        backgroundColor: readOnly ? '#f8fafc' : 'white'
    };

    const labelStyle = {
        fontSize: '13px',
        fontWeight: '700',
        color: '#475569',
        marginBottom: '4px',
        display: 'block',
        textTransform: 'uppercase' as const
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Primary Details Grid - Updated to 2 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div>
                    <label style={labelStyle}>Fecha de atención</label>
                    <input
                        type="date"
                        style={inputStyle}
                        value={safeData.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Hora</label>
                    <input
                        type="time"
                        style={inputStyle}
                        value={safeData.time}
                        onChange={(e) => handleChange('time', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Edad</label>
                    <input
                        type="text"
                        placeholder="Ingresar edad"
                        style={inputStyle}
                        value={safeData.age}
                        onChange={(e) => handleChange('age', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Estado civil</label>
                    <select
                        style={inputStyle}
                        value={safeData.civilStatus}
                        onChange={(e) => handleChange('civilStatus', e.target.value)}
                        disabled={readOnly || loadingOptions}
                    >
                        <option value="">{loadingOptions ? 'Cargando...' : 'Seleccione'}</option>
                        {civilStatusOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={labelStyle}>Ocupación</label>
                    <input
                        type="text"
                        placeholder="Ingrese la ocupación"
                        style={inputStyle}
                        value={safeData.occupation}
                        onChange={(e) => handleChange('occupation', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Nº Seguro de Salud</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {['IESS', 'OTRO'].map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleToggle('insuranceType', opt)}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '2px solid',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    backgroundColor: safeData.insuranceType === opt ? '#fef2f2' : 'white',
                                    borderColor: safeData.insuranceType === opt ? '#ef4444' : '#e2e8f0',
                                    color: safeData.insuranceType === opt ? '#ef4444' : '#64748b'
                                }}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Companion Info Section */}
            <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', marginBottom: '16px', borderLeft: '4px solid #ef4444', paddingLeft: '12px' }}>
                    INFORMACIÓN DEL ACOMPAÑANTE
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={labelStyle}>Nombre del acompañante</label>
                        <input
                            type="text"
                            placeholder="Ingrese nombre completo"
                            style={inputStyle}
                            value={safeData.companionName}
                            onChange={(e) => handleChange('companionName', e.target.value)}
                            disabled={readOnly}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Nº Cédula de Identidad</label>
                        <input
                            type="text"
                            placeholder="Ingrese número de cédula"
                            style={inputStyle}
                            value={safeData.companionId}
                            onChange={(e) => handleChange('companionId', e.target.value)}
                            disabled={readOnly}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Dirección</label>
                        <input
                            type="text"
                            placeholder="Ingrese dirección domiciliaria"
                            style={inputStyle}
                            value={safeData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            disabled={readOnly}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Nº Teléfono</label>
                        <input
                            type="text"
                            placeholder="Ingrese número telefónico"
                            style={inputStyle}
                            value={safeData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            disabled={readOnly}
                        />
                    </div>
                </div>
            </div>

            {/* Detailed Info Grid - Updated to single column for stacking */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                <div>
                    <label style={labelStyle}>Forma de llegada</label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {['AMBULATORIO', 'SILLA DE RUEDAS', 'CAMILLA'].map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleToggle('arrivalMethod', opt)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: '2px solid',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    backgroundColor: safeData.arrivalMethod === opt ? '#fef2f2' : 'white',
                                    borderColor: safeData.arrivalMethod === opt ? '#ef4444' : '#e2e8f0',
                                    color: safeData.arrivalMethod === opt ? '#ef4444' : '#64748b'
                                }}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label style={labelStyle}>Fuente de información</label>
                    <input
                        type="text"
                        placeholder="Ingrese la fuente de información"
                        style={inputStyle}
                        value={safeData.informationSource}
                        onChange={(e) => handleChange('informationSource', e.target.value)}
                        disabled={readOnly}
                    />
                </div>

                <div>
                    <label style={labelStyle}>Institución o persona que entrega al paciente</label>
                    <input
                        type="text"
                        placeholder="Nombre de institución o persona"
                        style={inputStyle}
                        value={safeData.deliveryPerson}
                        onChange={(e) => handleChange('deliveryPerson', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Nº Teléfono (Institución/Persona)</label>
                    <input
                        type="text"
                        placeholder="Número de contacto"
                        style={inputStyle}
                        value={safeData.deliveryPhone}
                        onChange={(e) => handleChange('deliveryPhone', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
            </div>
        </div>
    );
}
