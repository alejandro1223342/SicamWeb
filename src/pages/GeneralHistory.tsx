import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
    Save, FileText, Activity, Search, 
    FileSignature, Loader2, ArrowLeft, CheckCircle, CloudUpload 
} from 'lucide-react';
import { useSpecialty } from '../context/SpecialtyContext';
import api from '../api';
import toast, { Toaster } from 'react-hot-toast';

// Components
import GeneralAnamnesisForm from '../components/medical-history/general/GeneralAnamnesisForm';
import GeneralVitalsForm from '../components/medical-history/general/GeneralVitalsForm';
import ConsentForm from '../components/medical-history/ConsentForm';

type SectionKey = 'anamnesis' | 'vitals' | 'epicrisis' | 'emergency' | 'evolution' | 'consents';

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
    const [activeSection, setActiveSection] = useState<SectionKey>('anamnesis');
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [currentRecordId, setCurrentRecordId] = useState<string | null>(recordId || null);
    const currentRecordIdRef = useRef<string | null>(recordId || null);
    const isSavingRef = useRef(false);

    const [formData, setFormData] = useState({
        anamnesis: {},
        vitals: {},
        epicrisis: {},
        emergency: {},
        evolution: {},
        consents: { signedFiles: [] as any[] },
        sessionId: queryParams.get('session') || null as string | null
    });

    const getSections = (): SectionDef[] => [
        { id: 'anamnesis', title: 'Anamnesis', icon: <FileText size={18} /> },
        { id: 'vitals', title: 'Signos Vitales', icon: <Activity size={18} /> },
        { id: 'epicrisis', title: 'Epicrisis', icon: <FileSignature size={18} /> },
        { id: 'emergency', title: 'Emergencia', icon: <Search size={18} /> },
        { id: 'evolution', title: 'Evolución', icon: <Activity size={18} /> },
        { id: 'consents', title: 'Consentimientos', icon: <FileSignature size={18} /> },
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
                    setFormData(prev => ({
                        ...prev,
                        ...(existingRecord.data || {}),
                        sessionId: existingRecord.data?.sessionId || prev.sessionId
                    }));
                    // If we have a recordId in the URL, we are likely viewing an old record
                    if (recordId) setIsReadOnly(true);
                }
            } catch (error) { console.error('Error fetching record:', error); }
            finally { setLoading(false); }
        };
        fetchRecord();
    }, [patientId, recordId, activeSpecialty, mode]);

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
            case 'anamnesis': return <GeneralAnamnesisForm readOnly={isReadOnly} data={formData.anamnesis} onChange={(d) => handleUpdateSection('anamnesis', d)} />;
            case 'vitals': return <GeneralVitalsForm readOnly={isReadOnly} data={formData.vitals} onChange={(d) => handleUpdateSection('vitals', d)} />;
            case 'consents': return <ConsentForm readOnly={isReadOnly} specialty="Medicina General" patientId={patientId || ''} recordId={currentRecordId} sessionId={formData.sessionId} data={formData.consents} onChange={(d) => handleUpdateSection('consents', d)} onUploadingChange={() => {}} />;
            default: return <div className="p-8 text-center text-gray-500">Sección en desarrollo...</div>;
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
        </div>
    );
}
