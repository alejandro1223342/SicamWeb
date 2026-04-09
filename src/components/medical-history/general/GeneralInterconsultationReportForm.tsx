import React from 'react';
import SectionNavigator from '../SectionNavigator';
import GeneralDiagnosisForm from './GeneralDiagnosisForm';

interface GeneralInterconsultationReportFormProps {
  data: any;
  onChange: (data: any) => void;
  readOnly?: boolean;
}

const GeneralInterconsultationReportForm: React.FC<GeneralInterconsultationReportFormProps> = ({ data = {}, onChange, readOnly }) => {
  const handleChange = (field: string, value: any) => {
    if (readOnly) return;
    onChange({ ...data, [field]: value });
  };

  const sections = [
    { id: 'clinicalSummary', title: '07-Cuadro clínico de interconsulta' },
    { id: 'proposedTests', title: '08-Pruebas diagnósticas propuestas' },
    { id: 'diagnosis', title: '09-Diagnósticos' },
    { id: 'proposedTherapeuticPlan', title: '10-Plan terapéutico propuesto' },
    { id: 'proposedEducationalPlan', title: '11-Plan educacional propuesto' },
    { id: 'clinicalCriteriaSummary', title: '12-Resumen del criterio clínico' }
  ];

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'diagnosis':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
              09-Diagnósticos
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
          clinicalSummary: 'Descripción detallada de los hallazgos clínicos encontrados durante la interconsulta',
          proposedTests: 'Detalle de los exámenes complementarios sugeridos por el especialista',
          proposedTherapeuticPlan: 'Indicaciones farmacológicas y terapéuticas propuestas por el servicio consultado',
          proposedEducationalPlan: 'Guía de educación en salud y cuidados preventivos sugeridos',
          clinicalCriteriaSummary: 'Conclusión y resumen final del criterio médico del especialista'
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
                placeholder="Ingrese el informe clínico detallado..."
                onFocus={(e) => !readOnly && (e.target.style.borderColor = '#6366f1')}
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
      activeColor="#6366f1" 
    />
  );
};

export default GeneralInterconsultationReportForm;
