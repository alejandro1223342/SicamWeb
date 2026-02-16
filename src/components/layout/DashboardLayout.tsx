import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout() {
    const location = useLocation();

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <Header />
                {/* DEBUG BAR */}
                <div style={{ background: '#000', color: '#fff', padding: '5px' }}>
                    LAYOUT RENDER: {location.pathname} | KEY: {location.key}
                </div>
                <main className="content-area" style={{ border: '5px solid red', padding: '10px' }}>
                    <Outlet key={location.pathname} />
                </main>
            </div>
        </div>
    );
}
