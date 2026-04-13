import { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { createPortal } from 'react-dom';
import { useInactivityLogout } from '../../hooks/useInactivityLogout';
import InactivityModal from '../common/InactivityModal';

export default function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    // Inactivity logout logic
    const { showModal, remainingSeconds, stayLoggedIn, logout } = useInactivityLogout();

    // Reset sidebar on navigation
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="layout">
            {/* Inactivity Modal */}
            {showModal && (
                <InactivityModal 
                    remainingSeconds={remainingSeconds} 
                    onStayLoggedIn={stayLoggedIn} 
                    onLogout={logout} 
                />
            )}

            {/* Sidebar y Backdrop renderizados en el Portal para evitar problemas de posicionamiento */}
            {createPortal(
                <>
                    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                    
                    {/* Backdrop visible para cerrar el menú en móviles */}
                    <div 
                        className="sidebar-backdrop" 
                        onClick={() => setIsSidebarOpen(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 99998,
                            display: isSidebarOpen ? 'block' : 'none',
                            opacity: isSidebarOpen ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                            pointerEvents: isSidebarOpen ? 'auto' : 'none'
                        }}
                    ></div>
                </>,
                document.body
            )}
            
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <Header onMenuClick={toggleSidebar} />
                <main className="content-area">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
