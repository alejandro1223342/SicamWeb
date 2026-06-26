import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { User, ShieldAlert, Syringe, AlertTriangle, FileText, FileSignature, Loader2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import CabinConsultationReasonForm from '../components/medical-history/CabinConsultationReasonForm';
import CabinEmergencyContactForm from '../components/medical-history/CabinEmergencyContactForm';
import CabinFamilyHistoryForm from '../components/medical-history/CabinFamilyHistoryForm';
import CabinRecentVaccinesForm from '../components/medical-history/CabinRecentVaccinesForm';
import CabinRiskFactorsForm from '../components/medical-history/CabinRiskFactorsForm';
import CabinNovedadesForm from '../components/medical-history/CabinNovedadesForm';
import CabinGalleryForm from '../components/medical-history/CabinGalleryForm';
import { useSpecialty } from '../context/SpecialtyContext';
import api from '../api';
import toast from 'react-hot-toast';
import { CheckCircle, CloudUpload, Save } from 'lucide-react';
import ConfirmModal from '../components/common/ConfirmModal';

type SectionKey = 'reason' | 'emergency' | 'family' | 'vaccines' | 'risks' | 'novedades' | 'gallery';

interface SectionDef {
    id: SectionKey;
    title: string;
    icon: React.ReactNode;
}

export default function CabinHistory() {
    const { patientId, recordId } = useParams<{ patientId: string, recordId?: string }>();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');
    const navigate = useNavigate();

    const { specialtyId: urlSpecialtyId } = useParams<{ specialtyId: string }>();
    const { activeSpecialty, getActiveSpecialtyId } = useSpecialty(); 
    const [activeSection, setActiveSection] = useState<SectionKey>('reason');
    const [patient, setPatient] = useState<any>(null);
    
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [currentRecordId, setCurrentRecordId] = useState<string | null>(recordId || null);
    const currentRecordIdRef = useRef<string | null>(recordId || null);
    const isSavingRef = useRef(false);
    const [isGlobalUploading, setIsGlobalUploading] = useState(false);

    const sections: SectionDef[] = [
        { id: 'reason', title: 'Motivo de la consulta', icon: <FileSignature size={18} /> },
        { id: 'emergency', title: 'Contactos de emergencia', icon: <User size={18} /> },
        { id: 'family', title: 'Antecedentes familiares', icon: <ShieldAlert size={18} /> },
        { id: 'vaccines', title: 'Vacunas recientes', icon: <Syringe size={18} /> },
        { id: 'risks', title: 'Factores de riesgo', icon: <AlertTriangle size={18} /> },
        { id: 'novedades', title: 'Novedades y Observaciones', icon: <FileText size={18} /> },
        { id: 'gallery', title: 'Galería Fotográfica', icon: <ImageIcon size={18} /> },
    ];

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

    useEffect(() => {
        currentRecordIdRef.current = currentRecordId;
    }, [currentRecordId]);

    const initialEmptyState = {
        reason: { reason: '', currentIllness: '' },
        emergency: { name: '', relation: '', phone: '', address: '' },
        family: { selected: [] as string[], allergyDetails: '' },
        vaccines: { selected: [] as string[], details: '' },
        risks: { selected: [] as string[], allergyDetails: '' },
        novedades: { novedades: '' },
        gallery: [] as any[],
        sessionId: queryParams.get('session') || (null as string | null)
    };

    const [formData, setFormData] = useState(initialEmptyState);
    const [isDirty, setIsDirty] = useState(false);

    const handleUpdateSection = (section: SectionKey, data: any) => {
        if (isReadOnly) return;
        setIsDirty(true);
        setFormData(prev => ({ ...prev, [section]: data }));
    };

    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (mode === 'new' && patientId && activeSpecialty?.id && !hasFetchedRef.current) {
            hasFetchedRef.current = true;
            const fetchPreviousRecord = async () => {
                try {
                    const targetId = urlSpecialtyId || getActiveSpecialtyId();
                    const response = await api.get(`/medical-records/patient/${patientId}`, {
                        params: { specialtyId: targetId }
                    });

                    const history = response.data?.data || response.data || [];
                    const lastRecord = Array.isArray(history) ? history[0] : null;

                    let fallbackData = { ...initialEmptyState };

                    try {
                        const cleanId = patientId.trim();
                        const patientRes = await api.get(`/users/patients/${cleanId}`);
                        const pData = patientRes.data?.data || patientRes.data;
                        setPatient(pData);
                        
                        if (pData?.onboardingData) {
                            fallbackData.family = Array.isArray(pData.onboardingData.family) 
                                ? { selected: pData.onboardingData.family, allergyDetails: '' } 
                                : (pData.onboardingData.family || fallbackData.family);
                            
                            fallbackData.vaccines = Array.isArray(pData.onboardingData.vaccines)
                                ? { selected: pData.onboardingData.vaccines, details: '' }
                                : (pData.onboardingData.vaccines || fallbackData.vaccines);
                                
                            fallbackData.risks = Array.isArray(pData.onboardingData.risks)
                                ? { selected: pData.onboardingData.risks, allergyDetails: '' }
                                : (pData.onboardingData.risks || fallbackData.risks);
                                
                            fallbackData.emergency = pData.onboardingData.emergency || fallbackData.emergency;
                        }
                    } catch (err) {
                        console.error('Error fetching patient basic info:', err);
                    }

                    if (lastRecord) {
                        if (lastRecord.data) {
                            fallbackData = {
                                ...fallbackData,
                                reason: { reason: '', currentIllness: '' }, 
                                novedades: { novedades: '' }, 
                                gallery: [], 
                                family: Array.isArray(lastRecord.data.family) ? { selected: lastRecord.data.family, allergyDetails: '' } : (lastRecord.data.family || fallbackData.family),
                                vaccines: Array.isArray(lastRecord.data.vaccines) ? { selected: lastRecord.data.vaccines, details: '' } : (lastRecord.data.vaccines || fallbackData.vaccines),
                                risks: Array.isArray(lastRecord.data.risks) ? { selected: lastRecord.data.risks, allergyDetails: '' } : (lastRecord.data.risks || fallbackData.risks),
                                emergency: lastRecord.data.emergency || fallbackData.emergency,
                            };
                        }
                    }

                    setFormData(fallbackData);
                    setIsDirty(false);

                    // Removed initial auto-save logic per user request

                } catch (error) {
                    console.error('Error fetching previous record:', error);
                }
            };
            fetchPreviousRecord();
            setCurrentRecordId(null);
            currentRecordIdRef.current = null;
        } else if (recordId && !hasFetchedRef.current) {
            hasFetchedRef.current = true;
            setIsReadOnly(true);
            const fetchRecord = async () => {
                try {
                    const response = await api.get(`/medical-records/${recordId}`);
                    const dbRecord = response.data;
                    console.log('--- READ MODE FETCHED RECORD ---', dbRecord);
                    
                    const cleanId = patientId?.trim() || '';
                    const patientRes = await api.get(`/users/patients/${cleanId}`);
                    const pData = patientRes.data?.data || patientRes.data;
                    setPatient(pData);
                    
                    if (dbRecord && dbRecord.data) {
                        console.log('--- PARSED DATA ---', dbRecord.data);
                        setFormData({
                            ...initialEmptyState,
                            ...dbRecord.data,
                            sessionId: dbRecord.data.sessionId || null
                        });
                    } else {
                        console.warn('--- DB RECORD OR DATA MISSING ---');
                    }
                } catch (error) {
                    console.error('Error fetching record:', error);
                    toast.error('Error al cargar la historia clÃ­nica');
                }
            };
            fetchRecord();
        }
    }, [patientId, recordId, mode, activeSpecialty, urlSpecialtyId, getActiveSpecialtyId]);

    const saveHistory = useCallback(async (isAutoSave = false) => {
        if (!patientId || isReadOnly || isSavingRef.current || isGlobalUploading) return;
        
        try {
            isSavingRef.current = true;
            if (!isAutoSave) setSaveStatus('saving');
            
            const userData = localStorage.getItem('user');
            if (!userData) throw new Error('No user data');
            const user = JSON.parse(userData);

            const targetId = urlSpecialtyId || getActiveSpecialtyId();
            if (!targetId) throw new Error('No specialty selected');

            const currentData = { ...formData };
            const payload = {
                id: currentRecordIdRef.current,
                forceNew: mode === 'new' && !currentRecordIdRef.current,
                patientId,
                doctorId: user.id,
                specialtyId: targetId,
                data: currentData,
                diagnosis: currentData.reason?.currentIllness || 'Atención en Cabina'
            };

            const response = await api.post('/medical-records/upsert', payload);
            const savedRecord = response.data?.data || response.data;

            if (savedRecord?.id && !currentRecordIdRef.current) {
                setCurrentRecordId(savedRecord.id);
                currentRecordIdRef.current = savedRecord.id;
                
                if (mode === 'new') {
                    navigate(`/dashboard/specialty/${targetId}/cabin-history/${patientId}/${savedRecord.id}?mode=edit`, { replace: true });
                }
            }

            setIsDirty(false);
            if (!isAutoSave) {
                setSaveStatus('saved');
                toast.success('Historia de Cabina guardada correctamente');
                setTimeout(() => setSaveStatus('idle'), 3000);
            }
        } catch (error) {
            console.error('Error saving history:', error);
            if (!isAutoSave) {
                setSaveStatus('error');
                toast.error('Error al guardar la historia');
                setTimeout(() => setSaveStatus('idle'), 3000);
            }
        } finally {
            isSavingRef.current = false;
        }
    }, [patientId, formData, isReadOnly, urlSpecialtyId, getActiveSpecialtyId, isGlobalUploading]);

    const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isDirty && !isReadOnly && !isGlobalUploading) {
                // saveHistory(true);
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [isDirty, isReadOnly, saveHistory, isGlobalUploading]);

    const handleGoBack = () => {
        if (isDirty && !isReadOnly && !isGlobalUploading) {
            setShowDiscardConfirm(true);
        } else {
            navigate(-1);
        }
    };

    if (!patient) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <Loader2 className="animate-spin text-primary" size={48} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                <p className="text-muted">Cargando información del paciente...</p>
            </div>
        );
    }

    return (
        <div className="management-container" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'sticky', top: '0', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button onClick={handleGoBack} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', backgroundColor: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer' }}><ArrowLeft size={20} /></button>
                    <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontSize: '18px', fontWeight: '700' }}>{patient?.firstName?.[0] || ''}{patient?.lastName?.[0] || ''}</div>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0', color: '#1e293b' }}>{patient?.firstName} {patient?.lastName}</h2>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '4px', fontSize: '13px', color: '#64748b' }}>
                            <span><b>CI:</b> {patient?.idNumber || 'N/A'}</span>
                            <span><b>Edad:</b> {getAge(patient?.birthDate)} años</span>
                            <span><b>Teléfono:</b> {patient?.phone || 'N/A'}</span>
                            {isReadOnly && <span style={{ marginLeft: '10px', padding: '2px 8px', background: '#fef3c7', color: '#d97706', borderRadius: '12px', fontWeight: '600' }}>Modo Lectura</span>}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ textAlign: 'right' }}><div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Especialidad</div><div style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6' }}>Cabina</div></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px' }}>
                            {isGlobalUploading ? (
                                <><CloudUpload size={14} className="animate-bounce" color="#3b82f6" /> Subiendo...</>
                            ) : saveStatus === 'saving' ? (
                                <><Loader2 className="animate-spin" size={14} /> Guardando...</>
                            ) : saveStatus === 'saved' ? (
                                <><CheckCircle size={14} color="#22c55e" /> Guardado</>
                            ) : saveStatus === 'error' ? (
                                <span style={{ color: '#ef4444' }}>Error al guardar</span>
                            ) : isDirty ? (
                                <span style={{ color: '#f59e0b' }}>Cambios sin guardar</span>
                            ) : (
                                <><CloudUpload size={14} /> Todo guardado</>
                            )}
                        </div>
                        <button onClick={() => saveHistory(false)} disabled={saveStatus === 'saving' || isGlobalUploading || isReadOnly} style={{ padding: '0 16px', height: '36px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', display: isReadOnly ? 'none' : 'flex', alignItems: 'center', gap: '8px' }}>
                            {saveStatus === 'saving' || isGlobalUploading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Guardar
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', flex: 1, alignItems: 'flex-start' }}>
                <div style={{ width: '280px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', flexShrink: 0, position: 'sticky', top: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {sections.map((section) => (
                            <button key={section.id} onClick={() => setActiveSection(section.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: activeSection === section.id ? '#eff6ff' : 'transparent', color: activeSection === section.id ? '#1d4ed8' : '#475569', fontWeight: '600', cursor: 'pointer', textAlign: 'left' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>{section.icon} {section.title}</div>
                            </button>
                        ))}
                    </div>
                </div>
                <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '32px', minHeight: '500px' }}>
                    {activeSection === 'reason' && <CabinConsultationReasonForm data={formData.reason} onChange={(data) => handleUpdateSection('reason', data)} readOnly={isReadOnly} />}
                    {activeSection === 'emergency' && <CabinEmergencyContactForm data={formData.emergency} onChange={(data) => handleUpdateSection('emergency', data)} readOnly={isReadOnly} />}
                    {activeSection === 'family' && <CabinFamilyHistoryForm data={formData.family} onChange={(data) => handleUpdateSection('family', data)} readOnly={isReadOnly} />}
                    {activeSection === 'vaccines' && <CabinRecentVaccinesForm data={formData.vaccines} onChange={(data) => handleUpdateSection('vaccines', data)} readOnly={isReadOnly} />}
                    {activeSection === 'risks' && <CabinRiskFactorsForm data={formData.risks} onChange={(data) => handleUpdateSection('risks', data)} readOnly={isReadOnly} />}
                    {activeSection === 'novedades' && <CabinNovedadesForm data={formData.novedades} onChange={(data) => handleUpdateSection('novedades', data)} readOnly={isReadOnly} />}
                    {activeSection === 'gallery' && <CabinGalleryForm data={formData.gallery} onChange={(data) => handleUpdateSection('gallery', data)} onUploadingChange={setIsGlobalUploading} patientId={patientId || ''} recordId={currentRecordId} sessionId={formData.sessionId} readOnly={isReadOnly} />}
                </div>
            </div>
            
            <ConfirmModal
                isOpen={showDiscardConfirm}
                title="Cambios sin guardar"
                message="Tienes cambios en esta historia clínica que no han sido guardados. ¿Estás seguro de que deseas salir? Las imágenes subidas serán eliminadas automáticamente."
                confirmText="Salir sin guardar"
                cancelText="Quedarme aquí"
                onConfirm={() => navigate(-1)}
                onCancel={() => setShowDiscardConfirm(false)}
            />
        </div>
    );
}
