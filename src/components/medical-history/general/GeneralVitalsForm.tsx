import React from 'react';

interface GeneralVitalsFormProps {
  data: any;
  onChange: (data: any) => void;
  readOnly?: boolean;
  title?: string;
  hideTitle?: boolean;
}

const GeneralVitalsForm: React.FC<GeneralVitalsFormProps> = ({ data = {}, onChange, readOnly, title, hideTitle = false }) => {
  const handleChange = (field: string, value: any) => {
    if (readOnly) return;
    onChange({ ...data, [field]: value });
  };

  const handleNumericUpdate = (field: string, value: string) => {
    if (readOnly) return;
    // Allow only digits and decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points
    const parts = cleanValue.split('.');
    const finalValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
    handleChange(field, finalValue);
  };

  const fields = [
    { id: 'bloodPressure', label: 'Presión arterial', placeholder: 'Ej: 120/80' },
    { id: 'heartRate', label: 'Frecuencia cardiaca min', placeholder: 'Ej: 75' },
    { id: 'respiratoryRate', label: 'Frecuencia respira min', placeholder: 'Ej: 18' },
    { id: 'oralTemp', label: 'Temperatura bucal °C', placeholder: 'Ej: 36.5' },
    { id: 'axillaryTemp', label: 'Temperatura axilar °C', placeholder: 'Ej: 36.2' },
    { id: 'weight', label: 'Peso Kg', placeholder: 'Ej: 70' },
    { id: 'height', label: 'Talla m', placeholder: 'Ej: 1.75' },
    { id: 'bmi', label: 'Masa corporal', placeholder: 'Ej: 22.5' },
    { id: 'headCircumference', label: 'Perimetro cefalic cm', placeholder: 'Ej: 54' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {!hideTitle && (
        <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
           {title || '06-Signos vitales y mediciones'}
        </h3>
      )}
      
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
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>{field.label}</label>
            <input
              type="text"
              style={{ 
                width: '100%', 
                padding: '12px 14px', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0', 
                fontSize: '14px', 
                outline: 'none',
                backgroundColor: readOnly ? '#f8fafc' : 'white',
                color: '#334155',
                transition: 'all 0.2s'
              }}
              value={data[field.id] || ''}
              onChange={(e) => field.id === 'bloodPressure' ? handleChange(field.id, e.target.value) : handleNumericUpdate(field.id, e.target.value)}
              disabled={readOnly}
              placeholder={field.placeholder}
              onFocus={(e) => !readOnly && (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneralVitalsForm;
