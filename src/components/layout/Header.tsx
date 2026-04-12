import { useState, useEffect, useRef } from 'react';
import { Bell, ChevronDown, LogOut, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const [user, setUser] = useState<any>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                    if (parsedUser.role === 'MEDICO' || parsedUser.role === 'ADMIN') {
                        fetchNotifications();
                    }
                } catch (e) {
                    console.error("Error al parsear usuario en Header", e);
                }
            }
        };

        loadUser();

        // Escuchar actualizaciones manuales desde el perfil
        window.addEventListener('userUpdate', loadUser);
        // Escuchar cambios desde otras pestañas
        window.addEventListener('storage', loadUser);

        return () => {
            window.removeEventListener('userUpdate', loadUser);
            window.removeEventListener('storage', loadUser);
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const res = await fetch(`${baseUrl}/notifications/my-notifications`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
                setUnreadCount(data.filter((n: any) => !n.isRead).length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const res = await fetch(`${baseUrl}/notifications/${id}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                // Update local state by removing the read notification
                setNotifications(prev => prev.filter(n => n.id !== id));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
            
            // Mark all concurrently
            await Promise.all(
                unreadIds.map(id => fetch(`${baseUrl}/notifications/${id}/read`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token}` }
                }))
            );
            
            // Clear local notifications array completely
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('activeSpecialty');
        navigate('/signin');
    };

    return (
        <header className="header">
            <div className="header-content">


                {/* Right Section */}
                <div className="header-actions">


                    {/* Notifications */}
                    <div className="notifications-menu" ref={notificationsRef} style={{ position: 'relative' }}>
                        <button 
                            className="header-btn notification-btn"
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && <span className="dot-badge"></span>}
                        </button>

                        {/* Notifications Dropdown */}
                        {isNotificationsOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '0.5rem',
                                backgroundColor: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                zIndex: 50,
                                width: '320px',
                                maxHeight: '400px',
                                overflowY: 'auto',
                                padding: '0'
                            }}>
                                <div style={{
                                    padding: '1rem',
                                    borderBottom: '1px solid #e2e8f0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    position: 'sticky',
                                    top: 0,
                                    backgroundColor: 'white',
                                    zIndex: 1
                                }}>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
                                        Notificaciones
                                    </h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {unreadCount > 0 && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAllAsRead();
                                                }}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: '#3b82f6',
                                                    fontSize: '0.75rem',
                                                    cursor: 'pointer',
                                                    padding: '2px 4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem'
                                                }}
                                            >
                                                <Check size={14} />
                                                <span className="hidden sm:inline">Marcar leídas</span>
                                            </button>
                                        )}
                                    {unreadCount > 0 && (
                                        <span style={{ 
                                            backgroundColor: '#ef4444', 
                                            color: 'white', 
                                            padding: '4px 10px', 
                                            borderRadius: '9999px',
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            lineHeight: 1,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            whiteSpace: 'nowrap',
                                            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
                                        }}>
                                            {unreadCount} nuevas
                                        </span>
                                        )}
                                    </div>
                                </div>
                                <div style={{ padding: '0.5rem' }}>
                                    {notifications.length === 0 ? (
                                        <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
                                            No tienes notificaciones
                                        </div>
                                    ) : (
                                        notifications.map((notif: any) => (
                                            <div 
                                                key={notif.id}
                                                style={{
                                                    padding: '0.75rem',
                                                    borderBottom: '1px solid #f1f5f9',
                                                    borderRadius: '0.375rem',
                                                    backgroundColor: '#f8fafc',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    transition: 'background-color 0.2s',
                                                    marginBottom: '0.25rem'
                                                }}
                                                onClick={() => markAsRead(notif.id)}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#f8fafc';
                                                }}
                                            >
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a', marginBottom: '0.25rem' }}>
                                                        {notif.title}
                                                    </div>
                                                    <div style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.4 }}>
                                                        {notif.message}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                                                        {new Date(notif.createdAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                                <div style={{ 
                                                    width: '8px', 
                                                    height: '8px', 
                                                    backgroundColor: '#3b82f6', 
                                                    borderRadius: '50%',
                                                    marginTop: '0.25rem'
                                                }} />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="user-menu" ref={dropdownRef} style={{ position: 'relative' }}>
                        <div
                            className="user-menu-btn"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={user?.photoUrl || `https://ui-avatars.com/api/?name=${user?.firstName || 'User'}+${user?.lastName || ''}&background=5D5FEF&color=fff&rounded=true`}
                                alt="User"
                                className="user-avatar"
                                style={{ objectFit: 'cover' }}
                            />
                            <div className="user-info">
                                <span className="user-name">{user?.firstName || 'Usuario'}</span>
                            </div>
                            <ChevronDown
                                size={14}
                                style={{
                                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                                    transition: 'transform 0.2s'
                                }}
                            />
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '0.5rem',
                                backgroundColor: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                zIndex: 50,
                                minWidth: '260px',
                                padding: '0.5rem'
                            }}>
                                <div style={{
                                    padding: '0.5rem',
                                    borderBottom: '1px solid #e2e8f0',
                                    marginBottom: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}>
                                    <img
                                        src={user?.photoUrl || `https://ui-avatars.com/api/?name=${user?.firstName || 'User'}+${user?.lastName || ''}&background=5D5FEF&color=fff&rounded=true`}
                                        alt="User"
                                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>
                                            {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Usuario'}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', wordBreak: 'break-all' }}>
                                            {user?.email || 'admin@sicam.com'}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '100%',
                                        padding: '0.5rem',
                                        fontSize: '0.875rem',
                                        color: '#ef4444',
                                        background: 'transparent',
                                        border: 'none',
                                        borderRadius: '0.375rem',
                                        cursor: 'pointer',
                                        gap: '0.5rem',
                                        textAlign: 'left',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <LogOut size={16} />
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
