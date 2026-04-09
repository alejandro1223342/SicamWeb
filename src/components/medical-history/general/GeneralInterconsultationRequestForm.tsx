import React from 'react';
import SectionNavigator from '../SectionNavigator';
import GeneralDiagnosisForm from './GeneralDiagnosisForm';
import GeneralInterconsultationReasonForm from './GeneralInterconsultationReasonForm';

interface GeneralInterconsultationRequestFormProps {
  data: any;
  onChange: (data: any) => void;
  readOnly?: boolean;
}

const GeneralInterconsultationRequestForm: React.FC<GeneralInterconsultationRequestFormProps> = ({ data = {}, onChange, readOnly }) => {
  const handleChange = (field: string, value: any) => {
    if (readOnly) return;
    onChange({ ...data, [field]: value });
  };

  const sections = [
    { id: 'clinicalReason', title: '01-Motivo y destino de solicitud' },
    { id: 'currentIllness', title: '02-Cuadro clínico actual' },
    { id: 'diagnosticsResults', title: '03-Resultados de las pruebas diagnósticas' },
    { id: 'diagnosis', title: '04-Diagnósticos' },
    { id: 'therapeuticPlan', title: '05-Plan terapéutico realizado' },
    { id: 'educationalPlan', title: '06-Plan educacional realizado' }
  ];

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'clinicalReason':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
              01-Motivo y destino de solicitud
            </h3>
            <GeneralInterconsultationReasonForm 
              data={data.clinicalReason || {}} 
              onChange={(d) => handleChange('clinicalReason', d)} 
              readOnly={readOnly} 
            />
          </div>
        );

      case 'diagnosis':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
              04-Diagnósticos
            </h3>
            <GeneralDiagnosisForm 
              data={data.diagnosis || []} 
              onChange={(d) => handleChange('diagnosis', d)} 
              readOnly={readOnly} 
            />
          </div>
        );

      default:
        const labels: Record<string, string> = {
          currentIllness: 'Resumen detallado de la sintomatología actual y antecedentes relevantes',
          diagnosticsResults: 'Resumen de hallazgos significativos en exámenes de laboratorio, imagen u otros',
          therapeuticPlan: 'Descripción de las medidas terapéuticas y farmacológicas ejecutadas',
          educationalPlan: 'Recomendaciones y educación brindada al paciente o familiares'
        };

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
              {sections.find(s => s.id === sectionId)?.title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                {labels[sectionId]}
              </label>
              <textarea
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  borderRadius: '12px', 
                  border: '1.5px solid #e2e8f0', 
                  minHeight: '350px', 
                  fontSize: '16px', 
                  lineHeight: '1.6',
                  transition: 'all 0.2s', 
                  outline: 'none',
                  backgroundColor: readOnly ? '#f8fafc' : 'white',
                  resize: 'vertical'
                }}
                value={data[sectionId] || ''}
                onChange={(e) => handleChange(sectionId, e.target.value)}
                disabled={readOnly}
                placeholder="Escriba los detalles aquí..."
                onFocus={(e) => !readOnly && (e.target.style.borderColor = '#22c55e')}
                onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <SectionNavigator 
      sections={sections} 
      renderSection={renderSectionContent} 
      activeColor="#22c55e" 
    />
  );
};

export default GeneralInterconsultationRequestForm;
