import PatientProfileForm from '../../components/patient/PatientProfileForm';

export default function PatientProfilePage() {
    return (
        <div className="page-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="page-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1e293b' }}>
                Mi Perfil
            </h1>
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '2rem' }}>
                <PatientProfileForm />
            </div>
        </div>
    );
}
