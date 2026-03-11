import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Save, User, ShieldAlert, Syringe, AlertTriangle, Search, FileText, Stethoscope, FileSignature, Loader2, Phone, Printer, ArrowLeft } from 'lucide-react';
import EmergencyContactForm from '../components/medical-history/EmergencyContactForm';
import FamilyHistoryForm from '../components/medical-history/FamilyHistoryForm';
import RecentVaccinesForm from '../components/medical-history/RecentVaccinesForm';
import RiskFactorsForm from '../components/medical-history/RiskFactorsForm';
import TricologyFindingsForm from '../components/medical-history/TricologyFindingsForm';
import LabResultsForm from '../components/medical-history/LabResultsForm';
import DiagnosisActivityForm from '../components/medical-history/DiagnosisActivityForm';
import ComplementaryExamsForm from '../components/medical-history/ComplementaryExamsForm';
import PrintMedicalHistoryTemplate from '../components/medical-history/PrintMedicalHistoryTemplate';
import PrintExamsTemplate from '../components/medical-history/PrintExamsTemplate';
import { useSpecialty } from '../context/SpecialtyContext';
import api from '../api';
import toast from 'react-hot-toast';
import { CheckCircle, CloudUpload, AlertCircle } from 'lucide-react';

type SectionKey = 'emergency' | 'family' | 'vaccines' | 'risks' | 'labresults' | 'diagnosis' | 'exams' | 'tricology';

interface SectionDef {
    id: SectionKey;
    title: string;
    icon: React.ReactNode;
}

const SECTIONS: SectionDef[] = [
    { id: 'emergency', title: 'Contactos de emergencia', icon: <User size={18} /> },
    { id: 'family', title: 'Antecedentes familiares', icon: <ShieldAlert size={18} /> },
    { id: 'vaccines', title: 'Vacunas recientes', icon: <Syringe size={18} /> },
    { id: 'risks', title: 'Factores y conductas de riesgo', icon: <AlertTriangle size={18} /> },
    { id: 'tricology', title: 'Hallazgos en tricología', icon: <Search size={18} /> },
    { id: 'labresults', title: 'Resultados de laboratorio e imágenes', icon: <FileText size={18} /> },
    { id: 'diagnosis', title: 'Diagnóstico/Actividad', icon: <Stethoscope size={18} /> },
    { id: 'exams', title: 'Exámenes complementarios solicitados', icon: <FileSignature size={18} /> },
];

