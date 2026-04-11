import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Save, User, ShieldAlert, Syringe, AlertTriangle, Search, FileText, Stethoscope, FileSignature, Loader2, ArrowLeft } from 'lucide-react';
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
import { CheckCircle, CloudUpload } from 'lucide-react';
import ConsultationReasonForm from '../components/medical-history/ConsultationReasonForm';
import TreatmentForm from '../components/medical-history/TreatmentForm';
import TricologyConsentForm from '../components/medical-history/TricologyConsentForm';

type SectionKey = 'emergency' | 'family' | 'vaccines' | 'risks' | 'labresults' | 'diagnosis' | 'exams' | 'tricology' | 'reason' | 'consents' | 'treatment_details';

interface SectionDef {
    id: SectionKey;
    title: string;
    icon: React.ReactNode;
}

const getSections = (): SectionDef[] => {
    return [
        { id: 'reason', title: 'Motivo de la consulta', icon: <FileText size={18} /> },
        { id: 'emergency', title: 'Contactos de emergencia', icon: <User size={18} /> },
        { id: 'family', title: 'Antecedentes familiares', icon: <ShieldAlert size={18} /> },
        { id: 'vaccines', title: 'Vacunas recientes', icon: <Syringe size={18} /> },
        { id: 'risks', title: 'Factores y conductas de riesgo', icon: <AlertTriangle size={18} /> },
        { id: 'tricology', title: 'Hallazgos en Tricoscopía', icon: <Search size={18} /> },
        { id: 'labresults', title: 'Resultados de laboratorio e imágenes', icon: <FileText size={18} /> },
        { id: 'diagnosis', title: 'Diagnóstico/Actividad', icon: <Stethoscope size={18} /> },
        { id: 'consents', title: 'Consentimientos Informados', icon: <FileSignature size={18} /> },
        { id: 'treatment_details', title: 'Procedimiento / Tratamiento y Observaciones', icon: <Stethoscope size={18} /> },
        { id: 'exams', title: 'Exámenes complementarios solicitados', icon: <FileSignature size={18} /> },
    ];
};

