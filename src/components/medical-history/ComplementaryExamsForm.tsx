import { useState, useEffect } from 'react';
import { Eye, FileText, Loader2 } from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';

interface ComplementaryExamData {
    category: string;
    options: string[];
    other: string;
    diagnosis: string;
}

interface ExamCategory {
    id: string;
    name: string;
    options: { id: string; name: string }[];
}

interface Props {
    data: ComplementaryExamData;
    onChange: (data: ComplementaryExamData) => void;
    onSave?: () => void;
}

export default function ComplementaryExamsForm({ data = { category: '', options: [], other: '', diagnosis: '' }, onChange, onSave }: Props) {

    const [categories, setCategories] = useState<ExamCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/catalogs/complementary-exams', {
                    params: { page, limit: 5, search: searchTerm }
                });
                const fetchedItems = response.data.items || [];
                setCategories(fetchedItems);
                setTotalPages(response.data.meta?.totalPages || 1);

                if (fetchedItems.length > 0) {
                    if (!fetchedItems.find((c: any) => c.name === selectedCategory)) {
                        setSelectedCategory(fetchedItems[0].name);
                    }
                } else {
                    setSelectedCategory('');
                }
            } catch (error) {
                console.error('Error fetching complementary exams:', error);
                toast.error('Error al cargar catálogo de exámenes');
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchCategories();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [page, searchTerm]);

    const handleToggleOption = (opt: string) => {
        const currentOptions = data.options || [];
        let newOptions = [...currentOptions];
        if (newOptions.includes(opt)) {
            newOptions = newOptions.filter(o => o !== opt);
        } else {
            newOptions.push(opt);
        }
        onChange({ ...data, options: newOptions });
    };

    const activeCategoryOptions = categories.find(c => c.name === selectedCategory)?.options || [];

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <Loader2 className="animate-spin" size={32} color="#3b82f6" />
                <span style={{ marginLeft: '12px', color: '#475569' }}>Cargando exámenes...</span>
            </div>
        );
    }

    return (
        <div className="section-container" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px' }}>
                Exámenes complementarios solicitados
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                {/* Left Column: Categories */}
                <div>
                    <h4 style={{ textAlign: 'center', color: '#475569', fontWeight: '600', fontSize: '14px', marginBottom: '12px' }}>
                        Exámenes complementarios
                    </h4>

                    <div style={{ marginBottom: '12px' }}>
                        <input
                            type="text"
                            placeholder="Buscar examen..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            style={{ width: '100%', padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outlineColor: '#3b82f6' }}
                        />
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                            <thead style={{ backgroundColor: '#f8fafc', color: '#1e293b', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th colSpan={2} style={{ padding: '8px', textAlign: 'center' }}>Exámen complementario</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat, idx) => (
                                    <tr
                                        key={cat.id}
                                        style={{
                                            backgroundColor: idx % 2 !== 0 ? '#f8fafc' : 'white',
                                            borderBottom: '1px solid #e2e8f0',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setSelectedCategory(cat.name)}
                                    >
                                        <td style={{ padding: '6px 8px', textAlign: 'center', width: '40px' }}>
                                            <button style={{
                                                backgroundColor: selectedCategory === cat.name ? '#3b82f6' : '#94a3b8',
                                                color: 'white', border: 'none', padding: '4px 6px', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <Eye size={14} />
                                            </button>
                                        </td>
                                        <td style={{ padding: '6px 8px', color: selectedCategory === cat.name ? '#1d4ed8' : '#475569', fontWeight: selectedCategory === cat.name ? '500' : '400', textTransform: 'uppercase' }}>
                                            {cat.name}
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr>
                                        <td colSpan={2} style={{ padding: '16px', textAlign: 'center', color: '#64748b' }}>
                                            No se encontraron exámenes
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '13px', color: '#475569', fontWeight: '500' }}>
                        <button
                            onClick={(e) => { e.preventDefault(); setPage(p => Math.max(1, p - 1)); }}
                            disabled={page === 1}
                            style={{
                                padding: '6px 14px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: page === 1 ? '#f1f5f9' : 'white',
                                color: page === 1 ? '#94a3b8' : '#334155',
                                cursor: page === 1 ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                            }}
                            onMouseOver={(e) => { if (page !== 1) e.currentTarget.style.backgroundColor = '#f8fafc' }}
                            onMouseOut={(e) => { if (page !== 1) e.currentTarget.style.backgroundColor = 'white' }}
                        >
                            Anterior
                        </button>
                        <span>Página {page} de {totalPages || 1}</span>
                        <button
                            onClick={(e) => { e.preventDefault(); setPage(p => Math.min(totalPages, p + 1)); }}
                            disabled={page >= totalPages || totalPages === 0}
                            style={{
                                padding: '6px 14px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: page >= totalPages || totalPages === 0 ? '#f1f5f9' : 'white',
                                color: page >= totalPages || totalPages === 0 ? '#94a3b8' : '#334155',
                                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                            }}
                            onMouseOver={(e) => { if (page < totalPages) e.currentTarget.style.backgroundColor = '#f8fafc' }}
                            onMouseOut={(e) => { if (page < totalPages) e.currentTarget.style.backgroundColor = 'white' }}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>

                {/* Right Column: Options & Inputs */}
                <div style={{ paddingLeft: '16px', borderLeft: '1px dashed #cbd5e1' }}>
                    <h4 style={{ textAlign: 'center', color: '#475569', fontWeight: '600', fontSize: '14px', marginBottom: '12px' }}>
                        Lista de opciones
                    </h4>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontWeight: '500', color: '#475569', marginBottom: '8px', fontSize: '13px' }}>Seleccione(*)</label>

                        {activeCategoryOptions.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                {activeCategoryOptions.map(opt => (
                                    <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569', cursor: 'pointer', textTransform: 'uppercase' }}>
                                        <input
                                            type="checkbox"
                                            checked={(data.options || []).includes(opt.name)}
                                            onChange={() => handleToggleOption(opt.name)}
                                            style={{ width: '14px', height: '14px', cursor: 'pointer' }}
                                        />
                                        <span dangerouslySetInnerHTML={{ __html: opt.name }}></span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '4px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                                Sin opciones para {selectedCategory}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: '500', color: '#475569', marginBottom: '4px', fontSize: '13px' }}>Otro(*)</label>
                            <textarea
                                value={data.other || ''}
                                onChange={(e) => onChange({ ...data, other: e.target.value })}
                                style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', resize: 'vertical', minHeight: '40px', outlineColor: '#3b82f6', fontSize: '13px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: '500', color: '#475569', marginBottom: '4px', fontSize: '13px' }}>Diagnóstico(*)</label>
                            <textarea
                                value={data.diagnosis || ''}
                                onChange={(e) => onChange({ ...data, diagnosis: e.target.value })}
                                style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', resize: 'vertical', minHeight: '40px', outlineColor: '#3b82f6', fontSize: '13px' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
                        <button
                            onClick={(e) => { e.preventDefault(); onSave && onSave(); }}
                            style={{ backgroundColor: '#4f46e5', color: 'white', padding: '6px 40px', borderRadius: '4px', fontWeight: '600', fontSize: '13px', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>

            {/* Boton Ver PDF al final */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
                <button
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '6px 20px', borderRadius: '4px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                >
                    <FileText size={16} /> Ver PDF
                </button>
            </div>

        </div>
    );
}
