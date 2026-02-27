import React, { useState } from 'react';
import { Upload, Plus, X, Trash2 } from 'lucide-react';

interface Props {
    data: { text: string; files: string[] };
    onChange: (data: { text: string; files: string[] }) => void;
    onSave?: () => void;
}

export default function TricologyFindingsForm({ data = { text: '', files: [] }, onChange, onSave }: Props) {
    const [dragActive, setDragActive] = useState(false);

    // Mock array to simulate file selection before upload
    const [previewFiles, setPreviewFiles] = useState<any[]>(data.files.map(f => ({ url: f, status: 'uploaded' })));

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            addMockFile(e.dataTransfer.files[0]);
        }
    };

    const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            addMockFile(e.target.files[0]);
        }
    };

    const addMockFile = (file: File) => {
        // We create a mock Object URL for preview purposes (mock data)
        const url = URL.createObjectURL(file);
        const newFiles = [...previewFiles, { url, status: 'uploading', name: file.name }];
        setPreviewFiles(newFiles);

        // Simulate upload progress
        setTimeout(() => {
            const finishedFiles = newFiles.map(f => f.url === url ? { ...f, status: 'uploaded' } : f);
            setPreviewFiles(finishedFiles);
            onChange({ ...data, files: finishedFiles.map(f => f.url) });
        }, 1500);
    };

    const removeFile = (index: number) => {
        const newFiles = [...previewFiles];
        newFiles.splice(index, 1);
        setPreviewFiles(newFiles);
        onChange({ ...data, files: newFiles.map(f => f.url) });
    };

    return (
        <div className="section-container" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
                Hallazgos en tricología
            </h3>

            <div className="form-group" style={{ marginBottom: '24px' }}>
                <label style={{ fontWeight: '500', color: '#475569', marginBottom: '8px', display: 'block' }}>Texto(*)</label>
                <textarea
                    className="form-input"
                    value={data?.text || ''}
                    onChange={(e) => onChange({ ...data, text: e.target.value })}
                    rows={5}
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', resize: 'vertical', minHeight: '120px', transition: 'border-color 0.2s' }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={(e) => { e.preventDefault(); onSave && onSave(); }}
                        style={{ backgroundColor: '#4f46e5', color: 'white', padding: '10px 40px', borderRadius: '6px', fontWeight: '500', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                    >
                        Guardar texto
                    </button>
                </div>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ display: 'flex' }}>
                    <label style={{ flex: 1, cursor: 'pointer', backgroundColor: '#22c55e', color: 'white', textAlign: 'center', padding: '12px', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                        <Plus size={20} /> Agregar archivos
                        <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleChangeFile} />
                    </label>
                    <button style={{ flex: 1, border: 'none', cursor: 'pointer', backgroundColor: '#4f46e5', color: 'white', textAlign: 'center', padding: '12px', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                        <Upload size={20} /> Subir archivos
                    </button>
                </div>

                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    style={{ padding: '24px', backgroundColor: dragActive ? '#f8fafc' : 'white', minHeight: '150px' }}
                >
                    {previewFiles.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
                            <p>No hay archivos seleccionados. Arrastra las imágenes aquí.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {previewFiles.map((file, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <img src={file.url} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }} />

                                    <div style={{ flex: 1 }}>
                                        <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', backgroundColor: file.status === 'uploading' ? '#3b82f6' : '#22c55e', width: file.status === 'uploading' ? '50%' : '100%', transition: 'width 1s ease' }} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => removeFile(idx)} style={{ backgroundColor: '#eab308', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500', cursor: 'pointer' }}>
                                            <X size={16} /> Remover
                                        </button>
                                        <button onClick={() => removeFile(idx)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500', cursor: 'pointer' }}>
                                            <Trash2 size={16} /> Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
