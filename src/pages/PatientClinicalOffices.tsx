import { useState, useEffect } from 'react';
import api from '../api';
import { Building2, Phone, MapPin, ArrowRight, User, Stethoscope } from 'lucide-react';

interface Specialty {
    id: string;
    name: string;
    description: string;
}

interface Doctor {
    id: string;
    firstName: string;
    lastName: string;
    specialties: { specialty: Specialty }[];
}

interface Office {
    id: string;
    name: string;
    address: string;
    phone: string;
    doctors: { doctor: Doctor }[];
}

interface DoctorCardData {
    doctorId: string;
    doctorName: string;
    officeName: string;
    address: string;
    phone: string;
    specialties: Specialty[];
}

export default function PatientClinicalOffices() {
    const [doctorCards, setDoctorCards] = useState<DoctorCardData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffices = async () => {
            try {
                const response = await api.get('/medical-offices');
                const offices = response.data;

                // Unflatten: one card per doctor assigned to an office
                const cards: DoctorCardData[] = [];

                offices.forEach((office: Office) => {
                    if (office.doctors && office.doctors.length > 0) {
                        office.doctors.forEach((d) => {
                            cards.push({
                                doctorId: d.doctor.id,
                                doctorName: `${d.doctor.firstName} ${d.doctor.lastName}`,
                                officeName: office.name,
                                address: office.address,
                                phone: office.phone,
                                specialties: d.doctor.specialties.map(s => s.specialty)
                            });
                        });
                    }
                });

                setDoctorCards(cards);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOffices();
    }, []);

    if (loading) {
        return (
            <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div className="loader">Cargando especialistas...</div>
            </div>
        );
    }

    return (
        <div className="patient-offices-container">
            <div className="page-header-premium">
                <div className="header-text">
                    <h1>Especialistas Disponibles</h1>
                    <p>Encuentra al profesional adecuado en nuestras sedes equipadas para tu bienestar.</p>
                </div>
                <div className="header-decoration"></div>
            </div>

            {doctorCards.length === 0 ? (
                <div className="empty-state">
                    <p>No hay especialistas disponibles asignados a consultorios en este momento.</p>
                </div>
            ) : (
                <div className="offices-grid-premium">
                    {doctorCards.map((card, idx) => (
                        <div key={`${card.doctorId}-${idx}`} className="office-card-premium">
                            <div className="office-card-header-premium">
                                <div className="doctor-avatar-bg">
                                    <User size={28} className="doctor-icon" />
                                </div>
                                <div className="office-title-block">
                                    <h3>{card.doctorName}</h3>
                                    <span className="status-badge">Médico Especialista</span>
                                </div>
                            </div>

                            <div className="doctor-specialties-info">
                                {card.specialties.map((spec) => (
                                    <div key={spec.id} className="specialty-badge-group">
                                        <div className="spec-name-row">
                                            <Stethoscope size={16} className="text-secondary" />
                                            <span className="spec-name">{spec.name}</span>
                                        </div>
                                        <p className="spec-description">{spec.description}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="office-card-body-premium">
                                <div className="info-group">
                                    <div className="info-item-premium">
                                        <Building2 size={16} className="text-muted" />
                                        <span className="office-tag">{card.officeName}</span>
                                    </div>
                                    <div className="info-item-premium">
                                        <MapPin size={16} className="text-muted" />
                                        <span>{card.address}</span>
                                    </div>
                                    <div className="info-item-premium">
                                        <Phone size={16} className="text-muted" />
                                        <span>{card.phone}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="office-card-footer-premium">
                                <button className="btn-book-now">
                                    <span>Ver Agenda de {card.doctorName.split(' ')[0]}</span>
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .patient-offices-container {
                    padding: 20px 0;
                }

                .page-header-premium {
                    position: relative;
                    margin-bottom: 40px;
                    padding: 40px;
                    background: linear-gradient(135deg, #1C2434 0%, #24303F 100%);
                    border-radius: 20px;
                    color: white;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }

                .header-text h1 {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin: 0 0 10px 0;
                    letter-spacing: -0.5px;
                }

                .header-text p {
                    font-size: 1.1rem;
                    opacity: 0.8;
                    max-width: 600px;
                    margin: 0;
                }

                .header-decoration {
                    position: absolute;
                    top: -50px;
                    right: -50px;
                    width: 250px;
                    height: 250px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 50%;
                }

                .offices-grid-premium {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
                    gap: 30px;
                }

                .office-card-premium {
                    background: white;
                    border-radius: 24px;
                    padding: 30px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid #E2E8F0;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }

                .office-card-premium:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
                    border-color: #3C50E040;
                }

                .office-card-header-premium {
                    display: flex;
                    align-items: center;
                    gap: 18px;
                }

                .doctor-avatar-bg {
                    width: 64px;
                    height: 64px;
                    background: #F1F5F9;
                    border-radius: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #3C50E0;
                    transition: all 0.3s ease;
                }

                .office-card-premium:hover .doctor-avatar-bg {
                    background: #3C50E0;
                    color: white;
                }

                .office-title-block h3 {
                    margin: 0;
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: #1C2434;
                }

                .status-badge {
                    display: inline-block;
                    padding: 4px 10px;
                    background: #E0E7FF;
                    color: #4338CA;
                    font-size: 0.75rem;
                    font-weight: 600;
                    border-radius: 100px;
                    margin-top: 4px;
                }

                .doctor-specialties-info {
                    padding: 15px 0;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .specialty-badge-group {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .spec-name-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 700;
                    color: #475569;
                    font-size: 1rem;
                }

                .spec-description {
                    font-size: 0.85rem;
                    color: #64748B;
                    line-height: 1.4;
                    margin: 0;
                    padding-left: 24px;
                }

                .office-card-body-premium {
                    background: #F8FAFC;
                    border-radius: 16px;
                    padding: 15px;
                    margin-top: auto;
                }

                .info-group {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .info-item-premium {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #64748B;
                    font-size: 0.9rem;
                }

                .office-tag {
                    color: #3C50E0;
                    font-weight: 600;
                }

                .text-secondary {
                    color: #3C50E0;
                }

                .text-muted {
                    color: #94A3B8;
                }

                .btn-book-now {
                    width: 100%;
                    padding: 14px;
                    background: #3C50E0;
                    border: none;
                    border-radius: 14px;
                    color: white;
                    font-weight: 700;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .btn-book-now:hover {
                    background: #2D3EAF;
                    box-shadow: 0 4px 12px rgba(60, 80, 224, 0.3);
                }

                .empty-state {
                    text-align: center;
                    padding: 80px 0;
                    color: #64748B;
                }
            `}</style>
        </div>
    );
}
