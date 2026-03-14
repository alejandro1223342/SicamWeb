import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';

const monthNamesES: { [key: string]: string } = {
    'Jan': 'Ene', 'Feb': 'Feb', 'Mar': 'Mar', 'Apr': 'Abr',
    'May': 'May', 'Jun': 'Jun', 'Jul': 'Jul', 'Aug': 'Ago',
    'Sep': 'Sep', 'Oct': 'Oct', 'Nov': 'Nov', 'Dec': 'Dic'
};

interface StatisticsProps {
    data: any[];
    salesCount?: number;
}

export default function Statistics({ data, salesCount = 0 }: StatisticsProps) {
    const chartData = data.map(item => ({
        ...item,
        date: monthNamesES[item.month] || item.month
    }));

    const [activeFilter, setActiveFilter] = useState('Mensual');

    return (
        <div className="chart-card">
            <div className="chart-header">
                <div>
                    <h3 className="chart-title">Estadísticas Generales</h3>
                    <p className="chart-subtitle">Progreso de objetivos mensuales</p>
                </div>
                <button className="chart-menu-btn">
                    <MoreVertical size={20} />
                </button>
            </div>

            <div className="stats-filters">
                <button
                    className={`filter-btn ${activeFilter === 'Mensual' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('Mensual')}
                >
                    Mensual
                </button>
                <button
                    className={`filter-btn ${activeFilter === 'Trimestral' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('Trimestral')}
                >
                    Trimestral
                </button>
                <button
                    className={`filter-btn ${activeFilter === 'Anual' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('Anual')}
                >
                    Anual
                </button>
                <div className="date-range">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M5 1v3M11 1v3M2 6h12" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    Resumen de Año Actual
                </div>
            </div>

            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#5D5FEF" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#5D5FEF" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748B', fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748B', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="sales"
                            name="Citas"
                            stroke="#5D5FEF"
                            strokeWidth={2}
                            fill="url(#colorSales)"
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            name="Ingresos ($)"
                            stroke="#10B981"
                            strokeWidth={2}
                            fill="url(#colorRevenue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>

                <div className="chart-legend">
                    <div className="legend-item">
                        <span className="legend-dot sales"></span>
                        <span className="legend-label">Citas Totales (Pagadas): {salesCount}</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot" style={{ backgroundColor: '#10B981' }}></span>
                        <span className="legend-label">Ingresos Mensuales</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
