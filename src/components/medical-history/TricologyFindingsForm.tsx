import React, { useState } from 'react';
import { Upload, Trash2, Eye, X, FileImage, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../api';

interface Props {
    data: { text: string; files: string[] };
    patientId?: string;
    onChange: (data: { text: string; files: string[] }) => void;
    onSave?: () => void;
}

export default function TricologyFindingsForm({ data = { text: '', files: [] }, patientId = 'generic', onChange, onSave }: Props) {
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [previewFiles, setPreviewFiles] = useState<any[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    // Cargar archivos persistentes desde la base de datos al montar
    React.useEffect(() => {
        const fetchFiles = async () => {
            if (!patientId || patientId === 'generic') return;
            try {
                const response = await api.get(`/drive/patient/${patientId}?specialty=Tricologia`);
                if (Array.isArray(response.data)) {
                    const dbFiles = response.data.map((f: any) => ({
                        url: f.url,
                        status: 'uploaded',
                        name: f.name
                    }));

                    setPreviewFiles(prev => {
                        const existingUrls = new Set(prev.map(p => p.url));
                        const newOnes = dbFiles.filter(f => !existingUrls.has(f.url));
                        return [...prev, ...newOnes];
                    });

                    const allUrls = [...new Set([...data.files, ...dbFiles.map(f => f.url)])];
                    if (allUrls.length !== data.files.length) {
                        onChange({ ...data, files: allUrls });
                    }
                }
            } catch (error) {
                console.error('Error fetching patient files:', error);
            }
        };
        fetchFiles();
    }, [patientId]);

    // Sincronizar la vista previa cuando los datos externos cambian
    React.useEffect(() => {
        if (!isUploading) {
            setPreviewFiles(prev => {
                const propFiles = data.files.map(url => ({
                    url,
                    status: 'uploaded'
                }));
                const currentUrls = new Set(prev.map(p => p.url));
                const missing = propFiles.filter(f => !currentUrls.has(f.url));
                return [...prev, ...missing];
            });
        }
    }, [data.files, isUploading]);

    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const batchFiles = Array.from(files);

        for (const file of batchFiles) {
            const tempUrl = URL.createObjectURL(file);
            setPreviewFiles(prev => [...prev, { url: tempUrl, status: 'uploading', name: file.name }]);

            const formData = new FormData();
            formData.append('file', file);

            try {
                const baseUrl = api.defaults.baseURL?.replace(/\/$/, '') || 'http://localhost:3000';
                const response = await api.post(`/drive/upload?patientId=${patientId}&specialty=Tricologia`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.data?.data?.id) {
                    const fileId = response.data.data.id;
                    const proxyUrl = `${baseUrl}/drive/file/${fileId}`;

                    setPreviewFiles(prev => {
                        const updated = prev.map(p =>
                            p.url === tempUrl ? { ...p, url: proxyUrl, status: 'uploaded' } : p
                        );
                        const uploadedUrls = updated
                            .filter(f => f.status === 'uploaded')
                            .map(f => f.url);
                        onChange({ ...data, files: uploadedUrls });
                        return updated;
                    });
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                setPreviewFiles(prev => prev.map(p =>
                    p.url === tempUrl ? { ...p, status: 'error' } : p
                ));
            }
        }
        setIsUploading(false);
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

    const removeFile = (index: number) => {
        setPreviewFiles(prev => {
            const updated = [...prev];
            updated.splice(index, 1);
            const uploadedUrls = updated
                .filter(f => f.status === 'uploaded')
                .map(f => f.url);
            onChange({ ...data, files: uploadedUrls });
            return updated;
        });
    };

    return (
        <div className="section-container" style={{ animation: 'fadeIn 0.3s ease-in-out', backgroundColor: '#fcfcfd', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileImage size={24} color="#4f46e5" /> Hallazgos en tricología
            </h3>

            <div style={{ marginBottom: '32px' }}>
                <label style={{ fontWeight: '600', color: '#475569', marginBottom: '10px', display: 'block', fontSize: '14px' }}>Descripción de los hallazgos</label>
                <textarea
                    className="form-input"
                    value={data?.text || ''}
                    onChange={(e) => onChange({ ...data, text: e.target.value })}
                    rows={4}
                    placeholder="Escriba aquí los hallazgos observados..."
                    style={{ width: '100%', padding: '14px 18px', border: '1.5px solid #e2e8f0', borderRadius: '12px', outline: 'none', resize: 'vertical', minHeight: '120px', transition: 'all 0.2s', fontSize: '15px' }}
                    onFocus={(e) => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={(e) => { e.preventDefault(); onSave && onSave(); }}
                        style={{ backgroundColor: '#4f46e5', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: '600', border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)' }}
                    >
                        Guardar texto
                    </button>
                </div>
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
                        cursor: isUploading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%'
                    }}>
                        <div style={{ backgroundColor: '#fff', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', color: '#4f46e5' }}>
                            <Upload size={24} />
                        </div>
                        <div>
                            <p style={{ fontWeight: '700', color: '#1e293b', marginBottom: '4px', fontSize: '16px' }}>
                                {isUploading ? 'Subiendo archivos...' : 'Agregar o arrastre imágenes'}
                            </p>
                            <p style={{ fontSize: '13px', color: '#64748b' }}>PNG, JPG hasta 10MB</p>
                        </div>
                        <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e.target.files)} disabled={isUploading} />
                    </label>

                    {previewFiles.length > 0 && (
                        <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', width: '100%' }}>
                            {previewFiles.map((file, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    backgroundColor: 'white',
                                    padding: '10px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                                    textAlign: 'left'
                                }}>
                                    <div style={{ width: '54px', height: '54px', flexShrink: 0, position: 'relative', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                                        <img
                                            src={file.url}
                                            alt="preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement!.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#fee2e2;color:#ef4444;font-size:10px;font-weight:700">ERR</div>';
                                            }}
                                        />
                                        {file.status === 'uploading' && (
                                            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <div style={{ width: '16px', height: '16px', border: '2px solid #4f46e5', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {file.name || `Imagen ${idx + 1}`}
                                        </p>
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                                            <button
                                                onClick={() => setSelectedImageIndex(idx)}
                                                style={{ border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                                title="Ver imagen"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                onClick={() => removeFile(idx)}
                                                style={{ border: '1px solid #ffe4e6', background: '#fff1f2', color: '#e11d48', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                                title="Eliminar"
                                            >
                                                <Trash2 size={14} />
                                            </button>
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
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                    backdropFilter: 'blur(12px)',
                    padding: '20px',
                    userSelect: 'none'
                }}
                    onClick={() => setSelectedImageIndex(null)}
                >
                    <div
                        style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Botón Cerrar */}
                        <button
                            onClick={() => setSelectedImageIndex(null)}
                            style={{ position: 'fixed', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'white', transition: 'all 0.2s', zIndex: 10000 }}
                            onMouseMove={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        >
                            <X size={24} />
                        </button>

                        {/* Navegación Anterior */}
                        {previewFiles.length > 1 && (
                            <button
                                onClick={() => setSelectedImageIndex((selectedImageIndex - 1 + previewFiles.length) % previewFiles.length)}
                                style={{ position: 'fixed', left: '24px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'white', transition: 'all 0.2s', zIndex: 10000 }}
                                onMouseMove={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            >
                                <ChevronLeft size={32} />
                            </button>
                        )}

                        <div style={{ position: 'relative', textAlign: 'center' }}>
                            <img
                                src={previewFiles[selectedImageIndex].url}
                                alt="Full preview"
                                style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', transition: 'all 0.3s ease' }}
                            />
                            <div style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '500' }}>
                                {previewFiles[selectedImageIndex].name || `Imagen ${selectedImageIndex + 1}`} ({selectedImageIndex + 1} / {previewFiles.length})
                            </div>
                        </div>

                        {/* Navegación Siguiente */}
                        {previewFiles.length > 1 && (
                            <button
                                onClick={() => setSelectedImageIndex((selectedImageIndex + 1) % previewFiles.length)}
                                style={{ position: 'fixed', right: '24px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'white', transition: 'all 0.2s', zIndex: 10000 }}
                                onMouseMove={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            >
                                <ChevronRight size={32} />
                            </button>
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
