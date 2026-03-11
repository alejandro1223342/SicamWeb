import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Save, User, ShieldAlert, Syringe, AlertTriangle, Search, FileText, Stethoscope, FileSignature, Loader2, Phone, Printer } from 'lucide-react';
import EmergencyContactForm from '../components/medical-history/EmergencyContactForm';
import FamilyHistoryForm from '../components/medical-history/FamilyHistoryForm';
import RecentVaccinesForm from '../components/medical-history/RecentVaccinesForm';
import RiskFactorsForm from '../components/medical-history/RiskFactorsForm';
import TricologyFindingsForm from '../components/medical-history/TricologyFindingsForm';
import LabResultsForm from '../components/medical-history/LabResultsForm';
import DiagnosisActivityForm from '../components/medical-history/DiagnosisActivityForm';
import ComplementaryExamsForm from '../components/medical-history/ComplementaryExamsForm';
import PrintMedicalHistoryTemplate from '../components/medical-history/PrintMedicalHistoryTemplate';
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
    const { patientId } = useParams<{ patientId: string }>();
    const { activeSpecialty } = useSpecialty();
    const [activeSection, setActiveSection] = useState<SectionKey>('emergency');
    const [patient, setPatient] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [showPreview, setShowPreview] = useState(false);


    // Master state for the entire form
    const [formData, setFormData] = useState({
        emergency: { name: '', relation: '', phone: '', address: '' },
        family: [] as string[],
        vaccines: [] as string[],
        risks: [] as string[],
        labresults: [] as any[],
        diagnosis: [] as any[],
        exams: { options: [] as string[], other: '', diagnosis: '', treatment: '' },
        tricology: { observations: '', files: [] as any[] }
    });

    const handleUpdateSection = (section: SectionKey, data: any) => {
        setFormData(prev => ({ ...prev, [section]: data }));
    };

    useEffect(() => {
        const fetchPatient = async () => {
            const cleanPatientId = patientId?.trim();
            if (!cleanPatientId || cleanPatientId === 'generic') return;
            try {
                const response = await api.get(`/users/patients/${cleanPatientId}`);
                console.log('DEBUG: Patient fetch response:', response.data);
                // Handle both wrapped and unwrapped response
                const userData = response.data?.data || response.data;
                console.log('DEBUG: Set patient state with:', userData);
                setPatient(userData);
            } catch (error) {
                console.error('DEBUG: Error fetching patient:', error);
            }
        };

        const fetchTodayRecord = async () => {
            const cleanPatientId = patientId?.trim();
            if (!cleanPatientId || !activeSpecialty || cleanPatientId === 'generic') return;

            const userData = localStorage.getItem('user');
            if (!userData) return;
            const doctorId = JSON.parse(userData).id;

            try {
                console.log('DEBUG: Fetching today record for:', { patientId: cleanPatientId, doctorId, specialtyId: activeSpecialty.id });
                const response = await api.get(`/medical-records/today/${cleanPatientId}/${doctorId}/${activeSpecialty.id}`);
                console.log('DEBUG: Today record response:', response.data);
                if (response.data && response.data.data) {
                    const dbData = response.data.data;

                    setFormData((prev: any) => ({
                        ...prev,
                        emergency: dbData.emergency || prev.emergency,
                        family: dbData.family || prev.family,
                        vaccines: dbData.vaccines || prev.vaccines,
                        risks: dbData.risks || prev.risks,
                        labresults: Array.isArray(dbData.labresults) ? dbData.labresults : prev.labresults,
                        diagnosis: Array.isArray(dbData.diagnosis) ? dbData.diagnosis : prev.diagnosis,
                        exams: { ...prev.exams, ...dbData.exams },
                        tricology: { ...prev.tricology, ...dbData.tricology },
                    }));

                    // Use patient data from the record if available
                    if (dbData.patient) {
                        console.log('DEBUG: Found patient data in medical record:', dbData.patient);
                        setPatient((prev: any) => ({ ...prev, ...dbData.patient }));
                    }
                }
            } catch (error) {
                console.error('DEBUG: Error fetching today\'s record:', error);
            }
        };

        fetchPatient();
        fetchTodayRecord();
    }, [patientId, activeSpecialty]);

    // Auto-save logic
    useEffect(() => {
        if (!activeSpecialty || !patientId || patientId === 'generic') return;

        const timer = setTimeout(() => {
            handleSaveAll(true);
        }, 3000); // 3 seconds delay

        return () => clearTimeout(timer);
    }, [formData]);

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

    const handleSaveAll = async (isAuto = false) => {
        if (!activeSpecialty || !patientId || patientId === 'generic') {
            console.warn('Cannot save: missing specialty or patientId');
            return;
        }

        const userData = localStorage.getItem('user');
        if (!userData) return;
        const doctorId = JSON.parse(userData).id;

        if (!isAuto) setSaving(true);
        setSaveStatus('saving');

        try {
            // Extract main diagnosis from the diagnosis list if exams.diagnosis is blank
            let mainDiagnosis = formData.exams.diagnosis || '';
            if (!mainDiagnosis && formData.diagnosis.length > 0) {
                // Use the first item's description as main diagnosis
                mainDiagnosis = formData.diagnosis[0].description;
            }

            const payload = {
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

            // Sync patient data from response if available
            const recordData = response.data?.data || response.data;
            if (recordData?.patient) {
                console.log('DEBUG: Updating patient state from upsert response:', recordData.patient);
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
            if (!isAuto) setSaving(false);
        }
    };



    const renderActiveSection = () => {
        switch (activeSection) {
            case 'emergency':
                return <EmergencyContactForm data={formData.emergency} onChange={(d: any) => handleUpdateSection('emergency', d)} />;
            case 'family':
                return <FamilyHistoryForm data={formData.family} onChange={(d: string[]) => handleUpdateSection('family', d)} />;
            case 'vaccines':
                return <RecentVaccinesForm data={formData.vaccines} onChange={(d: string[]) => handleUpdateSection('vaccines', d)} />;
            case 'risks':
                return <RiskFactorsForm data={formData.risks} onChange={(d: string[]) => handleUpdateSection('risks', d)} />;
            case 'tricology':
                return <TricologyFindingsForm
                    patientId={patientId || ''}
                    data={formData.tricology}
                    onChange={(d: any) => handleUpdateSection('tricology', d)}
                />;
            case 'labresults':
                return <LabResultsForm patientId={patientId || ''} data={formData.labresults} onChange={(d: any[]) => handleUpdateSection('labresults', d)} />;
            case 'diagnosis':
                return <DiagnosisActivityForm data={formData.diagnosis} onChange={(d: any[]) => handleUpdateSection('diagnosis', d)} />;
            case 'exams':
                return <ComplementaryExamsForm
                    data={formData.exams}
                    onChange={(d: any) => handleUpdateSection('exams', d)}
                    patient={patient}
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
                        <div style={{
                            width: '56px',
                            height: '56px',
                            background: '#eff6ff',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#3b82f6',
                            fontSize: '20px',
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
                                disabled={saving}
                                style={{ width: 'auto', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', height: '36px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
                            >
                                {saving ? <div className="loader" style={{ width: '14px', height: '14px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                                Guardar
                            </button>
                            <button
                                className="submit-btn"
                                onClick={() => setShowPreview(true)}
                                style={{
                                    width: 'auto', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px',
                                    height: '36px', backgroundColor: '#64748b', color: 'white', borderRadius: '8px',
                                    border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '13px'
                                }}
                            >
                                <Printer size={16} />
                                Vista Previa
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


                {/* Modal de Vista Previa */}
                {showPreview && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                        padding: '40px'
                    }}>
                        <div style={{
                            backgroundColor: '#f1f5f9', borderRadius: '12px',
                            width: '100%', maxWidth: '900px', height: '90vh',
                            display: 'flex', flexDirection: 'column', overflow: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        }}>
                            <div style={{
                                padding: '16px 24px', backgroundColor: 'white',
                                borderBottom: '1px solid #e2e8f0', display: 'flex',
                                justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                                    Vista Previa de Historia Clínica
                                </h3>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={() => window.print()}
                                        style={{
                                            padding: '8px 16px', backgroundColor: '#3b82f6',
                                            color: 'white', border: 'none', borderRadius: '6px',
                                            fontWeight: '600', cursor: 'pointer', display: 'flex',
                                            alignItems: 'center', gap: '8px'
                                        }}
                                    >
                                        <Printer size={18} /> Imprimir
                                    </button>
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        style={{
                                            padding: '8px 16px', backgroundColor: '#64748b',
                                            color: 'white', border: 'none', borderRadius: '6px',
                                            fontWeight: '600', cursor: 'pointer'
                                        }}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                            <div style={{
                                flex: 1, overflowY: 'auto', padding: '40px',
                                display: 'flex', justifyContent: 'center',
                                backgroundColor: '#cbd5e1'
                            }}>
                                <div style={{
                                    backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    width: '210mm', minHeight: '297mm', padding: '10mm'
                                }}>
                                    <PrintMedicalHistoryTemplate patient={patient} data={formData} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Template para Impresión (Solo para el diálogo de impresión real) */}
            <div id="print-root" className="print-history-template">
                <PrintMedicalHistoryTemplate patient={patient} data={formData} />
            </div>

            <style>{`
                @media screen {
                    .print-history-template { display: none; }
                }
                @media print {
                    /* Ocultar interfaz de la app y modales */
                    .management-container, div[style*="position: fixed"] {
                        display: none !important;
                    }
                    /* Forzar que el template de impresión sea visible */
                    .print-history-template {
                        display: block !important;
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        z-index: 9999 !important;
                        background: white !important;
                    }
                    /* Asegurar que el body permita ver el contenido absoluto */
                    body {
                        overflow: visible !important;
                    }
                    @page { margin: 0; size: A4; }
                }
            `}</style>
        </>
    );
}
