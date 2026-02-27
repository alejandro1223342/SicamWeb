
interface Props {
    data: string[];
    onChange: (data: string[]) => void;
    onSave?: () => void;
}

const OPTIONS = [
    'NINGUNO', 'NEOPLASIAS', 'DIABETES', 'HTA', 'CALVICIE', 'ALERGIAS', 'HTA PADRE'
];

export default function FamilyHistoryForm({ data = [], onChange, onSave }: Props) {

    const toggleOption = (option: string) => {
        if (option === 'NINGUNO') {
            onChange(data.includes('NINGUNO') ? [] : ['NINGUNO']);
            return;
        }

        let newData = [...data];
        if (newData.includes('NINGUNO')) {
            newData = newData.filter(item => item !== 'NINGUNO');
        }

        if (newData.includes(option)) {
            newData = newData.filter(item => item !== option);
        } else {
            newData.push(option);
        }
        onChange(newData);
    };

    return (
        <div className="section-container" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
                Antecedentes familiares
            </h3>

            <label style={{ fontWeight: '500', color: '#475569', marginBottom: '16px', display: 'block' }}>Seleccione(*)</label>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {OPTIONS.map((opt) => {
                    const isSelected = data.includes(opt);
                    return (
                        <div
                            key={opt}
                            onClick={() => toggleOption(opt)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: `1px solid ${isSelected ? '#3b82f6' : '#cbd5e1'}`,
                                backgroundColor: isSelected ? '#eff6ff' : 'white',
                                color: isSelected ? '#1d4ed8' : '#475569',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: '500',
                                transition: 'all 0.2s ease',
                                userSelect: 'none'
                            }}
                        >
                            <div style={{
                                width: '18px', height: '18px', borderRadius: '4px', border: `2px solid ${isSelected ? '#3b82f6' : '#cbd5e1'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isSelected ? '#3b82f6' : 'transparent'
                            }}>
                                {isSelected && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px' }}><polyline points="20 6 9 17 4 12"></polyline></svg>}
                            </div>
                            {opt}
                        </div>
                    );
                })}
            </div >

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
                <button
                    onClick={(e) => { e.preventDefault(); onSave && onSave(); }}
                    style={{ backgroundColor: '#22c55e', color: 'white', padding: '10px 32px', borderRadius: '6px', fontWeight: '500', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#22c55e'}
                >
                    Guardar sección
                </button>
            </div>
        </div >
    );
}
