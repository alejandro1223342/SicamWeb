import React, { useState } from 'react';
import { Plus, X, Trash2, FileText, Eye, ChevronLeft, ChevronRight, Download, ExternalLink, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';

interface LabResult {
    id: string;
    exam: string;
    observations: string;
    value: string;
    date: string;
    files: { name: string, url: string, type: string }[];
}

interface LabResultsFormProps {
    patientId: string;
    data: LabResult[]; // Changed type to LabResult[]
    onChange: (data: LabResult[]) => void; // Changed type to LabResult[]
}

export default function LabResultsForm({ patientId, data, onChange }: LabResultsFormProps) {
    const [showModal, setShowModal] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    // State to manage the full-screen preview of a file
    const [selectedFilePreview, setSelectedFilePreview] = useState<{ file: { url: string, type: string, name: string }, allFiles: { url: string, type: string, name: string }[], currentIndex: number } | null>(null);
    const [newItem, setNewItem] = useState<Partial<LabResult>>({
        exam: '', observations: '', value: '', date: '', files: []
    });

    const handleAddItem = () => {
        if (!newItem.exam || !newItem.observations || !newItem.value || !newItem.date) {
            toast.error('Por favor llene todos los campos obligatorios (*)');
            return;
        }
        const result: LabResult = {
            id: Date.now().toString(),
            exam: newItem.exam!,
            observations: newItem.observations!,
            value: newItem.value!,
            date: newItem.date!,
            files: newItem.files!
        };
        onChange([...data, result]);
        setNewItem({ exam: '', observations: '', value: '', date: '', files: [] });
        setShowModal(false);
        toast.success('Resultado de laboratorio agregado correctamente.');
    };

    const handleRemove = async (id: string) => {
        const itemToRemove = data.find(item => item.id === id);
        if (itemToRemove && itemToRemove.files?.length > 0) {
            // Eliminar todos los archivos del item en Drive
            for (const file of itemToRemove.files) {
                try {
                    const parts = file.url.split('/');
                    const fileId = parts[parts.length - 1];
                    if (fileId) await api.delete(`/drive/file/${fileId}`);
                } catch (error) {
                    console.error('Error deleting file from Drive:', error);
                    toast.error('Error al eliminar un archivo del servidor.');
                }
            }
        }
        onChange(data.filter(item => item.id !== id));
        toast.success('Resultado de laboratorio eliminado correctamente.');
    };

    const handleRemoveFileInModal = async (idx: number) => {
        const fileToRemove = newItem.files?.[idx];
        if (fileToRemove) {
            try {
                const parts = fileToRemove.url.split('/');
                const fileId = parts[parts.length - 1];
                if (fileId) {
                    await api.delete(`/drive/file/${fileId}`);
                    console.log(`✅ Archivo eliminado de Drive: ${fileId}`);
                    toast.success('Archivo eliminado del servidor.');
                }
            } catch (error) {
                console.error('Error deleting file from Drive:', error);
                toast.error('No se pudo eliminar el archivo del servidor.');
                return;
            }
        }
        setNewItem({ ...newItem, files: newItem.files?.filter((_, i) => i !== idx) });
    };

    const handleDeleteFileFromRecord = async (recordId: string, fileIdx: number) => {
        const record = data.find(r => r.id === recordId);
        if (!record || !record.files || !record.files[fileIdx]) return;

        const fileToRemove = record.files[fileIdx];
        try {
            const parts = fileToRemove.url.split('/');
            const fileId = parts[parts.length - 1];
            if (fileId) {
                await api.delete(`/drive/file/${fileId}`);
                toast.success('Archivo eliminado del servidor.');
            }
        } catch (error) {
            console.error('Error deleting file from record:', error);
            toast.error('No se pudo eliminar el archivo del servidor.');
        }

        const updatedFiles = record.files.filter((_, i) => i !== fileIdx);
        const updatedData = data.map(r => r.id === recordId ? { ...r, files: updatedFiles } : r);
        onChange(updatedData);
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
        if (e.dataTransfer.files) {
            handleFileSelection(e.dataTransfer.files);
        }
    };

    const handleFileSelection = async (fileList: FileList) => {
        const files = Array.from(fileList);

        for (const file of files) {
            // Validar tipo de archivo
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                toast.error(`El archivo ${file.name} no es un tipo permitido (Imágenes o PDF).`);
                continue;
            }

            // Validar tamaño (10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`El archivo ${file.name} supera el límite de 10MB.`);
                continue;
            }

            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await api.post(`/drive/upload?patientId=${patientId}&specialty=Tricologia&folder=Examenes`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.data?.success && response.data?.data?.url) {
                    const proxyUrl = response.data.data.url;
                    setNewItem(prev => ({
                        ...prev,
                        files: [
                            ...(prev.files || []),
                            { name: file.name, url: proxyUrl, type: file.type }
                        ]
                    }));
                    toast.success(`Archivo ${file.name} subido correctamente.`);
                } else {
                    toast.error(`Error al subir ${file.name} al servidor.`);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                toast.error(`Error crítico durante la subida de ${file.name}.`);
            } finally {
                setIsUploading(false);
            }
        }
    };

    // Function to prepare and open the file preview modal
    const openFilePreview = (itemFiles: { name: string, url: string, type: string }[], initialFile: { name: string, url: string, type: string }) => {
        const allViewableFiles = itemFiles; // In this context, we only view files from the current item
        const currentIndex = allViewableFiles.findIndex(f => f.url === initialFile.url);
        if (currentIndex !== -1) {
            setSelectedFilePreview({
                file: initialFile,
                allFiles: allViewableFiles,
                currentIndex: currentIndex
            });
        }
    };

    const navigateFilePreview = (direction: 'prev' | 'next') => {
        if (!selectedFilePreview) return;

        const { allFiles, currentIndex } = selectedFilePreview;
        let newIndex = currentIndex;

        if (direction === 'prev') {
            newIndex = (currentIndex - 1 + allFiles.length) % allFiles.length;
        } else {
            newIndex = (currentIndex + 1) % allFiles.length;
        }

        const newFile = allFiles[newIndex];
        setSelectedFilePreview({
            file: newFile,
            allFiles: allFiles,
            currentIndex: newIndex
        });
    };


    return (
        <div className="section-container" style={{ animation: 'fadeIn 0.3s ease-in-out', backgroundColor: '#fcfcfd', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '2px solid #f1f5f9', paddingBottom: '16px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', backgroundColor: '#f5f3ff', borderRadius: '12px', color: '#4f46e5', display: 'flex' }}>
                        <ImageIcon size={24} />
                    </div>
                    Resultados de laboratorio e imágenes
                </h3>
                <button
                    onClick={() => setShowModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)' }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#4338ca'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#4f46e5'; e.currentTarget.style.transform = 'none'; }}
                >
                    Agregar resultado <Plus size={18} />
                </button>
            </div>

            {/* Table */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead style={{ backgroundColor: '#f8fafc', color: '#64748b', fontWeight: '700', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '16px 20px', width: '40px' }}></th>
                            <th style={{ padding: '16px 20px' }}>EXAMEN</th>
                            <th style={{ padding: '16px 20px' }}>VALOR/NSH</th>
                            <th style={{ padding: '16px 20px' }}>FECHA</th>
                            <th style={{ padding: '16px 20px', textAlign: 'center' }}>ADJUNTOS</th>
                            <th style={{ padding: '16px 20px', width: '80px', textAlign: 'center' }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody style={{ color: '#334155' }}>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '60px 40px', textAlign: 'center', color: '#94a3b8', backgroundColor: '#f8fafc' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '64px', height: '64px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                                            <FileText size={32} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontSize: '16px', fontWeight: '700', color: '#475569' }}>Sin registros aún</span>
                                            <span style={{ fontSize: '13px', color: '#94a3b8' }}>Los resultados de laboratorio que agregues aparecerán aquí.</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            (Array.isArray(data) ? data : []).map((item) => (
                                <React.Fragment key={item.id}>
                                    <tr
                                        style={{ borderBottom: expandedId === item.id ? 'none' : '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: expandedId === item.id ? '#f8fafc' : 'white' }}
                                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                        onMouseOver={(e) => { if (expandedId !== item.id) e.currentTarget.style.backgroundColor = '#fcfdff'; }}
                                        onMouseOut={(e) => { if (expandedId !== item.id) e.currentTarget.style.backgroundColor = 'white'; }}
                                    >
                                        <td style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                                            <div style={{ transition: 'transform 0.2s', transform: expandedId === item.id ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                                                <ChevronRight size={18} />
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>{item.exam}</span>
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
                                        <td style={{ padding: '20px', textAlign: 'center' }}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}
                                                style={{ color: '#ef4444', backgroundColor: 'transparent', border: '1.5px solid #fee2e2', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', margin: '0 auto' }}
                                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#fee2e2'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                                title="Eliminar registro"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedId === item.id && (
                                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                            <td colSpan={6} style={{ padding: '0 20px 24px 78px' }}>
                                                <div style={{ animation: 'fadeIn 0.2s ease-out', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                    {/* Observations Section */}
                                                    <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                                                        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Observaciones</h4>
                                                        <p style={{ margin: 0, color: '#334155', lineHeight: '1.6', fontSize: '14px' }}>{item.observations}</p>
                                                    </div>

                                                    {/* Files Section */}
                                                    <div>
                                                        <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Documentos y Archivos</h4>
                                                        {item.files?.length > 0 ? (
                                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                                                                {item.files.map((file, idx) => (
                                                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'white', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                                                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
                                                                            {file.type?.includes('pdf') ? <FileText size={20} /> : <ImageIcon size={20} />}
                                                                        </div>
                                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                                        </div>
                                                                        <div style={{ display: 'flex', gap: '6px' }}>
                                                                            <button
                                                                                onClick={() => openFilePreview(item.files, file)}
                                                                                style={{ border: 'none', background: '#f1f5f9', color: '#475569', padding: '6px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                                                                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0'; }}
                                                                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                                                                                title="Ver"
                                                                            >
                                                                                <Eye size={16} />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDeleteFileFromRecord(item.id, idx)}
                                                                                style={{ border: 'none', background: '#fff1f2', color: '#e11d48', padding: '6px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                                                                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#ffe4e6'; }}
                                                                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fff1f2'; }}
                                                                                title="Eliminar"
                                                                            >
                                                                                <Trash2 size={16} />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div style={{ padding: '16px', borderRadius: '14px', border: '1px dashed #e2e8f0', color: '#94a3b8', fontSize: '13px', textAlign: 'center', backgroundColor: '#fcfcfd' }}>
                                                                No hay documentos adjuntos a este registro.
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



            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.2s ease-out' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>

                        <div style={{ padding: '28px 36px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fcfcfd', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
                            <div>
                                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Nuevo Resultado</h2>
                                <p style={{ fontSize: '15px', color: '#64748b', margin: '6px 0 0 0' }}>Ingrese los datos del examen y comparta una imagen o documento.</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ background: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                onMouseOver={(e) => { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.backgroundColor = '#e2e8f0'; }}
                                onMouseOut={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '700', color: '#334155', marginBottom: '10px', fontSize: '14px' }}>Examen (*)</label>
                                    <textarea
                                        value={newItem.exam} onChange={(e) => setNewItem({ ...newItem, exam: e.target.value })}
                                        placeholder="Nombre del examen o estudio realizado..."
                                        style={{ width: '100%', padding: '14px 18px', border: '1.5px solid #e2e8f0', borderRadius: '14px', resize: 'none', minHeight: '100px', outline: 'none', transition: 'all 0.2s', fontSize: '15px', color: '#1e293b' }}
                                        onFocus={(e) => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontWeight: '700', color: '#334155', marginBottom: '10px', fontSize: '14px' }}>Observaciones (*)</label>
                                    <textarea
                                        value={newItem.observations} onChange={(e) => setNewItem({ ...newItem, observations: e.target.value })}
                                        placeholder="Resumen de hallazgos o notas clínicas..."
                                        style={{ width: '100%', padding: '14px 18px', border: '1.5px solid #e2e8f0', borderRadius: '14px', resize: 'none', minHeight: '100px', outline: 'none', transition: 'all 0.2s', fontSize: '15px', color: '#1e293b' }}
                                        onFocus={(e) => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '700', color: '#334155', marginBottom: '10px', fontSize: '14px' }}>Valor/NSH (*)</label>
                                    <input
                                        type="text"
                                        value={newItem.value}
                                        onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                                        placeholder="Ej: 80-120 mg/dL"
                                        style={{ width: '100%', padding: '14px 18px', border: '1.5px solid #e2e8f0', borderRadius: '14px', outline: 'none', transition: 'all 0.2s', fontSize: '15px', color: '#1e293b' }}
                                        onFocus={(e) => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '700', color: '#334155', marginBottom: '10px', fontSize: '14px' }}>Fecha (*)</label>
                                    <input
                                        type="date"
                                        value={newItem.date}
                                        onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                                        style={{ width: '100%', padding: '14px 18px', border: '1.5px solid #e2e8f0', borderRadius: '14px', outline: 'none', transition: 'all 0.2s', fontSize: '15px', backgroundColor: 'transparent', color: '#1e293b' }}
                                        onFocus={(e) => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontWeight: '700', color: '#334155', marginBottom: '14px', fontSize: '14px' }}>Documento, imagen o video (*)</label>

                                {isUploading ? (
                                    <div style={{
                                        border: '2px dashed #4f46e5',
                                        borderRadius: '20px',
                                        padding: '40px 32px',
                                        textAlign: 'center',
                                        backgroundColor: '#f5f3ff',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '16px'
                                    }}>
                                        <div style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                        <p style={{ fontWeight: '700', color: '#4f46e5' }}>Subiendo archivo...</p>
                                    </div>
                                ) : (!newItem.files || newItem.files.length === 0) ? (
                                    <div
                                        style={{
                                            border: dragActive ? '2.5px dashed #4f46e5' : '2px dashed #e2e8f0',
                                            borderRadius: '20px',
                                            padding: '40px 32px',
                                            textAlign: 'center',
                                            backgroundColor: dragActive ? '#f5f3ff' : '#fcfcfd',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            cursor: 'pointer'
                                        }}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ backgroundColor: 'white', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.04)', color: '#4f46e5' }}>
                                                <Upload size={28} />
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: '800', color: '#1e293b', marginBottom: '6px', fontSize: '17px' }}>Cargue el documento del examen</p>
                                                <p style={{ fontSize: '14px', color: '#94a3b8' }}>Arrastre el archivo aquí o haga clic para seleccionar</p>
                                                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                    <span style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>JPG, PNG</span>
                                                    <span style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>PDF</span>
                                                    <span style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>Max 10MB</span>
                                                </div>
                                            </div>
                                        </div>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            multiple
                                            accept="image/jpeg,image/png,image/jpg,application/pdf"
                                            style={{ display: 'none' }}
                                            onChange={(e) => e.target.files && handleFileSelection(e.target.files)}
                                        />
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {newItem.files?.map((file, idx) => (
                                            <div key={idx} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '16px',
                                                backgroundColor: '#f8fafc',
                                                padding: '12px 16px',
                                                borderRadius: '16px',
                                                border: '1.5px solid #e2e8f0',
                                                animation: 'fadeIn 0.3s ease-out'
                                            }}>
                                                <div style={{ width: '48px', height: '48px', borderRadius: '10px', overflow: 'hidden', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                                                    {file.type?.match(/\.(jpg|jpeg|png|gif)$/i) || file.type?.startsWith('image/') ? (
                                                        <img src={file.url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <FileText size={24} color="#94a3b8" strokeWidth={1.5} />
                                                    )}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => openFilePreview(newItem.files || [], file)}
                                                        style={{ background: 'white', border: '1.5px solid #e2e8f0', padding: '8px', borderRadius: '10px', color: '#475569', cursor: 'pointer', transition: 'all 0.2s', display: 'flex' }}
                                                        onMouseOver={(e) => { e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.borderColor = '#4f46e5'; }}
                                                        onMouseOut={(e) => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveFileInModal(idx)}
                                                        style={{ background: 'white', border: '1.5px solid #fee2e2', padding: '8px', borderRadius: '10px', color: '#ef4444', cursor: 'pointer', transition: 'all 0.2s', display: 'flex' }}
                                                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                                                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {!isUploading && (
                                            <button
                                                onClick={() => document.getElementById('file-upload')?.click()}
                                                style={{ border: '1.5px dashed #cbd5e1', borderRadius: '16px', padding: '12px', color: '#64748b', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.color = '#475569'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#64748b'; }}
                                            >
                                                <Plus size={16} /> Agregar más archivos
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ padding: '28px 36px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '16px', backgroundColor: '#fcfcfd', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ backgroundColor: 'white', color: '#64748b', padding: '12px 28px', borderRadius: '14px', fontWeight: '700', border: '1.5px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' }}
                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = '#334155'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddItem}
                                style={{ backgroundColor: '#4f46e5', color: 'white', padding: '12px 48px', borderRadius: '14px', fontWeight: '700', border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)' }}
                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#4338ca'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#4f46e5'; e.currentTarget.style.transform = 'none'; }}
                            >
                                Guardar Resultado
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Full Screen Preview */}
            {selectedFilePreview && (
                <div
                    style={{
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
                    onClick={() => setSelectedFilePreview(null)}
                >
                    <div
                        style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Botón Cerrar */}
                        <button
                            onClick={() => setSelectedFilePreview(null)}
                            style={{ position: 'fixed', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'white', transition: 'all 0.2s', zIndex: 10000 }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        >
                            <X size={24} />
                        </button>

                        {/* Navegación Anterior */}
                        {selectedFilePreview.allFiles.length > 1 && (
                            <button
                                onClick={() => navigateFilePreview('prev')}
                                style={{ position: 'fixed', left: '24px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'white', transition: 'all 0.2s', zIndex: 10000 }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            >
                                <ChevronLeft size={32} />
                            </button>
                        )}

                        <div style={{ position: 'relative', textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center' }}>
                            {(selectedFilePreview.file.type === 'application/pdf' || selectedFilePreview.file.url.toLowerCase().includes('pdf') || selectedFilePreview.file.name.toLowerCase().endsWith('.pdf')) ? (
                                <div
                                    style={{
                                        width: '90vw',
                                        maxWidth: '1000px',
                                        height: '85vh',
                                        backgroundColor: 'white',
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                                        animation: 'zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* PDF Header/Toolbar */}
                                    <div style={{ padding: '16px 24px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                                            <div style={{ backgroundColor: '#eff6ff', color: '#3b82f6', padding: '8px', borderRadius: '8px' }}>
                                                <FileText size={20} />
                                            </div>
                                            <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {selectedFilePreview.file.name}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <a
                                                href={selectedFilePreview.file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'white', color: '#475569', padding: '8px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', textDecoration: 'none', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' }}
                                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                            >
                                                <ExternalLink size={16} /> Abrir externo
                                            </a>
                                            <a
                                                href={selectedFilePreview.file.url}
                                                download={selectedFilePreview.file.name}
                                                style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#4f46e5', color: 'white', padding: '8px 16px', borderRadius: '10px', border: 'none', textDecoration: 'none', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' }}
                                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
                                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                                            >
                                                <Download size={16} /> Descargar
                                            </a>
                                        </div>
                                    </div>
                                    <iframe
                                        src={selectedFilePreview.file.url}
                                        style={{ width: '100%', flex: 1, border: 'none' }}
                                        title="PDF Preview"
                                    />
                                </div>
                            ) : (
                                <img
                                    src={selectedFilePreview.file.url}
                                    alt="Result"
                                    style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', transition: 'all 0.3s ease' }}
                                />
                            )}
                            {selectedFilePreview.allFiles.length > 1 && (
                                <div style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '500' }}>
                                    {selectedFilePreview.file.name} ({selectedFilePreview.currentIndex + 1} / {selectedFilePreview.allFiles.length})
                                </div>
                            )}
                        </div>

                        {/* Navegación Siguiente */}
                        {selectedFilePreview.allFiles.length > 1 && (
                            <button
                                onClick={() => navigateFilePreview('next')}
                                style={{ position: 'fixed', right: '24px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'white', transition: 'all 0.2s', zIndex: 10000 }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            >
                                <ChevronRight size={32} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes modalSlideIn { from { opacity: 0; transform: translateY(40px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
