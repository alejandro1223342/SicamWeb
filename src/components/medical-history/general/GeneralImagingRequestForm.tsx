import React from 'react';
import SectionNavigator from '../SectionNavigator';
import GeneralDiagnosisForm from './GeneralDiagnosisForm';
import GeneralImagingStudyForm from './GeneralImagingStudyForm';

interface GeneralImagingRequestFormProps {
    data: any;
    onChange: (data: any) => void;
    readOnly?: boolean;
}

const GeneralImagingRequestForm: React.FC<GeneralImagingRequestFormProps> = ({ data = {}, onChange, readOnly }) => {
    const handleChange = (field: string, value: any) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const sections = [
        { id: 'requestedStudies', title: '01-Estudios solicitados' },
        { id: 'requestReason', title: '02-Motivo de la solicitud' },
        { id: 'diagnosis', title: '03-Diagnóstico' },
        { id: 'clinicalSummary', title: '04-Resumen clínico' }
    ];

    const renderSectionContent = (sectionId: string) => {
        if (sectionId === 'requestedStudies') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#3b82f6', marginBottom: '8px' }}>
                        01-Estudios solicitados
                    </h3>
                    <GeneralImagingStudyForm 
                        data={data.requestedStudies || {}} 
                        onChange={(d) => handleChange('requestedStudies', d)} 
                        readOnly={readOnly} 
                    />
                </div>
            );
        }

        if (sectionId === 'diagnosis') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#3b82f6', marginBottom: '8px' }}>
                        03-Diagnóstico
                    </h3>
                    <GeneralDiagnosisForm 
                        data={data.diagnosis || []} 
                        onChange={(d) => handleChange('diagnosis', d)} 
                        readOnly={readOnly} 
                    />
                </div>
            );
        }

        const labels: Record<string, string> = {
            requestReason: 'Describa el motivo médico o sospecha clínica que justifica la solicitud de los estudios',
            clinicalSummary: 'Resumen pertinente del cuadro actual para orientación del médico radiólogo'
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#3b82f6', marginBottom: '8px' }}>
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
                        onFocus={(e) => !readOnly && (e.target.style.borderColor = '#3b82f6')}
                        onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                    />
                </div>
            </div>
        );
    };

    return (
        <SectionNavigator 
            sections={sections} 
            renderSection={renderSectionContent} 
            activeColor="#3b82f6" 
        />
    );
};

export default GeneralImagingRequestForm;
