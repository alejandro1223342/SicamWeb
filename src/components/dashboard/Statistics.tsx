import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';

const data = [
    { date: 'Sep', sales: 200, revenue: 180 },
    { date: '', sales: 220, revenue: 190 },
    { date: '', sales: 250, revenue: 210 },
    { date: '', sales: 240, revenue: 200 },
    { date: '', sales: 280, revenue: 240 },
    { date: '', sales: 260, revenue: 220 },
    { date: '', sales: 300, revenue: 260 },
    { date: '', sales: 320, revenue: 280 },
    { date: '', sales: 310, revenue: 270 },
    { date: '', sales: 340, revenue: 300 },
    { date: '', sales: 330, revenue: 290 },
    { date: '', sales: 350, revenue: 310 },
];

export default function Statistics() {
    const [activeFilter, setActiveFilter] = useState('Monthly');

    return (
        <div className="chart-card">
            <div className="chart-header">
                <div>
                    <h3 className="chart-title">Statistics</h3>
                    <p className="chart-subtitle">Target you've set for each month</p>
                </div>
                <button className="chart-menu-btn">
                    <MoreVertical size={20} />
                </button>
            </div>

            <div className="stats-filters">
                <button
                    className={`filter-btn ${activeFilter === 'Monthly' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('Monthly')}
                >
                    Monthly
                </button>
                <button
                    className={`filter-btn ${activeFilter === 'Quarterly' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('Quarterly')}
                >
                    Quarterly
                </button>
                <button
                    className={`filter-btn ${activeFilter === 'Annually' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('Annually')}
                >
                    Annually
                </button>
                <div className="date-range">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M5 1v3M11 1v3M2 6h12" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    Jan 30 to Feb 05
                </div>
            </div>

            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#5D5FEF" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#5D5FEF" stopOpacity={0} />
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
                            ticks={[200, 250]}
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
                            stroke="#5D5FEF"
                            strokeWidth={2}
                            fill="url(#colorSales)"
                        />
                    </AreaChart>
                </ResponsiveContainer>

                <div className="chart-legend">
                    <div className="legend-item">
                        <span className="legend-dot sales"></span>
                        <span className="legend-label">Sales: 250</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot revenue"></span>
                        <span className="legend-label">Revenue: 170</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
