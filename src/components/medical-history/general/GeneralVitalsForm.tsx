import React, { useEffect } from 'react';

interface GeneralVitalsFormProps {
  data: any;
  onChange: (data: any) => void;
  readOnly?: boolean;
}

const GeneralVitalsForm: React.FC<GeneralVitalsFormProps> = ({ data = {}, onChange, readOnly }) => {
  const handleChange = (field: string, value: any) => {
    if (readOnly) return;
    onChange({ ...data, [field]: value });
  };

  useEffect(() => {
    const weight = parseFloat(data.weight);
    const height = parseFloat(data.height);
    if (weight > 0 && height > 0) {
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      if (data.bmi !== bmi) {
        handleChange('bmi', bmi);
      }
    }
  }, [data.weight, data.height]);

  const vitalFields = [
    { id: 'temperature', label: 'Temperatura', unit: '°C' },
    { id: 'bloodPressure', label: 'Presión Arterial', unit: 'mmHg' },
    { id: 'heartRate', label: 'Frecuencia Cardíaca', unit: 'bpm' },
    { id: 'respiratoryRate', label: 'Frecuencia Resp.', unit: 'rpm' },
    { id: 'oxygenSaturation', label: 'Saturación O2', unit: '%' },
    { id: 'weight', label: 'Peso', unit: 'kg' },
    { id: 'height', label: 'Estatura', unit: 'cm' },
    { id: 'bmi', label: 'IMC (Auto)', unit: 'kg/m²', readOnly: true },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#4f46e5', margin: '0', borderLeft: '4px solid #4f46e5', paddingLeft: '12px', textTransform: 'uppercase' }}>
          Signos Vitales y Antropometría
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {vitalFields.map(field => (
            <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>{field.label}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  style={{ width: '100%', padding: '10px 12px', paddingRight: '45px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: field.readOnly ? '#f8fafc' : 'white', outline: 'none' }}
                  value={data[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  disabled={readOnly || field.readOnly}
                />
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>
                  {field.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Observaciones Generales</label>
        <textarea
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '80px', fontSize: '14px', outline: 'none' }}
          value={data.observations || ''}
          onChange={(e) => handleChange('observations', e.target.value)}
          disabled={readOnly}
          placeholder="Apariencia general, estado de alerta, etc."
        />
      </div>
    </div>
  );
};

export default GeneralVitalsForm;
