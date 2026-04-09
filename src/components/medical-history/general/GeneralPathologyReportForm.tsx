import React from 'react';
import { Microscope, Eye, FileText, ClipboardList, Activity } from 'lucide-react';
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
        { id: 'macroscopic', title: '01-Descripción macroscópica', icon: <Eye size={18} /> },
        { id: 'microscopic', title: '02-Descripción microscópica', icon: <Microscope size={18} /> },
        { id: 'diagnosis', title: '03-Diagnóstico histopatológico', icon: <ClipboardList size={18} /> },
        { id: 'recommendations', title: '04-Recomendaciones', icon: <Activity size={18} /> },
        { id: 'attachments', title: '05-Informe de Citología', icon: <FileText size={18} /> }
    ];

    const renderSectionContent = (sectionId: string) => {
        if (sectionId === 'macroscopic') {
            const mData = data.macroscopic || {};
            const itemStyle = { display: 'flex', flexDirection: 'column' as const, gap: '8px' };
            const labelStyleLocal = { fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' as const };
            const inputStyleLocal = {
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #e2e8f0',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s',
                backgroundColor: readOnly ? '#f8fafc' : 'white'
            };

            const handleMChange = (field: string, val: string) => {
                handleChange('macroscopic', { ...mData, [field]: val });
            };

            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#6366f1', marginBottom: '8px' }}>
                        01-Descripción macroscópica
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div style={itemStyle}>
                            <label style={labelStyleLocal}>Servicio(*)</label>
                            <input 
                                type="text" placeholder="Ingrese servicio" style={inputStyleLocal}
                                value={mData.service || ''} onChange={(e) => handleMChange('service', e.target.value)}
                                disabled={readOnly}
                            />
                        </div>
                        <div style={itemStyle}>
                            <label style={labelStyleLocal}>Sala(*)</label>
                            <input 
                                type="text" placeholder="Ingrese sala" style={inputStyleLocal}
                                value={mData.room || ''} onChange={(e) => handleMChange('room', e.target.value)}
                                disabled={readOnly}
                            />
                        </div>
                        <div style={itemStyle}>
                            <label style={labelStyleLocal}>Cama(*)</label>
                            <input 
                                type="text" placeholder="Ingrese cama" style={inputStyleLocal}
                                value={mData.bed || ''} onChange={(e) => handleMChange('bed', e.target.value)}
                                disabled={readOnly}
                            />
                        </div>
                        <div style={itemStyle}>
                            <label style={labelStyleLocal}>Número de la pieza(*)</label>
                            <input 
                                type="text" placeholder="Ej. 1234-24" style={inputStyleLocal}
                                value={mData.pieceNumber || ''} onChange={(e) => handleMChange('pieceNumber', e.target.value)}
                                disabled={readOnly}
                            />
                        </div>
                        <div style={itemStyle}>
                            <label style={labelStyleLocal}>Fecha recepción(*)</label>
                            <input 
                                type="date" style={inputStyleLocal}
                                value={mData.receptionDate || ''} onChange={(e) => handleMChange('receptionDate', e.target.value)}
                                disabled={readOnly}
                            />
                        </div>
                        <div style={itemStyle}>
                            <label style={labelStyleLocal}>Fecha entrega(*)</label>
                            <input 
                                type="date" style={inputStyleLocal}
                                value={mData.deliveryDate || ''} onChange={(e) => handleMChange('deliveryDate', e.target.value)}
                                disabled={readOnly}
                            />
                        </div>
                    </div>

                    <div style={itemStyle}>
                        <label style={labelStyleLocal}>Descripción macroscópica(*)</label>
                        <textarea
                            placeholder="Ingrese la descripción detallada del aspecto físico de la pieza o muestra..."
                            style={{
                                ...inputStyleLocal,
                                minHeight: '180px',
                                resize: 'vertical'
                            }}
                            value={mData.description || ''}
                            onChange={(e) => handleMChange('description', e.target.value)}
                            disabled={readOnly}
                            onFocus={(e) => !readOnly && (e.target.style.borderColor = '#6366f1')}
                            onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                        />
                    </div>
                </div>
            );
        }

        if (sectionId === 'diagnosis') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#6366f1', marginBottom: '8px' }}>
                        03-Diagnóstico Histopatológico Final
                    </h3>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                            Detalle del diagnóstico histopatológico(*)
                        </label>
                        <textarea
                            placeholder="Describa el diagnóstico final basado en el estudio de tejidos..."
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '1.5px solid #e2e8f0',
                                minHeight: '150px',
                                fontSize: '15px',
                                outline: 'none',
                                transition: 'all 0.2s',
                                backgroundColor: readOnly ? '#f8fafc' : 'white',
                                resize: 'vertical'
                            }}
                            value={data.histopathologicalDiagnosis?.detail || ''}
                            onChange={(e) => handleChange('histopathologicalDiagnosis', { ...data.histopathologicalDiagnosis, detail: e.target.value })}
                            disabled={readOnly}
                            onFocus={(e) => !readOnly && (e.target.style.borderColor = '#6366f1')}
                            onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                        />
                    </div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                        Codificación CIE-10 (Búsqueda de diagnóstico)
                    </label>
                    <GeneralDiagnosisForm 
                        data={data.histopathologicalDiagnosis?.codes || []} 
                        onChange={(codes) => handleChange('histopathologicalDiagnosis', { ...data.histopathologicalDiagnosis, codes })} 
                        readOnly={readOnly} 
                    />
                </div>
            );
        }

        if (sectionId === 'attachments') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#6366f1', marginBottom: '8px' }}>
                        05-Informe de Citología (Adjuntos)
                    </h3>
                    <GeneralFileUploadForm 
                        data={{ files: data.files || [], comments: data.fileComments || '' }}
                        onChange={(d) => {
                            if (readOnly) return;
                            onChange({
                                ...data,
                                files: d.files,
                                fileComments: d.comments
                            });
                        }}
                        readOnly={readOnly}
                        patientId={patientId}
                        specialty={specialty}
                        recordId={recordId}
                        sessionId={sessionId}
                        folderName="Informes_Histopatologia"
                        fileNamePrefix="Informe_Citologia"
                        label="Suba el informe de citología o imágenes relacionadas"
                        placeholder="Detalle observaciones sobre el informe cargado..."
                        color="#6366f1"
                    />
                </div>
            );
        }

        const labels: Record<string, string> = {
            macroscopic: 'Describa detalladamente el aspecto físico de la muestra recibida...',
            microscopic: 'Describa los hallazgos celulares y estructurales observados...',
            recommendations: 'Indique sugerencias clínicas, estudios adicionales o seguimiento...',
            cytologyReport: 'Detalle los resultados específicos del estudio citológico realizado...'
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
                        minHeight: '280px',
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
