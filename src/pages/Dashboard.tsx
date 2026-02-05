import { Users, Package } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import MonthlySales from '../components/dashboard/MonthlySales';
import MonthlyTarget from '../components/dashboard/MonthlyTarget';
import Statistics from '../components/dashboard/Statistics';

export default function Dashboard() {
    return (
        <div className="dashboard">
            {/* Stats Cards Row */}
            <div className="stats-grid">
                <StatsCard title="Customers" value={3782} change={11.01} icon={Users} />
                <StatsCard title="Orders" value={5359} change={-9.05} icon={Package} />
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
                <div className="charts-left">
                    <MonthlySales />
                    <Statistics />
                </div>
                <div className="charts-right">
                    <MonthlyTarget />
                </div>
            </div>
        </div>
    );
}
