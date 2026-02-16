import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    UserCircle,
    ChevronDown,
    ChevronRight,
} from 'lucide-react';

interface MenuItem {
    title: string;
    icon: React.ReactNode;
    path?: string;
    badge?: string;
    children?: MenuItem[];
}

const menuItems: MenuItem[] = [
    {
        title: 'Acceso',
        icon: <LayoutDashboard size={20} />,
        children: [
            { title: 'Médicos', icon: <UserCircle size={20} />, path: '/dashboard/doctor' },
        ],
    },

];


export default function Sidebar() {
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
        Dashboard: true,
    });
    const location = useLocation();

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const isActive = (path?: string) => {
        return path && location.pathname === path;
    };

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
                    <span className="logo-text">Administrador</span>
                </Link>
            </div>

            {/* Menu Section */}
            <nav className="sidebar-nav">
                <div className="nav-section">
                    <h3 className="nav-section-title">MENU</h3>
                    {menuItems.map((item) => (
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
                                            {child.title}
                                            {child.badge && <span className="badge">{child.badge}</span>}
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
