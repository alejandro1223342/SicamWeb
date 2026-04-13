import React, { useState, useEffect } from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Loader2, Calendar, User, Stethoscope } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useSpecialty } from '../context/SpecialtyContext';

interface MedicalRecord {
    id: string;
    createdAt: string;
    doctor: {
        firstName: string;
        lastName: string;
    };
    specialty: {
        name: string;
    };
    diagnosis: string | null;
}

interface Patient {
    firstName: string;
    lastName: string;
    idNumber: string | null;
}

const MedicalHistoryList: React.FC = () => {
    const { patientId } = useParams<{ patientId: string }>();
    const navigate = useNavigate();
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    const { activeSpecialty } = useSpecialty();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        
        const fetchData = async () => {
            if (!patientId || !activeSpecialty) return;
            try {
                // Fetch patient info
                const patientRes = await api.get(`/users/patients/${patientId}`);
                setPatient(patientRes.data.data || patientRes.data);

                // Fetch medical records filtered by specialty
                const recordsRes = await api.get(`/medical-records/patient/${patientId}`, {
                    params: { specialtyId: activeSpecialty.id }
                });
                setRecords(recordsRes.data);
            } catch (error) {
                console.error('Error fetching medical history:', error);
                toast.error('Error al cargar la historia clínica');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        return () => window.removeEventListener('resize', handleResize);
    }, [patientId, activeSpecialty]);
 interim:    useEffect(() => {
         const fetchData = async () => {
             if (!patientId || !activeSpecialty) return;
             try {
                 // Fetch patient info
                 const patientRes = await api.get(`/users/patients/${patientId}`);
                 setPatient(patientRes.data.data || patientRes.data);
 
                 // Fetch medical records filtered by specialty
                 const recordsRes = await api.get(`/medical-records/patient/${patientId}`, {
                     params: { specialtyId: activeSpecialty.id }
                 });
                 setRecords(recordsRes.data);
             } catch (error) {
                 console.error('Error fetching medical history:', error);
                 toast.error('Error al cargar la historia clínica');
             } finally {
                 setLoading(false);
             }
         };
 
         fetchData();
     }, [patientId, activeSpecialty]);

    const handleViewRecord = (recordId: string) => {
        if (!activeSpecialty) return;
        let path = 'medical-history';
        if (activeSpecialty.name === 'Estética') path = 'aesthetic-history';
        if (activeSpecialty.name === 'Nutrición') path = 'nutrition-history';

        navigate(`/dashboard/specialty/${activeSpecialty.id}/${path}/${patientId}/${recordId}`);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <Loader2 className="animate-spin text-primary" size={48} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                <p className="text-muted">Cargando historiales...</p>
            </div>
        );
    }

    return (
        <div className="management-page">
            <Toaster position="top-right" />
            <div className="management-container">
                <div style={{ marginBottom: '24px', padding: '0 4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button
                                onClick={() => navigate(activeSpecialty ? `/dashboard/specialty/${activeSpecialty.id}/patients` : '/dashboard')}
                                title="Regresar a Pacientes"
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '40px', height: '40px', backgroundColor: 'white', color: '#64748b',
                                    border: '1px solid #e2e8f0', borderRadius: '10px',
                                    cursor: 'pointer', transition: 'all 0.2s',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = '#1e293b'; }}
                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#64748b'; }}
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', margin: 0, letterSpacing: '-0.02em' }}>
                                Historial de Atenciones
                            </h2>
                        </div>

                        {patient && (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                backgroundColor: '#f8fafc',
                                padding: '10px 18px',
                                borderRadius: '12px',
                                border: '1px solid #f1f5f9'
                            }}>
                                <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
                                    {patient.firstName} {patient.lastName}
                                </span>
                                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500', marginTop: '2px' }}>
                                    CI: {patient.idNumber || 'N/A'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {isMobile ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginTop: '10px' }}>
                        {records.length === 0 ? (
                            <div className="card text-center py-12" style={{ padding: '60px', background: 'white' }}>
                                <p className="text-muted">No se registran atenciones previas.</p>
                            </div>
                        ) : (
                            records.map(record => (
                                <div key={record.id} className="card" style={{ padding: '20px', background: 'white' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dark)', fontWeight: '600' }}>
                                            <Calendar size={18} className="text-muted" />
                                            {new Date(record.createdAt).toLocaleDateString()}
                                        </div>
                                        <button
                                            className="action-btn-outline"
                                            onClick={() => handleViewRecord(record.id)}
                                            style={{ color: 'var(--primary)', padding: '5px' }}
                                        >
                                            <Eye size={20} />
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Stethoscope size={16} className="text-primary" />
                                            <span style={{ fontWeight: '500' }}>{record.specialty.name}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <User size={16} className="text-muted" />
                                            <span>Dr. {record.doctor.firstName} {record.doctor.lastName}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleViewRecord(record.id)}
                                        className="btn-primary" 
                                        style={{ width: '100%', marginTop: '15px', padding: '10px', fontSize: '0.9rem' }}
                                    >
                                        Ver Detalles
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="list-card card" style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                        <div className="table-responsive">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th className="text-center">Fecha</th>
                                        <th className="text-center">Especialidad</th>
                                        <th className="text-center">Médico</th>
                                        <th className="text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-12" style={{ padding: '60px' }}>
                                                <p className="text-muted">No se registran atenciones previas para este paciente.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        records.map(record => (
                                            <tr key={record.id}>
                                                <td className="text-center">
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-dark)', fontWeight: '500' }}>
                                                        <Calendar size={16} className="text-muted" />
                                                        {new Date(record.createdAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                        <Stethoscope size={16} className="text-primary" />
                                                        {record.specialty.name}
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                        <User size={16} className="text-muted" />
                                                        Dr. {record.doctor.firstName} {record.doctor.lastName}
                                                    </div>
                                                </td>
                                                <td className="text-right">
                                                    <button
                                                        className="action-btn-outline"
                                                        onClick={() => handleViewRecord(record.id)}
                                                        title="Ver Detalles"
                                                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px', width: '36px', height: '36px', color: 'var(--primary)' }}
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MedicalHistoryList;
