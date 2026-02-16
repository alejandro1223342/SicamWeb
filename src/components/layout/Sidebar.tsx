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
    ClipboardList
} from 'lucide-react';
import { useSpecialty } from '../../context/SpecialtyContext';

interface MenuItem {
    title: string;
    icon: React.ReactNode;
    path?: string;
    badge?: string;
    children?: MenuItem[];
}

export default function Sidebar() {
    const { activeSpecialty, setActiveSpecialty, setAvailableSpecialties, availableSpecialties } = useSpecialty();
    const [user, setUser] = useState<any>(null);
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
        Acceso: true,
        Tricología: true
    });
    const location = useLocation();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);

            if (parsedUser.role === 'MEDICO' && parsedUser.specialties) {
                const specialties = parsedUser.specialties.map((us: any) => us.specialty);
                setAvailableSpecialties(specialties);

                if (!localStorage.getItem('activeSpecialty') && specialties.length > 0) {
                    setActiveSpecialty(specialties[0]);
                }
            } else if (parsedUser.role !== 'MEDICO') {
                // If not a doctor, clear any leftover specialty state
                setActiveSpecialty(null);
            }
        }
    }, [setAvailableSpecialties, setActiveSpecialty]);

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
            title: 'Configuración',
            icon: <LayoutDashboard size={20} />,
            children: [
                { title: 'Gestión de Médicos', icon: <UserCircle size={20} />, path: '/dashboard/doctor/new' },
                { title: 'Gestión de Consultorios', icon: <Building2 size={20} />, path: '/dashboard/medical-offices' },
            ],
        });
    }

    // Specialty-specific menu items (Only for Doctors)
    const specialtyItems: MenuItem[] = [];
    if (activeSpecialty && user?.role === 'MEDICO') {
        specialtyItems.push({
            title: activeSpecialty.name,
            icon: <Stethoscope size={20} />,
            children: [
                { title: 'Mi Agenda', icon: <Calendar size={20} />, path: '/dashboard/schedules' },
                { title: 'Mis Pacientes', icon: <Users size={20} />, path: '/dashboard/patients' },
                { title: 'Historias Clínicas', icon: <ClipboardList size={20} />, path: '/dashboard/medical-history' },
            ],
        });
    }

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-header">
                <Link to="/dashboard" className="sidebar-logo">
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
                        {user?.role === 'ADMIN' ? 'Sicam Admin' : 'Sicam Médico'}
                    </span>
                </Link>
            </div>

            {/* Specialty Switcher (Only for Doctors with multiple specialties) */}
            {user?.role === 'MEDICO' && availableSpecialties.length > 1 && (
                <div style={{ padding: '0 20px 20px', borderBottom: '1px solid var(--border)' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-gray)', marginBottom: '8px', display: 'block' }}>
                        ESPECIALIDAD ACTIVA
                    </label>
                    <select
                        className="form-input"
                        style={{ padding: '8px', fontSize: '13px' }}
                        value={activeSpecialty?.id || ''}
                        onChange={(e) => {
                            const selected = availableSpecialties.find(s => s.id === e.target.value);
                            if (selected) setActiveSpecialty(selected);
                        }}
                    >
                        {availableSpecialties.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Menu Section */}
            <nav className="sidebar-nav">
                <div className="nav-section">
                    <h3 className="nav-section-title">MENU PRINCIPAL</h3>

                    {[...specialtyItems, ...managementItems].map((item) => (
                        <div key={item.title}>
                            <button
                                onClick={() => toggleMenu(item.title)}
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
                                            to={child.path || '#'}
                                            className={`nav-subitem ${isActive(child.path) ? 'active' : ''}`}
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
