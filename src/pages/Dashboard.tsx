import { useNavigate } from 'react-router-dom';
import { Users, Package } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import MonthlySales from '../components/dashboard/MonthlySales';
import MonthlyTarget from '../components/dashboard/MonthlyTarget';
import Statistics from '../components/dashboard/Statistics';
import EngagementCard from '../components/dashboard/EngagementCard';

export default function Dashboard() {
    const navigate = useNavigate();
    return (
        <div className="dashboard">
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', padding: '10px', background: '#ffe4e6', borderRadius: '8px', border: '1px solid #f43f5e' }}>
                <strong>DEBUG MENU:</strong>
                <button onClick={() => navigate('/dashboard/patients')} style={{ padding: '5px 10px', background: 'white', border: '1px solid black' }}>
                    IR A PACIENTES
                </button>
                <button onClick={() => navigate('/dashboard/medical-history')} style={{ padding: '5px 10px', background: 'white', border: '1px solid black' }}>
                    IR A HISTORIAS
                </button>
                <button onClick={() => navigate('/dashboard/schedules')} style={{ padding: '5px 10px', background: 'white', border: '1px solid black' }}>
                    IR A AGENDA
                </button>
            </div>

            {/* Row 1: Bar Chart + Engagement Card */}
            <div className="charts-grid">
                <MonthlySales />
                <EngagementCard />
            </div>

            {/* Row 2: Statistics (Area Chart) */}
            <Statistics />

            {/* Optional/Previous components can go below or be removed */}
            <div className="stats-grid" style={{ display: 'none' }}>
                <StatsCard title="Customers" value={3782} change={11.01} icon={Users} />
                <StatsCard title="Orders" value={5359} change={-9.05} icon={Package} />
                <MonthlyTarget />
            </div>
        </div>
    );
}