export default function MedicalHistory() {
    const { patientId, recordId } = useParams<{ patientId: string, recordId?: string }>();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode'); // 'new' if forced empty
    const navigate = useNavigate();
    
    const { activeSpecialty } = useSpecialty();
    const [activeSection, setActiveSection] = useState<SectionKey>('emergency');
    const [patient, setPatient] = useState<any>(null);
    const [examCatalog, setExamCatalog] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [currentRecordId, setCurrentRecordId] = useState<string | null>(recordId || null);
    const currentRecordIdRef = useRef<string | null>(recordId || null);
    const isSavingRef = useRef(false);

    const [isGlobalUploading, setIsGlobalUploading] = useState(false);

    // Sync ref with state
    useEffect(() => {
        currentRecordIdRef.current = currentRecordId;
    }, [currentRecordId]);


    // Master state for the entire form
    const [formData, setFormData] = useState({
        emergency: { name: '', relation: '', phone: '', address: '' },
        family: [] as string[],
        vaccines: [] as string[],
        risks: [] as string[],
        labresults: [] as any[],
        diagnosis: [] as any[],
        exams: { options: [] as string[], other: '', diagnosis: '', treatment: '' },
        tricology: { observations: '', files: [] as any[] },
        sessionId: queryParams.get('session') || null as string | null
    });

    const handleUpdateSection = (section: SectionKey, data: any) => {
        if (isReadOnly) return;
        setFormData(prev => ({ ...prev, [section]: data }));
    };

    // Reset state strictly if mode is 'new'
    useEffect(() => {
        if (mode === 'new') {
            console.log('DEBUG: New record mode detected, resetting all form data.');
            setFormData({
                emergency: { name: '', relation: '', phone: '', address: '' },
                family: [],
                vaccines: [],
                risks: [],
                labresults: [],
                diagnosis: [],
                exams: { options: [], other: '', diagnosis: '', treatment: '' },
                tricology: { observations: '', files: [] },
                sessionId: queryParams.get('session') || null
            });
            setCurrentRecordId(null);
            currentRecordIdRef.current = null;
        }
    }, [mode, patientId]);

    useEffect(() => {
        const fetchCatalog = async () => {
            try {
                const response = await api.get('/catalogs/complementary-exams', {
                    params: { page: 1, limit: 1000 } // Get all for the catalog
                });
                const fetchedItems = response.data.items || [];
                const catalog: any = {};
                fetchedItems.forEach((cat: any) => {
                    catalog[cat.name] = (cat.options || []).map((opt: any) => opt.name);
                });
                setExamCatalog(catalog);
            } catch (error) {
                console.error('Error fetching catalog:', error);
            }
        };

        const fetchPatient = async (id: string) => {
            const cleanPatientId = id.trim();
            if (!cleanPatientId || cleanPatientId === 'generic') return;
            try {
                const response = await api.get(`/users/patients/${cleanPatientId}`);
                const userData = response.data?.data || response.data;
                setPatient(userData);
            } catch (error) {
                console.error('DEBUG: Error fetching patient:', error);
            }
        };

        const fetchRecordById = async () => {
            if (!recordId) return;
            setIsReadOnly(true);
            try {
                const response = await api.get(`/medical-records/${recordId}`);
                if (response.data) {
                    const dbData = response.data;
                    setFormData((prev: any) => ({
                        ...prev,
                        emergency: dbData.data?.emergency || prev.emergency,
                        family: dbData.data?.family || prev.family,
                        vaccines: dbData.data?.vaccines || prev.vaccines,
                        risks: dbData.data?.risks || prev.risks,
                        labresults: Array.isArray(dbData.data?.labresults) ? dbData.data?.labresults : prev.labresults,
                        diagnosis: Array.isArray(dbData.data?.diagnosis) ? dbData.data?.diagnosis : prev.diagnosis,
                        exams: { ...prev.exams, ...dbData.data?.exams },
                        tricology: { ...prev.tricology, ...dbData.data?.tricology },
                        sessionId: dbData.data?.sessionId || prev.sessionId
                    }));
                    
                    if (dbData.patient) {
                        setPatient(dbData.patient);
                    }
                }
            } catch (error) {
                console.error('DEBUG: Error fetching specific record:', error);
                toast.error('Error al cargar el registro histórico');
            }
        };

        const fetchTodayRecord = async () => {
            const cleanPatientId = patientId?.trim();
            if (!cleanPatientId || !activeSpecialty || cleanPatientId === 'generic' || mode === 'new') return;

            const userData = localStorage.getItem('user');
            if (!userData) return;
            const doctorId = JSON.parse(userData).id;

            try {
                const response = await api.get(`/medical-records/today/${cleanPatientId}/${doctorId}/${activeSpecialty.id}`);
                if (response.data && response.data.data) {
                    const dbData = response.data.data;

                    setFormData((prev: any) => ({
                        ...prev,
                        emergency: dbData.data?.emergency || prev.emergency,
                        family: dbData.data?.family || prev.family,
                        vaccines: dbData.data?.vaccines || prev.vaccines,
                        risks: dbData.data?.risks || prev.risks,
                        labresults: Array.isArray(dbData.data?.labresults) ? dbData.data?.labresults : prev.labresults,
                        diagnosis: Array.isArray(dbData.data?.diagnosis) ? dbData.data?.diagnosis : prev.diagnosis,
                        exams: { ...prev.exams, ...dbData.data?.exams },
                        tricology: { ...prev.tricology, ...dbData.data?.tricology },
                        sessionId: dbData.data?.sessionId || prev.sessionId
                    }));

                    if (dbData.patient) {
                        setPatient((prev: any) => ({ ...prev, ...dbData.patient }));
                    }

                    if (dbData.id) {
                        setCurrentRecordId(dbData.id);
                        currentRecordIdRef.current = dbData.id;
                    }
                }
            } catch (error) {
                console.error('DEBUG: Error fetching today\'s record:', error);
            }
        };

        if (recordId) {
            // Set read-only if not in 'new' mode (viewing an existing record)
            setIsReadOnly(mode !== 'new');
            
            // Only fetch if data is not already loaded for this record
            // This prevents re-fetching immediately after an auto-save that updated the URL
            if (recordId !== currentRecordIdRef.current || formData.emergency.name === '') {
                fetchRecordById();
            }
            fetchPatient(patientId!);
        } else if (patientId) {
            setIsReadOnly(false);
            fetchPatient(patientId);
            if (mode !== 'new') fetchTodayRecord();
        }
        fetchCatalog();
    }, [patientId, recordId, activeSpecialty, mode]);


    const isSectionComplete = (section: SectionKey) => {
        const data = formData[section];
        if (section === 'emergency') {
            const e = data as any;
            return e.name && e.relation && e.phone && e.address;
        }
        if (section === 'tricology') {
            const t = data as any;
            return (t.observations && t.observations.length > 0) || (t.files && t.files.length > 0);
        }
        if (section === 'exams') {
            const x = data as any;
            return (x.options && x.options.length > 0) || x.other.length > 0;
        }
        // Arrays for checklists and tables
        return Array.isArray(data) && data.length > 0;
    };

    const handleSaveAll = useCallback(async (isAuto = false) => {
        // Prevent overlapping saves using REF for absolute safety
        if (isSavingRef.current || isGlobalUploading || !activeSpecialty || !patientId || patientId === 'generic' || isReadOnly) {
            return;
        }

        const userData = localStorage.getItem('user');
        if (!userData) return;
        const doctorId = JSON.parse(userData).id;

        isSavingRef.current = true;
        setSaving(true);
        setSaveStatus('saving');

        try {
            // Extract main diagnosis
            let mainDiagnosis = formData.exams.diagnosis || '';
            if (!mainDiagnosis && formData.diagnosis.length > 0) {
                mainDiagnosis = formData.diagnosis[0].description;
            }

            const payload = {
                id: currentRecordIdRef.current || recordId, // Use parameter or ref
                forceNew: mode === 'new' && !currentRecordIdRef.current && !recordId,
                patientId,
                doctorId,
                specialtyId: activeSpecialty.id,
                data: formData,
                diagnosis: mainDiagnosis,
                treatment: '',
                notes: ''
            };
            console.log('SAVING MEDICAL RECORD PAYLOAD:', payload);

            const response = await api.post('/medical-records/upsert', payload);

            // Sync record ID from response
            const recordData = response.data?.data || response.data;
            if (recordData?.id) {
                if (!currentRecordIdRef.current) {
                    console.log('DEBUG: First save successful, set ID to', recordData.id);
                    setCurrentRecordId(recordData.id);
                    currentRecordIdRef.current = recordData.id;
                    
                    // Update URL silently if in new mode to prevent "new" logic on refresh
                    // Since it's consolidated, it won't unmount MedicalHistory
                    if (mode === 'new') {
                        navigate(`/dashboard/medical-history/${patientId}/${recordData.id}`, { replace: true });
                    }
                }
            }
            if (recordData?.patient) {
                setPatient((prev: any) => ({ ...prev, ...recordData.patient }));
            }

            if (!isAuto) toast.success('Historia clínica guardada exitosamente');
            setSaveStatus('saved');
        } catch (error: any) {
            console.error('Error saving medical record:', error);
            const msg = error.response?.data?.message || 'Error al guardar la historia clínica';
            if (!isAuto) toast.error(msg);
            setSaveStatus('error');
        } finally {
            isSavingRef.current = false;
            setSaving(false);
        }
    }, [activeSpecialty, patientId, isReadOnly, mode, formData]); // Removed volatile deps

    // Auto-save logic
    useEffect(() => {
        if (!activeSpecialty || !patientId || patientId === 'generic' || isReadOnly) return;

        const timer = setTimeout(() => {
            handleSaveAll(true);
        }, 5000); // Increased to 5 seconds to be safer

        return () => clearTimeout(timer);
    }, [formData, isReadOnly]); // ONLY depend on formData for auto-save trigger



    const renderActiveSection = () => {
        const commonProps = { readOnly: isReadOnly };
        
        switch (activeSection) {
            case 'emergency':
                return <EmergencyContactForm {...commonProps} data={formData.emergency} onChange={(d: any) => handleUpdateSection('emergency', d)} />;
            case 'family':
                return <FamilyHistoryForm {...commonProps} data={formData.family} onChange={(d: string[]) => handleUpdateSection('family', d)} />;
            case 'vaccines':
                return <RecentVaccinesForm {...commonProps} data={formData.vaccines} onChange={(d: string[]) => handleUpdateSection('vaccines', d)} />;
            case 'risks':
                return <RiskFactorsForm {...commonProps} data={formData.risks} onChange={(d: string[]) => handleUpdateSection('risks', d)} />;
            case 'tricology':
                return <TricologyFindingsForm
                    {...commonProps}
                    patientId={patientId || ''}
                    recordId={currentRecordId}
                    sessionId={formData.sessionId}
                    data={formData.tricology}
                    onChange={(d: any) => handleUpdateSection('tricology', d)}
                    onUploadingChange={setIsGlobalUploading}
                />;
            case 'labresults':
                return <LabResultsForm
                    {...commonProps}
                    patientId={patientId || ''}
                    recordId={currentRecordId}
                    sessionId={formData.sessionId}
                    data={formData.labresults}
                    onChange={(d: any[]) => handleUpdateSection('labresults', d)}
                    onUploadingChange={setIsGlobalUploading}
                />;
            case 'diagnosis':
                return <DiagnosisActivityForm {...commonProps} data={formData.diagnosis} onChange={(d: any[]) => handleUpdateSection('diagnosis', d)} />;
            case 'exams':
                return <ComplementaryExamsForm
                    {...commonProps}
                    data={formData.exams}
                    onChange={(d: any) => handleUpdateSection('exams', d)}
                    patient={patient}
                    fullCatalog={examCatalog}
                />;
            default:
                return null;
        }
    };

    const getAge = (birthDate: any) => {
        if (!birthDate) return 'N/A';
        try {
            const birth = new Date(birthDate);
            if (isNaN(birth.getTime())) return 'N/A';
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            return age;
        } catch (e) { return 'N/A'; }
    };

    return (
        <>
            <div className="management-container" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>

                {/* Patient Header Summary */}
                <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    position: 'sticky',
                    top: '0',
                    zIndex: 10
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button
                            onClick={() => recordId ? navigate(`/dashboard/medical-history-list/${patientId}`) : navigate('/dashboard/patients')}
                            title="Regresar"
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '36px', height: '36px', backgroundColor: '#f8fafc', color: '#64748b',
                                border: '1px solid #e2e8f0', borderRadius: '10px',
                                cursor: 'pointer', transition: 'all 0.2s',
                                marginRight: '4px'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#1e293b'; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = '#64748b'; }}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#eff6ff',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#3b82f6',
                            fontSize: '18px',
                            fontWeight: '700'
                        }}>
                            {patient?.firstName?.[0]}{patient?.lastName?.[0]}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0', color: '#1e293b' }}>
                                {patient?.firstName} {patient?.lastName}
                            </h2>
                            <div style={{ display: 'flex', gap: '16px', marginTop: '4px', fontSize: '13px', color: '#64748b' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <FileSignature size={14} /> <b>CI:</b> {patient?.idNumber || 'N/A'}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <User size={14} /> <b>Edad:</b> {getAge(patient?.birthDate)} años
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Phone size={14} /> <b>Teléfono:</b> {patient?.phone || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' }}>Especialidad</div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6' }}>{activeSpecialty?.name || '---'}</div>
                        </div>
                        <div style={{ width: '1px', height: '40px', backgroundColor: '#e2e8f0' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: saveStatus === 'error' ? '#ef4444' : '#64748b', fontSize: '12px', fontWeight: '500' }}>
                                {saveStatus === 'saving' && <><Loader2 className="animate-spin" size={14} /> Guardando...</>}
                                {saveStatus === 'saved' && <><CheckCircle size={14} color="#22c55e" /> Guardado</>}
                                {saveStatus === 'error' && <><AlertCircle size={14} /> Error</>}
                                {saveStatus === 'idle' && <><CloudUpload size={14} /> Auto-save</>}
                            </div>
                            <button
                                className="submit-btn"
                                onClick={() => handleSaveAll(false)}
                                disabled={saving || isReadOnly}
                                style={{ 
                                    width: 'auto', 
                                    padding: '0 16px', 
                                    display: isReadOnly ? 'none' : 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px', 
                                    height: '36px', 
                                    backgroundColor: '#3b82f6', 
                                    color: 'white', 
                                    borderRadius: '8px', 
                                    border: 'none', 
                                    fontWeight: '600', 
                                    cursor: 'pointer', 
                                    fontSize: '13px' 
                                }}
                            >
                                {saving ? <div className="loader" style={{ width: '14px', height: '14px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                                Guardar
                            </button>
                            <button
                                className="submit-btn"
                                onClick={() => {
                                    if (!currentRecordId) {
                                        toast.error('Guarde el registro antes de imprimir');
                                        return;
                                    }
                                    window.open(`/print/history/${patientId}/${currentRecordId}`, '_blank');
                                }}
                                style={{
                                    width: 'auto', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px',
                                    height: '36px', backgroundColor: '#64748b', color: 'white', borderRadius: '8px',
                                    border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '13px'
                                }}
                            >
                                <Printer size={16} />
                                Imprimir
                            </button>

                        </div>
                    </div>
                </div>

                <div className="management-header" style={{ display: 'none' }}>
                    {/* Ocultado pero mantenemos la lógica si es necesario */}
                </div>

                <div style={{ display: 'flex', gap: '24px', flex: 1, alignItems: 'flex-start' }}>

                    {/* Sidebar Nav */}
                    <div style={{ width: '280px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', flexShrink: 0, position: 'sticky', top: '24px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', paddingLeft: '12px' }}>
                            Secciones
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {SECTIONS.map((section) => {
                                const isActive = activeSection === section.id;
                                const isComplete = isSectionComplete(section.id);
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
                                            backgroundColor: isActive ? '#eff6ff' : 'transparent',
                                            color: isActive ? '#1d4ed8' : '#475569',
                                            fontWeight: isActive ? '600' : '500',
                                            cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
                                        }}
                                        onMouseOver={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                                        onMouseOut={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ color: isActive ? '#3b82f6' : '#94a3b8' }}>{section.icon}</span>
                                            {section.title}
                                        </div>
                                        {isComplete && (
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '32px', minHeight: '500px' }}>
                        {renderActiveSection()}
                    </div>

                </div>

                <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>



            </div>

            {/* Template para Impresión (Solo para el diálogo de impresión real) */}
            <div id="print-root">
                <div className="print-history-template">
                    <PrintMedicalHistoryTemplate patient={patient} data={formData} />
                </div>
                <div className="print-exams-only-template">
                    <PrintExamsTemplate 
                        patient={patient} 
                        data={formData.exams} 
                        catalog={examCatalog}
                    />
                </div>
            </div>

            <style>{`
                @media screen {
                    #print-root { display: none; }
                }
                @media print {
                    @page { margin: 0; size: A4; }
                    
                    /* Ocultar elementos de la UI principal y marcados con no-print */
                    .management-container, 
                    .dashboard-layout, 
                    .sidebar, 
                    .header, 
                    .no-print,
                    button,
                    nav,
                    div[style*="position: fixed"]:not(#print-root) {
                        display: none !important;
                    }
                    
                    /* Forzar visibilidad de colores */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    /* Asegurar que el root de impresión sea lo único visible */
                    #print-root {
                        display: block !important;
                        visibility: visible !important;
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        height: auto !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        z-index: 99999 !important;
                        background: white !important;
                    }

                    /* Estilos específicos para el contenido de impresión */
                    .print-only-content {
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        width: 210mm !important;
                        min-height: 290mm !important;
                        margin: 0 !important;
                        padding: 10mm !important;
                        box-sizing: border-box !important;
                        background: white !important;
                        position: relative !important;
                    }

                    /* Mostrar solo la plantilla correcta según la clase en el body */
                    body.printing-exams .print-history-template {
                        display: none !important;
                    }
                    body.printing-exams .print-exams-only-template {
                        display: block !important;
                        visibility: visible !important;
                    }
                    
                    body:not(.printing-exams) .print-history-template {
                        display: block !important;
                        visibility: visible !important;
                    }
                    body:not(.printing-exams) .print-exams-only-template {
                        display: none !important;
                    }

                    body {
                        background: white !important;
                        visibility: visible !important;
                    }
                }
            `}</style>
        </>
    );
}
