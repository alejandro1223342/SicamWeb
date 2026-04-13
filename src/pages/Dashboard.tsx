import { useEffect, useState } from 'react';
import { Users, Calendar, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import MonthlySales from '../components/dashboard/MonthlySales';
import Statistics from '../components/dashboard/Statistics';
import EngagementCard from '../components/dashboard/EngagementCard';
import StatsCard from '../components/dashboard/StatsCard';
import api from '../api';

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

    const totalSales = stats?.monthlySales?.reduce((acc: number, curr: any) => acc + curr.sales, 0) || 0;
    const totalRevenue = stats?.revenue?.total || 0;
    const todayRevenue = stats?.revenue?.today || 0;
    const goalPercentage = stats?.revenue?.percentage || 0;

    return (
        <div className="dashboard-container" style={{ padding: '24px' }}>
            <div className="page-header" style={{ marginBottom: '32px' }}>
                <div>
                    <h1 className="page-title">Panel de Control</h1>
                    <p className="page-subtitle">Bienvenido de nuevo. Aquí tienes un resumen de hoy.</p>
                </div>
            </div>

            {/* Tarjetas de Resumen */}
            <div className="stats-grid" style={{ marginBottom: '32px' }}>
                <StatsCard 
                    title="Citas del Mes" 
                    value={totalSales} 
                    change={12} 
                    icon={Calendar} 
                />
                <StatsCard 
                    title="Ingresos Totales" 
                    value={`$${totalRevenue.toLocaleString()}`} 
                    change={8} 
                    icon={DollarSign} 
                />
                <StatsCard 
                    title="Ingresos Hoy" 
                    value={`$${todayRevenue.toLocaleString()}`} 
                    change={todayRevenue > 0 ? 5 : 0} 
                    icon={TrendingUp} 
                />
                <StatsCard 
                    title="Cumplimiento Meta" 
                    value={`${goalPercentage}%`} 
                    change={goalPercentage > 50 ? 2 : -1} 
                    icon={Users} 
                />
            </div>

            <div className="charts-grid">
                <div className="charts-left" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* El componente Statistics es el de "Estadísticas Generales" */}
                    <Statistics 
                        data={stats?.monthlySales || []} 
                        salesCount={totalSales} 
                    />
                    <MonthlySales salesData={stats?.monthlySales || []} />
                </div>
                <div className="charts-right" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <EngagementCard revenueData={stats?.revenue} />
                </div>
            </div>
        </div>
    );
}
