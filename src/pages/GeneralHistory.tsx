import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
    Save, FileText, Activity, 
    FileSignature, Loader2, ArrowLeft, CheckCircle, CloudUpload, User,
    ClipboardList, AlertTriangle, ArrowRight, Scan, Microscope
} from 'lucide-react';
import { useSpecialty } from '../context/SpecialtyContext';
import api from '../api';
import toast, { Toaster } from 'react-hot-toast';

// Components
import GeneralAnamnesisForm from '../components/medical-history/general/GeneralAnamnesisForm';
import GeneralAnamnesis003Form from '../components/medical-history/general/GeneralAnamnesis003Form';
import GeneralEpicrisisForm from '../components/medical-history/general/GeneralEpicrisisForm';
import GeneralInterconsultationRequestForm from '../components/medical-history/general/GeneralInterconsultationRequestForm';
import GeneralInterconsultationReportForm from '../components/medical-history/general/GeneralInterconsultationReportForm';
import GeneralEmergency01Form from '../components/medical-history/general/GeneralEmergency01Form';
import GeneralReferenceForm from '../components/medical-history/general/GeneralReferenceForm';
import GeneralCounterReferenceForm from '../components/medical-history/general/GeneralCounterReferenceForm';
import GeneralImagingRequestForm from '../components/medical-history/general/GeneralImagingRequestForm';
import GeneralImagingReportForm from '../components/medical-history/general/GeneralImagingReportForm';
import EmergencyContactForm from '../components/medical-history/EmergencyContactForm';
import ConsentForm from '../components/medical-history/ConsentForm';

type SectionKey = 
    | 'emergency' 
    | 'anamnesis_002' 
    | 'anamnesis' 
    | 'epicrisis' 
    | 'inter_req' | 'inter_rep' 
    | 'emerg_01' | 'emerg_02' 
    | 'ref' | 'counter_ref' 
    | 'img_req' | 'img_rep' 
    | 'path_req' | 'path_rep'
    | 'evolution' | 'consents';

interface SectionDef {
    id: SectionKey;
    title: string;
    icon: React.ReactNode;
}

