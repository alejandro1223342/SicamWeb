import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldAlert, Syringe, AlertTriangle, ArrowRight, ArrowLeft, CheckCircle2, Loader2, Contact } from 'lucide-react';
import PersonalInfoForm from '../../components/medical-history/PersonalInfoForm';
import EmergencyContactForm from '../../components/medical-history/EmergencyContactForm';
import FamilyHistoryForm from '../../components/medical-history/FamilyHistoryForm';
import RecentVaccinesForm from '../../components/medical-history/RecentVaccinesForm';
import RiskFactorsForm from '../../components/medical-history/RiskFactorsForm';
import api from '../../api';
import toast from 'react-hot-toast';

export default function OnboardingPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        personalInfo: { idNumber: '', gender: '', phone: '', birthDate: '' },
        emergency: { name: '', relation: '', phone: '', address: '' },
        family: { selected: [] as string[], allergyDetails: '' },
        vaccines: { selected: [] as string[], details: '' },
        risks: { selected: [] as string[], allergyDetails: '' },
    });

    const steps = [
        { id: 1, title: 'Información Personal', icon: <Contact size={20} /> },
        { id: 2, title: 'Contacto de Emergencia', icon: <User size={20} /> },
        { id: 3, title: 'Antecedentes Familiares', icon: <ShieldAlert size={20} /> },
        { id: 4, title: 'Vacunas Recientes', icon: <Syringe size={20} /> },
        { id: 5, title: 'Factores de Riesgo', icon: <AlertTriangle size={20} /> },
    ];

    const handleUpdate = (section: string, data: any) => {
        setFormData(prev => ({ ...prev, [section]: data }));
    };

    const validateStep = (currentStep: number) => {
        switch (currentStep) {
            case 1: {
                const { idNumber, gender, phone, birthDate } = formData.personalInfo;
                if (!idNumber || !gender || !phone || !birthDate) return false;
                if (idNumber.length !== 10) {
                    toast.error('La cédula debe tener exactamente 10 dígitos');
                    return false;
                }
                if (phone.length !== 10) {
                    toast.error('El teléfono debe tener exactamente 10 dígitos');
                    return false;
                }
                return true;
            }
            case 2:
                return formData.emergency.name && formData.emergency.phone;
            case 3:
                return formData.family.selected.length > 0;
            case 4:
                return formData.vaccines.selected.length > 0 || formData.vaccines.details.trim().length > 0;
            case 5:
                return true;
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (!validateStep(step)) {
            toast.error('Por favor completa los campos obligatorios antes de continuar');
            return;
        }
        if (step < 5) {
            setStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.patch('/users/patient/onboarding', formData);
            
            // Actualizar el localStorage con el nuevo estado
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            userData.onboardingCompleted = true;
            userData.onboardingData = formData;
            localStorage.setItem('user', JSON.stringify(userData));

            setIsSuccess(true);
            setTimeout(() => {
                toast.success('¡Perfil completado exitosamente!');
                navigate('/patient/clinics');
            }, 3000);
        } catch (error) {
            console.error('Error saving onboarding:', error);
            toast.error('Ocurrió un error al guardar tu información');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <PersonalInfoForm data={formData.personalInfo} onChange={(d) => handleUpdate('personalInfo', d)} />;
            case 2:
                return <EmergencyContactForm data={formData.emergency} onChange={(d) => handleUpdate('emergency', d)} />;
            case 3:
                return <FamilyHistoryForm data={formData.family} onChange={(d) => handleUpdate('family', d)} />;
            case 4:
                return <RecentVaccinesForm data={formData.vaccines} onChange={(d) => handleUpdate('vaccines', d)} />;
            case 5:
                return <RiskFactorsForm data={formData.risks} onChange={(d) => handleUpdate('risks', d)} />;
            default:
                return null;
        }
    };

    if (isSuccess) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <style>{`
                    @keyframes successIn {
                        from { opacity: 0; transform: scale(0.9); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    @keyframes checkBounce {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                `}</style>
                <div style={{ 
                    maxWidth: '500px', width: '100%', backgroundColor: 'white', borderRadius: '24px', padding: '48px', 
                    textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', animation: 'successIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <div style={{ 
                        width: '80px', height: '80px', background: '#ecfdf5', borderRadius: '50%', color: '#10b981', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                        animation: 'checkBounce 2s infinite ease-in-out'
                    }}>
                        <CheckCircle2 size={48} />
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '16px' }}>¡Muchas Gracias!</h1>
                    <p style={{ color: '#64748b', fontSize: '18px', lineHeight: '1.6', marginBottom: '32px' }}>
                        Tus datos han sido registrados correctamente. Ahora tienes acceso completo a SICAM.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#3b82f6', fontWeight: '600' }}>
                        <Loader2 className="animate-spin" size={20} />
                        Redirigiendo a tus clínicas...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <style>{`
                @keyframes stepIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .section-transition {
                    animation: stepIn 0.4s ease-out;
                }
            `}</style>
            <div style={{ maxWidth: '800px', width: '100%', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)', overflow: 'hidden' }}>
                
                {/* Header */}
                <div style={{ padding: '40px 40px 20px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '12px' }}>Bienvenido a SICAM</h1>
                    <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.6' }}>
                        Para brindarte la mejor atención médica, necesitamos conocer tus antecedentes básicos. 
                        Este formulario es obligatorio y se llenará una sola vez.
                    </p>
                </div>

                {/* Progress Bar */}
                <div style={{ padding: '0 40px', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '20px', left: '0', right: '0', height: '2px', backgroundColor: '#e2e8f0', zIndex: 0 }}></div>
                        <div style={{ position: 'absolute', top: '20px', left: '0', width: `${((step - 1) / 4) * 100}%`, height: '2px', backgroundColor: '#3b82f6', zIndex: 0, transition: 'width 0.3s ease' }}></div>
                        
                        {steps.map((s) => (
                            <div key={s.id} style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <div style={{ 
                                    width: '40px', height: '40px', borderRadius: '50%', backgroundColor: step >= s.id ? '#3b82f6' : 'white', 
                                    border: `2px solid ${step >= s.id ? '#3b82f6' : '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: step >= s.id ? 'white' : '#94a3b8', fontWeight: 'bold', transition: 'all 0.3s ease'
                                }}>
                                    {step > s.id ? <CheckCircle2 size={24} /> : s.icon}
                                </div>
                                <span style={{ fontSize: '12px', fontWeight: '600', color: step >= s.id ? '#1e293b' : '#94a3b8', maxWidth: '100px', textAlign: 'center' }}>
                                    {s.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div style={{ padding: '0 40px 40px', minHeight: '350px' }}>
                    <div className="section-transition" key={step} style={{ backgroundColor: '#fdfdfd', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '32px' }}>
                        {renderStep()}
                    </div>
                </div>

                {/* Footer Controls */}
                <div style={{ padding: '24px 40px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button 
                        onClick={handleBack} 
                        disabled={step === 1 || loading}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', 
                            backgroundColor: 'white', color: '#64748b', fontWeight: '600', cursor: step === 1 ? 'not-allowed' : 'pointer', opacity: step === 1 ? 0.5 : 1
                        }}
                    >
                        <ArrowLeft size={18} /> Anterior
                    </button>

                    <button 
                        onClick={handleNext} 
                        disabled={loading}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 32px', borderRadius: '12px', border: 'none', 
                            backgroundColor: '#3b82f6', color: 'white', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)'
                        }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (step === 5 ? 'Finalizar' : 'Siguiente')} 
                        {step !== 5 && !loading && <ArrowRight size={18} />}
                    </button>
                </div>

            </div>
        </div>
    );
}
