import React from 'react';

interface GeneralAnamnesisFormProps {
  data: any;
  onChange: (data: any) => void;
  readOnly?: boolean;
}

const GeneralAnamnesisForm: React.FC<GeneralAnamnesisFormProps> = ({ data = {}, onChange, readOnly }) => {
  const handleChange = (field: string, value: any) => {
    if (readOnly) return;
    onChange({ ...data, [field]: value });
  };

  const sections = [
    {
      title: '1. MOTIVO DE CONSULTA Y ENFERMEDAD ACTUAL',
      fields: [
        { id: 'reason', label: 'Motivo de consulta', type: 'textarea' },
        { id: 'currentIllness', label: 'Enfermedad Actual', type: 'textarea' },
      ]
    },
    {
      title: '2. ANTECEDENTES PERSONALES Y FAMILIARES',
      fields: [
        { id: 'personalHistory', label: 'Antecedentes Personales (Clínicos, Quirúrgicos)', type: 'textarea' },
        { id: 'familyHistory', label: 'Antecedentes Familiares', type: 'textarea' },
        { id: 'allergies', label: 'Alergias', type: 'text' },
      ]
    },
    {
      title: '3. REVISIÓN POR SISTEMAS',
      fields: [
        { id: 'reviewSystems', label: 'Hallazgos por sistemas', type: 'textarea' },
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {sections.map((section, sIdx) => (
        <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#4f46e5', margin: '0', borderLeft: '4px solid #4f46e5', paddingLeft: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {section.title}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {section.fields.map(field => (
              <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '100px', fontSize: '14px', transition: 'border-color 0.2s', outline: 'none' }}
                    value={data[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    disabled={readOnly}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                ) : (
                  <input
                    type="text"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', transition: 'border-color 0.2s', outline: 'none' }}
                    value={data[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    disabled={readOnly}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GeneralAnamnesisForm;
