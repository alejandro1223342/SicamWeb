import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
    Save, User, Loader2, ArrowLeft, FileText, Layers, Ruler, 
    Activity, CheckCircle, CloudUpload, Briefcase, Utensils, 
    AlertCircle, Dumbbell, Scale, ClipboardList 
} from 'lucide-react';
import EmergencyContactForm from '../components/medical-history/EmergencyContactForm';
import MainDataForm from '../components/medical-history/MainDataForm';
import WorkActivityForm from '../components/medical-history/WorkActivityForm';
import DietaryHabitsForm from '../components/medical-history/DietaryHabitsForm';
import ToxicHabitsForm from '../components/medical-history/ToxicHabitsForm';
import PhysicalActivityForm from '../components/medical-history/PhysicalActivityForm';
import BasicMeasurementsForm from '../components/medical-history/BasicMeasurementsForm';
import BioimpedanceForm from '../components/medical-history/BioimpedanceForm';
import PerimetersForm from '../components/medical-history/PerimetersForm';
import SkinfoldsForm from '../components/medical-history/SkinfoldsForm';
import OtherNutritionDataForm from '../components/medical-history/OtherNutritionDataForm';
import MealPlanForm from '../components/medical-history/MealPlanForm';
import { useSpecialty } from '../context/SpecialtyContext';
import api from '../api';
import toast from 'react-hot-toast';

type SectionKey = 'emergency' | 'main' | 'work' | 'habits' | 'toxic' | 'physical' | 'measurements' | 'bioimpedance' | 'perimeters' | 'skinfolds' | 'other' | 'mealPlan';

interface SectionDef {
    id: SectionKey;
    title: string;
    icon: React.ReactNode;
}

