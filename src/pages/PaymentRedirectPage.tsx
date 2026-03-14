import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useToast } from '../components/Toast';
import { Loader2, CreditCard } from 'lucide-react';

export default function PaymentRedirectPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [message, setMessage] = useState('Preparando entorno de pago seguro...');

    useEffect(() => {
        const preparePayment = async () => {
            try {
                // 1. Get pending data from sessionStorage
                const pendingData = sessionStorage.getItem('pending_appointment');
                const rate = sessionStorage.getItem('pending_rate');

                if (!pendingData || !rate) {
                    showToast('No hay datos de cita pendientes o monto inválido.', 'error');
                    navigate('/patient/clinics');
                    return;
                }

                const clientTransactionId = `SICAM-${Date.now()}`;
                const returnUrl = `${window.location.origin}/payment/confirm`;

                const prepareData = {
                    amount: Math.round(Number(rate) * 100),
                    amountWithoutTax: Math.round(Number(rate) * 100),
                    currency: "USD",
                    clientTransactionId: clientTransactionId,
                    responseUrl: returnUrl,
                    cancellationUrl: `${window.location.origin}/patient/clinics`,
                    reference: "Cita Médica SICAM"
                };

                setMessage('Conectando con PayPhone...');

                // 2. Call backend to get PayPhone URL
                const response = await api.post('/payphone/prepare', prepareData);
                
                if (response.data.payWithPayPhone) {
                    // 3. Redirect to PayPhone
                    window.location.href = response.data.payWithPayPhone;
                } else {
                    throw new Error('No se recibió la URL de pago.');
                }

            } catch (error: any) {
                console.error('Redirect page error:', error);
                showToast(error.response?.data?.message || 'Error al conectar con la pasarela de pagos.', 'error');
                navigate('/patient/clinics');
            }
        };

        preparePayment();
    }, [navigate, showToast]);

    return (
        <div className="payment-redirect-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '90vh',
            background: 'white',
            textAlign: 'center',
            padding: '20px'
        }}>
            <div className="redirect-card" style={{
                maxWidth: '400px',
                width: '100%'
            }}>
                <div className="icon-wrapper" style={{
                    position: 'relative',
                    marginBottom: '30px',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: '#EEF2FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <CreditCard size={48} style={{ color: '#3C50E0' }} />
                    </div>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}>
                        <Loader2 size={100} className="animate-spin" style={{ color: '#3C50E0', opacity: 0.2 }} />
                    </div>
                </div>

                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1C2434', marginBottom: '15px' }}>
                    Redireccionando al Pago
                </h1>
                <p style={{ color: '#64748B', fontSize: '1.1rem', lineHeight: '1.6' }}>
                    {message}
                </p>
                
                <div className="secure-badge" style={{
                    marginTop: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '12px',
                    background: '#F8FAFC',
                    borderRadius: '12px',
                    color: '#64748B',
                    fontSize: '0.9rem'
                }}>
                    <span>🔒 Pago seguro procesado por PayPhone</span>
                </div>
            </div>
        </div>
    );
}
