import { useState, useEffect } from 'react';
import { Search, Moon, Bell, ChevronDown } from 'lucide-react';

export default function Header() {
    const [user, setUser] = useState<any>(null);

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
                    <div className="user-menu">
                        <div className="user-menu-btn">
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.firstName || 'User'}+${user?.lastName || ''}&background=5D5FEF&color=fff&rounded=true`}
                                alt="User"
                                className="user-avatar"
                            />
                            <div className="user-info">
                                <span className="user-name">{user?.firstName || 'Usuario'}</span>
                            </div>
                            <ChevronDown size={14} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
