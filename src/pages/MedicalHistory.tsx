import React, { useState } from 'react';
import { Save, User, ShieldAlert, Syringe, AlertTriangle, Search, FileText, Stethoscope, FileSignature } from 'lucide-react';
import EmergencyContactForm from '../components/medical-history/EmergencyContactForm';
import FamilyHistoryForm from '../components/medical-history/FamilyHistoryForm';
import RecentVaccinesForm from '../components/medical-history/RecentVaccinesForm';
import RiskFactorsForm from '../components/medical-history/RiskFactorsForm';
import TricologyFindingsForm from '../components/medical-history/TricologyFindingsForm';
import LabResultsForm from '../components/medical-history/LabResultsForm';
import DiagnosisActivityForm from '../components/medical-history/DiagnosisActivityForm';
import ComplementaryExamsForm from '../components/medical-history/ComplementaryExamsForm';
import toast from 'react-hot-toast';

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
    const [activeSection, setActiveSection] = useState<SectionKey>('emergency');
    const [saving, setSaving] = useState(false);

    // Master state for the entire form
    const [formData, setFormData] = useState({
        emergency: { name: '', relation: '', phone: '', address: '' },
        family: [] as string[],
        vaccines: [] as string[],
        risks: [] as string[],
        labresults: [] as any[],
        diagnosis: [] as any[],
        exams: { category: '', options: [] as string[], other: '', diagnosis: '' },
        tricology: { text: '', files: [] as string[] }
    });

    const handleUpdateSection = (section: SectionKey, data: any) => {
        setFormData(prev => ({ ...prev, [section]: data }));
    };

    const isSectionComplete = (section: SectionKey) => {
        const data = formData[section];
        if (section === 'emergency') {
            const e = data as any;
            return e.name && e.relation && e.phone && e.address;
        }
        if (section === 'tricology') {
            const t = data as any;
            return t.text.length > 0 || t.files.length > 0;
        }
        if (section === 'exams') {
            const x = data as any;
            return (x.options && x.options.length > 0) || x.other.length > 0;
        }
        // Arrays for checklists and tables
        return Array.isArray(data) && data.length > 0;
    };

    const handleSaveAll = async () => {
        setSaving(true);
        // Simulate API Call
        setTimeout(() => {
            console.log('Saved Data:', formData);
            toast.success('Historia clínica guardada exitosamente');
            setSaving(false);
        }, 1500);
    };

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'emergency':
                return <EmergencyContactForm data={formData.emergency} onChange={(d) => handleUpdateSection('emergency', d)} onSave={() => setActiveSection('family')} />;
            case 'family':
                return <FamilyHistoryForm data={formData.family} onChange={(d) => handleUpdateSection('family', d)} onSave={() => setActiveSection('vaccines')} />;
            case 'vaccines':
                return <RecentVaccinesForm data={formData.vaccines} onChange={(d) => handleUpdateSection('vaccines', d)} onSave={() => setActiveSection('risks')} />;
            case 'risks':
                return <RiskFactorsForm data={formData.risks} onChange={(d) => handleUpdateSection('risks', d)} onSave={() => setActiveSection('tricology')} />;
            case 'tricology':
                return <TricologyFindingsForm data={formData.tricology} onChange={(d) => handleUpdateSection('tricology', d)} onSave={() => setActiveSection('labresults')} />;
            case 'labresults':
                return <LabResultsForm data={formData.labresults} onChange={(d) => handleUpdateSection('labresults', d)} onSave={() => setActiveSection('diagnosis')} />;
            case 'diagnosis':
                return <DiagnosisActivityForm data={formData.diagnosis} onChange={(d) => handleUpdateSection('diagnosis', d)} onSave={() => setActiveSection('exams')} />;
            case 'exams':
                return <ComplementaryExamsForm data={formData.exams} onChange={(d) => handleUpdateSection('exams', d)} onSave={handleSaveAll} />;
            default:
                return null;
        }
    };

    return (
        <div className="management-container" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="management-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 className="management-title" style={{ fontSize: '24px', fontWeight: '700', margin: '0' }}>
                        Historia Clínica - Tricología (Diseño)
                    </h2>
                    <p className="management-subtitle" style={{ color: 'var(--text-gray)', marginTop: '4px' }}>
                        Registro de evolución clínica especializada
                    </p>
                </div>
                <div className="management-actions">
                    <button
                        className="submit-btn"
                        onClick={handleSaveAll}
                        disabled={saving}
                        style={{ width: 'auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px', height: '44px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                    >
                        {saving ? <div className="loader" style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
                        {saving ? 'Guardando...' : 'Guardar Todo'}
                    </button>
                </div>
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
    );
}