export default function NutritionHistory() {
    const { patientId, recordId } = useParams<{ patientId: string, recordId?: string }>();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');
    const navigate = useNavigate();
    
    const { activeSpecialty } = useSpecialty(); 
    const [activeSection, setActiveSection] = useState<SectionKey>('main');
    const [patient, setPatient] = useState<any>(null);
    const [toxicFrequencies, setToxicFrequencies] = useState<string[]>([]);
    const [mealTimes, setMealTimes] = useState<string[]>([]);
    const [foodGroups, setFoodGroups] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [currentRecordId, setCurrentRecordId] = useState<string | null>(recordId || null);
    const currentRecordIdRef = useRef<string | null>(recordId || null);
    const isSavingRef = useRef(false);
    const [isDirty, setIsDirty] = useState(false);

    const getSections = useCallback((): SectionDef[] => {
        return [
            { id: 'emergency', title: 'Contactos de emergencia', icon: <User size={18} /> },
            { id: 'main', title: 'Datos principales', icon: <FileText size={18} /> },
            { id: 'work', title: 'Actividad laboral', icon: <Briefcase size={18} /> },
            { id: 'habits', title: 'Hábitos dietéticos', icon: <Utensils size={18} /> },
            { id: 'toxic', title: 'Hábitos tóxicos', icon: <AlertCircle size={18} /> },
            { id: 'physical', title: 'Actividad física', icon: <Dumbbell size={18} /> },
            { id: 'measurements', title: 'Mediciones básicas', icon: <Scale size={18} /> },
            { id: 'bioimpedance', title: 'Bioimpedancia', icon: <Activity size={18} /> },
            { id: 'perimeters', title: 'Perímetros', icon: <Ruler size={18} /> },
            { id: 'skinfolds', title: 'Pliegues', icon: <Layers size={18} /> },
            { id: 'other', title: 'Otros datos', icon: <ClipboardList size={18} /> },
            { id: 'mealPlan', title: 'Plan Alimentación', icon: <Utensils size={18} /> },
        ];
    }, []);

    useEffect(() => {
        currentRecordIdRef.current = currentRecordId;
    }, [currentRecordId]);

    const [formData, setFormData] = useState({
        main: {
            reason: '',
            bloodType: '',
            surgeries: '',
            allergies: '',
            diagnosis: '',
            treatment: '',
            familyHistory: ''
        },
        work: {
            activity: '',
            description: '',
            schedule: '',
            stressLevel: ''
        },
        habits: {
            unwantedFoods: '',
            favoriteFoods: '',
            breakfastLocation: '',
            breakfastTime: '',
            lunchLocation: '',
            lunchTime: '',
            dinnerLocation: '',
            dinnerTime: ''
        },
        toxic: {
            smokingFrequency: '',
            smokingAmount: '',
            alcoholFrequency: '',
            alcoholAmount: '',
            drugsFrequency: '',
            drugsAmount: '',
            drugsType: ''
        },
        physical: {
            activities: ''
        },
        measurements: {
            height: '',
            weight: '',
            isPregnant: ''
        },
        bioimpedance: {
            totalFat: '',
            upperFat: '',
            lowerFat: '',
            visceralFat: '',
            fatFreeMass: '',
            muscleMass: '',
            boneWeight: '',
            bodyWater: '',
            metabolicAge: ''
        },
        perimeters: {
            cephalic: '',
            neck: '',
            midArmRelaxed: '',
            midArmContracted: '',
            forearm: '',
            wrist: '',
            mesosternal: '',
            umbilical: '',
            waist: '',
            hip: '',
            thigh1cm: '',
            midThigh: '',
            calf: '',
            ankle: ''
        },
        skinfolds: {
            subscapular: '',
            triceps: '',
            biceps: '',
            iliacCrest: '',
            supraspinal: '',
            abdominal: '',
            frontThigh: '',
            medialCalf: '',
            medialAxillary: '',
            pectoral: ''
        },
        other: {
            giSymptoms: '',
            physicalSigns: '',
            foodAllergies: '',
            foodIntolerances: '',
            mealCount: '',
            mealSchedules: '',
            habitualDiet: '',
            foodFeelings: ''
        },
        mealPlan: {
            summary: {
                height: '',
                currentWeight: '',
                minWeight: '',
                maxWeight: '',
                idealWeight: '',
                bmi: '',
                obesityType: '',
                recommendedCalories: '',
                nextControlDate: ''
            },
            details: [] as any[]
        },
        emergency: { name: '', relation: '', phone: '', address: '' },
        sessionId: queryParams.get('session') || null as string | null
    });

    const handleUpdateSection = (section: SectionKey, data: any) => {
        if (isReadOnly) return;
        setIsDirty(true);
        setFormData(prev => ({ ...prev, [section]: data }));
    };

    useEffect(() => {
        const fetchPreviousRecord = async () => {
            if (mode === 'new' && patientId && activeSpecialty?.id) {
                try {
                    const response = await api.get(`/medical-records/patient/${patientId}?specialtyId=${activeSpecialty.id}`);
                    const history = response.data;
                    const prevRes = Array.isArray(history) ? history[0] : null;

                    // Datos de respaldo desde Onboarding
                    let fallbackData = {
                        emergency: { name: '', relation: '', phone: '', address: '' },
                        family: [] as string[],
                        vaccines: [] as string[],
                        risks: [] as string[]
                    };

                    if (!prevRes) {
                        try {
                            const cleanId = patientId.trim();
                            const patientRes = await api.get(`/users/patients/${cleanId}`);
                            const patientInfo = patientRes.data?.data || patientRes.data;
                            if (patientInfo?.onboardingData) {
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

                    const prevData = prevRes?.data || {};

                    setFormData({
                        main: {
                            reason: prevData.main?.reason || '',
                            bloodType: patient?.bloodType || prevData.main?.bloodType || '',
                            surgeries: prevData.main?.surgeries || '',
                            allergies: prevData.main?.allergies || '',
                            diagnosis: '',
                            treatment: '',
                            familyHistory: prevData.main?.familyHistory || fallbackData.family.join(', ')
                        },
                        work: {
                            activity: patient?.jobActivity || prevData.work?.activity || '',
                            description: patient?.jobDescription || prevData.work?.description || '',
                            schedule: patient?.jobSchedule || prevData.work?.schedule || '',
                            stressLevel: patient?.stressLevel || prevData.work?.stressLevel || ''
                        },
                        habits: prevData.habits || { unwantedFoods: '', favoriteFoods: '', breakfastLocation: '', breakfastTime: '', lunchLocation: '', lunchTime: '', dinnerLocation: '', dinnerTime: '' },
                        toxic: prevData.toxic || { smokingFrequency: '', smokingAmount: '', alcoholFrequency: '', alcoholAmount: '', drugsFrequency: '', drugsAmount: '', drugsType: '' },
                        physical: prevData.physical || { activities: '' },
                        measurements: { height: prevData.measurements?.height || '', weight: '', isPregnant: prevData.measurements?.isPregnant || '' },
                        bioimpedance: { totalFat: '', upperFat: '', lowerFat: '', visceralFat: '', fatFreeMass: '', muscleMass: '', boneWeight: '', bodyWater: '', metabolicAge: '' },
                        perimeters: { cephalic: '', neck: '', midArmRelaxed: '', midArmContracted: '', forearm: '', wrist: '', mesosternal: '', umbilical: '', waist: '', hip: '', thigh1cm: '', midThigh: '', calf: '', ankle: '' },
                        skinfolds: { subscapular: '', triceps: '', biceps: '', iliacCrest: '', supraspinal: '', abdominal: '', frontThigh: '', medialCalf: '', medialAxillary: '', pectoral: '' },
                        other: prevData.other || { giSymptoms: '', physicalSigns: '', foodAllergies: '', foodIntolerances: '', mealCount: '', mealSchedules: '', habitualDiet: '', foodFeelings: '' },
                        mealPlan: {
                            summary: { height: prevData.measurements?.height || '', currentWeight: '', minWeight: '', maxWeight: '', idealWeight: '', bmi: '', obesityType: '', recommendedCalories: '', nextControlDate: '' },
                            details: []
                        },
                        emergency: prevData.emergency || fallbackData.emergency,
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
    }, [mode, patientId, activeSpecialty, patient?.bloodType, patient?.jobActivity, patient?.jobDescription, patient?.jobSchedule, patient?.stressLevel]);

    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                // Fetch Toxic Habit Frequencies
                const toxicResp = await api.get('/catalogs/type/TOXIC_HABIT_FREQUENCY');
                setToxicFrequencies((toxicResp.data || []).map((item: any) => item.name));

                // Fetch Meal Times
                const mealResp = await api.get('/catalogs/type/MEAL_TIME');
                setMealTimes((mealResp.data || []).map((item: any) => item.name));

                // Fetch Food Groups
                const foodResp = await api.get('/catalogs/type/FOOD_GROUP');
                setFoodGroups((foodResp.data || []).map((item: any) => item.name));
            } catch (error) { console.error('Error fetching catalogs:', error); }
        };

        const fetchPatient = async (id: string) => {
            if (!id || id === 'generic') return;
            try {
                const response = await api.get(`/users/patients/${id.trim()}`);
                const pData = response.data?.data || response.data;
                setPatient(pData);
                if (pData?.bloodType) {
                    setFormData(prev => ({ 
                        ...prev, 
                        main: { ...prev.main, bloodType: pData.bloodType },
                        work: {
                            ...prev.work,
                            activity: pData.jobActivity || prev.work.activity,
                            description: pData.jobDescription || prev.work.description,
                            schedule: pData.jobSchedule || prev.work.schedule,
                            stressLevel: pData.stressLevel || prev.work.stressLevel
                        }
                    }));
                }
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
                        main: dbData.data?.main || prev.main,
                        work: dbData.data?.work || prev.work,
                        habits: dbData.data?.habits || prev.habits,
                        toxic: dbData.data?.toxic || prev.toxic,
                        physical: dbData.data?.physical || prev.physical,
                        measurements: dbData.data?.measurements || prev.measurements,
                        bioimpedance: dbData.data?.bioimpedance || prev.bioimpedance,
                        perimeters: dbData.data?.perimeters || prev.perimeters,
                        skinfolds: dbData.data?.skinfolds || prev.skinfolds,
                        other: dbData.data?.other || prev.other,
                        mealPlan: dbData.data?.mealPlan || prev.mealPlan,
                        emergency: dbData.data?.emergency || prev.emergency,
                        sessionId: dbData.data?.sessionId || prev.sessionId
                    }));
                    if (dbData.patient) {
                        setPatient((prev: any) => ({ ...prev, ...dbData.patient }));
                        setFormData(prev => ({ 
                            ...prev, 
                            main: { ...prev.main, bloodType: dbData.patient.bloodType || prev.main.bloodType },
                            work: {
                                ...prev.work,
                                activity: dbData.patient.jobActivity || prev.work.activity,
                                description: dbData.patient.jobDescription || prev.work.description,
                                schedule: dbData.patient.jobSchedule || prev.work.schedule,
                                stressLevel: dbData.patient.stressLevel || prev.work.stressLevel
                            }
                        }));
                    }
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
        fetchCatalogs();
    }, [patientId, recordId, mode]);

    const handleSaveAll = useCallback(async (isAuto = false) => {
        if (isSavingRef.current || !activeSpecialty || !patientId || patientId === 'generic' || isReadOnly) return;
        
        const userData = localStorage.getItem('user');
        if (!userData) return;
        const doctorId = JSON.parse(userData).id;

        isSavingRef.current = true;
        setSaving(true);
        setSaveStatus('saving');

        try {
            // Update patient profile fields if changed
            const profileUpdates: any = {};
            if (formData.main.bloodType !== patient?.bloodType) profileUpdates.bloodType = formData.main.bloodType;
            if (formData.work.activity !== patient?.jobActivity) profileUpdates.jobActivity = formData.work.activity;
            if (formData.work.description !== patient?.jobDescription) profileUpdates.jobDescription = formData.work.description;
            if (formData.work.schedule !== patient?.jobSchedule) profileUpdates.jobSchedule = formData.work.schedule;
            if (formData.work.stressLevel !== patient?.stressLevel) profileUpdates.stressLevel = formData.work.stressLevel;

            if (Object.keys(profileUpdates).length > 0) {
                await api.patch(`/users/patients/${patientId}`, profileUpdates);
                setPatient((prev: any) => ({ ...prev, ...profileUpdates }));
            }

            let mainDiagnosis = '';
            const payload = {
                id: currentRecordIdRef.current,
                forceNew: mode === 'new' && !currentRecordIdRef.current,
                patientId,
                doctorId,
                specialtyId: activeSpecialty.id,
                data: formData,
                diagnosis: mainDiagnosis
            };

            const response = await api.post('/medical-records/upsert', payload);
            const recordData = response.data;
            if (recordData?.id) {
                if (!currentRecordIdRef.current) {
                    setCurrentRecordId(recordData.id);
                    // Si estábamos en modo "nuevo", actualizamos la URL para que sea persistente PERO editable con mode=edit
                    if (mode === 'new') {
                        navigate(`/dashboard/specialty/${activeSpecialty.id}/nutrition-history/${patientId}/${recordData.id}?mode=edit`, { replace: true });
                    }
                }
                currentRecordIdRef.current = recordData.id;
            }
            if (!isAuto) toast.success('Historia clínica guardada');
            setSaveStatus('saved');
            setIsDirty(false);
            return recordData?.id;
        } catch (error: any) {
            setSaveStatus('error');
            if (!isAuto) toast.error('Error al guardar');
        } finally {
            isSavingRef.current = false;
            setSaving(false);
        }
    }, [activeSpecialty, patientId, isReadOnly, mode, formData, patient?.jobActivity, patient?.jobDescription, patient?.jobSchedule, patient?.stressLevel, patient?.bloodType]);

    useEffect(() => {
        if (isReadOnly || !isDirty) return;
        const timer = setTimeout(() => handleSaveAll(true), 5000);
        return () => clearTimeout(timer);
    }, [formData, isReadOnly, handleSaveAll, isDirty]);

    const renderActiveSection = () => {
        const commonProps = { readOnly: isReadOnly };
        switch (activeSection) {
            case 'main': return <MainDataForm {...commonProps} data={formData.main} onChange={(d: any) => handleUpdateSection('main', d)} />;
            case 'work': return <WorkActivityForm {...commonProps} data={formData.work} onChange={(d: any) => handleUpdateSection('work', d)} />;
            case 'habits': return <DietaryHabitsForm {...commonProps} data={formData.habits} onChange={(d: any) => handleUpdateSection('habits', d)} />;
            case 'toxic': return <ToxicHabitsForm {...commonProps} data={formData.toxic} frequencies={toxicFrequencies} onChange={(d: any) => handleUpdateSection('toxic', d)} />;
            case 'physical': return <PhysicalActivityForm {...commonProps} data={formData.physical} onChange={(d: any) => handleUpdateSection('physical', d)} />;
            case 'measurements': return <BasicMeasurementsForm {...commonProps} data={formData.measurements} onChange={(d: any) => handleUpdateSection('measurements', d)} />;
            case 'bioimpedance': return <BioimpedanceForm {...commonProps} data={formData.bioimpedance} onChange={(d: any) => handleUpdateSection('bioimpedance', d)} />;
            case 'perimeters': return <PerimetersForm {...commonProps} data={formData.perimeters} onChange={(d: any) => handleUpdateSection('perimeters', d)} />;
            case 'skinfolds': return <SkinfoldsForm {...commonProps} data={formData.skinfolds} onChange={(d: any) => handleUpdateSection('skinfolds', d)} />;
            case 'other': return <OtherNutritionDataForm {...commonProps} data={formData.other} onChange={(d: any) => handleUpdateSection('other', d)} />;
            case 'mealPlan': return <MealPlanForm {...commonProps} data={{ ...formData.mealPlan, id: currentRecordId || undefined }} mealTimes={mealTimes} foodGroupsList={foodGroups} onChange={(d: any) => handleUpdateSection('mealPlan', d)} />;
            case 'emergency': return <EmergencyContactForm {...commonProps} data={formData.emergency} onChange={(d: any) => handleUpdateSection('emergency', d)} />;
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
                    <div style={{ textAlign: 'right' }}><div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Especialidad</div><div style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>Nutrición</div></div>
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
        </div>
    );
}
