import React from 'react';

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

  const fields = [
    { id: 'date', label: 'Fecha(*)', type: 'date', placeholder: 'dd/mm/aaaa' },
    { id: 'bloodPressure', label: 'Presión arterial(*)', type: 'text', placeholder: 'Ingrese la presión.' },
    { id: 'pulse', label: 'Pulso X min(*)', type: 'text', placeholder: 'Ingrese el pulso.' },
    { id: 'temperature', label: 'Temperatura °C(*)', type: 'text', placeholder: 'Ingrese la temperatura.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#9d174d', margin: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '10px' }}>▼</span> 06-Signos vitales
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '24px', 
        padding: '32px', 
        backgroundColor: '#fff', 
        border: '1px solid #f1f5f9', 
        borderRadius: '12px' 
      }}>
        {fields.map(field => (
          <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>{field.label}</label>
            <input
              type={field.type}
              style={{ 
                width: '100%', 
                padding: '10px 14px', 
                borderRadius: '6px', 
                border: '1px solid #e2e8f0', 
                fontSize: '14px', 
                outline: 'none',
                backgroundColor: readOnly ? '#f8fafc' : 'white',
                color: '#334155'
              }}
              value={data[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              disabled={readOnly}
              placeholder={field.placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneralVitalsForm;
