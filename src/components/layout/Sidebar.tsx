import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    UserCircle,
    Building2,
    ChevronDown,
    ChevronRight,
    Stethoscope,
    Calendar,
    Users,
    ClipboardList,
    Archive,
    Menu
} from 'lucide-react';
import { useSpecialty } from '../../context/SpecialtyContext';

interface MenuItem {
    title: string;
    icon: React.ReactNode;
    path?: string;
    badge?: string;
    children?: MenuItem[];
    specialty?: { id: string; name: string; description: string };
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { setActiveSpecialty, availableSpecialties, getActiveSpecialtyId } = useSpecialty();
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
        Acceso: true,
    });
    const location = useLocation();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch (e) {
                console.error("Error parsing user in Sidebar", e);
            }
        }
    }, []);

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const isActive = (path?: string) => {
        return path && location.pathname === path;
    };

    // Define base menu items
    const managementItems: MenuItem[] = [];
    if (user?.role === 'ADMIN') {
        managementItems.push({
            title: 'Configuracion',
            icon: <LayoutDashboard size={20} />,
            children: [
                { title: 'Gestion de Medicos', icon: <Users size={20} />, path: '/dashboard/doctors' },
                { title: 'Gestion de Consultorios', icon: <Building2 size={20} />, path: '/dashboard/medical-offices' },
                { title: 'Gestión de Catálogos', icon: <Archive size={20} />, path: '/dashboard/catalogs' },
            ],
        });
    }

    const patientItems: MenuItem[] = [];
    if (user?.role === 'PACIENTE') {
        patientItems.push({
            title: 'Mi Portal',
            icon: <LayoutDashboard size={20} />,
            children: [
                { title: 'Consultorios Clinicos', icon: <Building2 size={20} />, path: '/patient/clinics' },
                { title: 'Mi Perfil', icon: <UserCircle size={20} />, path: '/patient/profile' },
                { title: 'Mis Citas', icon: <Calendar size={20} />, path: '/patient/appointments' },
            ],
        });
    }

    const specialtyItems: MenuItem[] = [];
    const doctorItems: MenuItem[] = [];
    
    if (user?.role === 'MEDICO') {
        doctorItems.push({
            title: 'Mi Perfil',
            icon: <UserCircle size={20} />,
            path: '/dashboard/profile'
        });

        availableSpecialties.forEach(spec => {
            specialtyItems.push({
                title: spec.name,
                icon: <Stethoscope size={20} />,
                specialty: spec,
                children: [
                    { title: 'Mi Agenda', icon: <Calendar size={20} />, path: '/dashboard/schedules' },
                    { title: 'Citas', icon: <ClipboardList size={20} />, path: '/dashboard/appointments' },
                    { title: 'Mis Pacientes', icon: <Users size={20} />, path: '/dashboard/patients' },
                ],
            });
        });
    }

    const handleItemClick = (item: MenuItem) => {
        if (item.path) {
            navigate(item.path);
            if (window.innerWidth < 1024) onClose();
            return;
        }
        
        const selectedSpec = availableSpecialties.find(s => s.name === item.title);
        if (selectedSpec) {
            setActiveSpecialty(selectedSpec);
        }
        toggleMenu(item.title);
    };

    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 1024 : false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const sidebarStyle: React.CSSProperties = {
        backgroundColor: '#ffffff',
        zIndex: 100000,
        position: 'fixed',
        left: 0,
        top: 0,
        width: isMobile ? '100vw' : '260px',
        height: '100vh',
        boxShadow: isOpen && isMobile ? '0 10px 40px rgba(0,0,0,0.3)' : 'none',
        transform: isMobile ? (isOpen ? 'translateY(0)' : 'translateY(-101%)') : 'none',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
    };

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`} style={sidebarStyle}>
            <div className="sidebar-header" style={{ 
                padding: '12px 20px', 
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: '72px'
            }}>
                <Link to={user?.role === 'PACIENTE' ? '/patient/dashboard' : '/dashboard'} className="sidebar-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="logo-icon">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <rect width="32" height="32" rx="8" fill="#5D5FEF" />
                            <path d="M16 8L8 12V20L16 24L24 20V12L16 8Z" fill="white" />
                        </svg>
                    </div>
                    <span className="logo-text" style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1E293B' }}>
                        {user && user?.role === 'ADMIN' ? 'Sicam Admin' : user?.role === 'PACIENTE' ? 'Sicam Paciente' : 'Sicam Medico'}
                    </span>
                </Link>

                {isMobile && (
                    <button 
                        onClick={onClose}
                        style={{
                            background: '#f1f5f9',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px',
                            cursor: 'pointer',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Menu size={24} />
                    </button>
                )}
            </div>

            <nav className="sidebar-nav" style={{ flex: 1, overflowY: 'auto' }}>
                <div className="nav-section">
                    <h3 className="nav-section-title">MENU PRINCIPAL</h3>

                    {[...patientItems, ...doctorItems, ...specialtyItems, ...managementItems].map((item) => (
                        <div key={item.title}>
                            <button
                                onClick={() => handleItemClick(item)}
                                className={`nav-item ${(openMenus[item.title] || isActive(item.path)) ? 'active' : ''}`}
                            >
                                <div className="nav-item-content">
                                    {item.icon}
                                    <span>{item.title}</span>
                                    {item.badge && <span className="badge">{item.badge}</span>}
                                </div>
                                {item.children && (
                                    openMenus[item.title] ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                                )}
                            </button>
                            {item.children && openMenus[item.title] && (
                                <div className="nav-submenu">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.title}
                                            to={(() => {
                                                if (user?.role === 'PACIENTE' || !item.specialty) {
                                                    return child.path || '#';
                                                }
                                                const specId = item.specialty?.id || getActiveSpecialtyId() || 'generic';
                                                const cleanPath = child.path?.replace('/dashboard/', '') || '';
                                                if (cleanPath.includes('medical-history')) {
                                                    const historyType = item.title === 'Estética' ? 'aesthetic-history' : 
                                                                       item.title === 'Medicina General' ? 'general-history' : 
                                                                       'medical-history';
                                                    return `/dashboard/specialty/${specId}/${historyType}/${cleanPath.split('/').pop()}`;
                                                }
                                                return `/dashboard/specialty/${specId}/${cleanPath}`;
                                            })()}
                                            onClick={() => {
                                                if (item.specialty) setActiveSpecialty(item.specialty);
                                                if (window.innerWidth < 1024) onClose();
                                            }}
                                            className={`nav-subitem ${(isActive(child.path) || (item.title === 'Estética' && location.pathname.includes('aesthetic-history')) || (item.title === 'Medicina General' && location.pathname.includes('general-history'))) && getActiveSpecialtyId() === item.specialty?.id ? 'active' : ''}`}
                                        >
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {child.icon}
                                                {child.title}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </nav>
        </aside>
    );
}
