import { Search, Moon, Bell, ChevronDown } from 'lucide-react';

export default function Header() {
    return (
        <header className="header">
            <div className="header-content">
                {/* Search Bar */}
                <div className="search-container">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search or type command..."
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
                                src="https://ui-avatars.com/api/?name=Musharof+Chowdhury&background=5D5FEF&color=fff&rounded=true"
                                alt="User"
                                className="user-avatar"
                            />
                            <div className="user-info">
                                <span className="user-name">Musharof</span>
                            </div>
                            <ChevronDown size={14} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
