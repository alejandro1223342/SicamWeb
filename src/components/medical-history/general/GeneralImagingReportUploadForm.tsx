import { Upload, FileText, Eye, X, Loader2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../../api';
import { useToast } from '../../Toast';
import { SecureImage } from '../../common/SecureImage';
import { SecureIframe } from '../../common/SecureIframe';
import { useState } from 'react';

interface ReportFile {
    url: string;
    name: string;
}

interface ReportData {
    files: ReportFile[];
    comments: string;
}

interface GeneralImagingReportUploadFormProps {
    data: ReportData;
    onChange: (data: ReportData) => void;
    readOnly?: boolean;
    patientId: string;
    specialty: string;
    recordId?: string | null;
    sessionId?: string | null;
}

const GeneralImagingReportUploadForm: React.FC<GeneralImagingReportUploadFormProps> = ({ 
    data, onChange, readOnly, patientId, specialty, recordId, sessionId 
}) => {
    const { showToast } = useToast();
    const [isUploading, setIsUploading] = useState(false);
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);

    const handleFileUpload = async (files: FileList | null) => {
        if (readOnly || !files || files.length === 0) return;
        
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
        const uploadedFiles = [...(data.files || [])];
        
        setIsUploading(true);

        for (const file of Array.from(files)) {
            if (!allowedTypes.includes(file.type)) {
                showToast(`Formato de ${file.name} no permitido.`, 'error');
                continue;
            }

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await api.post(`/drive/upload?patientId=${patientId}&specialty=${specialty}&folder=Informes_Imagenologia&recordId=${recordId || ''}&sessionId=${sessionId || ''}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.data?.data?.id) {
                    const baseUrl = api.defaults.baseURL?.replace(/\/$/, '') || 'http://localhost:3000';
                    const fileId = response.data.data.id;
                    const proxyUrl = `${baseUrl}/drive/file/${fileId}`;
                    
                    uploadedFiles.push({
                        url: proxyUrl,
                        name: response.data.data.name || file.name
                    });
                }
            } catch (error) {
                console.error('Error uploading file:', file.name, error);
                showToast(`Error al subir ${file.name}`, 'error');
            }
        }

        onChange({ ...data, files: uploadedFiles });
        setIsUploading(false);
        showToast('Proceso de subida completado', 'success');
    };

    const removeFile = async (index: number) => {
        if (readOnly) return;
        const fileToRemove = data.files[index];
        
        // Optimistic update
        const updatedFiles = data.files.filter((_, i) => i !== index);
        onChange({ ...data, files: updatedFiles });

        try {
            const fileId = fileToRemove.url.split('/').pop();
            if (fileId) {
                await api.delete(`/drive/file/${fileId}`);
                showToast('Archivo eliminado de Google Drive', 'success');
            }
        } catch (error) {
            console.error('Error deleting file from Drive:', error);
            showToast('No se pudo eliminar el archivo del servidor, pero se quitó del registro.', 'warning');
        }
    };

    const handleCommentChange = (val: string) => {
        if (readOnly) return;
        onChange({ ...data, comments: val });
    };

    const isPdf = (fileName: string) => fileName.toLowerCase().endsWith('.pdf');

    const nextPreview = () => {
        if (previewIndex !== null && data.files && previewIndex < data.files.length - 1) {
            setPreviewIndex(previewIndex + 1);
        }
    };

    const prevPreview = () => {
        if (previewIndex !== null && previewIndex > 0) {
            setPreviewIndex(previewIndex - 1);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
                {/* File Upload Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>
                        Suba informe de imagenologia(*)
                    </label>
                    
                    <div style={{ 
                        border: '2px dashed #e2e8f0', 
                        borderRadius: '16px', 
                        padding: '24px', 
                        textAlign: 'center',
                        backgroundColor: '#f8fafc',
                        position: 'relative',
                        transition: 'all 0.2s',
                        cursor: readOnly ? 'default' : 'pointer'
                    }}>
                        <label style={{ cursor: isUploading || readOnly ? 'default' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <div style={{ backgroundColor: 'white', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', color: '#22c55e' }}>
                                {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                            </div>
                            <div>
                                <p style={{ fontWeight: '700', color: '#334155', fontSize: '14px', margin: 0 }}>
                                    {isUploading ? 'Subiendo archivos...' : 'Haga clic para subir informes'}
                                </p>
                                <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0 0' }}>Se permite subir varios archivos (PDF, JPG, PNG)</p>
                            </div>
                            <input type="file" multiple style={{ display: 'none' }} onChange={(e) => handleFileUpload(e.target.files)} disabled={isUploading || readOnly} />
                        </label>
                    </div>
                </div>

                {/* List of Files Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>
                        Lista de documentos cargados ({data.files?.length || 0})
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
                        {data.files && data.files.length > 0 ? data.files.map((file, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', backgroundColor: 'white', border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                                    <FileText size={18} color="#22c55e" />
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {file.name}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <button onClick={() => setPreviewIndex(idx)} style={{ border: 'none', background: '#f1f5f9', color: '#475569', padding: '6px', borderRadius: '6px', cursor: 'pointer' }} title="Ver"><Eye size={14} /></button>
                                    {!readOnly && <button onClick={() => removeFile(idx)} style={{ border: 'none', background: '#fff1f2', color: '#e11d48', padding: '6px', borderRadius: '6px', cursor: 'pointer' }} title="Eliminar"><Trash2 size={14} /></button>}
                                </div>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '13px' }}>
                                No hay archivos cargados.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Additional Comments Area */}
            <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                    Comentarios adicionales de todos los informes(*)
                </label>
                <textarea
                    placeholder="Detalle observaciones sobre los informes cargados..."
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
                    value={data.comments || ''}
                    onChange={(e) => handleCommentChange(e.target.value)}
                    disabled={readOnly}
                    onFocus={(e) => !readOnly && (e.target.style.borderColor = '#22c55e')}
                    onBlur={(e) => !readOnly && (e.target.style.borderColor = '#e2e8f0')}
                />
            </div>

            {/* Preview Modal */}
            {previewIndex !== null && data.files && data.files[previewIndex] && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(10px)', padding: '20px' }}>
                    {/* Navigation Arrows */}
                    <div style={{ position: 'absolute', top: '50%', left: '40px', transform: 'translateY(-50%)', zIndex: 100 }}>
                        <button 
                            disabled={previewIndex === 0}
                            onClick={prevPreview}
                            style={{ 
                                width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'white', color: '#1e293b', 
                                display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: previewIndex === 0 ? 'default' : 'pointer',
                                border: 'none', opacity: previewIndex === 0 ? 0.3 : 1, transition: 'all 0.2s'
                            }}
                        >
                            <ChevronLeft size={32} />
                        </button>
                    </div>

                    <div style={{ position: 'absolute', top: '50%', right: '40px', transform: 'translateY(-50%)', zIndex: 100 }}>
                        <button 
                            disabled={previewIndex === data.files.length - 1}
                            onClick={nextPreview}
                            style={{ 
                                width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'white', color: '#1e293b', 
                                display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: previewIndex === data.files.length - 1 ? 'default' : 'pointer',
                                border: 'none', opacity: previewIndex === data.files.length - 1 ? 0.3 : 1, transition: 'all 0.2s'
                            }}
                        >
                            <ChevronRight size={32} />
                        </button>
                    </div>

                    <div style={{ position: 'relative', width: '90vw', maxWidth: '1100px', height: '90vh', backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 110 }}>
                            <button onClick={() => setPreviewIndex(null)} style={{ background: 'white', border: 'none', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 110, backgroundColor: 'rgba(255,255,255,0.9)', padding: '8px 16px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>
                            {data.files[previewIndex].name} ({previewIndex + 1} / {data.files.length})
                        </div>

                        <div style={{ width: '100%', height: '100%', paddingTop: '0' }}>
                            {isPdf(data.files[previewIndex].name) ? (
                                <SecureIframe src={data.files[previewIndex].url} style={{ width: '100%', height: '100%', border: 'none' }} title="PDF Preview" />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9' }}>
                                    <SecureImage src={data.files[previewIndex].url} alt="Report Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeneralImagingReportUploadForm;
