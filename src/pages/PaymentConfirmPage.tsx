import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useToast } from '../components/Toast';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function PaymentConfirmPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verificando pago...');

    useEffect(() => {
        const confirmPayment = async () => {
            const id = searchParams.get('id');
            const clientTransactionId = searchParams.get('clientTransactionId');
            const errorMsg = searchParams.get('msg');

            if (!id || !clientTransactionId) {
                setStatus('error');
                setMessage(errorMsg ? decodeURIComponent(errorMsg) : 'Parámetros de pago cancelados o inválidos.');
                return;
            }

            try {
                // 1. Confirm transaction with PayPhone via backend
                const confirmResponse = await api.post('/payphone/confirm', {
                    id: parseInt(id),
                    clientTxId: clientTransactionId
                });

                if (confirmResponse.data.transactionStatus === 'Approved') {
                    // 2. Retrieve appointment data from sessionStorage
                    const pendingData = sessionStorage.getItem('pending_appointment');
                    if (!pendingData) {
                        setStatus('error');
                        setMessage('No se encontró información de la cita pendiente. Contacte a soporte.');
                        return;
                    }

                    const appointmentPayload = JSON.parse(pendingData);
                    appointmentPayload.paymentId = id;

                    // 3. Create the appointment
                    await api.post('/appointments', appointmentPayload);
                    
                    sessionStorage.removeItem('pending_appointment');
                    setStatus('success');
                    setMessage('¡Pago aprobado y cita agendada exitosamente!');
                    showToast('Cita confirmada correctamente.', 'success');
                } else {
                    setStatus('error');
                    setMessage(`El pago no fue aprobado. Estado: ${confirmResponse.data.transactionStatus}`);
                }
            } catch (error: any) {
                console.error('Payment confirmation error:', error);
                setStatus('error');
                setMessage(error.response?.data?.message || 'Error al confirmar el pago o registrar la cita.');
            }
        };

        confirmPayment();
    }, [searchParams, navigate, showToast]);

    return (
        <div className="payment-confirm-container" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '80vh',
            padding: '20px',
            textAlign: 'center'
        }}>
            <div className={`status-card ${status}`} style={{
                background: 'white',
                padding: '40px',
                borderRadius: '24px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                maxWidth: '450px',
                width: '100%',
                border: '1px solid #E2E8F0'
            }}>
                {status === 'loading' && (
                    <>
                        <Loader2 size={64} className="animate-spin" style={{ color: '#3C50E0', marginBottom: '20px' }} />
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1C2434' }}>Procesando...</h2>
                        <p style={{ color: '#64748B', marginTop: '10px' }}>{message}</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle2 size={64} style={{ color: '#10B981', marginBottom: '20px' }} />
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#065F46' }}>¡Todo listo!</h2>
                        <p style={{ color: '#065F46', marginTop: '10px', fontSize: '1.1rem' }}>{message}</p>
                        <button 
                            onClick={() => navigate('/patient/appointments')}
                            style={{ 
                                marginTop: '30px',
                                padding: '14px 24px',
                                background: '#3C50E0',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                width: '100%'
                            }}
                        >
                            Ver Mis Citas
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle size={64} style={{ color: '#EF4444', marginBottom: '20px' }} />
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#991B1B' }}>Ups, algo salió mal</h2>
                        <p style={{ color: '#991B1B', marginTop: '10px', fontSize: '1.1rem' }}>{message}</p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                            <button 
                                onClick={() => navigate('/clinical-offices')}
                                style={{ 
                                    padding: '14px 20px',
                                    background: '#F1F5F9',
                                    color: '#475569',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    flex: 1
                                }}
                            >
                                Reintentar
                            </button>
                            <button 
                                onClick={() => navigate('/')}
                                style={{ 
                                    padding: '14px 20px',
                                    background: '#3C50E0',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    flex: 1
                                }}
                            >
                                Ir al Inicio
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
