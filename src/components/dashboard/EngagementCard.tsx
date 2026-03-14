import { ArrowUp, ArrowDown } from 'lucide-react';

interface RevenueData {
    total: number;
    today: number;
    target: number;
    percentage: number;
}

interface EngagementCardProps {
    revenueData?: RevenueData;
}

export default function EngagementCard({ revenueData }: EngagementCardProps) {
    const total = revenueData?.total || 0;
    const today = revenueData?.today || 0;
    const target = revenueData?.target || 0;
    const percentage = revenueData?.percentage || 0;

    return (
        <div className="chart-card engagement-card">
            <div className="engagement-content">
                <p className="engagement-message">
                    Has ganado <strong>${today.toLocaleString()}</strong> hoy. 
                    {percentage > 50 ? ' ¡Buen trabajo, sigues por encima de la media!' : ' ¡Sigue así para alcanzar tu meta mensual!'}
                </p>
                <div className="engagement-image">
                    {/* Placeholder for illustration */}
                </div>
            </div>

            <div className="engagement-stats">
                <div className="e-stat">
                    <span className="e-label">Meta</span>
                    <div className="e-value-row">
                        <span className="e-value">${(target / 1000).toFixed(0)}K</span>
                        <ArrowDown size={14} className="text-danger" />
                    </div>
                </div>
                <div className="e-divider"></div>
                <div className="e-stat">
                    <span className="e-label">Ingresos</span>
                    <div className="e-value-row">
                        <span className="e-value">${(total / 1000).toFixed(1)}K</span>
                        <ArrowUp size={14} className="text-success" />
                    </div>
                </div>
                <div className="e-divider"></div>
                <div className="e-stat">
                    <span className="e-label">Hoy</span>
                    <div className="e-value-row">
                        <span className="e-value">${today.toLocaleString()}</span>
                        <ArrowUp size={14} className="text-success" />
                    </div>
                </div>
            </div>
        </div>
    );
}
