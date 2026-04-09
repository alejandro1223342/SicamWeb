import React from 'react';
import SectionNavigator from '../SectionNavigator';
import GeneralDiagnosisForm from './GeneralDiagnosisForm';
import GeneralEpicrisisDoctorsForm from './GeneralEpicrisisDoctorsForm';
import GeneralEpicrisisDischargeForm from './GeneralEpicrisisDischargeForm';

interface GeneralEpicrisisFormProps {
  data: any;
  onChange: (data: any) => void;
  readOnly?: boolean;
}

const GeneralEpicrisisForm: React.FC<GeneralEpicrisisFormProps> = ({ data = {}, onChange, readOnly }) => {
  const handleChange = (field: string, value: any) => {
    if (readOnly) return;
    onChange({ ...data, [field]: value });
  };

  const sections = [
    { id: 'clinicalSummary', title: '01-Resumen del cuadro clínico' },
    { id: 'evolutionSummary', title: '02-Resumen de evolución y complicaciones' },
    { id: 'relevantFindings', title: '03-Hallazgos relevantes de exámenes' },
    { id: 'diagnosis', title: '04-Diagnósticos' },
    { id: 'treatmentSummary', title: '05-Resumen de tratamiento' },
    { id: 'dischargeConditions', title: '06-Condiciones de egreso y pronóstico' },
    { id: 'attendingDoctors', title: '07-Médicos tratantes' },
    { id: 'discharge', title: '08-Egreso' }
  ];

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
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

      case 'attendingDoctors':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
              07-Médicos tratantes
            </h3>
            <GeneralEpicrisisDoctorsForm 
              data={data.attendingDoctors || []} 
              onChange={(d) => handleChange('attendingDoctors', d)} 
              readOnly={readOnly} 
            />
          </div>
        );

      case 'discharge':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
              08-Egreso
            </h3>
            <GeneralEpicrisisDischargeForm 
              data={data.discharge || {}} 
              onChange={(d) => handleChange('discharge', d)} 
              readOnly={readOnly} 
            />
          </div>
        );

      default:
        const labels: Record<string, string> = {
          clinicalSummary: 'Resumen detallado del cuadro clínico del paciente',
          evolutionSummary: 'Descripción de la evolución y complicaciones durante la hospitalización',
          relevantFindings: 'Principales hallazgos de exámenes de laboratorio e imagen relevantes',
          treatmentSummary: 'Resumen de tratamientos administrados y procedimientos terapéuticos realizados',
          dischargeConditions: 'Estado de salud al momento del egreso y pronóstico médico',
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
                  minHeight: '300px', 
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
                placeholder="Describa los detalles..."
                onFocus={(e) => !readOnly && (e.target.style.borderColor = '#3b82f6')}
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
    />
  );
};

export default GeneralEpicrisisForm;
