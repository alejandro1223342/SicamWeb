import React from 'react';
import SectionNavigator from '../SectionNavigator';
import GeneralDiagnosisForm from './GeneralDiagnosisForm';
import GeneralCounterReferenceSummaryForm from './GeneralCounterReferenceSummaryForm';

interface GeneralCounterReferenceFormProps {
    data: any;
    onChange: (data: any) => void;
    readOnly?: boolean;
}

const GeneralCounterReferenceForm: React.FC<GeneralCounterReferenceFormProps> = ({ data = {}, onChange, readOnly }) => {
    const handleChange = (field: string, value: any) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const sections = [
        { id: 'clinicalSummary', title: '01-Cuadro clínico' },
        { id: 'examFindings', title: '02-Hallazgos relevantes de exámenes y procedimientos diagnósticos' },
        { id: 'treatmentPerformed', title: '03-Tratamiento y procedimientos terapéuticos realizados' },
        { id: 'recommendedTreatment', title: '04-Tratamiento recomendado' },
        { id: 'diagnosis', title: '05-Diagnósticos definitivos' }
    ];

    const renderSectionContent = (sectionId: string) => {
        if (sectionId === 'clinicalSummary') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#22c55e', marginBottom: '8px' }}>
                        01-Cuadro clínico
                    </h3>
                    <GeneralCounterReferenceSummaryForm 
                        data={data.clinicalSummary || {}} 
                        onChange={(d) => handleChange('clinicalSummary', d)} 
                        readOnly={readOnly} 
                    />
                </div>
            );
        }

        if (sectionId === 'diagnosis') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#22c55e', marginBottom: '8px' }}>
                        05-Diagnósticos definitivos
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
            examFindings: 'Detalle de los resultados de exámenes de laboratorio, imagenología y otros hallazgos clínicos importantes',
            treatmentPerformed: 'Resumen de los medicamentos administrados y procedimientos terapéuticos llevados a cabo',
            recommendedTreatment: 'Detalle del plan de tratamiento sugerido para el seguimiento del paciente'
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#22c55e', marginBottom: '8px' }}>
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
                        onFocus={(e) => !readOnly && (e.target.style.borderColor = '#22c55e')}
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
            activeColor="#22c55e" 
        />
    );
};

export default GeneralCounterReferenceForm;
