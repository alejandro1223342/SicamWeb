import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    change: number;
    icon: LucideIcon;
}

export default function StatsCard({ title, value, change, icon: Icon }: StatsCardProps) {
    const isPositive = change >= 0;

    return (
        <div className="stats-card">
            <div className="stats-icon">
                <Icon size={24} />
            </div>
            <div className="stats-content">
                <p className="stats-title">{title}</p>
                <div className="stats-bottom">
                    <h3 className="stats-value">{value.toLocaleString()}</h3>
                    <span className={`stats-change ${isPositive ? 'positive' : 'negative'}`}>
                        {isPositive ? '↑' : '↓'} {Math.abs(change)}%
                    </span>
                </div>
            </div>
        </div>
    );
}
