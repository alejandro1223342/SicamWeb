import React from 'react';
import SectionNavigator from '../SectionNavigator';
import GeneralEmergencyVitalsForm from './GeneralEmergencyVitalsForm';
import GeneralEmergencyPhysicalExamForm from './GeneralEmergencyPhysicalExamForm';
import GeneralEmergencyTopographyForm from './GeneralEmergencyTopographyForm';
import GeneralDiagnosisForm from './GeneralDiagnosisForm';
import GeneralEmergencyPregnancyForm from './GeneralEmergencyPregnancyForm';
import GeneralEmergencyDischargeForm from './GeneralEmergencyDischargeForm';
import GeneralEmergencyTreatmentForm from './GeneralEmergencyTreatmentForm';

interface GeneralEmergency02FormProps {
    data: any;
    onChange: (data: any) => void;
    readOnly?: boolean;
    patient?: any;
}

const GeneralEmergency02Form: React.FC<GeneralEmergency02FormProps> = ({ data = {}, onChange, readOnly }) => {
    const handleChange = (field: string, value: any) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const sections = [
        { id: 'vitals', title: '07-Signos vitales, mediciones y valores' },
        { id: 'physicalExam', title: '08-Examen físico' },
        { id: 'topographicDiagram', title: '09-Diagrama topográfico' },
        { id: 'pregnancy', title: '10-Embarazo - parto' },
        { id: 'problemAnalysis', title: '11-Análisis de problemas' },
        { id: 'diagnosticPlan', title: '12-Plan diagnóstico' },
        { id: 'presumptiveDiagnosis', title: '13-Diagnósticos presuntivos' },
        { id: 'definitiveDiagnosis', title: '14-Diagnósticos definitivos' },
        { id: 'treatmentPlan', title: '15-Plan de tratamiento' },
        { id: 'discharge', title: '16-Salida' }
    ];

    const renderTextArea = (sectionId: string, label: string) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                {label}
            </h3>
            <textarea
                style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1.5px solid #e2e8f0',
                    minHeight: '350px',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    outline: 'none',
                    backgroundColor: readOnly ? '#f8fafc' : 'white',
                    color: '#334155'
                }}
                value={data[sectionId] || ''}
                onChange={(e) => handleChange(sectionId, e.target.value)}
                disabled={readOnly}
                placeholder={`Ingrese los detalles de ${label.toLowerCase()}...`}
            />
        </div>
    );

    const renderSectionContent = (sectionId: string) => {
        const section = sections.find(s => s.id === sectionId);
        const title = section?.title || '';

        switch (sectionId) {
            case 'vitals':
                return (
                    <GeneralEmergencyVitalsForm
                        data={data.vitals || {}}
                        onChange={(v) => handleChange('vitals', v)}
                        readOnly={readOnly}
                        title="07-Signos vitales, mediciones y valores"
                    />
                );

            case 'topographicDiagram':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                            09-Diagrama topográfico
                        </h3>
                        <GeneralEmergencyTopographyForm
                            data={data.topographicDiagram || { markers: [], comments: '' }}
                            onChange={(t) => handleChange('topographicDiagram', t)}
                            readOnly={readOnly}
                        />
                    </div>
                );

            case 'pregnancy':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                            10-Embarazo - parto
                        </h3>
                        <GeneralEmergencyPregnancyForm
                            data={data.pregnancy || {}}
                            onChange={(p) => handleChange('pregnancy', p)}
                            readOnly={readOnly}
                        />
                    </div>
                );

            case 'presumptiveDiagnosis':
            case 'definitiveDiagnosis':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                            {title}
                        </h3>
                        <GeneralDiagnosisForm
                            data={data[sectionId] || []}
                            onChange={(d) => handleChange(sectionId, d)}
                            readOnly={readOnly}
                        />
                    </div>
                );

            case 'discharge':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                            16-Salida
                        </h3>
                        <GeneralEmergencyDischargeForm
                            data={data.discharge || {}}
                            onChange={(d) => handleChange('discharge', d)}
                            readOnly={readOnly}
                        />
                    </div>
                );

            case 'physicalExam':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                            08-Examen físico
                        </h3>
                        <GeneralEmergencyPhysicalExamForm
                            data={data.physicalExam || { selections: {}, description: '' }}
                            onChange={(p) => handleChange('physicalExam', p)}
                            readOnly={readOnly}
                        />
                    </div>
                );

            case 'diagnosticPlan':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                            12-Plan diagnóstico
                        </h3>
                        
                        {/* Legend Grid */}
                        <div style={{ 
                            backgroundColor: 'white', 
                            borderRadius: '16px', 
                            border: '1px solid #e2e8f0', 
                            padding: '24px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                        }}>
                            {[
                                { id: 1, label: 'BIOMETRIA' }, { id: 2, label: 'URONALISIS' },
                                { id: 3, label: 'QUIMICA SANGUINEA' }, { id: 4, label: 'ELECTROLITOS' },
                                { id: 5, label: 'GASOMETRIA' }, { id: 6, label: 'ELECTRO CARDIOGRAMA' },
                                { id: 7, label: 'ENDOCOSP IA' }, { id: 8, label: 'R-X TORAX' },
                                { id: 9, label: 'R-X ABDOMEN' }, { id: 10, label: 'R-X OSEA' },
                                { id: 11, label: 'TOMOGRAIA' }, { id: 12, label: 'RESONANCIA' },
                                { id: 13, label: 'ECOGRAFIA PELVICA' }, { id: 14, label: 'ECOGRAFIA ABDOMEN' },
                                { id: 15, label: 'INTERCONSULTA' }, { id: 16, label: 'OTROS' }
                            ].map(test => (
                                <div key={test.id} style={{ fontSize: '11px', color: '#475569', fontWeight: '700' }}>
                                    <span style={{ color: '#3b82f6', marginRight: '4px' }}>{test.id}.</span> {test.label}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                                Describir abajo anotando el número correspondiente
                            </h4>
                            <textarea
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: '1.5px solid #e2e8f0',
                                    minHeight: '300px',
                                    fontSize: '15px',
                                    lineHeight: '1.6',
                                    outline: 'none',
                                    backgroundColor: readOnly ? '#f8fafc' : 'white',
                                    color: '#334155',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => !readOnly && (e.target.style.borderColor = '#3b82f6')}
                                onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                                value={data.diagnosticPlan || ''}
                                onChange={(e) => handleChange('diagnosticPlan', e.target.value)}
                                disabled={readOnly}
                                placeholder="Ingresar anotando el númar correspondiente..."
                            />
                        </div>
                    </div>
                );

            case 'treatmentPlan':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                            15-Plan de tratamiento
                        </h3>
                        <GeneralEmergencyTreatmentForm
                            data={data.treatmentPlan}
                            onChange={(tp) => handleChange('treatmentPlan', tp)}
                            readOnly={readOnly}
                        />
                    </div>
                );

            case 'problemAnalysis':
                return renderTextArea(sectionId, title);

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

export default GeneralEmergency02Form;
