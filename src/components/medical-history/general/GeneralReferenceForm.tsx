import React from 'react';
import SectionNavigator from '../SectionNavigator';
import GeneralDiagnosisForm from './GeneralDiagnosisForm';
import GeneralReferenceReasonForm from './GeneralReferenceReasonForm';

interface GeneralReferenceFormProps {
    data: any;
    onChange: (data: any) => void;
    readOnly?: boolean;
}

const GeneralReferenceForm: React.FC<GeneralReferenceFormProps> = ({ data = {}, onChange, readOnly }) => {
    const handleChange = (field: string, value: any) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const sections = [
        { id: 'reason', title: '01-Motivo de referencia' },
        { id: 'clinicalSummary', title: '02-Resumen de cuadro clínico' },
        { id: 'examFindings', title: '03-Hallazgos relevantes de exámenes y procedimientos diagnosticados' },
        { id: 'treatment', title: '04-Tratamiento realizado' },
        { id: 'diagnosis', title: '05-Diagnóstico presuntivo y definitivo' }
    ];

    const renderSectionContent = (sectionId: string) => {
        if (sectionId === 'reason') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#7c3aed', marginBottom: '8px' }}>
                        01-Motivo de referencia
                    </h3>
                    <GeneralReferenceReasonForm 
                        data={data.reason || {}} 
                        onChange={(d) => handleChange('reason', d)} 
                        readOnly={readOnly} 
                    />
                </div>
            );
        }

        if (sectionId === 'diagnosis') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#7c3aed', marginBottom: '8px' }}>
                        05-Diagnóstico presuntivo y definitivo
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
            clinicalSummary: 'Resumen detallado del cuadro clínico actual, evolución y estado general del paciente',
            examFindings: 'Detalle los resultados de laboratorio, imagenología u otros procedimientos realizados previamente',
            treatment: 'Describa los medicamentos administrados, procedimientos realizados y respuesta al tratamiento'
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#7c3aed', marginBottom: '8px' }}>
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
                        onFocus={(e) => !readOnly && (e.target.style.borderColor = '#a855f7')}
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
            activeColor="#a855f7" 
        />
    );
};

export default GeneralReferenceForm;
