import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Eye, Loader2, ChevronLeft, ChevronRight, Printer } from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';

interface ExamsData {
    options: string[];
    other: string;
    diagnosis: string;
    treatment: string;
}

interface ExamCategory {
    id: string;
    name: string;
    options: { id: string; name: string }[];
}

interface Props {
    data: ExamsData;
    onChange: (data: ExamsData) => void;
    patient?: any;
    readOnly?: boolean;
    fullCatalog?: any;
}

export default function ComplementaryExamsForm({ data, onChange, patient: propPatient, readOnly = false,}: Props) {
    const { patientId } = useParams<{ patientId: string }>();
    const [categories, setCategories] = useState<ExamCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [localPatient, setLocalPatient] = useState<any>(propPatient);

    useEffect(() => {
        if (propPatient) setLocalPatient(propPatient);
    }, [propPatient]);

    useEffect(() => {
        const fetchPatientFallback = async () => {
            if (localPatient || !patientId || patientId === 'generic') return;
            try {
                const response = await api.get(`/users/patients/${patientId}`);
                const userData = response.data?.data || response.data;
                setLocalPatient(userData);
            } catch (error) {
                console.error('Error in fallback patient fetch:', error);
            }
        };
        fetchPatientFallback();
    }, [patientId, localPatient]);

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
        if (readOnly) return;
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

            <div style={{ display: 'grid', gridTemplateColumns: readOnly ? '1fr' : '1fr 1fr', gap: '24px' }}>

                {/* Left Column: Categories */}
                {!readOnly && (
                    <div>
                        <h4 style={{ textAlign: 'center', color: '#475569', fontWeight: '600', fontSize: '14px', marginBottom: '12px' }}>
                            Catálogo de Exámenes
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
                                                <div style={{
                                                    backgroundColor: selectedCategory === cat.name ? '#3b82f6' : '#94a3b8',
                                                    color: 'white', padding: '4px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <Eye size={14} />
                                                </div>
                                            </td>
                                            <td style={{ padding: '6px 8px', color: selectedCategory === cat.name ? '#1d4ed8' : '#475569', fontWeight: selectedCategory === cat.name ? '500' : '400', textTransform: 'uppercase' }}>
                                                {cat.name}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '20px', padding: '12px', borderTop: '1px solid #f1f5f9' }}>
                            <button 
                                onClick={() => setPage(p => Math.max(1, p - 1))} 
                                disabled={page === 1}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0',
                                    backgroundColor: page === 1 ? '#f8fafc' : 'white',
                                    color: page === 1 ? '#cbd5e1' : '#475569',
                                    cursor: page === 1 ? 'default' : 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>
                                Pág. <span style={{ color: '#3b82f6' }}>{page}</span> / {totalPages}
                            </span>
                            <button 
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                                disabled={page >= totalPages}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0',
                                    backgroundColor: page >= totalPages ? '#f8fafc' : 'white',
                                    color: page >= totalPages ? '#cbd5e1' : '#475569',
                                    cursor: page >= totalPages ? 'default' : 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Right Column / Main View: Options & Summary */}
                <div style={{ paddingLeft: readOnly ? '0' : '16px', borderLeft: readOnly ? 'none' : '1px dashed #cbd5e1' }}>
                    <h4 style={{ textAlign: readOnly ? 'left' : 'center', color: '#475569', fontWeight: '600', fontSize: '14px', marginBottom: '12px' }}>
                        {readOnly ? 'Exámenes Seleccionados' : 'Lista de opciones'}
                    </h4>

                    <div style={{ marginBottom: '16px' }}>
                        {readOnly ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {data.options?.length > 0 ? (
                                    data.options.map((opt, i) => (
                                        <span key={i} style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '500', border: '1px solid #e2e8f0' }}>
                                            {opt}
                                        </span>
                                    ))
                                ) : (
                                    <p style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>No se seleccionaron exámenes del catálogo.</p>
                                )}
                            </div>
                        ) : (
                            <>
                                <label style={{ display: 'block', fontWeight: '500', color: '#475569', marginBottom: '8px', fontSize: '13px' }}>Seleccione(*)</label>
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
                            </>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: '500', color: '#475569', marginBottom: '4px', fontSize: '13px' }}>Otro(*)</label>
                            <textarea
                                value={data.other || ''}
                                onChange={(e) => !readOnly && onChange({ ...data, other: e.target.value })}
                                readOnly={readOnly}
                                style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', resize: 'vertical', minHeight: '40px', fontSize: '13px', backgroundColor: readOnly ? '#f8fafc' : 'white' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: '500', color: '#475569', marginBottom: '4px', fontSize: '13px' }}>Diagnóstico(*)</label>
                            <textarea
                                value={data.diagnosis || ''}
                                onChange={(e) => !readOnly && onChange({ ...data, diagnosis: e.target.value })}
                                readOnly={readOnly}
                                style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', resize: 'vertical', minHeight: '40px', fontSize: '13px', backgroundColor: readOnly ? '#f8fafc' : 'white' }}
                            />
                        </div>
                    </div>

                </div>
            </div>

            <div className="no-print" style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
                <button
                    onClick={() => {
                        if (!patientId || patientId === 'generic') {
                            toast.error('No se puede generar la orden para un paciente genérico o sin guardar');
                            return;
                        }
                        const currentPath = window.location.pathname;
                        const segments = currentPath.split('/');
                        const rId = segments[segments.length - 1];
                        
                        if (!rId || rId === 'medical-history' || rId === patientId) {
                            toast.error('Guarde el registro antes de imprimir los exámenes');
                            return;
                        }
                        
                        window.open(`/print/exams/${patientId}/${rId}`, '_blank');
                    }}
                    style={{ 
                        display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '10px 30px', borderRadius: '6px', fontWeight: '700', fontSize: '14px', cursor: 'pointer'
                    }}
                >
                    <Printer size={18} /> Imprimir Exámenes
                </button>
            </div>
        </div>
    );
}
