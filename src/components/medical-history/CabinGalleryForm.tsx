import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, Trash2, FileText, Eye, ChevronLeft, ChevronRight, Download, ExternalLink, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '../../api';
import { useToast } from '../Toast';
import { SecureImage } from '../common/SecureImage';
import { SecureIframe } from '../common/SecureIframe';

interface CabinGalleryItem {
    id: string;
    title: string;
    observations: string;
    value: string;
    date: string;
    files: { name: string, url: string, type: string }[];
}

interface CabinGalleryFormProps {
    patientId: string;
    recordId?: string | null;
    sessionId?: string | null;
    data: CabinGalleryItem[];
    onChange: (data: CabinGalleryItem[]) => void;
    onUploadingChange?: (uploading: boolean) => void;
    readOnly?: boolean;
}

export default function CabinGalleryForm({ patientId, recordId, sessionId, data, onChange, onUploadingChange, readOnly = false }: CabinGalleryFormProps) {
    const { showToast } = useToast();
    const [showModal, setShowModal] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [selectedFilePreview, setSelectedFilePreview] = useState<{ file: { url: string, type: string, name: string }, allFiles: { url: string, type: string, name: string }[], currentIndex: number } | null>(null);
    const [newItem, setNewItem] = useState<Partial<CabinGalleryItem>>({
        title: '', observations: '', value: '', date: new Date().toISOString().split('T')[0], files: []
    });

    const handleCancelModal = async () => {
        if (newItem.files && newItem.files.length > 0) {
            for (const file of newItem.files) {
                try {
                    const parts = file.url.split('/');
                    const fileId = parts[parts.length - 1];
                    if (fileId) await api.delete(`/drive/file/${fileId}`);
                } catch (error) {
                    console.error('Error deleting orphaned file:', error);
                }
            }
        }
        setNewItem({ title: '', observations: '', value: '', date: new Date().toISOString().split('T')[0], files: [] });
        setShowModal(false);
    };

    const handleAddItem = () => {
        if (!newItem.title || !newItem.observations || !newItem.value || !newItem.date) {
            showToast('Por favor llene todos los campos obligatorios (*)', 'error');
            return;
        }
        const result: CabinGalleryItem = {
            id: Date.now().toString(),
            title: newItem.title!,
            observations: newItem.observations!,
            value: newItem.value!,
            date: newItem.date!,
            files: newItem.files || []
        };
        onChange([...data, result]);
        setNewItem({ title: '', observations: '', value: '', date: new Date().toISOString().split('T')[0], files: [] });
        setShowModal(false);
        showToast('Imagen agregada correctamente a la galería.', 'success');
    };

    const handleRemove = async (id: string) => {
        if (readOnly) return;
        const itemToRemove = data.find(item => item.id === id);
        if (itemToRemove && itemToRemove.files?.length > 0) {
            for (const file of itemToRemove.files) {
                try {
                    const parts = file.url.split('/');
                    const fileId = parts[parts.length - 1];
                    if (fileId) await api.delete(`/drive/file/${fileId}`);
                } catch (error) {
                    console.error('Error deleting file from Drive:', error);
                }
            }
        }
        const newData = data.filter(item => item.id !== id);
        onChange(newData);
        showToast('Imagen eliminada correctamente.', 'success');
    };

    const handleRemoveFileInModal = async (idx: number) => {
        if (readOnly) return;
        const fileToRemove = newItem.files?.[idx];
        if (fileToRemove) {
            try {
                const parts = fileToRemove.url.split('/');
                const fileId = parts[parts.length - 1];
                if (fileId) {
                    await api.delete(`/drive/file/${fileId}`);
                }
                setNewItem({ ...newItem, files: newItem.files?.filter((_, i) => i !== idx) });
            } catch (error) {
                console.error('Error deleting file from Drive:', error);
                showToast('Error al eliminar el archivo.', 'error');
            }
        }
    };

    const handleDeleteFileFromRecord = async (recordId: string, fileIdx: number) => {
        if (readOnly) return;
        const record = data.find(r => r.id === recordId);
        if (!record || !record.files || !record.files[fileIdx]) return;

        const fileToRemove = record.files[fileIdx];
        try {
            const parts = fileToRemove.url.split('/');
            const fileId = parts[parts.length - 1];
            if (fileId) {
                await api.delete(`/drive/file/${fileId}`);
            }
        } catch (error) {
            console.error('Error deleting file from record:', error);
            showToast('Error al eliminar el archivo.', 'error');
        }

        const updatedFiles = record.files.filter((_, i) => i !== fileIdx);
        const updatedData = data.map(r => r.id === recordId ? { ...r, files: updatedFiles } : r);
        onChange(updatedData);
    };

    const handleDrag = (e: React.DragEvent) => {
        if (readOnly) return;
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const handleDrop = (e: React.DragEvent) => {
        if (readOnly) return;
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files) {
            handleFileSelection(e.dataTransfer.files);
        }
    };

    const handleFileSelection = async (fileList: FileList) => {
        if (readOnly) return;
        const files = Array.from(fileList);
        const validFiles: File[] = [];
        const invalidFiles: File[] = [];

        for (const file of files) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                showToast(`El archivo ${file.name} no es un tipo permitido (Imágenes o PDF).`, 'error');
                continue;
            }

            if (file.size > 10 * 1024 * 1024) {
                invalidFiles.push(file);
                continue;
            }
            validFiles.push(file);
        }

        if (invalidFiles.length > 0) {
            showToast(`Se omitieron ${invalidFiles.length} archivo(s) que superan los 10MB`, 'warning');
        }

        if (validFiles.length === 0) return;

        for (const file of validFiles) {
            setIsUploading(true);
            onUploadingChange?.(true);
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await api.post(`/drive/upload?patientId=${patientId}&specialty=Cabina&folder=Galeria%20de%20Cabina&recordId=${recordId || ''}&sessionId=${sessionId || ''}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.data?.data?.url) {
                    const proxyUrl = response.data.data.url;
                    setNewItem(prev => {
                        const updated = {
                            ...prev,
                            files: [
                                ...(prev.files || []),
                                { name: file.name, url: proxyUrl, type: file.type }
                            ]
                        };
                        // Check if this is the last file in the validFiles array
                        if (file === validFiles[validFiles.length - 1]) {
                            // Si todos los campos están llenos, autoguardar con ligero retraso
                            if (updated.title && updated.observations && updated.value && updated.date) {
                                setTimeout(() => {
                                    const result: CabinGalleryItem = {
                                        id: Date.now().toString(),
                                        title: updated.title!,
                                        observations: updated.observations!,
                                        value: updated.value!,
                                        date: updated.date!,
                                        files: updated.files || []
                                    };
                                    onChange([...data, result]);
                                    setNewItem({ title: '', observations: '', value: '', date: new Date().toISOString().split('T')[0], files: [] });
                                    setShowModal(false);
                                    showToast('Imagen agregada y guardada automáticamente.', 'success');
                                }, 1200); // 1.2 segundos para que no sea al milisegundo
                            }
                        }
                        return updated;
                    });
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                showToast('Error al subir el archivo', 'error');
            } finally {
                setIsUploading(false);
                onUploadingChange?.(false);
            }
        }
    };

    const openFilePreview = (itemFiles: { name: string, url: string, type: string }[], initialFile: { name: string, url: string, type: string }) => {
        const currentIndex = itemFiles.findIndex(f => f.url === initialFile.url);
        if (currentIndex !== -1) {
            setSelectedFilePreview({
                file: initialFile,
                allFiles: itemFiles,
                currentIndex: currentIndex
            });
        }
    };

    const handleNav = (direction: 'next' | 'prev') => {
        if (!selectedFilePreview) return;
        const { allFiles, currentIndex } = selectedFilePreview;
        let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

        if (nextIndex >= allFiles.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = allFiles.length - 1;

        setSelectedFilePreview({
            file: allFiles[nextIndex],
            allFiles,
            currentIndex: nextIndex
        });
    };

    return (
        <div className="section-container" style={{ animation: 'fadeIn 0.3s ease-in-out', backgroundColor: '#fcfcfd', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '2px solid #f1f5f9', paddingBottom: '16px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', backgroundColor: '#f5f3ff', borderRadius: '12px', color: '#4f46e5', display: 'flex' }}>
                        <ImageIcon size={24} />
                    </div>
                    Galería Fotográfica - Cabina
                </h3>
                {!readOnly && (
                    <button
                        onClick={() => setShowModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)' }}
                    >
                        Agregar a Galería <Plus size={18} />
                    </button>
                )}
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead style={{ backgroundColor: '#f8fafc', color: '#64748b', fontWeight: '700', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '16px 20px', width: '40px' }}></th>
                            <th style={{ padding: '16px 20px' }}>TÍTULO DE FOTO</th>
                            <th style={{ padding: '16px 20px' }}>RESULTADOS</th>
                            <th style={{ padding: '16px 20px' }}>FECHA</th>
                            <th style={{ padding: '16px 20px', textAlign: 'center' }}>ADJUNTOS</th>
                            {!readOnly && <th style={{ padding: '16px 20px', width: '80px', textAlign: 'center' }}>ACCIONES</th>}
                        </tr>
                    </thead>
                    <tbody style={{ color: '#334155' }}>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={readOnly ? 5 : 6} style={{ padding: '60px 40px', textAlign: 'center', color: '#94a3b8', backgroundColor: '#f8fafc' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '64px', height: '64px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                                            <FileText size={32} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontSize: '16px', fontWeight: '700', color: '#475569' }}>Sin imágenes en la galería aún</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <React.Fragment key={item.id}>
                                    <tr
                                        style={{ borderBottom: expandedId === item.id ? 'none' : '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: expandedId === item.id ? '#f8fafc' : 'white' }}
                                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                    >
                                        <td style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                                            <div style={{ transition: 'transform 0.2s', transform: expandedId === item.id ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                                                <ChevronRight size={18} />
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>{item.title}</span>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <span style={{ fontWeight: '700', color: '#4f46e5', backgroundColor: '#eef2ff', padding: '6px 12px', borderRadius: '8px', fontSize: '13px' }}>
                                                {item.value || 'N/A'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px', whiteSpace: 'nowrap' }}>
                                            <span style={{ fontSize: '13px', fontWeight: '500', color: '#64748b' }}>{item.date}</span>
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'center' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: item.files?.length > 0 ? '#f0fdf4' : '#f8fafc', color: item.files?.length > 0 ? '#16a34a' : '#94a3b8', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: item.files?.length > 0 ? '1px solid #dcfce7' : '1px solid #e2e8f0' }}>
                                                <ImageIcon size={14} />
                                                {item.files?.length || 0}
                                            </div>
                                        </td>
                                        {!readOnly && (
                                            <td style={{ padding: '20px', textAlign: 'center' }}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}
                                                    style={{ color: '#ef4444', backgroundColor: 'transparent', border: '1.5px solid #fee2e2', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                    {expandedId === item.id && (
                                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                            <td colSpan={readOnly ? 5 : 6} style={{ padding: '0 20px 24px 78px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                    <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                                                        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Observaciones</h4>
                                                        <p style={{ margin: 0, color: '#334155', lineHeight: '1.6', fontSize: '14px' }}>{item.observations}</p>
                                                    </div>

                                                    <div>
                                                        <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Documentos</h4>
                                                        {item.files?.length > 0 ? (
                                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                                                                {item.files.map((file, idx) => (
                                                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'white', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                                                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                                                            {file.type?.includes('pdf') ? <FileText size={20} /> : <ImageIcon size={20} />}
                                                                        </div>
                                                                        <div style={{ display: 'flex', gap: '6px' }}>
                                                                            <button
                                                                                onClick={() => openFilePreview(item.files, file)}
                                                                                style={{ border: 'none', background: '#f1f5f9', color: '#475569', padding: '6px', borderRadius: '8px', cursor: 'pointer' }}
                                                                            >
                                                                                <Eye size={16} />
                                                                            </button>
                                                                            {!readOnly && (
                                                                                <button
                                                                                    onClick={() => handleDeleteFileFromRecord(item.id, idx)}
                                                                                    style={{ border: 'none', background: '#fff1f2', color: '#e11d48', padding: '6px', borderRadius: '8px', cursor: 'pointer' }}
                                                                                >
                                                                                    <Trash2 size={16} />
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div style={{ padding: '16px', borderRadius: '14px', border: '1px dashed #e2e8f0', color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>
                                                                No hay documentos adjuntos.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && createPortal(
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(4px)' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '700px', maxHeight: '95vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', animation: 'modalFadeIn 0.3s ease-out' }}>
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10 }}>
                            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Nueva Imagen de Galería (Cabina)</h2>
                            <button onClick={handleCancelModal} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#fee2e2'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}><X size={20} /></button>
                        </div>

                        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>Título de Foto (*)</label>
                                    <input
                                        placeholder="Ej: Vista frontal"
                                        value={newItem.title}
                                        onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: '12px', outline: 'none', transition: 'all 0.2s', fontSize: '15px' }}
                                        onFocus={e => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                                        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>Fecha (*)</label>
                                    <input
                                        type="date"
                                        value={newItem.date}
                                        onChange={e => setNewItem({ ...newItem, date: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: '12px', outline: 'none', transition: 'all 0.2s', fontSize: '15px' }}
                                        onFocus={e => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                                        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>Resultados (*)</label>
                                <input
                                    placeholder="Ej: Piel hidratada, sin lesiones"
                                    value={newItem.value}
                                    onChange={e => setNewItem({ ...newItem, value: e.target.value })}
                                    style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: '12px', outline: 'none', transition: 'all 0.2s', fontSize: '15px' }}
                                    onFocus={e => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>Observaciones (*)</label>
                                <textarea
                                    placeholder="Detalles relevantes del resultado..."
                                    value={newItem.observations}
                                    onChange={e => setNewItem({ ...newItem, observations: e.target.value })}
                                    rows={3}
                                    style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: '12px', outline: 'none', transition: 'all 0.2s', fontSize: '15px', resize: 'vertical' }}
                                    onFocus={e => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>Adjuntar Archivos (Imágenes o PDF)</label>
                                <div
                                    style={{ border: dragActive ? '2px dashed #4f46e5' : '2px dashed #cbd5e1', borderRadius: '16px', padding: '24px', backgroundColor: dragActive ? '#f5f3ff' : '#f8fafc', textAlign: 'center', transition: 'all 0.2s' }}
                                    onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                                >
                                    <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', color: '#4f46e5' }}>
                                            <Upload size={20} />
                                        </div>
                                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{isUploading ? 'Subiendo...' : 'Seleccione o arrastre archivos'}</span>
                                        <input type="file" multiple accept="image/*,application/pdf" style={{ display: 'none' }} onChange={e => { if (e.target.files) handleFileSelection(e.target.files) }} />
                                    </label>
                                </div>

                                {newItem.files && newItem.files.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px' }}>
                                        {newItem.files.map((_, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>
                                                <ImageIcon size={14} />
                                                <button onClick={() => handleRemoveFileInModal(idx)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex' }}><X size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ padding: '24px 32px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#f8fafc', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
                            <button
                                onClick={() => !isUploading && handleCancelModal()}
                                disabled={isUploading}
                                style={{
                                    padding: '10px 24px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    backgroundColor: 'white',
                                    color: isUploading ? '#cbd5e1' : '#475569',
                                    fontWeight: '600',
                                    cursor: isUploading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddItem}
                                disabled={isUploading}
                                style={{
                                    padding: '10px 32px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    backgroundColor: isUploading ? '#94a3b8' : '#4f46e5',
                                    color: 'white',
                                    fontWeight: '700',
                                    cursor: isUploading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: isUploading ? 'none' : '0 4px 12px rgba(79, 70, 229, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                onMouseOver={e => { if (!isUploading) e.currentTarget.style.backgroundColor = '#4338ca' }}
                                onMouseOut={e => { if (!isUploading) e.currentTarget.style.backgroundColor = '#4f46e5' }}
                            >
                                {isUploading && <Loader2 className="animate-spin" size={18} />}
                                {isUploading ? 'Subiendo Archivos...' : 'Guardar Imagen'}
                            </button>
                        </div>
                    </div>
                </div>
            , document.body)}

            {selectedFilePreview && createPortal(
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.95)', zIndex: 100000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(8px)' }} onClick={() => setSelectedFilePreview(null)}>
                    <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => e.stopPropagation()}>

                        {/* BotÃ³n Cerrar */}
                        <button onClick={() => setSelectedFilePreview(null)} style={{ position: 'fixed', top: '24px', right: '24px', color: 'white', background: 'rgba(255,255,255,0.1)', border: 'none', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2001 }}><X size={24} /></button>

                        {/* NavegaciÃ³n Anterior */}
                        {selectedFilePreview.allFiles.length > 1 && (
                            <button
                                onClick={() => handleNav('prev')}
                                style={{ position: 'fixed', left: '24px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'white', transition: 'all 0.2s', zIndex: 2001 }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            >
                                <ChevronLeft size={32} />
                            </button>
                        )}

                        <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', maxWidth: '90vw', maxHeight: '85vh', position: 'relative' }}>
                            <div style={{ padding: '12px 20px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '6px', borderRadius: '6px' }}>
                                        {selectedFilePreview.file.type.includes('pdf') ? <FileText size={18} /> : <ImageIcon size={18} />}
                                    </div>
                                    <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>Archivo {selectedFilePreview.currentIndex + 1} de {selectedFilePreview.allFiles.length}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <a href={selectedFilePreview.file.url} target="_blank" rel="noopener noreferrer" style={{ padding: '8px 16px', borderRadius: '10px', color: '#475569', backgroundColor: 'white', border: '1px solid #e2e8f0', textDecoration: 'none', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}><ExternalLink size={16} /> Abrir</a>
                                    <a href={selectedFilePreview.file.url} download={selectedFilePreview.file.name} style={{ padding: '8px 16px', borderRadius: '10px', color: 'white', backgroundColor: '#4f46e5', border: 'none', textDecoration: 'none', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}><Download size={16} /></a>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                                {selectedFilePreview.file.type.includes('pdf') ? (
                                    <SecureIframe src={selectedFilePreview.file.url} style={{ width: '80vw', height: '70vh', border: 'none' }} title="PDF" />
                                ) : (
                                    <SecureImage src={selectedFilePreview.file.url} alt="Preview" style={{ maxWidth: '100%', maxHeight: '70vh', display: 'block', objectFit: 'contain' }} />
                                )}
                            </div>
                        </div>

                        {/* NavegaciÃ³n Siguiente */}
                        {selectedFilePreview.allFiles.length > 1 && (
                            <button
                                onClick={() => handleNav('next')}
                                style={{ position: 'fixed', right: '24px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'white', transition: 'all 0.2s', zIndex: 2001 }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            >
                                <ChevronRight size={32} />
                            </button>
                        )}
                    </div>
                </div>
            , document.body)}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes modalFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
}

