import { useState, useEffect } from 'react';
import { useToast } from '../Toast';
import { SecureIframe } from '../common/SecureIframe';
import { FileText, Eye, Upload, Trash2, Search, X, CheckCircle, Printer, Loader2 } from 'lucide-react';
import api from '../../api';

interface ConsentFormProps {
    patientId: string;
    specialty: string; // "Estética", "Tricología", etc.
    recordId?: string | null;
    sessionId?: string | null;
    data: {
        signedFiles: any[];
    };
    onChange: (data: { signedFiles: any[] }) => void;
    onUploadingChange?: (uploading: boolean) => void;
    readOnly?: boolean;
}

const ConsentForm = ({ patientId, specialty, recordId, sessionId, data, onChange, onUploadingChange, readOnly = false }: ConsentFormProps) => {
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [templates, setTemplates] = useState<any[]>([]);
    const [previewFiles, setPreviewFiles] = useState<any[]>([]);
    const [fetchingTemplates, setFetchingTemplates] = useState(false);

    // Fetch PDF templates from Drive (Only for the current specialty)
    useEffect(() => {
        const fetchTemplates = async () => {
            setFetchingTemplates(true);
            try {
                // Normalize specialty for API (Estética -> Estetica)
                const normalizedSpec = specialty.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const response = await api.get('/drive/templates', { params: { specialty: normalizedSpec } });
                
                if (response.data?.data) {
                    setTemplates(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching templates:', error);
                setTemplates([]);
            } finally {
                setFetchingTemplates(false);
            }
        };
        fetchTemplates();
    }, [specialty]);

    // Fetch existing signed files for this patient AND specialty
    useEffect(() => {
        const fetchFiles = async () => {
            const isNewMode = new URLSearchParams(window.location.search).get('mode') === 'new';
            if (isNewMode) return;
            if (!patientId || patientId === 'generic') return;

            try {
                const normalizedSpec = specialty.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const response = await api.get(`/drive/patient/${patientId}?specialty=${normalizedSpec}&folder=Consentimientos&recordId=${recordId || ''}&sessionId=${sessionId || ''}`);
                
                if (Array.isArray(response.data)) {
                    const dbFiles = response.data.map((f: any) => ({
                        url: f.url,
                        status: 'uploaded',
                        name: f.name,
                        type: f.mimeType
                    }));
                    setPreviewFiles(dbFiles);
                    const currentFiles = Array.isArray(data?.signedFiles) ? data.signedFiles : [];
                    const dbUrls = dbFiles.map(f => f.url);
                    const allUrls = [...new Set([...currentFiles, ...dbUrls])];
                    if (allUrls.length !== currentFiles.length) {
                        onChange({ ...data, signedFiles: allUrls });
                    }
                }
            } catch (error) {
                console.error('Error fetching signed consents:', error);
            }
        };
        fetchFiles();
    }, [patientId, recordId, sessionId, specialty]);

    const handleFileUpload = async (files: FileList | null) => {
        if (readOnly || !files || files.length === 0) return;
        setIsUploading(true);
        onUploadingChange?.(true);

        const normalizedSpec = specialty.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        for (const file of Array.from(files)) {
            if (file.type !== 'application/pdf') {
                showToast(`El archivo ${file.name} no es un PDF. Solo se admiten PDFs firmados.`, 'error');
                continue;
            }

            const tempUrl = URL.createObjectURL(file);
            setPreviewFiles(prev => [...prev, { url: tempUrl, status: 'uploading', name: file.name, type: file.type }]);

            const formData = new FormData();
            formData.append('file', file);
            try {
                const baseUrl = api.defaults.baseURL?.replace(/\/$/, '') || 'http://localhost:3000';
                const response = await api.post(`/drive/upload?patientId=${patientId}&specialty=${normalizedSpec}&folder=Consentimientos&recordId=${recordId || ''}&sessionId=${sessionId || ''}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.data?.data?.id) {
                    const fileId = response.data.data.id;
                    const proxyUrl = `${baseUrl}/drive/file/${fileId}`;
                    setPreviewFiles(prev => {
                        const updated = prev.map(p => p.url === tempUrl ? { ...p, url: proxyUrl, status: 'uploaded' } : p);
                        onChange({ ...data, signedFiles: updated.filter(f => f.status === 'uploaded').map(f => f.url) });
                        return updated;
                    });
                }
            } catch (error) {
                setPreviewFiles(prev => prev.map(p => p.url === tempUrl ? { ...p, status: 'error' } : p));
                showToast('Error al subir el consentimiento firmado.', 'error');
            }
        }
        setIsUploading(false);
        onUploadingChange?.(false);
    };

    const removeFile = async (index: number) => {
        if (readOnly) return;
        const fileToRemove = previewFiles[index];
        if (fileToRemove.status === 'uploaded') {
            try {
                const fileId = fileToRemove.url.split('/').pop();
                if (fileId) await api.delete(`/drive/file/${fileId}`);
            } catch (error) {
                showToast('No se pudo eliminar el archivo del servidor.', 'error');
                return;
            }
        }
        setPreviewFiles(prev => {
            const updated = [...prev];
            updated.splice(index, 1);
            onChange({ ...data, signedFiles: updated.filter(f => f.status === 'uploaded').map(f => f.url) });
            return updated;
        });
    };

    const filteredTemplates = templates.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePrint = (path: string) => {
        const win = window.open(path, '_blank');
        if (win) {
            win.focus();
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', animation: 'fadeIn 0.4s ease-out' }}>
            {/* Left: Templates Library */}
            <div className="section-container" style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={24} color="#3b82f6" /> Librería de Consentimientos
                    </h3>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                        <input
                            type="text"
                            placeholder="Buscar consentimiento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto', paddingRight: '4px' }}>
                    {fetchingTemplates ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                            <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 10px', display: 'block' }} />
                            Cargando plantillas de {specialty}...
                        </div>
                    ) : (
                        filteredTemplates.map(template => (
                            <div key={template.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc', transition: 'all 0.2s' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ backgroundColor: '#fff', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: '700', fontSize: '14px', color: '#334155', margin: 0 }}>{template.name}</p>
                                        <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>{specialty}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => setPreviewUrl(template.path)} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', cursor: 'pointer' }} title="Previsualizar"><Eye size={18} /></button>
                                    <button onClick={() => handlePrint(template.path)} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#3b82f6', cursor: 'pointer' }} title="Imprimir"><Printer size={18} /></button>
                                </div>
                            </div>
                        ))
                    )}
                    {!fetchingTemplates && filteredTemplates.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                            No se encontraron consentimientos en la carpeta de {specialty}.
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Uploaded Signed Consents */}
            <div className="section-container" style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle size={24} color="#10b981" /> Consentimientos Firmados
                </h3>

                <div style={{ padding: '20px', border: '2px dashed #cbd5e1', borderRadius: '16px', backgroundColor: '#f8fafc', textAlign: 'center', marginBottom: '24px', transition: 'all 0.2s' }}>
                    <label style={{ cursor: isUploading ? 'default' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <div style={{ backgroundColor: 'white', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', color: '#10b981' }}>
                            <Upload size={20} />
                        </div>
                        <div>
                            <p style={{ fontWeight: '700', color: '#334155', fontSize: '15px' }}>{isUploading ? 'Subiendo...' : 'Subir Consentimiento Firmado'}</p>
                            <p style={{ fontSize: '12px', color: '#64748b' }}>Solo archivos PDF</p>
                        </div>
                        <input type="file" multiple accept="application/pdf" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e.target.files)} disabled={isUploading || readOnly} />
                    </label>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {previewFiles.map((file, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f1f5f9', backgroundColor: 'white' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                                <FileText size={18} color="#10b981" />
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button onClick={() => setPreviewUrl(file.url)} style={{ border: 'none', background: '#f1f5f9', color: '#475569', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><Eye size={14} /></button>
                                {!readOnly && <button onClick={() => removeFile(idx)} style={{ border: 'none', background: '#fff1f2', color: '#e11d48', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={14} /></button>}
                            </div>
                        </div>
                    ))}
                    {previewFiles.length === 0 && !isUploading && (
                        <div style={{ textAlign: 'center', padding: '30px', border: '1px solid #f1f5f9', borderRadius: '12px', color: '#94a3b8', fontSize: '13px' }}>
                            No hay documentos firmados cargados todavía.
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Modal */}
            {previewUrl && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(10px)', padding: '20px' }}>
                    <div style={{ position: 'relative', width: '90vw', maxWidth: '1000px', height: '90vh', backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                        <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}>
                            <button onClick={() => setPreviewUrl(null)} style={{ background: 'rgba(255,255,255,0.9)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}><X size={20} /></button>
                        </div>
                        <SecureIframe src={previewUrl} style={{ width: '100%', height: '100%', border: 'none' }} title="PDF Preview" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsentForm;
