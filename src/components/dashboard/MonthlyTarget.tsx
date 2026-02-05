import { MoreVertical } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Completed', value: 75.55 },
    { name: 'Remaining', value: 24.45 },
];

const COLORS = ['#5D5FEF', '#E5E7EB'];

export default function MonthlyTarget() {
    return (
        <div className="chart-card">
            <div className="chart-header">
                <h3 className="chart-title">Monthly Target</h3>
                <button className="chart-menu-btn">
                    <MoreVertical size={20} />
                </button>
            </div>
            <p className="chart-subtitle">Target you've set for each month</p>

            <div className="target-chart-container">
                <div className="target-chart">
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={0}
                                dataKey="value"
                            >
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="target-percentage">
                        <span className="target-value">75.55%</span>
                        <span className="target-change">↑10%</span>
                    </div>
                </div>

                <p className="target-message">
                    You earn <strong>$3287</strong> today, it's higher than last month.
                    <br />
                    Keep up your good work!
                </p>

                <div className="target-stats">
                    <div className="target-stat">
                        <span className="target-stat-label">Target</span>
                        <span className="target-stat-value negative">$20K ↓</span>
                    </div>
                    <div className="target-stat">
                        <span className="target-stat-label">Revenue</span>
                        <span className="target-stat-value positive">$20K ↑</span>
                    </div>
                    <div className="target-stat">
                        <span className="target-stat-label">Today</span>
                        <span className="target-stat-value positive">$20K ↑</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
