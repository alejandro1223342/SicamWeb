import React from 'react';
import { Microscope, Eye, FileText, ClipboardList, Camera } from 'lucide-react';
import SectionNavigator from '../SectionNavigator';
import GeneralDiagnosisForm from './GeneralDiagnosisForm';
import GeneralFileUploadForm from './GeneralFileUploadForm';

interface GeneralPathologyReportFormProps {
    data: any;
    onChange: (data: any) => void;
    readOnly?: boolean;
    patientId: string;
    specialty: string;
    recordId?: string | null;
    sessionId?: string | null;
}

const GeneralPathologyReportForm: React.FC<GeneralPathologyReportFormProps> = ({ 
    data = {}, onChange, readOnly, patientId, specialty, recordId, sessionId 
}) => {
    const handleChange = (field: string, value: any) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    const sections = [
        { id: 'macroscopic', title: '01-Descripción Macroscópica', icon: <Eye size={18} /> },
        { id: 'microscopic', title: '02-Descripción Microscópica', icon: <Microscope size={18} /> },
        { id: 'diagnosis', title: '03-Diagnóstico Definitivo', icon: <ClipboardList size={18} /> },
        { id: 'attachments', title: '04-Adjuntos e Imágenes', icon: <Camera size={18} /> },
        { id: 'comments', title: '05-Comentarios adicionales', icon: <FileText size={18} /> }
    ];

    const renderSectionContent = (sectionId: string) => {
        if (sectionId === 'diagnosis') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#6366f1', marginBottom: '8px' }}>
                        03-Diagnóstico Anatomopatológico Final
                    </h3>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                            Detalle del diagnóstico definitivo(*)
                        </label>
                        <textarea
                            placeholder="Describa el diagnóstico final basado en el estudio..."
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '1.5px solid #e2e8f0',
                                minHeight: '120px',
                                fontSize: '15px',
                                outline: 'none',
                                transition: 'all 0.2s',
                                backgroundColor: readOnly ? '#f8fafc' : 'white',
                                resize: 'vertical'
                            }}
                            value={data.diagnosisDetail || ''}
                            onChange={(e) => handleChange('diagnosisDetail', e.target.value)}
                            disabled={readOnly}
                            onFocus={(e) => !readOnly && (e.target.style.borderColor = '#6366f1')}
                            onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                        />
                    </div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                        Codificación CIE-10(*)
                    </label>
                    <GeneralDiagnosisForm 
                        data={data.diagnosis || []} 
                        onChange={(d) => handleChange('diagnosis', d)} 
                        readOnly={readOnly} 
                    />
                </div>
            );
        }

        if (sectionId === 'attachments') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#6366f1', marginBottom: '8px' }}>
                        04-Adjuntos e Imágenes de Biopsia
                    </h3>
                    <GeneralFileUploadForm 
                        data={{ files: data.files || [], comments: data.comments || '' }}
                        onChange={(d) => {
                            handleChange('files', d.files);
                            handleChange('comments', d.comments);
                        }}
                        readOnly={readOnly}
                        patientId={patientId}
                        specialty={specialty}
                        recordId={recordId}
                        sessionId={sessionId}
                        folderName="Informes_Patologia"
                        label="Suba imágenes o reportes de patología"
                        placeholder="Detalle observaciones sobre las imágenes cargadas..."
                        color="#6366f1"
                    />
                </div>
            );
        }

        const labels: Record<string, string> = {
            macroscopic: 'Describa detalladamente el aspecto físico de la muestra recibida...',
            microscopic: 'Describa los hallazgos celulares y estructurales observados al microscopio...',
            comments: 'Cualquier otra información relevante o recomendación de seguimiento...'
        };

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
                        minHeight: '250px',
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

export default GeneralPathologyReportForm;