export default function MedicalHistory() {
    const { patientId, recordId } = useParams<{ patientId: string, recordId?: string }>();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');
    const navigate = useNavigate();
    
    const { specialtyId: urlSpecialtyId } = useParams<{ specialtyId: string }>();
    const { activeSpecialty, getActiveSpecialtyId } = useSpecialty();
    const [activeSection, setActiveSection] = useState<SectionKey>('reason');
    const [patient, setPatient] = useState<any>(null);
    const [examCatalog, setExamCatalog] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [currentRecordId, setCurrentRecordId] = useState<string | null>(recordId || null);
    const currentRecordIdRef = useRef<string | null>(recordId || null);
    const isSavingRef = useRef(false);
    const [isGlobalUploading, setIsGlobalUploading] = useState(false);

    useEffect(() => {
        currentRecordIdRef.current = currentRecordId;
    }, [currentRecordId]);

    const [formData, setFormData] = useState({
        reason: '',
        emergency: { name: '', relation: '', phone: '', address: '' },
        family: [] as string[],
        vaccines: [] as string[],
        risks: [] as string[],
        labresults: [] as any[],
        diagnosis: [] as any[],
        consents: { signedFiles: [] as any[] },
        treatment_details: { treatment: '', observations: '' },
        exams: { options: [] as string[], other: '', diagnosis: '', treatment: '' },
        tricology: { observations: '', files: [] as any[] },
        sessionId: queryParams.get('session') || null as string | null
    });

    const handleUpdateSection = (section: SectionKey, data: any) => {
        if (isReadOnly) return;
        setFormData(prev => ({ ...prev, [section]: data }));
    };

    useEffect(() => {
        const fetchPreviousRecord = async () => {
            const targetId = urlSpecialtyId || getActiveSpecialtyId();
            if (mode === 'new' && patientId && targetId) {
                try {
                    const response = await api.get(`/medical-records/patient/${patientId}?specialtyId=${targetId}`);
                    const history = response.data;
                    const prevRes = Array.isArray(history) ? history[0] : null;

                    // Si no hay registro previo, buscamos los datos de onboarding del paciente
                    let fallbackData = {
                        emergency: { name: '', relation: '', phone: '', address: '' },
                        family: [],
                        vaccines: [],
                        risks: []
                    };

                    if (!prevRes) {
                        try {
                            const cleanId = patientId.trim();
                            console.log('Fetching onboarding fallback for patient:', cleanId);
                            const patientRes = await api.get(`/users/patients/${cleanId}`);
                            const patientInfo = patientRes.data?.data || patientRes.data;
                            console.log('Patient Info received:', patientInfo);
                            if (patientInfo?.onboardingData) {
                                console.log('Applying onboarding fallback data:', patientInfo.onboardingData);
                                fallbackData = {
                                    emergency: patientInfo.onboardingData.emergency || fallbackData.emergency,
                                    family: patientInfo.onboardingData.family || fallbackData.family,
                                    vaccines: patientInfo.onboardingData.vaccines || fallbackData.vaccines,
                                    risks: patientInfo.onboardingData.risks || fallbackData.risks,
                                };
                            }
                        } catch (pErr) {
                            console.error('Error fetching patient onboarding data:', pErr);
                        }
                    }

                    setFormData({
                        reason: prevRes?.data?.reason || '',
                        emergency: prevRes?.data?.emergency || fallbackData.emergency,
                        family: prevRes?.data?.family || fallbackData.family,
                        vaccines: prevRes?.data?.vaccines || fallbackData.vaccines,
                        risks: prevRes?.data?.risks || fallbackData.risks,
                        labresults: [],
                        diagnosis: [],
                        consents: { signedFiles: [] },
                        treatment_details: { treatment: '', observations: '' },
                        exams: { options: [], other: '', diagnosis: '', treatment: '' },
                        tricology: { observations: '', files: [] },
                        sessionId: queryParams.get('session') || null
                    });
                } catch (error) {
                    console.error('Error fetching previous record:', error);
                }
            }
        };

        if (mode === 'new') {
            fetchPreviousRecord();
            setCurrentRecordId(null);
            currentRecordIdRef.current = null;
        }
    }, [mode, patientId, activeSpecialty, urlSpecialtyId]);

    useEffect(() => {
        const fetchCatalog = async () => {
            try {
                const response = await api.get('/catalogs/complementary-exams', { params: { page: 1, limit: 1000 } });
                const fetchedItems = response.data.items || [];
                const catalog: any = {};
                fetchedItems.forEach((cat: any) => {
                    catalog[cat.name] = (cat.options || []).map((opt: any) => opt.name);
                });
                setExamCatalog(catalog);
            } catch (error) { console.error('Error fetching catalog:', error); }
        };

        const fetchPatient = async (id: string) => {
            const cleanPatientId = id.trim();
            if (!cleanPatientId || cleanPatientId === 'generic') return;
            try {
                const response = await api.get(`/users/patients/${cleanPatientId}`);
                setPatient(response.data?.data || response.data);
            } catch (error) { console.error('Error fetching patient:', error); }
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
                        reason: dbData.data?.reason || prev.reason,
                        emergency: dbData.data?.emergency || prev.emergency,
                        family: dbData.data?.family || prev.family,
                        vaccines: dbData.data?.vaccines || prev.vaccines,
                        risks: dbData.data?.risks || prev.risks,
                        labresults: Array.isArray(dbData.data?.labresults) ? dbData.data?.labresults : prev.labresults,
                        diagnosis: Array.isArray(dbData.data?.diagnosis) ? dbData.data?.diagnosis : prev.diagnosis,
                        consents: dbData.data?.consents || prev.consents,
                        treatment_details: dbData.data?.treatment_details || prev.treatment_details,
                        exams: { ...prev.exams, ...dbData.data?.exams },
                        tricology: { ...prev.tricology, ...dbData.data?.tricology },
                        sessionId: dbData.data?.sessionId || prev.sessionId
                    }));
                    if (dbData.patient) setPatient(dbData.patient);
                }
            } catch (error) { toast.error('Error al cargar el registro'); }
        };

        const fetchTodayRecord = async () => {
            const cleanPatientId = patientId?.trim();
            if (!cleanPatientId || !activeSpecialty || cleanPatientId === 'generic' || mode === 'new') return;
            const userData = localStorage.getItem('user');
            if (!userData) return;
            const doctorId = JSON.parse(userData).id;
            try {
                const targetId = urlSpecialtyId || getActiveSpecialtyId();
                if (!targetId) return;
                const response = await api.get(`/medical-records/today/${cleanPatientId}/${doctorId}/${targetId}`);
                if (response.data && response.data.data) {
                    const dbData = response.data.data;
                    setFormData((prev: any) => ({
                        ...prev,
                        reason: dbData.data?.reason || prev.reason,
                        emergency: dbData.data?.emergency || prev.emergency,
                        family: dbData.data?.family || prev.family,
                        vaccines: dbData.data?.vaccines || prev.vaccines,
                        risks: dbData.data?.risks || prev.risks,
                        labresults: Array.isArray(dbData.data?.labresults) ? dbData.data?.labresults : prev.labresults,
                        diagnosis: Array.isArray(dbData.data?.diagnosis) ? dbData.data?.diagnosis : prev.diagnosis,
                        consents: dbData.data?.consents || prev.consents,
                        treatment_details: dbData.data?.treatment_details || prev.treatment_details,
                        exams: { ...prev.exams, ...dbData.data?.exams },
                        tricology: { ...prev.tricology, ...dbData.data?.tricology },
                        sessionId: dbData.data?.sessionId || prev.sessionId
                    }));
                    if (dbData.patient) setPatient((prev: any) => ({ ...prev, ...dbData.patient }));
                    if (dbData.id) {
                        setCurrentRecordId(dbData.id);
                        currentRecordIdRef.current = dbData.id;
                    }
                }
            } catch (error) { console.error('Error fetching today\'s record:', error); }
        };

        if (recordId) {
            setIsReadOnly(true); // Ver historial existente es solo lectura
            if (recordId !== currentRecordIdRef.current || formData.emergency.name === '') fetchRecordById();
            fetchPatient(patientId!);
        } else if (patientId) {
            setIsReadOnly(false);
            fetchPatient(patientId);
            if (mode !== 'new') fetchTodayRecord();
        }
        fetchCatalog();
    }, [patientId, recordId, activeSpecialty, urlSpecialtyId, mode]);

    const handleSaveAll = useCallback(async (isAuto = false) => {
        if (isSavingRef.current || isGlobalUploading || !activeSpecialty || !patientId || patientId === 'generic' || isReadOnly) return;
        const userData = localStorage.getItem('user');
        if (!userData) return;
        const doctorId = JSON.parse(userData).id;
        isSavingRef.current = true;
        setSaving(true);
        setSaveStatus('saving');
        try {
            let mainDiagnosis = formData.exams.diagnosis || (formData.diagnosis.length > 0 ? formData.diagnosis[0].description : '');
            const payload = {
                id: currentRecordIdRef.current,
                forceNew: mode === 'new' && !currentRecordIdRef.current,
                patientId,
                doctorId,
                specialtyId: getActiveSpecialtyId(),
                data: formData,
                diagnosis: mainDiagnosis
            };
            const response = await api.post('/medical-records/upsert', payload);
            console.log('SAVE: Response received:', response.data);
            const recordData = response.data;
            if (recordData?.id) {
                if (!currentRecordIdRef.current) {
                    setCurrentRecordId(recordData.id);
                }
                currentRecordIdRef.current = recordData.id;
            }
            if (!isAuto) toast.success('Historia clínica guardada');
            setSaveStatus('saved');
            return recordData?.id;
        } catch (error: any) {
            setSaveStatus('error');
            if (!isAuto) toast.error('Error al guardar');
        } finally {
            isSavingRef.current = false;
            setSaving(false);
        }
    }, [activeSpecialty, patientId, isReadOnly, mode, formData, isGlobalUploading]);

    useEffect(() => {
        if (isReadOnly) return;
        const timer = setTimeout(() => handleSaveAll(true), 5000);
        return () => clearTimeout(timer);
    }, [formData, isReadOnly, handleSaveAll]);

    const renderActiveSection = () => {
        const commonProps = { readOnly: isReadOnly };
        switch (activeSection) {
            case 'reason': return <ConsultationReasonForm {...commonProps} data={formData.reason} onChange={(d: string) => handleUpdateSection('reason', d)} />;
            case 'emergency': return <EmergencyContactForm {...commonProps} data={formData.emergency} onChange={(d: any) => handleUpdateSection('emergency', d)} />;
            case 'family': return <FamilyHistoryForm {...commonProps} data={formData.family} onChange={(d: string[]) => handleUpdateSection('family', d)} />;
            case 'vaccines': return <RecentVaccinesForm {...commonProps} data={formData.vaccines} onChange={(d: string[]) => handleUpdateSection('vaccines', d)} />;
            case 'risks': return <RiskFactorsForm {...commonProps} data={formData.risks} onChange={(d: string[]) => handleUpdateSection('risks', d)} />;
            case 'tricology': return <TricologyFindingsForm {...commonProps} patientId={patientId || ''} recordId={currentRecordId} sessionId={formData.sessionId} data={formData.tricology} onChange={(d: any) => handleUpdateSection('tricology', d)} onUploadingChange={setIsGlobalUploading} />;
            case 'labresults': return <LabResultsForm {...commonProps} patientId={patientId || ''} recordId={currentRecordId} sessionId={formData.sessionId} data={formData.labresults} onChange={(d: any[]) => handleUpdateSection('labresults', d)} onUploadingChange={setIsGlobalUploading} />;
            case 'diagnosis': return <DiagnosisActivityForm {...commonProps} data={formData.diagnosis} onChange={(d: any[]) => handleUpdateSection('diagnosis', d)} />;
            case 'consents': return <TricologyConsentForm {...commonProps} patientId={patientId || ''} recordId={currentRecordId} sessionId={formData.sessionId} data={formData.consents} onChange={(d: any) => handleUpdateSection('consents', d)} onUploadingChange={setIsGlobalUploading} />;
            case 'treatment_details': return <TreatmentForm {...commonProps} data={formData.treatment_details} onChange={(d: any) => handleUpdateSection('treatment_details', d)} />;
            case 'exams': return <ComplementaryExamsForm {...commonProps} data={formData.exams} onChange={(d: any) => handleUpdateSection('exams', d)} patient={patient} fullCatalog={examCatalog} recordId={currentRecordId} />;
            default: return null;
        }
    };

    const getAge = (birthDate: any) => {
        if (!birthDate) return 'N/A';
        try {
            const birth = new Date(birthDate);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
            return age;
        } catch (e) { return 'N/A'; }
    };

    return (
        <div className="management-container" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'sticky', top: '0', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', backgroundColor: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer' }}><ArrowLeft size={20} /></button>
                    <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontSize: '18px', fontWeight: '700' }}>{patient?.firstName?.[0]}{patient?.lastName?.[0]}</div>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0', color: '#1e293b' }}>{patient?.firstName} {patient?.lastName}</h2>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '4px', fontSize: '13px', color: '#64748b' }}>
                            <span><b>CI:</b> {patient?.idNumber || 'N/A'}</span>
                            <span><b>Edad:</b> {getAge(patient?.birthDate)} años</span>
                            <span><b>Teléfono:</b> {patient?.phone || 'N/A'}</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ textAlign: 'right' }}><div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Especialidad</div><div style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6' }}>{activeSpecialty?.name || '---'}</div></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px' }}>
                           {saveStatus === 'saving' ? <Loader2 className="animate-spin" size={14} /> : saveStatus === 'saved' ? <CheckCircle size={14} color="#22c55e" /> : <CloudUpload size={14} />}
                           {saveStatus === 'saving' ? 'Guardando...' : saveStatus === 'saved' ? 'Guardado' : 'Auto-save'}
                        </div>
                        <button onClick={() => handleSaveAll(false)} disabled={saving || isReadOnly} style={{ padding: '0 16px', height: '36px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', display: isReadOnly ? 'none' : 'flex', alignItems: 'center', gap: '8px' }}>
                            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Guardar
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', flex: 1, alignItems: 'flex-start' }}>
                <div style={{ width: '280px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', flexShrink: 0, position: 'sticky', top: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {getSections().map((section) => (
                            <button key={section.id} onClick={() => setActiveSection(section.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: activeSection === section.id ? '#eff6ff' : 'transparent', color: activeSection === section.id ? '#1d4ed8' : '#475569', fontWeight: '600', cursor: 'pointer', textAlign: 'left' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>{section.icon} {section.title}</div>
                            </button>
                        ))}
                    </div>
                </div>
                <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '32px', minHeight: '500px' }}>
                    {renderActiveSection()}
                </div>
            </div>
            
            <div id="print-root" style={{ display: 'none' }}>
                <PrintMedicalHistoryTemplate patient={patient} data={formData} />
                <PrintExamsTemplate patient={patient} data={formData.exams} catalog={examCatalog} />
            </div>
        </div>
    );
}
