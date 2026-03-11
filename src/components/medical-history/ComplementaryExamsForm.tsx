import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Eye, FileText, Loader2 } from 'lucide-react';
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
}

export const EXAMS_CATALOG = {
    "HEMATOLOGÍA": [
        "BIOMETRÍA HEMÁTICA", "HEMATROCRITO + HEMOGLOBINA", "SEDIMENTACIÓN", "PLAQUETAS",
        "RETICULOSCITOS", "MORFOLOGÍA CELULAR", "GRUPO SANGUÍNEO Y RH", "DREPANOCITOS",
        "COOMBS DIRECTO", "COOMBS INDIRECTO", "VITAMINA D25", "VITAMINA B12", "ÁCIDO FÓLICO"
    ],
    "HEMOSTASIA": [
        "TP + INR", "TTP", "PLAQUETAS", "DIMERO D", "FIBRINÓGENO", "ANTICOAGULANTE LÚPICO",
        "FACTOR V (LEADING)", "PROTEÍNA C", "ANTITROMBINA III"
    ],
    "HEMOQUÍMICA": [
        "GLUCOSA BASAL", "GLUCOSA RÁPIDA", "GLUCOSA POSPANDRIAL 2H", "CURVA TOLERICA GLUCOSA..H",
        "GLUCOSA-TEST DE O'SULIVAN", "HEMOGLOBINA GLICOSILADA", "FRUCTOSAMINA", "INSULINA BASAL",
        "CURVA TOLERACIA INSULINA..H", "ÍNDICE HOMA", "HIERRO SERICO", "PÉPTIDO C", "ÚREA",
        "N. UREICO", "CREATININA", "ÁC. ÚRICO", "CISTATINA C", "FOSFATASA ÁCIDA TOTAL",
        "FOSFATASA ÁCIDA PROSTÁTICA", "FERRITINA"
    ],
    "PERFIL LIPÍDICO": [
        "COLESTEROL", "HDL COLESTEROL", "LDL COLESTEROL", "COLESTEROL V.L.D.L",
        "TRIGLICÉRIDOS", "LÍPIDOS TOTALES", "APO-LIPOPTROTEÍNA AyB"
    ],
    "PERFIL TIROIDEO": [
        "TSH", "FT4", "FT3", "T4", "T3", "ANTI-TPO", "ANTI-TIPO", "ANTI TIROGLOBULINA",
        "TIROGLOBULINA", "PTH (PARATOHORMONA)"
    ],
    "PERFIL HEPÁTICO": [
        "BILIRRUBINA TOTAL", "BILIRRUBINA DIRECTA", "BILIRRUBINA INDIRECTA", "PROTEÍNAS TOTALES",
        "ALBÚMINA", "GLOBULINA", "ÍNDICE ALBÚMINA/GLOBULINA", "COLINESTERASA SÉRICA",
        "COLINESTERASA ERITROCITARIA", "TGO/AST", "TGP/ALT", "FOSFATASA ALCALINA", "GAMMA GT",
        "LDH", "AMILASA", "LIPASA"
    ],
    "PERFIL HORMONAL": [
        "LH", "FSH", "ESTRADIOL", "PROGESTERONA", "17 HIDROXIPROGESTERONA", "PROLACTINA",
        "ESTRONA", "ESTRIOL LIBRE", "CORTISOL AM", "CORTISOL PM", "DHEAS", "ACTH",
        "HCG CUALITATIVA", "HCG BETA CUANTITATIVA", "HORMONA DE CRECIMIENTO", "ANDROSTENEDIONA",
        "TESTOSTERONA TOTAL", "TESTOSTERONA LIBRE", "TRANSPORTADORA SEXUAL", "PTH"
    ],
    "INMUNOSEROLOGÍA": [
        "ASTO CUANTITATIVO", "ASTO LATEX", "POR CUANTITATIVO", "PCR LATEX", "FR CUANTITATIVO",
        "FR LATEX", "AGLUTINACIONES FEBRILES", "ANTI ESTREPTOCOCO GRUPO A", "ANTI TUBERCULOSIS",
        "ANTI HEMATOZOARIOS", "ANTI MONONUCLEOSIS", "ANTI DENGUE IgG/IgM", "ANTI CHIKUNGUYA"
    ],
    "IONOGRAMA": [
        "SODIO/POTASIO/CLORO", "CALCIO IÓNICO", "CALCIO TOTAL", "MAGNESIO", "FÓSFORO", "LITIO"
    ],
    "GASOMETRÍA": [
        "ARTERIAL", "VENOSA"
    ],
    "INFECCIOSAS": [
        "PROCALCITONINA", "INTERLEUKINA-6", "VDRL/RPR", "FTA-ABS", "HIV 1+2+P24", "CARGA VIRAL HIV (PCR)",
        "CD4/CD8", "HEPATITIS A", "HEPATITIS B", "HEPATITIS C", "ANTI HAV IgM", "ANTI BHs (CONTROL VACUNA)",
        "HBc LgM (CORE)", "ANTI HBC (CORE TOTAL)", "HBe Ag", "HBe Ac", "QUANTIFERÓN TB", "TOXOPLASMA IgG",
        "TOXOPLASMA IgM", "RUBEOLA IgG", "RUBEOLA IgM", "CITOMEGALOVIRUS IgG", "CITOMEGALOVIRUS IgM",
        "HERPES I IgG", "HERPES I IgM", "HERPES II IgG", "HERPES II IgM", "TORCH IgG/IgM CUALITATIVO",
        "HEICOBACTER PYLORI IgG", "HELICOBACTER PYLORI IgM", "CHALAMIDYA TRACH. IgG", "EPSTEIN BARR IgM",
        "VARICELA ZÓSTER IgG", "VARICELA ZÓSTER IgM"
    ],
    "MARCADORES ONCOLÓGICOS": [
        "PSA TOTAL", "PSA LIBRE", "AFP (ALFA FETO PROTEÍNA)", "CEA  (AG. CARCINO EMBRIONARIO)",
        "CEA 125 (OVARIO)", "HE4", "ÍNDICE ROMA", "CA 15-3 (MAMAS)", "CA 19-9 (PÁNCREAS GÁSTRICO E INTESTINAL)",
        "CA 72-4 (ESTÓMAGO)", "CYFRA 21-1 (PULMON)"
    ],
    "INMUNOGLOBULINAS": [
        "IgA", "IgD", "IgE TOTAL", "IgM", "IgG"
    ],
    "MACADORES CARDIACOS": [
        "CK-MB", "TROPONINA T ULTRASENSIBLE", "PRO BNP", "MIOGLOBINA"
    ],
    "AUTOINMUNIDAD": [
        "COMPLEMENTO C3", "COMPLEMENTO C4", "ANA (Ac. ANTINUCLEARES)", "Ac. Anti DNA", "CCP (CITRULINADO)",
        "Anti-Ro (SSA)", "AnTI-La (SSB)", "Anti-Jo", "ANCA C (Anti-PR3)", "ANCA P (Anti-MPO)",
        "CARDIOPLINA IgG", "CARDIOPLINA IgM", "FOSFOLIPÍDO IgG", "FOSFOLIPÍDO IgM", "AntI-SM",
        "AntI-RNP", "Anti. MÚSCULO LISO", "Ac. Anti. MITOCONDRIALES", "Ac. Anti. CENTRÓMERO"
    ],
    "PRUEBAS DE ALERGIA": [
        "PANEL 54 ALIMENTOS", "PANEL 108 ALIMENTOS", "PANEL 216 ALIMENTOS", "PANEL 54 ALERGENOS RESP/ALIM",
        "PANEL PEDÍATRICO"
    ],
    "UROANÁLISIS": [
        "ELEMENTAL Y MICROSCÓPICO", "GRAM GOTA FRESCA", "GRAM SEDIMENTO", "MICROALBUMINURIA",
        "MICROALBUMINURIA 24h", "CLEARENCE CREATININA 24h", "PROTEINURIA 24h", "CREATININA EN ORINA",
        "SODIO EN ORINA", "POTASIO EN ORINA", "CLORO EN ORINA", "BAAR ORINA Nº MUESTRAS:"
    ],
    "HECES": [
        "COPROLÓGICO/PARASITARIO", "COPROPARASITARIO SERIADO", "POLIMORFONUCLEARES", "SANGRE OCULTA",
        "AZÚCARES REDUCTORES", "pH en heces", "HELICOBACTER PYLORI", "ROTAVIRUS", "ADENOVIRUS",
        "CALPROTECTINA", "CRIPTOSPORIDIUM", "CLINITEST"
    ],
    "ESTUDIO DE LÍQUIDOS": [
        "LCR", "ASCÍTICO", "PLEURAL", "SINOVIAL", "PERITONEAL"
    ],
    "LÍQUIDO ESPERMÁTICO": [
        "ESPERMATOGRAMA"
    ],
    "MICROBIOLOGÍA": [
        "UROCULTIVO", "COPROCULTIVO", "CULTIVO EXUDADO FARÍNGEO", "CULTIVO DE ESPUTO",
        "CULTIVO SECRECIÓN VAGINAL", "HEMOCULTIVO", "CULTIVO HONGOS", "CULTIVO THAYER MARTIN", "OTROS"
    ],
    "BACTERIOLOGÍA": [
        "MUESTRA DE:", "KOH", "FRESCO", "GRAM", "ZHIEL NEELSEN Nº"
    ],
    "CITOLOGÍA/HISTOPATOLOGÍA": [
        "PAPANICOLAOU", "(PAAF) PUNCIÓN DE AGUJA FINA", "HISTOPATOLÓGICO", "FRESCO/GRAM SECRE. VAGINAL",
        "CRISTALOGRAFÍA", "BIOPSIA"
    ],
    "TOXICOLOGÍA": [
        "PLOMO EN SANGRE", "ZINC", "COLINESTERASA"
    ],
    "DROGAS TERAPÉUTICAS": [
        "Ac. VALPROICO", "FENITOÍNA", "CARBAMAZEPINA", "FENOBARBITAL", "DIGOXINA", "DIFENILHIDANTOINA (EPAMIN)"
    ],
    "DROGAS DE ABUSO": [
        "MARIHUANA", "COCAÍNA", "PANEL DROGAS: MARIHUANA COCAINA, OTRO"
    ],
    "BIOLOGÍA MOLECULAR": [
        "HPV DE ALTO RIESGO", "CARGA VIRAL HIV", "INFLUENZA A Y B", "INFLUENZA A y B + VIRUS SINCITIAL RESP.",
        "INFLUENZA A y B (INMUNOCROMATOGRAFÍA)"
    ],
    "SARS CoV-2": [
        "RT-PCR", "ANTÍGENO CUALITATIVO", "PANEL: SARS CoV-2, INFLUENZA A Y B", "ANTICUERPOS CUANTITATIVO IgG e IgM",
        "ANTICUERPOS CUALITATIVO IgG e IgM", "CONTROL POST VACUNA"
    ]
};

