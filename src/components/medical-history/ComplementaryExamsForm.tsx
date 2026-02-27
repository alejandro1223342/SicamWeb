import { useState } from 'react';
import { Eye, FileText } from 'lucide-react';

interface ComplementaryExamData {
    category: string;
    options: string[];
    other: string;
    diagnosis: string;
}

interface Props {
    data: ComplementaryExamData;
    onChange: (data: ComplementaryExamData) => void;
    onSave?: () => void;
}

const CATEGORIES = [
    'HEMATOLOGÍA',
    'HEMOSTASIA',
    'HEMOQUÍMICA',
    'PERFIL LIPÍDICO',
    'PERFIL TIROIDEO'
];

const HEMATOLOGY_OPTIONS = [
    'BIOMETRÍA HEMÁTICA', 'HEMATROCRITO + HEMOGLOBINA', 'SEDIMENTACIÓN', 'PLAQUETAS',
    'RETICULOSCITOS', 'MORFOLOGÍA CELULAR', 'GRUPO SANGUÍNEO Y RH', 'DREPANOCITOS',
    'COOMBS DIRECTO', 'COOMBS INDIRECTO', 'VITAMINA D25', 'VITAMINA B12', 'ÁCIDO FÓLICO'
];

export default function ComplementaryExamsForm({ data = { category: '', options: [], other: '', diagnosis: '' }, onChange, onSave }: Props) {

    // Fake state to toggle UI view
    const [selectedCategory, setSelectedCategory] = useState<string>('HEMATOLOGÍA');

    const handleToggleOption = (opt: string) => {
        const currentOptions = data.options || [];
        let newOptions = [...currentOptions];
        if (newOptions.includes(opt)) {
            newOptions = newOptions.filter(o => o !== opt);
        } else {
            newOptions.push(opt);
        }
        onChange({ ...data, options: newOptions });
    };

    return (
        <div className="section-container" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
                Exámenes complementarios solicitados
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

                {/* Left Column: Categories */}
                <div>
                    <h4 style={{ textAlign: 'center', color: '#475569', fontWeight: '600', fontSize: '16px', marginBottom: '16px' }}>
                        Exámenes complementarios
                    </h4>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                            <thead style={{ backgroundColor: '#f8fafc', color: '#1e293b', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th colSpan={2} style={{ padding: '12px', textAlign: 'center' }}>Exámen complementario</th>
                                </tr>
                            </thead>
                            <tbody>
                                {CATEGORIES.map((cat, idx) => (
                                    <tr
                                        key={cat}
                                        style={{
                                            backgroundColor: idx % 2 !== 0 ? '#f8fafc' : 'white',
                                            borderBottom: '1px solid #e2e8f0',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        <td style={{ padding: '8px 12px', textAlign: 'center', width: '50px' }}>
                                            <button style={{
                                                backgroundColor: selectedCategory === cat ? '#3b82f6' : '#94a3b8',
                                                color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                        <td style={{ padding: '8px 12px', color: selectedCategory === cat ? '#1d4ed8' : '#475569', fontWeight: selectedCategory === cat ? '500' : '400', textTransform: 'uppercase' }}>
                                            {cat}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Options & Inputs */}
                <div style={{ paddingLeft: '24px', borderLeft: '1px dashed #cbd5e1' }}>
                    <h4 style={{ textAlign: 'center', color: '#475569', fontWeight: '600', fontSize: '16px', marginBottom: '16px' }}>
                        Lista de opciones
                    </h4>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontWeight: '500', color: '#475569', marginBottom: '12px' }}>Seleccione(*)</label>

                        {selectedCategory === 'HEMATOLOGÍA' ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {HEMATOLOGY_OPTIONS.map(opt => (
                                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={(data.options || []).includes(opt)}
                                            onChange={() => handleToggleOption(opt)}
                                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '4px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                                Opciones para {selectedCategory}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: '500', color: '#475569', marginBottom: '8px', fontSize: '14px' }}>Otro(*)</label>
                            <textarea
                                value={data.other || ''}
                                onChange={(e) => onChange({ ...data, other: e.target.value })}
                                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', resize: 'vertical', minHeight: '60px', outlineColor: '#3b82f6', fontSize: '14px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: '500', color: '#475569', marginBottom: '8px', fontSize: '14px' }}>Diagnóstico(*)</label>
                            <textarea
                                value={data.diagnosis || ''}
                                onChange={(e) => onChange({ ...data, diagnosis: e.target.value })}
                                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', resize: 'vertical', minHeight: '60px', outlineColor: '#3b82f6', fontSize: '14px' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
                        <button
                            onClick={(e) => { e.preventDefault(); onSave && onSave(); }}
                            style={{ backgroundColor: '#4f46e5', color: 'white', padding: '8px 48px', borderRadius: '4px', fontWeight: '600', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>

            {/* Boton Ver PDF al final */}
            <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
                <button
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '8px 24px', borderRadius: '4px', fontWeight: '600', cursor: 'pointer' }}
                >
                    <FileText size={18} /> Ver PDF
                </button>
            </div>

        </div>
    );
}
