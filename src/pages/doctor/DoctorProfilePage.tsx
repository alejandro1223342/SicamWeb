import DoctorProfileForm from '../../components/doctor/DoctorProfileForm';

export default function DoctorProfilePage() {
    return (
        <div className="profile-page">
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b' }}>Mi Perfil Profesional</h1>
                <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Visualiza y gestiona tu información profesional y personal.</p>
            </div>
            
            <div className="card" style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <DoctorProfileForm />
            </div>
        </div>
    );
}
