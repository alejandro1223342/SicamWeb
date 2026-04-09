import React from 'react';
import SectionNavigator from '../SectionNavigator';
import GeneralEmergencyAdmissionForm from './GeneralEmergencyAdmissionForm';
import GeneralEmergencyCareStartForm from './GeneralEmergencyCareStartForm';
import GeneralEmergencyAccidentForm from './GeneralEmergencyAccidentForm';
import GeneralEmergencyHistoryForm from './GeneralEmergencyHistoryForm';
import GeneralEmergencyPainForm from './GeneralEmergencyPainForm';

interface GeneralEmergency01FormProps {
  data: any;
  onChange: (data: any) => void;
  readOnly?: boolean;
  patient?: any;
}

const GeneralEmergency01Form: React.FC<GeneralEmergency01FormProps> = ({ data = {}, onChange, readOnly, patient }) => {
  const handleChange = (field: string, value: any) => {
    if (readOnly) return;
    onChange({ ...data, [field]: value });
  };

  const sections = [
    { id: 'admissionRecord', title: '01-Registro de admisión' },
    { id: 'startOfCare', title: '02-Inicio de atención' },
    { id: 'accidentViolencePoisoning', title: '03-Accidente, violencia, intoxicación' },
    { id: 'relevantHistory', title: '04-Antecedentes personales y familiares relevantes' },
    { id: 'currentIllnessReview', title: '05-Enfermedad actual y revisión de sistemas' },
    { id: 'painCharacteristics', title: '06-Caracteres del dolor' }
  ];

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'admissionRecord':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
              01-Registro de admisión
            </h3>
            <GeneralEmergencyAdmissionForm 
              data={data.admissionRecord || {}} 
              onChange={(d) => handleChange('admissionRecord', d)} 
              readOnly={readOnly} 
              patient={patient}
            />
          </div>
        );

      case 'startOfCare':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
              02-Inicio de atención
            </h3>
            <GeneralEmergencyCareStartForm 
              data={data.startOfCare || {}} 
              onChange={(d) => handleChange('startOfCare', d)} 
              readOnly={readOnly} 
              patient={patient}
            />
          </div>
        );

      case 'accidentViolencePoisoning':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
              03-Accidente, violencia, intoxicación
            </h3>
            <GeneralEmergencyAccidentForm 
              data={data.accidentViolencePoisoning || {}} 
              onChange={(d) => handleChange('accidentViolencePoisoning', d)} 
              readOnly={readOnly} 
            />
          </div>
        );

      case 'relevantHistory':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
              04-Antecedentes personales y familiares relevantes
            </h3>
            <GeneralEmergencyHistoryForm 
              data={data.relevantHistory || {}} 
              onChange={(d) => handleChange('relevantHistory', d)} 
              readOnly={readOnly} 
            />
          </div>
        );

      case 'painCharacteristics':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
              06-Caracteres del dolor
            </h3>
            <GeneralEmergencyPainForm 
              data={data.painCharacteristics || []} 
              onChange={(d) => handleChange('painCharacteristics', d)} 
              readOnly={readOnly} 
            />
          </div>
        );

      default:
        const labels: Record<string, string> = {
          startOfCare: 'Descripción del inicio de la atención médica y triaje inicial',
          accidentViolencePoisoning: 'Detalle de incidentes traumáticos, actos de violencia o casos de intoxicación detectados',
          relevantHistory: 'Antecedentes médicos, quirúrgicos, alérgicos y familiares de importancia para la emergencia',
          currentIllnessReview: 'Resumen de la enfermedad actual y revisión sistemática de los síntomas reportados',
          painCharacteristics: 'Descripción precisa del dolor: localización, tipo, intensidad (EVA), irradiación y factores agravantes'
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
                placeholder="Escriba aquí los detalles..."
                onFocus={(e) => !readOnly && (e.target.style.borderColor = '#ef4444')}
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
      activeColor="#ef4444" 
    />
  );
};

export default GeneralEmergency01Form;
