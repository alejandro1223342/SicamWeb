import { useEffect, useState } from 'react';
import MonthlySales from '../components/dashboard/MonthlySales';
import Statistics from '../components/dashboard/Statistics';
import EngagementCard from '../components/dashboard/EngagementCard';
import api from '../api';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllStats = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllStats();
    }, []);

    if (loading) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh'
            }}>
                <Loader2 className="animate-spin" size={48} style={{ color: '#5D5FEF' }} />
                <span style={{ marginLeft: '12px', fontSize: '1.2rem', color: '#64748B' }}>
                    Cargando estadísticas...
                </span>
            </div>
        );
    }

    return (
        <div className="dashboard">
            {/* Row 1: Bar Chart + Engagement Card */}
            <div className="charts-grid">
                <MonthlySales salesData={stats?.monthlySales || []} />
                <EngagementCard revenueData={stats?.revenue} />
            </div>

            {/* Row 2: Statistics (Area Chart) */}
            <Statistics 
                data={stats?.monthlySales || []} 
                salesCount={stats?.monthlySales?.reduce((acc: number, curr: any) => acc + curr.sales, 0) || 0} 
            />
        </div>
    );
}