export default function ComplementaryExamsForm({ data, onChange, patient: propPatient }: Props) {
    const { patientId } = useParams<{ patientId: string }>();
    const [categories, setCategories] = useState<ExamCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [localPatient, setLocalPatient] = useState<any>(propPatient);

    // Sync prop patient to local state
    useEffect(() => {
        if (propPatient) setLocalPatient(propPatient);
    }, [propPatient]);

    // Fallback fetch if patient is null
    useEffect(() => {
        const fetchPatientFallback = async () => {
            if (localPatient || !patientId || patientId === 'generic') return;
            try {
                console.log('FALLBACK FETCH PATIENT:', patientId);
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

    const handlePrint = () => {
        if (!data.options?.length && !data.other) {
            toast.error('No hay exámenes seleccionados para generar el PDF');
            return;
        }
        
        // Add class to specify we are printing exams
        document.body.classList.add('printing-exams');
        
        // Use a small delay to ensure CSS reflects the change
        setTimeout(() => {
            window.print();
            // Remove the class after print dialog opens/closes
            document.body.classList.remove('printing-exams');
        }, 100);
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

                </div>
            </div>

            {/* Boton Ver PDF al final */}
            <div className="no-print" style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
                <button
                    onClick={handlePrint}
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        backgroundColor: 'transparent', 
                        color: '#ef4444', 
                        border: '1px solid #ef4444', 
                        padding: '10px 30px', 
                        borderRadius: '6px', 
                        fontWeight: '700', 
                        fontSize: '14px', 
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#fef2f2';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                    }}
                >
                    <FileText size={18} /> Ver PDF
                </button>
            </div>
        </div>
    );
}
