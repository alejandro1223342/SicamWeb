import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    Archive
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

export default function Sidebar() {
    const { setActiveSpecialty, availableSpecialties, getActiveSpecialtyId } = useSpecialty();
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

    // Define base menu items (Admin/Management)
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

    // Specialty-specific menu items (Only for Doctors)
    const specialtyItems: MenuItem[] = [];
    if (user?.role === 'MEDICO') {
        availableSpecialties.forEach(spec => {
            specialtyItems.push({
                title: spec.name,
                icon: <Stethoscope size={20} />,
                specialty: spec, // Crucial for ID access
                children: [
                    { title: 'Mi Agenda', icon: <Calendar size={20} />, path: '/dashboard/schedules' },
                    { title: 'Citas', icon: <ClipboardList size={20} />, path: '/dashboard/appointments' },
                    { title: 'Mis Pacientes', icon: <Users size={20} />, path: '/dashboard/patients' },
                ],
            });
        });
    }

    const handleItemClick = (item: MenuItem) => {
        const selectedSpec = availableSpecialties.find(s => s.name === item.title);
        if (selectedSpec) {
            setActiveSpecialty(selectedSpec);
        }
        toggleMenu(item.title);
    };

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-header">
                <Link to={user?.role === 'PACIENTE' ? '/patient/dashboard' : '/dashboard'} className="sidebar-logo">
                    <div className="logo-icon">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <rect width="32" height="32" rx="6" fill="#5D5FEF" />
                            <path
                                d="M16 8L8 12V20L16 24L24 20V12L16 8Z"
                                fill="white"
                            />
                        </svg>
                    </div>
                    <span className="logo-text">
                        {user?.role === 'ADMIN' ? 'Sicam Admin' : user?.role === 'PACIENTE' ? 'Sicam Paciente' : 'Sicam Medico'}
                    </span>
                </Link>
            </div>

            {/* Menu Section */}
            <nav className="sidebar-nav">
                <div className="nav-section">
                    <h3 className="nav-section-title">MENU PRINCIPAL</h3>

                    {[...patientItems, ...specialtyItems, ...managementItems].map((item) => (
                        <div key={item.title}>
                            <button
                                onClick={() => handleItemClick(item)}
                                className={`nav-item ${openMenus[item.title] ? 'active' : ''}`}
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
                                                // If it's a patient or a non-specialty menu, use original path
                                                if (user?.role === 'PACIENTE' || !item.specialty) {
                                                    return child.path || '#';
                                                }

                                                const specId = item.specialty?.id || getActiveSpecialtyId() || 'generic';
                                                const cleanPath = child.path?.replace('/dashboard/', '') || '';
                                                
                                                // Handle history path mapping
                                                if (cleanPath.includes('medical-history')) {
                                                    const historyType = item.title === 'Estética' ? 'aesthetic-history' : 
                                                                       item.title === 'Medicina General' ? 'general-history' : 
                                                                       'medical-history';
                                                    return `/dashboard/specialty/${specId}/${historyType}/${cleanPath.split('/').pop()}`;
                                                }

                                                // Default workspace path
                                                return `/dashboard/specialty/${specId}/${cleanPath}`;
                                            })()}
                                            onClick={() => item.specialty && setActiveSpecialty(item.specialty)}
                                            className={`nav-subitem ${(isActive(child.path) || (item.title === 'Estética' && location.pathname.includes('aesthetic-history')) || (item.title === 'Medicina General' && location.pathname.includes('general-history'))) && getActiveSpecialtyId() === item.specialty?.id ? 'active' : ''}`}
                                        >
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
