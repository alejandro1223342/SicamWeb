import { ArrowUp, ArrowDown } from 'lucide-react';

export default function EngagementCard() {
    return (
        <div className="chart-card engagement-card">
            <div className="engagement-content">
                <p className="engagement-message">
                    You earn <strong>$3287</strong> today, it's higher than last month. Keep up your good work!
                </p>
                <div className="engagement-image">
                    {/* Placeholder for the illustration in the image */}
                </div>
            </div>

            <div className="engagement-stats">
                <div className="e-stat">
                    <span className="e-label">Target</span>
                    <div className="e-value-row">
                        <span className="e-value">$20K</span>
                        <ArrowDown size={14} className="text-danger" />
                    </div>
                </div>
                <div className="e-divider"></div>
                <div className="e-stat">
                    <span className="e-label">Revenue</span>
                    <div className="e-value-row">
                        <span className="e-value">$20K</span>
                        <ArrowUp size={14} className="text-success" />
                    </div>
                </div>
                <div className="e-divider"></div>
                <div className="e-stat">
                    <span className="e-label">Today</span>
                    <div className="e-value-row">
                        <span className="e-value">$20K</span>
                        <ArrowUp size={14} className="text-success" />
                    </div>
                </div>
            </div>
        </div>
    );
}
