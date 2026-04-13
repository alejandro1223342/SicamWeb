import { AlertTriangle, Clock, LogOut, Play } from 'lucide-react';

interface InactivityModalProps {
  remainingSeconds: number;
  onStayLoggedIn: () => void;
  onLogout: () => void;
}

export default function InactivityModal({ 
  remainingSeconds, 
  onStayLoggedIn, 
  onLogout 
}: InactivityModalProps) {
  
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .timer-badge {
          background: #FEF2F2;
          color: #EF4444;
          padding: 8px 16px;
          border-radius: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          font-variant-numeric: tabular-nums;
        }
      `}</style>
      
      <div style={{
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '450px',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        animation: 'slideUp 0.4s ease-out'
      }}>
        <div style={{
          padding: '32px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#FEF2F2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <AlertTriangle size={32} color="#EF4444" />
          </div>

          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#1E293B',
            marginBottom: '12px'
          }}>
            ¿Sigues ahí?
          </h3>

          <p style={{
            color: '#64748B',
            fontSize: '1rem',
            lineHeight: 1.5,
            marginBottom: '24px'
          }}>
            Tu sesión está a punto de expirar debido a la inactividad. Por seguridad, cerraremos tu sesión en:
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '32px'
          }}>
            <div className="timer-badge">
              <Clock size={20} />
              <span style={{ fontSize: '1.25rem' }}>{timeString}</span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <button
              onClick={onStayLoggedIn}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '16px',
                backgroundColor: '#5D5FEF',
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b4df2'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#5D5FEF'}
            >
              <Play size={18} />
              Mantener sesión activa
            </button>

            <button
              onClick={onLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '16px',
                backgroundColor: 'transparent',
                color: '#64748B',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.color = '#EF4444';
                e.currentTarget.style.borderColor = '#FEE2E2';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#64748B';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <LogOut size={18} />
              Cerrar sesión ahora
            </button>
          </div>
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: '#F8FAFC',
          borderTop: '1px solid #F1F5F9',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#94A3B8'
        }}>
          Sicam - Sistema de Información Clínica y Administrativa Médica
        </div>
      </div>
    </div>
  );
}
