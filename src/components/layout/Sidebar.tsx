import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingCart,
    Bot,
    Calendar,
    UserCircle,
    CheckSquare,
    FileText,
    Table,
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
        title: 'Dashboard',
        icon: <LayoutDashboard size={20} />,
        children: [
            { title: 'Ecommerce', icon: null, path: '/dashboard/ecommerce' },
            { title: 'Analytics', icon: null, path: '/dashboard/analytics' },
            { title: 'Marketing', icon: null, path: '/dashboard/marketing' },
            { title: 'CRM', icon: null, path: '/dashboard/crm' },
            { title: 'Stocks', icon: null, path: '/dashboard/stocks' },
            { title: 'SaaS', icon: null, badge: 'NEW', path: '/dashboard/saas' },
            { title: 'Logistics', icon: null, badge: 'NEW', path: '/dashboard/logistics' },
        ],
    },
];

const supportItems: MenuItem[] = [
    { title: 'AI Assistant', icon: <Bot size={20} />, badge: 'NEW', path: '/ai-assistant' },
    { title: 'E-commerce', icon: <ShoppingCart size={20} />, badge: 'NEW', path: '/ecommerce' },
    { title: 'Calendar', icon: <Calendar size={20} />, path: '/calendar' },
    { title: 'User Profile', icon: <UserCircle size={20} />, path: '/profile' },
    { title: 'Task', icon: <CheckSquare size={20} />, path: '/tasks' },
    { title: 'Forms', icon: <FileText size={20} />, path: '/forms' },
    { title: 'Tables', icon: <Table size={20} />, path: '/tables' },
];

const authItems: MenuItem[] = [
    { title: 'Sign In', icon: null, path: '/signin' },
    { title: 'Sign Up', icon: null, path: '/signup' },
    { title: 'Reset Password', icon: null, path: '/reset-password' },
    { title: 'Two Step Verification', icon: null, path: '/two-step' },
];

export default function Sidebar() {
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
        Dashboard: true,
        Authentication: false,
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
                    <span className="logo-text">TailAdmin</span>
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

                {/* Support Section */}
                <div className="nav-section">
                    <h3 className="nav-section-title">SUPPORT</h3>
                    {supportItems.map((item) => (
                        <Link
                            key={item.title}
                            to={item.path || '#'}
                            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                        >
                            <div className="nav-item-content">
                                {item.icon}
                                <span>{item.title}</span>
                                {item.badge && <span className="badge">{item.badge}</span>}
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Others Section */}
                <div className="nav-section">
                    <h3 className="nav-section-title">OTHERS</h3>
                    <button
                        onClick={() => toggleMenu('Authentication')}
                        className={`nav-item ${openMenus['Authentication'] ? 'active' : ''}`}
                    >
                        <div className="nav-item-content">
                            <UserCircle size={20} />
                            <span>Authentication</span>
                        </div>
                        {openMenus['Authentication'] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    {openMenus['Authentication'] && (
                        <div className="nav-submenu">
                            {authItems.map((child) => (
                                <Link
                                    key={child.title}
                                    to={child.path || '#'}
                                    className={`nav-subitem ${isActive(child.path) ? 'active' : ''}`}
                                >
                                    {child.title}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                <p className="footer-title">#1 Tailwind CSS Dashboard</p>
                <p className="footer-subtitle">Leading Tailwind CSS Admin</p>
            </div>
        </aside>
    );
}
