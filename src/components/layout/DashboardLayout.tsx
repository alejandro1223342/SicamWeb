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
                <main className="content-area">
                    <Outlet key={location.pathname} />
                </main>
            </div>
        </div>
    );
}
