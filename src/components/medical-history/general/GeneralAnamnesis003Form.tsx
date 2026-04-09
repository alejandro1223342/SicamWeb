import React from 'react';
import SectionNavigator from '../SectionNavigator';
import GeneralVitalsForm from './GeneralVitalsForm';
import GeneralDiagnosisForm from './GeneralDiagnosisForm';
import GeneralPersonalHistoryForm from './GeneralPersonalHistoryForm';
import GeneralOrgansReviewForm from './GeneralOrgansReviewForm';
import GeneralPhysicalExamForm from './GeneralPhysicalExamForm';

interface GeneralAnamnesis003FormProps {
  data: any;
  onChange: (data: any) => void;
  readOnly?: boolean;
}

const GeneralAnamnesis003Form: React.FC<GeneralAnamnesis003FormProps> = ({ data = {}, onChange, readOnly }) => {
  const handleChange = (field: string, value: any) => {
    if (readOnly) return;
    onChange({ ...data, [field]: value });
  };

  const sections = [
    { id: 'reason', title: '01-Motivo de consulta' },
    { id: 'personalHistory', title: '02-Antecedentes personales' },
    { id: 'familyHistory', title: '03-Antecedentes familiares' },
    { id: 'currentIllness', title: '04-Enfermedad o problema actual' },
    { id: 'organsReview', title: '05-Revisión actual de organos y sistemas' },
    { id: 'vitals', title: '06-Signos vitales y mediciones' },
    { id: 'physicalExam', title: '07-Exámen físico' },
    { id: 'diagnosis', title: '08-Diagnóstico' },
    { id: 'plans', title: '09-Planes' }
  ];

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'vitals':
        return (
          <GeneralVitalsForm 
            data={data.vitals || {}} 
            onChange={(v) => handleChange('vitals', v)} 
            readOnly={readOnly} 
          />
        );
      
      case 'diagnosis':
        return (
          <GeneralDiagnosisForm 
            data={data.diagnosis || []} 
            onChange={(d) => handleChange('diagnosis', d)} 
            readOnly={readOnly} 
          />
        );
      
      case 'personalHistory':
        return (
          <GeneralPersonalHistoryForm 
            data={data.personalHistory || {}} 
            onChange={(d) => handleChange('personalHistory', d)} 
            readOnly={readOnly} 
          />
        );

      case 'organsReview':
        return (
          <GeneralOrgansReviewForm 
            data={data.organsReview || {}} 
            onChange={(d) => handleChange('organsReview', d)} 
            readOnly={readOnly} 
          />
        );

      case 'physicalExam':
        return (
          <GeneralPhysicalExamForm 
            data={data.physicalExam || {}} 
            onChange={(d) => handleChange('physicalExam', d)} 
            readOnly={readOnly} 
          />
        );

      case 'reason':
      case 'familyHistory':
      case 'currentIllness':
      case 'plans':
        const labels: Record<string, string> = {
          reason: 'Ingrese el motivo de consulta',
          personalHistory: 'Antecedentes Personales (Clínicos, Quirúrgicos, etc.)',
          familyHistory: 'Antecedentes familiares de importancia',
          currentIllness: 'Cronología y descripción del problema actual',
          organsReview: 'Hallazgos de revisión por sistemas',
          physicalExam: 'Detalles del examen físico realizado',
          diagnosis: 'Diagnóstico o impresión diagnóstica',
          plans: 'Plan terapéutico, procedimientos e indicadores'
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
                  backgroundColor: readOnly ? '#f8fafc' : 'white'
                }}
                value={data[sectionId] || ''}
                onChange={(e) => handleChange(sectionId, e.target.value)}
                disabled={readOnly}
                placeholder={`Describa los detalles...`}
                onFocus={(e) => !readOnly && (e.target.style.borderColor = '#3b82f6')}
                onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <SectionNavigator 
      sections={sections} 
      renderSection={renderSectionContent} 
    />
  );
};

export default GeneralAnamnesis003Form;
