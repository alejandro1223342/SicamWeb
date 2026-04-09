import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Section {
    id: string;
    title: string;
    icon?: React.ReactNode;
}

interface SectionNavigatorProps {
    sections: Section[];
    renderSection: (sectionId: string) => React.ReactNode;
    initialSectionId?: string;
    onSectionChange?: (sectionId: string) => void;
    activeColor?: string;
    activeBgColor?: string;
}

export default function SectionNavigator({ 
    sections, 
    renderSection, 
    initialSectionId,
    onSectionChange,
    activeColor = '#3b82f6',
    activeBgColor
}: SectionNavigatorProps) {
    const [activeId, setActiveId] = useState(initialSectionId || sections[0].id);
    const activeIndex = sections.findIndex(s => s.id === activeId);

    // Default light background if not provided
    const defaultBgColor = activeColor === '#3b82f6' ? '#eff6ff' : `${activeColor}15`; // 15 is ~8% opacity
    const finalBgColor = activeBgColor || defaultBgColor;

    const handleSectionChange = (id: string) => {
        setActiveId(id);
        onSectionChange?.(id);
    };

    const next = () => {
        if (activeIndex < sections.length - 1) {
            handleSectionChange(sections[activeIndex + 1].id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prev = () => {
        if (activeIndex > 0) {
            handleSectionChange(sections[activeIndex - 1].id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div style={{ display: 'flex', gap: '24px', minHeight: '600px', alignItems: 'flex-start' }}>
            {/* Internal Sidebar */}
            <div style={{ 
                width: '240px', 
                flexShrink: 0, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '8px',
                borderRight: '1px solid #f1f5f9',
                paddingRight: '16px',
                position: 'sticky',
                top: '100px'
            }}>
                {sections.map((section, index) => {
                    const isActive = section.id === activeId;
                    return (
                        <button
                            key={section.id}
                            onClick={() => handleSectionChange(section.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                border: 'none',
                                backgroundColor: isActive ? finalBgColor : 'transparent',
                                color: isActive ? activeColor : '#64748b',
                                fontWeight: isActive ? '700' : '500',
                                fontSize: '14px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span style={{ 
                                width: '24px', 
                                height: '24px', 
                                borderRadius: '6px', 
                                backgroundColor: isActive ? activeColor : '#f1f5f9',
                                color: isActive ? 'white' : '#94a3b8',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: '800'
                            }}>
                                {index + 1}
                            </span>
                            {section.title}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                    {renderSection(activeId)}
                </div>

                {/* Footer Navigation */}
                <div style={{ 
                    marginTop: 'auto', 
                    paddingTop: '24px', 
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <button
                        onClick={prev}
                        disabled={activeIndex === 0}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: 'white',
                            color: activeIndex === 0 ? '#cbd5e1' : '#64748b',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: activeIndex === 0 ? 'default' : 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <ChevronLeft size={18} /> Anterior
                    </button>

                    <button
                        onClick={next}
                        disabled={activeIndex === sections.length - 1}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 24px',
                            borderRadius: '10px',
                            border: 'none',
                            backgroundColor: activeIndex === sections.length - 1 ? '#f1f5f9' : activeColor,
                            color: activeIndex === sections.length - 1 ? '#cbd5e1' : 'white',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: activeIndex === sections.length - 1 ? 'default' : 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: activeIndex === sections.length - 1 ? 'none' : `0 4px 12px ${activeColor}40`
                        }}
                    >
                        Siguiente <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
