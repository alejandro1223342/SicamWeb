import React from 'react';
import { Microscope, ClipboardList, Stethoscope, Pill, Syringe, Activity } from 'lucide-react';
import SectionNavigator from '../SectionNavigator';
import GeneralDiagnosisForm from './GeneralDiagnosisForm';
import GeneralPathologySampleForm from './GeneralPathologySampleForm';
import GeneralVaginalCytologyForm from './GeneralVaginalCytologyForm';
import GeneralPathologyRequestedStudyForm from './GeneralPathologyRequestedStudyForm';

interface GeneralPathologyRequestFormProps {
    data: any;
    onChange: (data: any) => void;
    readOnly?: boolean;
}

const GeneralPathologyRequestForm: React.FC<GeneralPathologyRequestFormProps> = ({ data = {}, onChange, readOnly }) => {
    const handleChange = (field: string, value: any) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const sections = [
        { id: 'requestedStudy', title: '01-Estudio solicitado', icon: <Microscope size={18} /> },
        { id: 'diagnosis', title: '02-Diagnostico', icon: <ClipboardList size={18} /> },
        { id: 'clinicalSummary', title: '03-Resumen clinico', icon: <Stethoscope size={18} /> },
        { id: 'treatmentReceived', title: '04-Tratamiento que recibe', icon: <Pill size={18} /> },
        { id: 'sampleDetails', title: '05-Muestra o pieza', icon: <Syringe size={18} /> },
        { id: 'vaginalCytology', title: '06-Datos básicos para la citología vaginal', icon: <Activity size={18} /> }
    ];

    const renderSectionContent = (sectionId: string) => {
        const labels: Record<string, string> = {
            requestedStudy: 'Especifique el tipo de estudio histopatológico requerido...',
            clinicalSummary: 'Detalle los antecedentes relevantes y estado actual del paciente...',
            treatmentReceived: 'Indique medicamentos o terapias actuales que puedan interferir...'
        };

        if (sectionId === 'diagnosis') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#6366f1', marginBottom: '8px' }}>
                        02-Diagnóstico Presuntivo
                    </h3>
                    <GeneralDiagnosisForm 
                        data={data.diagnosis || []} 
                        onChange={(d) => handleChange('diagnosis', d)} 
                        readOnly={readOnly} 
                    />
                </div>
            );
        }

        if (sectionId === 'sampleDetails') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#6366f1', marginBottom: '8px' }}>
                        05-Muestra o pieza quirúrgica
                    </h3>
                    <GeneralPathologySampleForm 
                        data={data.sampleDetails || {}} 
                        onChange={(d) => handleChange('sampleDetails', d)} 
                        readOnly={readOnly} 
                    />
                </div>
            );
        }

        if (sectionId === 'vaginalCytology') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#6366f1', marginBottom: '8px' }}>
                        06-Datos básicos para la citología vaginal
                    </h3>
                    <GeneralVaginalCytologyForm 
                        data={data.vaginalCytology || {}} 
                        onChange={(d) => handleChange('vaginalCytology', d)} 
                        readOnly={readOnly} 
                    />
                </div>
            );
        }

        if (sectionId === 'requestedStudy') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#6366f1', marginBottom: '8px' }}>
                        01-Estudio solicitado
                    </h3>
                    <GeneralPathologyRequestedStudyForm 
                        data={data.requestedStudy || {}} 
                        onChange={(d) => handleChange('requestedStudy', d)} 
                        readOnly={readOnly} 
                    />
                </div>
            );
        }

        // Generic text areas for 03, 04
        const activeTitle = sections.find(s => s.id === sectionId)?.title;
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#6366f1', marginBottom: '8px' }}>
                    {activeTitle}
                </h3>
                <textarea
                    placeholder={labels[sectionId] || "Escriba aquí los detalles..."}
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1.5px solid #e2e8f0',
                        minHeight: '200px',
                        fontSize: '15px',
                        outline: 'none',
                        transition: 'all 0.2s',
                        backgroundColor: readOnly ? '#f8fafc' : 'white',
                        resize: 'vertical'
                    }}
                    value={data[sectionId] || ''}
                    onChange={(e) => handleChange(sectionId, e.target.value)}
                    disabled={readOnly}
                    onFocus={(e) => !readOnly && (e.target.style.borderColor = '#6366f1')}
                    onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                />
            </div>
        );
    };

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <SectionNavigator
                sections={sections}
                renderSection={renderSectionContent}
                activeColor="#6366f1"
            />
        </div>
    );
};

export default GeneralPathologyRequestForm;
