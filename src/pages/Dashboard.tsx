import { Users, Package } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import MonthlySales from '../components/dashboard/MonthlySales';
import MonthlyTarget from '../components/dashboard/MonthlyTarget';
import Statistics from '../components/dashboard/Statistics';
import EngagementCard from '../components/dashboard/EngagementCard';

export default function Dashboard() {
    return (
        <div className="dashboard">
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
