import PatientAppointmentsList from '../../components/patient/PatientAppointmentsList';

export default function PatientAppointmentsPage() {
    return (
        <div className="page-container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 className="page-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e293b' }}>
                Mis Citas
            </h1>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                Administra y consulta tu historial de citas médicas agendadas.
            </p>
            
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '2rem' }}>
                <PatientAppointmentsList />
            </div>
        </div>
    );
}