export default function GeneralHistory() {
    const { patientId, recordId } = useParams<{ patientId: string, recordId?: string }>();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');
    const navigate = useNavigate();

    const { activeSpecialty } = useSpecialty();
    const [activeSection, setActiveSection] = useState<SectionKey>('anamnesis_002');
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [currentRecordId, setCurrentRecordId] = useState<string | null>(recordId || null);
    const currentRecordIdRef = useRef<string | null>(recordId || null);
    const isSavingRef = useRef(false);

    const [formData, setFormData] = useState({
        anamnesis_002: {
            reason: '',
            personalHistory: '',
            familyHistory: '',
            currentIllness: '',
            organsReview: '',
            vitals: {},
            physicalExam: '',
            diagnosis: [],
            plans: '',
            finalData: []
        },
        anamnesis: {
            reason: '',
            personalHistory: {
                description: '',
                datos: {
                    menarquiaEdad: '', menopausiaEdad: '', ciclos: '', vidaSexualActiva: null,
                    gesta: '', partos: '', abortos: '', cesareas: '', hijosVivos: '',
                    fum: '', fup: '', fuc: '',
                    biopsia: null, terapiaHormonal: null, colposcopia: null, mamografia: null,
                    metodoPlanificacion: ''
                }
            },
            familyHistory: '',
            currentIllness: '',
            organsReview: {
                description: '',
                systems: {
                    senses: null, respiratory: null, cardiovascular: null, digestive: null, 
                    genital: null, urinary: null, musculoskeletal: null, endocrine: null, 
                    hemolymphatic: null, nervous: null
                }
            },
            vitals: {
                bloodPressure: '', heartRate: '', respiratoryRate: '',
                oralTemp: '', axillaryTemp: '', weight: '',
                height: '', bmi: '', headCircumference: ''
            },
            physicalExam: {
                description: '',
                areas: {
                    skin: null, head: null, eyes: null, ears: null, nose: null,
                    mouth: null, oropharynx: null, neck: null, axillaeBreasts: null,
                    thorax: null, abdomen: null, spine: null, groinPerineum: null,
                    upperLimbs: null, lowerLimbs: null
                }
            },
            diagnosis: [],
            plans: ''
        },
        epicrisis: {
            clinicalSummary: '',
            evolutionSummary: '',
            relevantFindings: '',
            diagnosis: [],
            treatmentSummary: '',
            dischargeConditions: '',
            attendingDoctors: [],
            discharge: {
                finalDischarge: null,
                transitoryDischarge: null,
                asymptomatic: null,
                mildDisability: null,
                moderateDisability: null,
                severeDisability: null,
                voluntaryRetirement: null,
                involuntaryRetirement: null,
                deathBefore48h: null,
                deathAfter48h: null,
                stayDays: '',
                disabilityDays: ''
            }
        },
        inter_req: {
            clinicalReason: {
                destination: '',
                consultedService: '',
                requestingService: '',
                ward: '',
                bed: '',
                priority: null,
                consultedDoctor: ''
            },
            currentIllness: '',
            diagnosticsResults: '',
            diagnosis: [],
            therapeuticPlan: '',
            educationalPlan: ''
        },
        inter_rep: {
            clinicalSummary: '',
            proposedTests: '',
            diagnosis: [],
            proposedTherapeuticPlan: '',
            proposedEducationalPlan: '',
            clinicalCriteriaSummary: ''
        },
        emerg_01: {
            admissionRecord: {
                date: '',
                time: '',
                age: '',
                civilStatus: '',
                occupation: '',
                insuranceType: null,
                companionName: '',
                companionId: '',
                address: '',
                phone: '',
                arrivalMethod: null,
                informationSource: '',
                deliveryPerson: '',
                deliveryPhone: ''
            },
            startOfCare: {
                time: '',
                bloodType: '',
                airwayState: null,
                arrivalCondition: null,
                arrivalReason: ''
            },
            accidentViolencePoisoning: {
                eventPlace: '',
                eventAddress: '',
                eventDate: '',
                eventTime: '',
                vehicleOrWeapon: '',
                eventType: null,
                otherEventType: '',
                reportTime: '',
                policeCustody: null,
                reportObservations: '',
                alcoholBreath: null,
                alcocheckValue: '',
                examTime: '',
                substanceSelection: null,
                abuseSuspicion: null,
                generalObservations: '',
                burnDegree: null,
                burnPercentage: '',
                stingDetail: '',
                biteDetail: ''
            },
            relevantHistory: {
                selectedTypes: [],
                details: ''
            },
            currentIllnessReview: '',
            painCharacteristics: []
        },
        emerg_02: {},
        ref: {
            reason: {
                targetInstitution: '',
                referringService: '',
                detailedReason: ''
            },
            clinicalSummary: '',
            examFindings: '',
            treatment: '',
            diagnosis: []
        },
        counter_ref: {
            clinicalSummary: {
                targetInstitution: '',
                referringService: '',
                detailedSummary: ''
            },
            examFindings: '',
            treatmentPerformed: '',
            recommendedTreatment: '',
            diagnosis: []
        },
        img_req: {
            requestedStudies: {
                service: '',
                room: '',
                bed: '',
                priority: 'NORMAL',
                collectionDate: '',
                studyType: '',
                description: '',
                mobilityState: ''
            },
            requestReason: '',
            diagnosis: [],
            clinicalSummary: ''
        },
        img_rep: {
            studiesPerformed: {
                service: '',
                room: '',
                bed: '',
                priority: 'NORMAL',
                collectionDate: '',
                studyType: '',
                description: ''
            },
            imagingReport: {
                files: [] as { url: string, name: string }[],
                comments: ''
            },
            obstetricData: {
                biparietalDiameter: { value: '', age: '', weight: '' },
                femurLength: { value: '', age: '', weight: '' },
                abdominalPerimeter: { value: '', age: '', weight: '' },
                placentaLocation: '',
                fetusGender: '',
                maturityGrade: ''
            },
            gynecologicData: {
                uterus: '',
                annexes: '',
                uterineCavity: '',
                douglasPouch: ''
            },
            diagnosis: [],
            recommendations: '',
            extraData: {
                platesSent: '',
                size30x40: '',
                size8x10: '',
                size14x14: '',
                size14x17: '',
                size18x24: '',
                odont: '',
                damagedPlates: '',
                withContrast: ''
            }
        },
        path_req: {},
        path_rep: {},
        emergency: { name: '', relation: '', phone: '', address: '' },
        evolution: {},
        consents: { signedFiles: [] as any[] },
        sessionId: queryParams.get('session') || null as string | null
    });

    const getSections = (): SectionDef[] => [
        { id: 'emergency', title: 'Contactos de emergencia', icon: <User size={18} /> },
        { id: 'anamnesis_002', title: 'CONSULTA EXTERNA - ANAMNESIS Y EF-002', icon: <FileText size={18} /> },
        { id: 'anamnesis', title: 'ANAMNESIS', icon: <Activity size={18} /> },
        { id: 'epicrisis', title: 'EPICRISIS', icon: <FileSignature size={18} /> },
        { id: 'inter_req', title: 'INTERCONSULTA - SOLICITUD', icon: <ClipboardList size={18} /> },
        { id: 'inter_rep', title: 'INTERCONSULTA - INFORME', icon: <FileText size={18} /> },
        { id: 'emerg_01', title: 'EMERGENCIA 01', icon: <AlertTriangle size={18} /> },
        { id: 'emerg_02', title: 'EMERGENCIA 02', icon: <AlertTriangle size={18} /> },
        { id: 'ref', title: 'REFERENCIA', icon: <ArrowRight size={18} /> },
        { id: 'counter_ref', title: 'CONTRARREFERENCIA', icon: <ArrowLeft size={18} /> },
        { id: 'img_req', title: 'IMAGENOLOGIA - SOLICITUD', icon: <Scan size={18} /> },
        { id: 'img_rep', title: 'IMAGENOLOGIA - INFORME', icon: <FileText size={18} /> },
        { id: 'path_req', title: 'HISTOPATOLOGIA - SOLICITUD', icon: <Microscope size={18} /> },
        { id: 'path_rep', title: 'HISTOPATOLOGIA - INFORME', icon: <FileText size={18} /> },
    ];

    const handleUpdateSection = (section: SectionKey, data: any) => {
        if (isReadOnly) return;
        setFormData(prev => ({ ...prev, [section]: data }));
        setSaveStatus('idle');
    };

    // Load patient data
    useEffect(() => {
        const fetchPatient = async () => {
            if (!patientId) return;
            try {
                const response = await api.get(`/users/patients/${patientId.trim()}`);
                setPatient(response.data?.data || response.data);
            } catch (error) { console.error('Error fetching patient:', error); }
        };
        fetchPatient();
    }, [patientId]);

    // Load existing record
    useEffect(() => {
        const fetchRecord = async () => {
            if (!patientId || !activeSpecialty) return;

            // If mode is 'new', we start fresh and don't look for today's record
            if (mode === 'new' && !recordId) {
                setLoading(false);
                return;
            }

            try {
                let existingRecord = null;
                if (recordId) {
                    const res = await api.get(`/general-records/${recordId}`);
                    existingRecord = res.data;
                } else {
                    // This case is for when we are editing the "current" visit (e.g. from a link)
                    const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
                    const res = await api.get(`/general-records/today/${patientId}/${userId}/${activeSpecialty.id}`);
                    existingRecord = res.data;
                }

                if (existingRecord) {
                    setCurrentRecordId(existingRecord.id);
                    currentRecordIdRef.current = existingRecord.id;
                    const dbData = existingRecord.data || {};
                    setFormData(prev => ({
                        ...prev,
                        ...dbData,
                        sessionId: dbData.sessionId || prev.sessionId
                    }));
                    // If we have a recordId in the URL, we are likely viewing an old record
                    if (recordId) setIsReadOnly(true);
                } else if (mode === 'new') {
                    // Pre-fill Emergency Contact if it's a new record
                    // 1. Try to fetch the most recent previous record for this patient/specialty
                    try {
                        const historyRes = await api.get(`/general-records/patient/${patientId}`, {
                            params: { specialtyId: activeSpecialty.id }
                        });
                        const previousRecords = historyRes.data || [];
                        if (previousRecords.length > 0) {
                            const lastRecordData = previousRecords[0].data || {};
                            if (lastRecordData.emergency?.name) {
                                setFormData(prev => ({
                                    ...prev,
                                    emergency: lastRecordData.emergency
                                }));
                                return; // Found it in history
                            }
                        }
                    } catch (err) { console.error('Error fetching history for pre-fill:', err); }

                    // 2. Fallback to onboarding data if available (after patient is loaded)
                    // We'll handle this in another useEffect or once patient data is available
                }
            } catch (error) { console.error('Error fetching record:', error); }
            finally { setLoading(false); }
        };
        fetchRecord();
    }, [patientId, recordId, activeSpecialty, mode]);

    // Fallback pre-fill from patient onboarding data
    useEffect(() => {
        if (mode === 'new' && patient?.onboardingData?.emergency && !formData.emergency.name) {
            setFormData(prev => ({
                ...prev,
                emergency: patient.onboardingData.emergency
            }));
        }
    }, [patient, mode, formData.emergency.name]);

    const handleSaveAll = useCallback(async (isAuto = false) => {
        if (isSavingRef.current || !activeSpecialty || !patientId || isReadOnly) return;

        const userData = localStorage.getItem('user');
        if (!userData) return;
        const doctorId = JSON.parse(userData).id;

        isSavingRef.current = true;
        setSaving(true);
        setSaveStatus('saving');

        try {
            const payload = {
                id: currentRecordIdRef.current,
                patientId,
                doctorId,
                specialtyId: activeSpecialty.id,
                data: formData,
                forceNew: mode === 'new' && !currentRecordIdRef.current, // Follow aesthetic logic
            };

            const response = await api.post('/general-records/upsert', payload);
            if (response.data?.id) {
                setCurrentRecordId(response.data.id);
                currentRecordIdRef.current = response.data.id;
            }
            if (!isAuto) toast.success('Registro guardado');
            setSaveStatus('saved');
        } catch (error: any) {
            console.error('SAVE ERROR DETAILS:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
                payload: {
                    patientId,
                    doctorId,
                    specialtyId: activeSpecialty.id,
                }
            });
            setSaveStatus('error');
            if (!isAuto) toast.error('Error al guardar');
        } finally {
            isSavingRef.current = false;
            setSaving(false);
        }
    }, [activeSpecialty, patientId, isReadOnly, formData]);

    useEffect(() => {
        if (isReadOnly) return;
        const timer = setTimeout(() => handleSaveAll(true), 5000);
        return () => clearTimeout(timer);
    }, [formData, isReadOnly, handleSaveAll]);

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'anamnesis_002': return <GeneralAnamnesisForm readOnly={isReadOnly} data={formData.anamnesis_002} onChange={(d) => handleUpdateSection('anamnesis_002', d)} />;
            case 'anamnesis': return <GeneralAnamnesis003Form readOnly={isReadOnly} data={formData.anamnesis} onChange={(d) => handleUpdateSection('anamnesis', d)} />;
            case 'emergency': return <EmergencyContactForm readOnly={isReadOnly} data={formData.emergency} onChange={(d) => handleUpdateSection('emergency', d)} />;
            case 'consents': return <ConsentForm readOnly={isReadOnly} specialty="Medicina General" patientId={patientId || ''} recordId={currentRecordId} sessionId={formData.sessionId} data={formData.consents} onChange={(d) => handleUpdateSection('consents', d)} onUploadingChange={() => {}} />;
            case 'epicrisis': return <GeneralEpicrisisForm readOnly={isReadOnly} data={formData.epicrisis} onChange={(d) => handleUpdateSection('epicrisis', d)} />;
            case 'inter_req': return <GeneralInterconsultationRequestForm readOnly={isReadOnly} data={formData.inter_req} onChange={(d) => handleUpdateSection('inter_req', d)} />;
            case 'inter_rep': return <GeneralInterconsultationReportForm readOnly={isReadOnly} data={formData.inter_rep} onChange={(d) => handleUpdateSection('inter_rep', d)} />;
            case 'emerg_01': return <GeneralEmergency01Form readOnly={isReadOnly} data={formData.emerg_01} onChange={(d) => handleUpdateSection('emerg_01', d)} patient={patient} />;
            case 'ref': return <GeneralReferenceForm readOnly={isReadOnly} data={formData.ref} onChange={(d) => handleUpdateSection('ref', d)} />;
            case 'counter_ref': return <GeneralCounterReferenceForm readOnly={isReadOnly} data={formData.counter_ref} onChange={(d) => handleUpdateSection('counter_ref', d)} />;
            case 'img_req': return <GeneralImagingRequestForm readOnly={isReadOnly} data={formData.img_req} onChange={(d) => handleUpdateSection('img_req', d)} />;
            case 'img_rep': return <GeneralImagingReportForm readOnly={isReadOnly} data={formData.img_rep} onChange={(d) => handleUpdateSection('img_rep', d)} patientId={patientId || ''} specialty="Medicina General" recordId={currentRecordId} sessionId={formData.sessionId} />;
            default: 
                const section = getSections().find(s => s.id === activeSection);
                return (
                    <div className="p-8 text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #e2e8f0' }}>
                        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '50%', marginBottom: '16px', color: '#94a3b8' }}>
                            {section?.icon && React.cloneElement(section.icon as React.ReactElement<any>, { size: 48 })}
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>{section?.title}</h3>
                        <p style={{ color: '#64748b' }}>Esta sección está en desarrollo para la especialidad de Medicina General.</p>
                    </div>
                );
        }
    };

    const getAge = (birthDate: any) => {
        if (!birthDate) return 'N/A';
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
        return age;
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '16px' }}>
                <Loader2 className="animate-spin text-primary" size={48} style={{ color: '#3b82f6' }} />
                <p style={{ color: '#64748b', fontWeight: '500' }}>Cargando historia clínica...</p>
            </div>
        );
    }

    return (
        <div className="management-container" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Toaster position="top-right" />
            
            {/* Header style identical to Aesthetic */}
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
                    <div style={{ textAlign: 'right' }}><div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Especialidad</div><div style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6' }}>{activeSpecialty?.name || 'Medicina General'}</div></div>
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

            {/* Layout identical to Aesthetic */}
            <div style={{ display: 'flex', gap: '24px', flex: 1, alignItems: 'flex-start' }}>
                <div style={{ 
                    width: '300px', 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px', 
                    padding: '16px', 
                    flexShrink: 0, 
                    position: 'sticky', 
                    top: '110px', 
                    maxHeight: 'calc(100vh - 140px)', 
                    overflowY: 'auto',
                    scrollbarWidth: 'thin'
                }}>
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
        </div>
    );
}
