import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cancelAllRequests, clearAxiosAuth } from '../../api';
import { useSpecialty } from '../../context/SpecialtyContext';

export default function LogoutPage() {
    const navigate = useNavigate();
    const { refreshSpecialties } = useSpecialty();

    useEffect(() => {
        const performLogout = async () => {
            // 1. Cancelar de inmediato cualquier petición en vuelo
            cancelAllRequests();

            // Un pequeño delay para que la animación sea visible y agradable
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 2. Limpiar Headers de la instancia global de Axios explícitamente
            clearAxiosAuth();

            // 3. Limpiar todo el almacenamiento local
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('activeSpecialty');
            
            // 4. Limpieza absoluta de variables en el Contexto/Memoria
            refreshSpecialties();
            
            // Redirigir al login y forzar un hard reload para limpiar toda la memoria y la pestaña Network del navegador
            window.location.href = '/signin';
        };

        performLogout();
    }, [navigate, refreshSpecialties]);

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F8FAFC',
            fontFamily: 'inherit'
        }}>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .logout-card {
                    background: white;
                    padding: 40px;
                    border-radius: 32px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
                    display: flex;
                    flex-direction: column;
                    alignItems: center;
                    animation: fadeIn 0.6s ease-out;
                    text-align: center;
                    width: 100%;
                    max-width: 320px;
                }
                .spinner-ring {
                    width: 60px;
                    height: 60px;
                    border: 4px solid #F1F5F9;
                    border-top: 4px solid #5D5FEF;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    margin-bottom: 24px;
                    position: relative;
                }
                .status-dot {
                    width: 8px;
                    height: 8px;
                    background-color: #5D5FEF;
                    border-radius: 50%;
                    display: inline-block;
                    margin-right: 4px;
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>

            <div className="logout-card">
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="spinner-ring"></div>
                </div>

                <h1 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#1E293B',
                    marginBottom: '8px'
                }}>
                    Cerrando sesión
                </h1>
                
                <p style={{
                    color: '#64748B',
                    fontSize: '0.9rem',
                    margin: 0
                }}>
                    Gracias por usar <span style={{ color: '#5D5FEF', fontWeight: 600 }}>Sicam</span>.
                </p>
                <p style={{
                    color: '#94A3B8',
                    fontSize: '0.8rem',
                    marginTop: '16px'
                }}>
                    Redirigiendo al inicio de sesión...
                </p>
            </div>

            <div style={{
                position: 'absolute',
                bottom: '40px',
                color: '#94A3B8',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>
                Sicam Medico
            </div>
        </div>
    );
}
