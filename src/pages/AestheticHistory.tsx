import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Save, User, ShieldAlert, Syringe, AlertTriangle, Search, FileText, Stethoscope, FileSignature, Loader2, ArrowLeft, Smile } from 'lucide-react';
import EmergencyContactForm from '../components/medical-history/EmergencyContactForm';
import FamilyHistoryForm from '../components/medical-history/FamilyHistoryForm';
import RecentVaccinesForm from '../components/medical-history/RecentVaccinesForm';
import RiskFactorsForm from '../components/medical-history/RiskFactorsForm';
import AestheticFindingsForm from '../components/medical-history/AestheticFindingsForm';
import AestheticLabResultsForm from '../components/medical-history/AestheticLabResultsForm';
import DiagnosisActivityForm from '../components/medical-history/DiagnosisActivityForm';
import ComplementaryExamsForm from '../components/medical-history/ComplementaryExamsForm';
import PrintAestheticHistoryTemplate from '../components/medical-history/PrintAestheticHistoryTemplate';
import BodyMapForm from '../components/medical-history/BodyMapForm';
import ConsultationReasonForm from '../components/medical-history/ConsultationReasonForm';
import TreatmentForm from '../components/medical-history/TreatmentForm';
import ConsentForm from '../components/medical-history/ConsentForm';
import MedicalPrescriptionForm from '../components/medical-history/MedicalPrescriptionForm';
import { useSpecialty } from '../context/SpecialtyContext';
import api from '../api';
import toast from 'react-hot-toast';
import { CheckCircle, CloudUpload } from 'lucide-react';

type SectionKey = 'reason' | 'emergency' | 'family' | 'vaccines' | 'risks' | 'labresults' | 'diagnosis' | 'exams' | 'findings' | 'consents' | 'bodymap_male' | 'bodymap_female' | 'bodymap_face' | 'bodymap_face_male' | 'bodymap_face_female' | 'treatment_details' | 'prescription';

interface SectionDef {
    id: SectionKey;
    title: string;
    icon: React.ReactNode;
}



