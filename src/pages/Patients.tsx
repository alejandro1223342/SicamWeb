import React, { useState, useEffect } from 'react';
import api from '../api';
import { UserPlus, Search, Edit, Mail, Phone, ClipboardList, PlusCircle, X, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useSpecialty } from '../context/SpecialtyContext';
import { useNavigate, useParams } from 'react-router-dom';

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    idNumber: string | null;
    birthDate: string | null;
    gender: string | null;
    createdAt: string;
}

const Patients: React.FC = () => {
    const { specialtyId: urlSpecialtyId } = useParams<{ specialtyId: string }>();
    const { activeSpecialty } = useSpecialty();
    const navigate = useNavigate();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [fetchingPatients, setFetchingPatients] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [genderOptions, setGenderOptions] = useState<{ id: string, name: string }[]>([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '', idNumber: '', birthDate: '', gender: ''
    });

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        fetchPatients();
        fetchGenderOptions();
        return () => window.removeEventListener('resize', handleResize);
    }, [activeSpecialty, urlSpecialtyId]);
    
    const fetchGenderOptions = async () => {
        try {
            const response = await api.get('/catalogs/type/GENDER');
            setGenderOptions(response.data);
        } catch (error) { console.error(error); }
    };

    const fetchPatients = async () => {
        setFetchingPatients(true);
        try {
            const userData = localStorage.getItem('user');
            if (!userData) return;
            const user = JSON.parse(userData);
            const targetSpecialtyId = urlSpecialtyId || activeSpecialty?.id;
            
            let response;
            if (user.role === 'MEDICO' && targetSpecialtyId) {
                response = await api.get(`/users/patients/doctor/${user.id}`, { params: { specialtyId: targetSpecialtyId } });
            } else {
                response = await api.get('/users/patients');
            }
            setPatients(response.data);
        } catch (err) { console.error(err); } finally { setFetchingPatients(false); }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditClick = (patient: Patient) => {
        const genderLabelMap: any = { 'M': 'Masculino', 'F': 'Femenino', 'O': 'Otro' };
        setFormData({
            firstName: patient.firstName,
            lastName: patient.lastName,
            email: patient.email,
            phone: patient.phone || '',
            idNumber: patient.idNumber || '',
            birthDate: patient.birthDate ? new Date(patient.birthDate).toISOString().split('T')[0] : '',
            gender: patient.gender ? (genderLabelMap[patient.gender] || patient.gender) : ''
        });
        setIsEditing(true);
        setSelectedPatientId(patient.id);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && selectedPatientId) {
                await api.patch(`/users/patients/${selectedPatientId}`, formData);
                toast.success('Paciente actualizado');
            } else {
                await api.post('/users/patients', formData);
                toast.success('Paciente registrado');
            }
            fetchPatients();
            setShowModal(false);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Error');
        } finally { }
    };

    const handleNewHistory = (patient: Patient) => {
        const sessionId = crypto.randomUUID();
        let path = 'medical-history';
        if (activeSpecialty?.name === 'Estética') path = 'aesthetic-history';
        if (activeSpecialty?.name === 'Nutrición') path = 'nutrition-history';
        if (activeSpecialty?.name === 'Medicina General') path = 'general-history';
        if (activeSpecialty?.name === 'Cabina') path = 'cabin-history';
        navigate(`/dashboard/specialty/${urlSpecialtyId || activeSpecialty?.id}/${path}/${patient.id}?mode=new&session=${sessionId}`);
    };

    const handleViewHistories = (patient: Patient) => {
        let listPath = 'medical-history-list';
        if (activeSpecialty?.name === 'Medicina General') listPath = 'general-history-list';
        if (activeSpecialty?.name === 'Cabina') listPath = 'cabin-history-list';
        navigate(`/dashboard/specialty/${urlSpecialtyId || activeSpecialty?.id}/${listPath}/${patient.id}`);
    };

    const filteredPatients = patients.filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.idNumber && p.idNumber.includes(searchTerm))
    );

    return (
        <div className="management-page">
            <Toaster position="top-right" />
            <div className="management-container">
                <div className="management-header" style={{ flexDirection: isMobile ? 'column' : 'row', gap: '16px' }}>
                    <div>
                        <h1 className="page-title">Gestión de Pacientes</h1>
                        <p className="page-subtitle">Administra tus pacientes de {activeSpecialty?.name}.</p>
                    </div>
                    <button className="submit-btn" onClick={() => { setIsEditing(false); setFormData({firstName:'',lastName:'',email:'',phone:'',idNumber:'',birthDate:'',gender:''}); setShowModal(true); }} style={{ width: isMobile ? '100%' : 'auto' }}>
                        <UserPlus size={18} /> Registrar Paciente
                    </button>
                </div>

                <div className="management-controls" style={{ flexDirection: isMobile ? 'column' : 'row', gap: '16px' }}>
                    <div className="search-wrapper" style={{ flex: 1 }}>
                        <Search className="search-icon" size={18} />
                        <input type="text" placeholder="Buscar..." className="form-input search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="stats-group">
                        <span className="count-label">Total: </span>
                        <span className="count-badge" style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '12px' }}>{patients.length}</span>
                    </div>
                </div>

                {fetchingPatients ? (
                    <div className="text-center py-20"><Loader2 className="animate-spin" /></div>
                ) : isMobile ? (
                    <div className="patient-cards-container" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginTop: '20px' }}>
                        {filteredPatients.map(p => (
                            <div key={p.id} className="card patient-mobile-card" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                                    <div style={{ width: '50px', height: '50px', background: '#f3f4f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>
                                        {p.firstName[0]}{p.lastName[0]}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{p.firstName} {p.lastName}</h3>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>ID: {p.idNumber}</p>
                                    </div>
                                    <button onClick={() => handleEditClick(p)} style={{ background: 'none', border: 'none', color: '#666' }}><Edit size={20} /></button>
                                </div>
                                <div style={{ marginBottom: '15px', fontSize: '0.9rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}><Mail size={14} /> {p.email}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} /> {p.phone || 'N/A'}</div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <button onClick={() => handleNewHistory(p)} className="btn-primary" style={{ padding: '10px', fontSize: '0.85rem' }}><PlusCircle size={16} /> Atender</button>
                                    <button onClick={() => handleViewHistories(p)} className="btn-outline" style={{ padding: '10px', fontSize: '0.85rem' }}><ClipboardList size={16} /> Historias</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="list-card card" style={{ marginTop: '24px', overflow: 'hidden' }}>
                        <div className="table-responsive">
                            <table className="custom-table">
                                <thead>
                                    <tr><th>Paciente</th><th>Identificación</th><th>Contacto</th><th>Fecha</th><th className="text-right">Acciones</th></tr>
                                </thead>
                                <tbody>
                                    {filteredPatients.map(p => (
                                        <tr key={p.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '36px', height: '36px', background: '#F3F4F6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: 'var(--primary)' }}>{p.firstName[0]}{p.lastName[0]}</div>
                                                    <div><div style={{ fontWeight: '600' }}>{p.firstName} {p.lastName}</div><div style={{ fontSize: '11px', color: '#999' }}>ID: {p.id.substring(0,8)}</div></div>
                                                </div>
                                            </td>
                                            <td>{p.idNumber}</td>
                                            <td><div style={{ fontSize: '12px' }}><Mail size={12} /> {p.email}</div><div style={{ fontSize: '12px' }}><Phone size={12} /> {p.phone}</div></td>
                                            <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                            <td className="text-right">
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => handleNewHistory(p)} className="action-btn-outline" style={{ color: 'var(--primary)' }} title="Atender"><PlusCircle size={18} /></button>
                                                    <button onClick={() => handleViewHistories(p)} className="action-btn-outline" style={{ color: 'var(--success)' }} title="Historias"><ClipboardList size={18} /></button>
                                                    <button onClick={() => handleEditClick(p)} className="action-btn-outline" style={{ color: 'var(--text-gray)' }} title="Editar"><Edit size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            {showModal && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '15px' }}>
                    <div className="modal-content card" style={{ background: 'white', width: '100%', maxWidth: '550px', borderRadius: '15px', overflow: 'hidden' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.1rem', margin: 0 }}>{isEditing ? 'Editar' : 'Registrar'} Paciente</h2>
                            <X onClick={() => setShowModal(false)} style={{ cursor: 'pointer', color: '#666' }} />
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '15px' }}>
                                <div><label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px' }}>Nombre*</label><input name="firstName" value={formData.firstName} onChange={handleChange} required className="form-input" /></div>
                                <div><label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px' }}>Apellido*</label><input name="lastName" value={formData.lastName} onChange={handleChange} required className="form-input" /></div>
                                <div><label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px' }}>ID/Cédula*</label><input name="idNumber" value={formData.idNumber} onChange={handleChange} required className="form-input" /></div>
                                <div><label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px' }}>Género</label><select name="gender" value={formData.gender} onChange={handleChange} className="form-input"><option value="">Selección...</option>{genderOptions.map(o=><option key={o.id} value={o.name}>{o.name}</option>)}</select></div>
                                <div><label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px' }}>Email*</label><input name="email" value={formData.email} onChange={handleChange} required className="form-input" /></div>
                                <div><label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px' }}>Teléfono</label><input name="phone" value={formData.phone} onChange={handleChange} className="form-input" /></div>
                                <div style={{ gridColumn: isMobile ? 'auto' : 'span 2' }}><label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px' }}>Nacimiento</label><input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="form-input" /></div>

                            </div>
                            <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setShowModal(false)} className="btn-outline" style={{ padding: '10px 20px' }}>Cancelar</button>
                                <button type="submit" className="btn-primary" style={{ padding: '10px 20px' }}>{isEditing ? 'Actualizar' : 'Registrar'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Patients;
