import { useState, useEffect, useRef } from 'react';
import { Search, Moon, Bell, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const [user, setUser] = useState<any>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (e) {
                console.error("Error al parsear usuario en Header", e);
            }
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
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
        navigate('/signin');
    };

    return (
        <header className="header">
            <div className="header-content">
                {/* Search Bar */}
                <div className="search-container">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar o escribir comando..."
                        className="search-input"
                    />
                    <kbd className="search-kbd">⌘ K</kbd>
                </div>

                {/* Right Section */}
                <div className="header-actions">
                    {/* Dark Mode Toggle */}
                    <button className="header-btn">
                        <Moon size={20} />
                    </button>

                    {/* Notifications */}
                    <button className="header-btn notification-btn">
                        <Bell size={20} />
                        <span className="dot-badge"></span>
                    </button>

                    {/* User Menu */}
                    <div className="user-menu" ref={dropdownRef} style={{ position: 'relative' }}>
                        <div
                            className="user-menu-btn"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.firstName || 'User'}+${user?.lastName || ''}&background=5D5FEF&color=fff&rounded=true`}
                                alt="User"
                                className="user-avatar"
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
                                minWidth: '200px',
                                padding: '0.5rem'
                            }}>
                                <div style={{
                                    padding: '0.5rem',
                                    borderBottom: '1px solid #e2e8f0',
                                    marginBottom: '0.5rem'
                                }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>
                                        {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Usuario'}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', wordBreak: 'break-all' }}>
                                        {user?.email || 'admin@sicam.com'}
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
