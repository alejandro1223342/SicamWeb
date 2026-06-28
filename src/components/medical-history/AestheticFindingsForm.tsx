import React, { useState } from 'react';
import { useToast } from '../Toast';
import { Upload, Trash2, Eye, X, FileImage, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import api from '../../api';
import { SecureImage } from '../common/SecureImage';
import { SecureIframe } from '../common/SecureIframe';

interface AestheticFindingsFormProps {
    patientId: string;
    recordId?: string | null;
    sessionId?: string | null;
    data: {
        observations: string;
        files: any[];
    };
    onChange: (data: { observations: string, files: any[] }) => void;
    onUploadingChange?: (uploading: boolean) => void;
    readOnly?: boolean;
}

export default function AestheticFindingsForm({ patientId, recordId, sessionId, data, onChange, onUploadingChange, readOnly = false }: AestheticFindingsFormProps) {
    const { showToast } = useToast();
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [previewFiles, setPreviewFiles] = useState<any[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    // Cargar archivos persistentes desde la base de datos al montar (Especialidad Estética)
    React.useEffect(() => {
        const fetchFiles = async () => {
            const isNewMode = new URLSearchParams(window.location.search).get('mode') === 'new';
            if (isNewMode) return;

            if (!patientId || patientId === 'generic') return;
            try {
                const response = await api.get(`/drive/patient/${patientId}?specialty=Estética&folder=Hallazgos de Estética&recordId=${recordId || ''}&sessionId=${sessionId || ''}`);
                if (Array.isArray(response.data)) {
                    const dbFiles = response.data.map((f: any) => ({
                        url: f.url,
                        status: 'uploaded',
                        name: f.name,
                        type: f.mimeType
                    }));

                    setPreviewFiles(dbFiles);

                    const currentFiles = Array.isArray(data?.files) ? data.files : [];
                    const dbUrls = dbFiles.map(f => typeof f === 'string' ? f : f.url).filter(Boolean);
                    const allUrls = [...new Set([...currentFiles, ...dbUrls])];
                    if (allUrls.length !== currentFiles.length) {
                        onChange({ ...data, files: allUrls });
                    }
                }
            } catch (error) {
                console.error('Error fetching patient files (Estética):', error);
            }
        };
        fetchFiles();
    }, [patientId, recordId, sessionId]);

    // Sincronizar la vista previa cuando los datos externos cambian
    React.useEffect(() => {
        if (!isUploading) {
            setPreviewFiles(prev => {
                const currentFilesMap = new Map(prev.map(f => [f.url, f]));
                const propFiles = (Array.isArray(data?.files) ? data.files : []).map(urlOrObj => {
                    const url = typeof urlOrObj === 'string' ? urlOrObj : (urlOrObj?.url || '');
                    if (!url) return null;
                    const existing = currentFilesMap.get(url);
                    return {
                        url,
                        status: 'uploaded' as const,
                        name: existing?.name || (url.includes('/') ? url.split('/').pop() : 'Archivo'),
                        type: existing?.type || (url.toLowerCase().includes('pdf') ? 'application/pdf' : 'image/jpeg')
                    };
                }).filter(Boolean) as any[];

                const currentUrls = prev.map(f => f.url).sort().join(',');
                const nextUrls = propFiles.map(f => f.url).sort().join(',');
                if (currentUrls === nextUrls) return prev;

                return propFiles;
            });
        }
    }, [data.files, isUploading]);

    const handleFileUpload = async (files: FileList | null) => {
        if (readOnly || !files || files.length === 0) return;

        setIsUploading(true);
        onUploadingChange?.(true);
        const batchFiles = Array.from(files);

        for (const file of batchFiles) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                showToast(`El archivo ${file.name} no es un tipo permitido (Imágenes o PDF).`, 'error');
                continue;
            }

            const tempUrl = URL.createObjectURL(file);
            setPreviewFiles(prev => [...prev, { url: tempUrl, status: 'uploading', name: file.name, type: file.type }]);

            const formData = new FormData();
            formData.append('file', file);

            try {
                const baseUrl = api.defaults.baseURL?.replace(/\/$/, '') || 'http://localhost:3000';
                // Cambiado a Estetica
                const response = await api.post(`/drive/upload?patientId=${patientId}&specialty=Estética&folder=Hallazgos de Estética&recordId=${recordId || ''}&sessionId=${sessionId || ''}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.data?.data?.id) {
                    const fileId = response.data.data.id;
                    const proxyUrl = `${baseUrl}/drive/file/${fileId}`;

                    setPreviewFiles(prev => {
                        const updated = prev.map(p =>
                            p.url === tempUrl ? { ...p, url: proxyUrl, status: 'uploaded', type: file.type } : p
                        );
                        const uploadedUrls = updated
                            .filter(f => f.status === 'uploaded')
                            .map(f => f.url);
                        onChange({ ...data, files: uploadedUrls });
                        return updated;
                    });
                }
            } catch (error) {
                console.error('Error uploading file (Estética):', error);
                setPreviewFiles(prev => prev.map(p => p.url === tempUrl ? { ...p, status: 'error' } : p));
                showToast('Error al subir el archivo. Inténtalo de nuevo.', 'error');
            }
        }
        setIsUploading(false);
        onUploadingChange?.(false);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.length > 0) handleFileUpload(e.dataTransfer.files);
    };

    const removeFile = async (index: number) => {
        if (readOnly) return;
        const fileToRemove = previewFiles[index];
        if (fileToRemove.status === 'uploaded') {
            try {
                const parts = fileToRemove.url.split('/');
                const fileId = parts[parts.length - 1];
                if (fileId) await api.delete(`/drive/file/${fileId}`);
            } catch (error) {
                console.error('❌ Error al eliminar archivo de Estética:', error);
                showToast('No se pudo eliminar el archivo del servidor.', 'error');
                return;
            }
        }

        setPreviewFiles(prev => {
            const updated = [...prev];
            updated.splice(index, 1);
            const uploadedUrls = updated.filter(f => f.status === 'uploaded').map(f => f.url);
            onChange({ ...data, files: uploadedUrls });
            return updated;
        });
    };

    return (
        <div className="section-container" style={{ animation: 'fadeIn 0.3s ease-in-out', backgroundColor: '#fcfcfd', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileImage size={24} color="#4f46e5" /> Hallazgos en Dermatoscopía
            </h3>

            <div style={{ marginBottom: '32px' }}>
                <label style={{ fontWeight: '600', color: '#475569', marginBottom: '10px', display: 'block', fontSize: '14px' }}>Descripción de los hallazgos de Dermatoscopia</label>
                <textarea
                    className="form-input"
                    value={data?.observations || ''}
                    onChange={(e) => !readOnly && onChange({ ...data, observations: e.target.value })}
                    readOnly={readOnly}
                    rows={4}
                    placeholder={readOnly ? "Sin observaciones" : "Escriba aquí los hallazgos de Dermatoscopía observados..."}
                    style={{ width: '100%', padding: '14px 18px', border: '1.5px solid #e2e8f0', borderRadius: '12px', outline: 'none', resize: 'vertical', minHeight: '120px', transition: 'all 0.2s', fontSize: '15px', backgroundColor: readOnly ? '#f8fafc' : 'white' }}
                />
            </div>

            <div style={{
                border: dragActive ? '2.5px dashed #4f46e5' : '1.5px dashed #cbd5e1',
                borderRadius: '16px',
                backgroundColor: dragActive ? '#f5f3ff' : '#f8fafc',
                transition: 'all 0.3s ease',
                padding: '24px',
                textAlign: 'center'
            }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={{
                        cursor: (readOnly || isUploading) ? 'default' : 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%'
                    }}>
                        {!readOnly && (
                            <>
                                <div style={{ backgroundColor: '#fff', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', color: '#4f46e5' }}>
                                    <Upload size={24} />
                                </div>
                                <div>
                                    <p style={{ fontWeight: '700', color: '#1e293b', marginBottom: '4px', fontSize: '16px' }}>
                                        {isUploading ? 'Subiendo archivos...' : 'Agregar o arrastre imágenes de Dermatoscopía'}
                                    </p>
                                    <p style={{ fontSize: '13px', color: '#64748b' }}>PNG, JPG hasta 10MB</p>
                                </div>
                                <input type="file" multiple accept="image/*,application/pdf" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e.target.files)} disabled={isUploading || readOnly} />
                            </>
                        )}
                        {readOnly && previewFiles.length === 0 && (
                            <p style={{ color: '#64748b', fontSize: '14px' }}>No hay imágenes cargadas en este registro de Dermatoscopia.</p>
                        )}
                    </label>

                    {previewFiles.length > 0 && (
                        <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', width: '100%' }}>
                            {previewFiles.map((file, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'white', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', textAlign: 'left' }}>
                                    <div style={{ width: '54px', height: '54px', flexShrink: 0, position: 'relative', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {file.type === 'application/pdf' || file.url.toLowerCase().endsWith('.pdf') ? (
                                            <FileText size={24} color="#64748b" />
                                        ) : (
                                            <SecureImage src={file.url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        )}
                                        {file.status === 'uploading' && (
                                            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <div style={{ width: '16px', height: '16px', border: '2px solid #4f46e5', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => setSelectedImageIndex(idx)} style={{ border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><Eye size={14} /></button>
                                            {!readOnly && <button onClick={() => removeFile(idx)} style={{ border: '1px solid #ffe4e6', background: '#fff1f2', color: '#e11d48', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={14} /></button>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Imagen */}
            {selectedImageIndex !== null && previewFiles[selectedImageIndex] && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(12px)', padding: '20px' }} onClick={() => setSelectedImageIndex(null)}>
                    <div style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedImageIndex(null)} style={{ position: 'fixed', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'white' }}><X size={24} /></button>
                        {previewFiles.length > 1 && (
                            <button onClick={() => setSelectedImageIndex((selectedImageIndex - 1 + previewFiles.length) % previewFiles.length)} style={{ position: 'fixed', left: '24px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'white' }}><ChevronLeft size={32} /></button>
                        )}
                        <div style={{ position: 'relative', textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center' }}>
                            {previewFiles[selectedImageIndex].type === 'application/pdf' ? (
                                <SecureIframe src={previewFiles[selectedImageIndex].url} style={{ width: '90vw', maxWidth: '1000px', height: '85vh', backgroundColor: 'white', borderRadius: '20px', border: 'none' }} title="PDF Preview" />
                            ) : (
                                <SecureImage src={previewFiles[selectedImageIndex].url} alt="Full preview" style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '12px' }} />
                            )}
                        </div>
                        {previewFiles.length > 1 && (
                            <button onClick={() => setSelectedImageIndex((selectedImageIndex + 1) % previewFiles.length)} style={{ position: 'fixed', right: '24px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'white' }}><ChevronRight size={32} /></button>
                        )}
                    </div>
                </div>
            )}
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
