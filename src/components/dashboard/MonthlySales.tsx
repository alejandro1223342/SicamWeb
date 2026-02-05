import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoreVertical } from 'lucide-react';

const data = [
    { month: 'Jan', sales: 250 },
    { month: 'Feb', sales: 350 },
    { month: 'Mar', sales: 300 },
    { month: 'Apr', sales: 350 },
    { month: 'May', sales: 300 },
    { month: 'Jun', sales: 350 },
    { month: 'Jul', sales: 400 },
    { month: 'Aug', sales: 250 },
    { month: 'Sep', sales: 350 },
    { month: 'Oct', sales: 400 },
    { month: 'Nov', sales: 350 },
    { month: 'Dec', sales: 300 },
];

export default function MonthlySales() {
    return (
        <div className="chart-card">
            <div className="chart-header">
                <h3 className="chart-title">Monthly Sales</h3>
                <button className="chart-menu-btn">
                    <MoreVertical size={20} />
                </button>
            </div>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748B', fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748B', fontSize: 12 }}
                            ticks={[0, 100, 200, 300, 400]}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(93, 95, 239, 0.1)' }}
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                            }}
                        />
                        <Bar dataKey="sales" fill="#5D5FEF" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