export default function AestheticHistory() {
    const { patientId, recordId } = useParams<{ patientId: string, recordId?: string }>();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');
    const navigate = useNavigate();

    const { specialtyId: urlSpecialtyId } = useParams<{ specialtyId: string }>();
    const { activeSpecialty, getActiveSpecialtyId } = useSpecialty(); // Still useful for context, but we know we are in Aesthetic
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

    const getSections = useCallback((): SectionDef[] => {
        const baseSections: SectionDef[] = [
            { id: 'reason', title: 'Motivo de la consulta', icon: <FileSignature size={18} /> },
            { id: 'emergency', title: 'Contactos de emergencia', icon: <User size={18} /> },
            { id: 'family', title: 'Antecedentes familiares', icon: <ShieldAlert size={18} /> },
            { id: 'vaccines', title: 'Vacunas recientes', icon: <Syringe size={18} /> },
            { id: 'risks', title: 'Factores y conductas de riesgo', icon: <AlertTriangle size={18} /> },
            { id: 'findings', title: 'Hallazgos en Dermatoscopía', icon: <Search size={18} /> },
        ];

        const g = (patient?.gender || '').toString().toUpperCase().trim();
        const isMale = g === 'M' || g.includes('MAS') || g.includes('MALE') || g === 'H' || g.includes('HOM') || g === '1';
        const isFemale = g === 'F' || g.includes('FEM') || g.includes('FEMALE') || g.includes('MUJ') || g === '2';

        console.log('DEBUG - AestheticHistory Patient:', patient);
        console.log('DEBUG - AestheticHistory Gender Logic:', { raw: patient?.gender, normalized: g, isMale, isFemale });

        if (isMale) {
            baseSections.push({ id: 'bodymap_male', title: 'Análisis Corporal (Hombre)', icon: <User size={18} /> });
            baseSections.push({ id: 'bodymap_face_male', title: 'Análisis Facial (Hombre)', icon: <Smile size={18} /> });
        } else if (isFemale) {
            baseSections.push({ id: 'bodymap_female', title: 'Análisis Corporal (Mujer)', icon: <User size={18} /> });
            baseSections.push({ id: 'bodymap_face_female', title: 'Análisis Facial (Mujer)', icon: <Smile size={18} /> });
        } else {
            // Fallback: If we don't have a verified gender yet (loading or missing), 
            // show both genders so the doctor isn't blocked.
            baseSections.push({ id: 'bodymap_male', title: 'Análisis Corporal (Hombre)', icon: <User size={18} /> });
            baseSections.push({ id: 'bodymap_female', title: 'Análisis Corporal (Mujer)', icon: <User size={18} /> });
            baseSections.push({ id: 'bodymap_face_male', title: 'Análisis Facial (Hombre)', icon: <Smile size={18} /> });
            baseSections.push({ id: 'bodymap_face_female', title: 'Análisis Facial (Mujer)', icon: <Smile size={18} /> });
        }

        baseSections.push({ id: 'bodymap_face', title: 'Análisis Facial (Músculos)', icon: <Smile size={18} /> });

        baseSections.push(
            { id: 'labresults', title: 'Resultados de laboratorio e imágenes', icon: <FileText size={18} /> },
            { id: 'diagnosis', title: 'Diagnóstico/Actividad', icon: <Stethoscope size={18} /> },
            { id: 'exams', title: 'Exámenes complementarios solicitados', icon: <FileSignature size={18} /> },
            { id: 'consents', title: 'Consentimientos Informados', icon: <FileText size={18} /> },
            { id: 'prescription', title: 'Receta Médica', icon: <FileText size={18} /> },
            { id: 'treatment_details', title: 'Procedimiento / Tratamiento y Observaciones', icon: <FileText size={18} /> },
        );

        return baseSections;
    }, [patient?.gender]);

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
        exams: { options: [] as string[], other: '', diagnosis: '', treatment: '' },
        treatment_details: { treatment: '', observations: '' },
        consents: { signedFiles: [] as any[] },
        tricology: { observations: '', files: [] as any[] },
        bodymap_male: {} as Record<string, number>,
        bodymap_female: {} as Record<string, number>,
        bodymap_face: {} as Record<string, number>,
        bodymap_face_male: {} as Record<string, number>,
        bodymap_face_female: {} as Record<string, number>,
        prescription: { cie10: '', hasAllergies: false, allergiesDetails: '', medications: '', indications: '' },
        sessionId: queryParams.get('session') || null as string | null
    });

    const handleUpdateSection = (section: SectionKey, data: any) => {
        if (isReadOnly) return;
        const mappedSection = section === 'findings' ? 'tricology' : section;
        setFormData(prev => ({ ...prev, [mappedSection]: data }));
    };

    useEffect(() => {
        if (mode === 'new' && patientId && activeSpecialty?.id) {
            const initialEmptyState = {
                reason: '',
                emergency: { name: '', relation: '', phone: '', address: '' },
                family: [] as string[],
                vaccines: [] as string[],
                risks: [] as string[],
                labresults: [] as any[],
                diagnosis: [] as any[],
                exams: { options: [] as string[], other: '', diagnosis: '', treatment: '' },
                treatment_details: { treatment: '', observations: '' },
                consents: { signedFiles: [] as any[] },
                tricology: { observations: '', files: [] as any[] },
                bodymap_male: {} as Record<string, number>,
                bodymap_female: {} as Record<string, number>,
                bodymap_face: {} as Record<string, number>,
                bodymap_face_male: {} as Record<string, number>,
                bodymap_face_female: {} as Record<string, number>,
                prescription: { cie10: '', hasAllergies: false, allergiesDetails: '', medications: '', indications: '' },
                sessionId: queryParams.get('session') || (null as string | null)
            };

            const fetchPreviousRecord = async () => {
                try {
                    const targetId = urlSpecialtyId || getActiveSpecialtyId();
                    const response = await api.get(`/medical-records/patient/${patientId}`, {
                        params: { specialtyId: targetId }
                    });

                    const records = response.data || [];
                    const lastRecord = records.length > 0 ? records[0] : null;

                    // Si no hay registro previo, buscamos los datos de onboarding del paciente
                    let fallbackData = {
                        emergency: initialEmptyState.emergency,
                        family: initialEmptyState.family,
                        vaccines: initialEmptyState.vaccines,
                        risks: initialEmptyState.risks
                    };

                    if (!lastRecord) {
                        try {
                            const cleanId = patientId.trim();
                            console.log('Fetching onboarding fallback for patient (Aesthetic):', cleanId);
                            const patientRes = await api.get(`/users/patients/${cleanId}`);
                            const patientInfo = patientRes.data?.data || patientRes.data;
                            console.log('Patient Info received (Aesthetic):', patientInfo);
                            if (patientInfo?.onboardingData) {
                                console.log('Applying onboarding fallback data (Aesthetic):', patientInfo.onboardingData);
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

                    if (lastRecord) {
                        const lastData = lastRecord.data || {};
                        setFormData({
                            ...initialEmptyState,
                            reason: lastData.reason || initialEmptyState.reason,
                            emergency: lastData.emergency || initialEmptyState.emergency,
                            family: lastData.family || initialEmptyState.family,
                            vaccines: lastData.vaccines || initialEmptyState.vaccines,
                            risks: lastData.risks || initialEmptyState.risks,
                        });
                    } else {
                        setFormData({
                            ...initialEmptyState,
                            emergency: fallbackData.emergency,
                            family: fallbackData.family,
                            vaccines: fallbackData.vaccines,
                            risks: fallbackData.risks,
                            prescription: { cie10: '', hasAllergies: false, allergiesDetails: '', medications: '', indications: '' }
                        });
                    }
                } catch (error) {
                    console.error('Error fetching last record for pre-fill:', error);
                    setFormData(initialEmptyState);
                }
            };

            fetchPreviousRecord();
            setCurrentRecordId(null);
            currentRecordIdRef.current = null;
        }
    }, [mode, patientId, getActiveSpecialtyId(), urlSpecialtyId]);

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
            if (!id || id === 'generic') return;
            try {
                const response = await api.get(`/users/patients/${id.trim()}`);
                setPatient(response.data?.data || response.data);
            } catch (error) { console.error('Error fetching patient:', error); }
        };

        const fetchRecordById = async () => {
            if (!recordId) return;
            const isHistoricalView = mode !== 'new' && mode !== 'edit';
            setIsReadOnly(isHistoricalView);
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
                        exams: { ...prev.exams, ...dbData.data?.exams },
                        treatment_details: dbData.data?.treatment_details || prev.treatment_details,
                        consents: dbData.data?.consents || prev.consents,
                        tricology: { ...prev.tricology, ...dbData.data?.tricology },
                        bodymap_male: dbData.data?.bodymap_male || dbData.data?.bodymap || prev.bodymap_male,
                        bodymap_female: dbData.data?.bodymap_female || prev.bodymap_female,
                        bodymap_face: dbData.data?.bodymap_face || prev.bodymap_face,
                        bodymap_face_male: dbData.data?.bodymap_face_male || prev.bodymap_face_male,
                        bodymap_face_female: dbData.data?.bodymap_face_female || prev.bodymap_face_female,
                        prescription: {
                            ...(dbData.data?.prescription || prev.prescription),
                            prescriptionNumber: dbData.prescriptions?.[0]?.prescriptionNumber,
                        },
                        sessionId: dbData.data?.sessionId || prev.sessionId
                    }));
                    if (dbData.patient) setPatient((prev: any) => ({ ...prev, ...dbData.patient }));
                }
            } catch (error) { toast.error('Error al cargar el registro'); }
        };

        if (recordId) {
            if (recordId !== currentRecordIdRef.current || formData.emergency.name === '') fetchRecordById();
            fetchPatient(patientId!);
        } else if (patientId) {
            setIsReadOnly(false);
            fetchPatient(patientId);
        }
        fetchCatalog();
    }, [patientId, recordId, mode]);

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
                specialtyId: urlSpecialtyId || getActiveSpecialtyId(),
                data: formData,
                diagnosis: mainDiagnosis
            };

            const response = await api.post('/medical-records/upsert', payload);
            console.log('SAVE: Response received:', response.data);
            const recordData = response.data;
            if (recordData?.id) {
                if (!currentRecordIdRef.current) {
                    setCurrentRecordId(recordData.id);
                    // Si estábamos en modo "nuevo", actualizamos la URL para que sea persistente PERO editable con mode=edit
                    if (mode === 'new') {
                        const specialtyId = urlSpecialtyId || getActiveSpecialtyId();
                        navigate(`/dashboard/specialty/${specialtyId}/aesthetic-history/${patientId}/${recordData.id}?mode=edit`, { replace: true });
                    }
                }
                if (recordData.prescriptions && recordData.prescriptions.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        prescription: {
                            ...prev.prescription,
                            prescriptionNumber: recordData.prescriptions[0].prescriptionNumber
                        }
                    }));
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
            case 'findings': return <AestheticFindingsForm {...commonProps} patientId={patientId || ''} recordId={currentRecordId} sessionId={formData.sessionId} data={formData.tricology} onChange={(d: any) => handleUpdateSection('findings', d)} onUploadingChange={setIsGlobalUploading} />;
            case 'labresults': return <AestheticLabResultsForm {...commonProps} patientId={patientId || ''} recordId={currentRecordId} sessionId={formData.sessionId} data={formData.labresults} onChange={(d: any[]) => handleUpdateSection('labresults', d)} onUploadingChange={setIsGlobalUploading} />;
            case 'diagnosis': return <DiagnosisActivityForm {...commonProps} data={formData.diagnosis} onChange={(d: any[]) => handleUpdateSection('diagnosis', d)} />;
            case 'exams': return <ComplementaryExamsForm {...commonProps} data={formData.exams} onChange={(d: any) => handleUpdateSection('exams', d)} patient={patient} fullCatalog={examCatalog} recordId={currentRecordId} />;
            case 'treatment_details': return <TreatmentForm {...commonProps} data={formData.treatment_details} onChange={(d: any) => handleUpdateSection('treatment_details', d)} />;
            case 'prescription': return <MedicalPrescriptionForm {...commonProps} data={formData.prescription} onChange={(d: any) => handleUpdateSection('prescription', d)} patient={patient} recordId={currentRecordId} />;
            case 'consents': return <ConsentForm {...commonProps} specialty="Estética" patientId={patientId || ''} recordId={currentRecordId} sessionId={formData.sessionId} data={formData.consents} onChange={(d: any) => handleUpdateSection('consents', d)} onUploadingChange={setIsGlobalUploading} />;
            case 'bodymap_male':
                return <BodyMapForm {...commonProps} gender="male" data={formData.bodymap_male} onChange={(d: any) => handleUpdateSection('bodymap_male' as any, d)} />;
            case 'bodymap_female':
                return <BodyMapForm {...commonProps} gender="female" data={formData.bodymap_female} onChange={(d: any) => handleUpdateSection('bodymap_female' as any, d)} />;
            case 'bodymap_face':
                return <BodyMapForm {...commonProps} gender="face" data={formData.bodymap_face} onChange={(d: any) => handleUpdateSection('bodymap_face' as any, d)} />;
            case 'bodymap_face_male':
                return <BodyMapForm {...commonProps} gender="face_male" data={formData.bodymap_face_male} onChange={(d: any) => handleUpdateSection('bodymap_face_male' as any, d)} />;
            case 'bodymap_face_female':
                return <BodyMapForm {...commonProps} gender="face_female" data={formData.bodymap_face_female} onChange={(d: any) => handleUpdateSection('bodymap_face_female' as any, d)} />;
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
                    <div style={{ textAlign: 'right' }}><div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Especialidad</div><div style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6' }}>Estética</div></div>
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

            {/* Hidden Templates for local use if needed, but we prefer Redirect to dedicated page */}
            <div id="print-root" style={{ display: 'none' }}>
                <PrintAestheticHistoryTemplate patient={patient} data={formData} />
            </div>
        </div>
    );
}
