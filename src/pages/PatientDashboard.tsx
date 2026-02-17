import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Stethoscope, ChevronRight } from 'lucide-react';

interface Specialty {
    id: string;
    name: string;
    description: string;
}

export default function PatientDashboard() {
    const navigate = useNavigate();
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }

        const fetchSpecialties = async () => {
            try {
                const response = await api.get('/specialties');
                setSpecialties(response.data);
            } catch (error) {
                console.error('Error fetching specialties:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSpecialties();
    }, []);


    if (loading) {
        return <div className="loading-container">Cargando especialidades...</div>;
    }

    return (
        <div className="patient-dashboard">
            <div className="page-header">
                <h1>Hola, {user?.firstName || 'Paciente'}</h1>
                <p>Bienvenido a tu portal de salud. Selecciona una especialidad para agendar tu cita.</p>
            </div>

            <main className="specialties-grid-container" style={{ marginTop: '20px' }}>
                <h2 className="section-title">Especialidades Disponibles</h2>
                <div className="specialties-grid">
                    {specialties.map((specialty) => (
                        <div key={specialty.id} className="specialty-card" onClick={() => navigate(`/patient/book/${specialty.id}`)}>
                            <div className="specialty-icon">
                                <Stethoscope size={32} />
                            </div>
                            <div className="specialty-info">
                                <h3>{specialty.name}</h3>
                                <p>{specialty.description || 'Consulta médica especializada'}</p>
                            </div>
                            <ChevronRight className="arrow-icon" />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
