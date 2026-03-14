import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoreVertical } from 'lucide-react';

interface MonthlyStats {
    month: string;
    sales: number;
}

const monthNamesES: { [key: string]: string } = {
    'Jan': 'Ene', 'Feb': 'Feb', 'Mar': 'Mar', 'Apr': 'Abr',
    'May': 'May', 'Jun': 'Jun', 'Jul': 'Jul', 'Aug': 'Ago',
    'Sep': 'Sep', 'Oct': 'Oct', 'Nov': 'Nov', 'Dec': 'Dic'
};

interface MonthlySalesProps {
    salesData: MonthlyStats[];
}

export default function MonthlySales({ salesData }: MonthlySalesProps) {
    const data = salesData.map(item => ({
        ...item,
        month: monthNamesES[item.month] || item.month
    }));

    return (
        <div className="chart-card">
            <div className="chart-header">
                <h3 className="chart-title">Citas Mensuales</h3>
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
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(93, 95, 239, 0.1)' }}
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                            }}
                            formatter={(value: any) => [value, 'Citas']}
                        />
                        <Bar dataKey="sales" name="Citas" fill="#5D5FEF" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
