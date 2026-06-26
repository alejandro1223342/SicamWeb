import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
    onConfirm,
    onCancel
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return createPortal(
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '24px',
                width: '100%', maxWidth: '440px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                <div style={{ padding: '32px 32px 24px 32px', textAlign: 'center' }}>
                    <div style={{ 
                        width: '64px', height: '64px', 
                        backgroundColor: '#fef2f2', 
                        borderRadius: '50%', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px auto',
                        color: '#ef4444'
                    }}>
                        <AlertTriangle size={32} strokeWidth={2.5} />
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 12px 0' }}>
                        {title}
                    </h3>
                    <p style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                        {message}
                    </p>
                </div>
                
                <div style={{ 
                    display: 'flex', gap: '12px', 
                    padding: '24px 32px', 
                    backgroundColor: '#f8fafc',
                    borderTop: '1px solid #f1f5f9' 
                }}>
                    <button
                        onClick={onCancel}
                        style={{
                            flex: 1, padding: '12px',
                            backgroundColor: 'white', color: '#475569',
                            border: '1px solid #cbd5e1', borderRadius: '12px',
                            fontWeight: '600', fontSize: '15px',
                            cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            flex: 1, padding: '12px',
                            backgroundColor: '#ef4444', color: 'white',
                            border: 'none', borderRadius: '12px',
                            fontWeight: '600', fontSize: '15px',
                            cursor: 'pointer', transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(20px) scale(0.95); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
            `}</style>
        </div>,
        document.body
    );
}
