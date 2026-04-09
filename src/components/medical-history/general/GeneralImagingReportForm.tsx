import React from 'react';
import SectionNavigator from '../SectionNavigator';
import GeneralDiagnosisForm from './GeneralDiagnosisForm';
import GeneralImagingReportStudyForm from './GeneralImagingReportStudyForm';
import GeneralImagingReportUploadForm from './GeneralImagingReportUploadForm';
import GeneralObstetricUltrasoundForm from './GeneralObstetricUltrasoundForm';
import GeneralGynecologicUltrasoundForm from './GeneralGynecologicUltrasoundForm';
import GeneralImagingExtraDataForm from './GeneralImagingExtraDataForm';

interface GeneralImagingReportFormProps {
    data: any;
    onChange: (data: any) => void;
    readOnly?: boolean;
    patientId: string;
    specialty: string;
    recordId?: string | null;
    sessionId?: string | null;
}

const GeneralImagingReportForm: React.FC<GeneralImagingReportFormProps> = ({ 
    data = {}, onChange, readOnly, patientId, specialty, recordId, sessionId 
}) => {
    const handleChange = (field: string, value: any) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const sections = [
        { id: 'studiesPerformed', title: '01-Estudios de imagenologia realizado' },
        { id: 'imagingReport', title: '02-Informe de imagenologia' },
        { id: 'obstetricData', title: '03-Datos basicos de ecografia obstetrica' },
        { id: 'gynecologicData', title: '04-Datos basicos de ecografia ginecologica' },
        { id: 'diagnosis', title: '05-Diagnostico de imagenologia' },
        { id: 'recommendations', title: '06-Recomendaciones' },
        { id: 'extraData', title: '07-Datos extras' }
    ];

    const renderSectionContent = (sectionId: string) => {
        if (sectionId === 'studiesPerformed') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#22c55e', marginBottom: '8px' }}>
                        01-Estudios de imagenologia realizado
                    </h3>
                    <GeneralImagingReportStudyForm 
                        data={data.studiesPerformed || {}} 
                        onChange={(d) => handleChange('studiesPerformed', d)} 
                        readOnly={readOnly} 
                    />
                </div>
            );
        }

        if (sectionId === 'imagingReport') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#22c55e', marginBottom: '8px' }}>
                        02-Informe de imagenologia
                    </h3>
                    <GeneralImagingReportUploadForm 
                        data={data.imagingReport || {}} 
                        onChange={(d) => handleChange('imagingReport', d)} 
                        readOnly={readOnly}
                        patientId={patientId}
                        specialty={specialty}
                        recordId={recordId}
                        sessionId={sessionId}
                    />
                </div>
            );
        }

        if (sectionId === 'obstetricData') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#22c55e', marginBottom: '8px' }}>
                        03-Datos basicos de ecografia obstetrica
                    </h3>
                    <GeneralObstetricUltrasoundForm 
                        data={data.obstetricData || {}} 
                        onChange={(d) => handleChange('obstetricData', d)} 
                        readOnly={readOnly} 
                    />
                </div>
            );
        }

        if (sectionId === 'gynecologicData') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#22c55e', marginBottom: '8px' }}>
                        04-Datos basicos de ecografia ginecologica
                    </h3>
                    <GeneralGynecologicUltrasoundForm 
                        data={data.gynecologicData || {}} 
                        onChange={(d) => handleChange('gynecologicData', d)} 
                        readOnly={readOnly} 
                    />
                </div>
            );
        }

        if (sectionId === 'diagnosis') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#22c55e', marginBottom: '8px' }}>
                        05-Diagnostico de imagenologia
                    </h3>
                    <GeneralDiagnosisForm 
                        data={data.diagnosis || []} 
                        onChange={(d) => handleChange('diagnosis', d)} 
                        readOnly={readOnly} 
                    />
                </div>
            );
        }

        if (sectionId === 'extraData') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#22c55e', marginBottom: '8px' }}>
                        07-Datos extras
                    </h3>
                    <GeneralImagingExtraDataForm 
                        data={data.extraData || {}} 
                        onChange={(d) => handleChange('extraData', d)} 
                        readOnly={readOnly} 
                    />
                </div>
            );
        }

        const labels: Record<string, string> = {
            recommendations: 'Sugerencias para el seguimiento médico o estudios complementarios adicionales'
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

export default GeneralImagingReportForm;
