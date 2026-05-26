import { Loader2 } from 'lucide-react';

export default function GlobalLoader() {
    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F8FAFC',
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeIn 0.3s ease-out' }}>
                <Loader2 className="animate-spin" size={48} color="#5D5FEF" style={{ marginBottom: '16px' }} />
                <h2 style={{ color: '#1E293B', fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>
                    Cargando Sicam...
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '8px' }}>
                    Preparando la plataforma para ti
                </p>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
