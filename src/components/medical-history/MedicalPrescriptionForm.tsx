import { FileText, Printer } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { debounce } from '@mui/material/utils';
import api from '../../api';

interface CieOption {
    code: string;
    description: string;
}

export interface MedicalPrescriptionData {
    cie10: any; // Can be string or CieOption[]
    hasAllergies: boolean;
    allergiesDetails: string;
    medications: string;
    indications: string;
    prescriptionNumber?: number;
}

interface MedicalPrescriptionFormProps {
    data: MedicalPrescriptionData;
    onChange: (data: MedicalPrescriptionData) => void;
    readOnly?: boolean;
    patient?: any;
    recordId?: string | null;
}

export default function MedicalPrescriptionForm({ data, onChange, readOnly = false, patient, recordId }: MedicalPrescriptionFormProps) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<CieOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const fetchCieCodes = useCallback(
        debounce(async (searchValue: string) => {
            if (searchValue.length < 2) {
                setOptions([]);
                return;
            }
            setLoading(true);
            try {
                const response = await api.get('/catalogs/cie-codes', {
                    params: { search: searchValue }
                });
                setOptions(response.data);
            } catch (error) {
                console.error('Error fetching CIE codes:', error);
            } finally {
                setLoading(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        if (!readOnly) {
            fetchCieCodes(inputValue);
        }
    }, [inputValue, fetchCieCodes, readOnly]);

    const handleFieldChange = (field: keyof MedicalPrescriptionData, value: any) => {
        if (readOnly) return;
        onChange({ ...data, [field]: value });
    };

    // Normalize cie10 value for the Autocomplete
    const cieValue = useMemo(() => {
        if (!data?.cie10) return [];
        if (typeof data.cie10 === 'string') {
            // Handle legacy string data
            return data.cie10.split(',').map(code => ({ code: code.trim(), description: '' })).filter(c => c.code);
        }
        if (Array.isArray(data.cie10)) {
            return data.cie10;
        }
        return [];
    }, [data?.cie10]);

    return (
        <div className="section-container" style={{ animation: 'fadeIn 0.3s ease-in-out', backgroundColor: '#fcfcfd', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                    <FileText size={24} color="#3b82f6" /> Receta Médica
                </h3>
                <button 
                    onClick={() => {
                        sessionStorage.setItem('temp_prescription_print', JSON.stringify({ patient, data, recordId }));
                        window.open('/print/prescription', '_blank');
                    }}
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        backgroundColor: '#f1f5f9', 
                        color: '#475569', 
                        border: '1px solid #cbd5e1', 
                        padding: '8px 16px', 
                        borderRadius: '8px', 
                        fontWeight: '600', 
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0'; e.currentTarget.style.color = '#1e293b'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#475569'; }}
                >
                    <Printer size={18} /> Imprimir Receta
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* CIE 10 */}
                <div>
                    <label style={{ fontWeight: '600', color: '#475569', marginBottom: '12px', display: 'block', fontSize: '14px' }}>
                        CIE 10
                    </label>
                    <Autocomplete
                        multiple
                        freeSolo
                        readOnly={readOnly}
                        open={open}
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
                        filterOptions={(x) => x}
                        isOptionEqualToValue={(option, value) => option.code === value.code}
                        getOptionLabel={(option) => {
                            if (typeof option === 'string') return option;
                            return option.description ? `${option.code} - ${option.description}` : option.code;
                        }}
                        options={options}
                        loading={loading}
                        value={cieValue}
                        onInputChange={(_, newInputValue) => {
                            setInputValue(newInputValue);
                        }}
                        onChange={(_, newValue) => {
                            // Convert string entries (from freeSolo) to objects if necessary
                            const processedValue = newValue.map(item => {
                                if (typeof item === 'string') return { code: item, description: '' };
                                return item;
                            });
                            handleFieldChange('cie10', processedValue);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder={readOnly ? "Sin diagnóstico registrado" : "Busque y seleccione códigos CIE-10..."}
                                variant="outlined"
                                InputProps={{
                                    ...params.InputProps,
                                    style: { 
                                        borderRadius: '12px', 
                                        fontSize: '15px', 
                                        backgroundColor: readOnly ? '#f8fafc' : 'white' 
                                    },
                                    endAdornment: (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </div>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        padding: '4px',
                                        '& fieldset': {
                                            borderColor: '#e2e8f0',
                                            borderWidth: '1.5px',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: readOnly ? '#e2e8f0' : '#cbd5e1',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#3b82f6',
                                            borderWidth: '1.5px',
                                        },
                                    }
                                }}
                            />
                        )}
                    />
                </div>

                {/* Alergias */}
                <div>
                    <label style={{ fontWeight: '600', color: '#475569', marginBottom: '12px', display: 'block', fontSize: '14px' }}>
                        Alergias
                    </label>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: readOnly ? 'default' : 'pointer' }}>
                            <input
                                type="radio"
                                name="hasAllergies"
                                checked={data?.hasAllergies === true}
                                onChange={() => handleFieldChange('hasAllergies', true)}
                                disabled={readOnly}
                            />
                            SÍ
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: readOnly ? 'default' : 'pointer' }}>
                            <input
                                type="radio"
                                name="hasAllergies"
                                checked={data?.hasAllergies === false}
                                onChange={() => handleFieldChange('hasAllergies', false)}
                                disabled={readOnly}
                            />
                            NO
                        </label>
                    </div>

                    {data?.hasAllergies && (
                        <input
                            type="text"
                            className="form-input"
                            value={data?.allergiesDetails || ''}
                            onChange={(e) => handleFieldChange('allergiesDetails', e.target.value)}
                            readOnly={readOnly}
                            placeholder={readOnly ? "Sin detalle" : "Especifique las alergias..."}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1.5px solid #e2e8f0',
                                borderRadius: '12px',
                                outline: 'none',
                                transition: 'all 0.2s',
                                fontSize: '16px',
                                backgroundColor: readOnly ? '#f8fafc' : 'white',
                                color: '#1e293b'
                            }}
                        />
                    )}
                </div>

                {/* Rp (Medicamentos) */}
                <div>
                    <label style={{ fontWeight: '600', color: '#475569', marginBottom: '12px', display: 'block', fontSize: '14px' }}>
                        Rp (Prescripción)
                    </label>
                    <textarea
                        className="form-input"
                        value={data?.medications || ''}
                        onChange={(e) => handleFieldChange('medications', e.target.value)}
                        readOnly={readOnly}
                        rows={6}
                        placeholder={readOnly ? "Sin medicamentos" : "1. Iraltone spray topico...\n2. Formula Magistral..."}
                        style={{
                            width: '100%',
                            padding: '16px 20px',
                            border: '1.5px solid #e2e8f0',
                            borderRadius: '12px',
                            outline: 'none',
                            resize: 'vertical',
                            minHeight: '150px',
                            transition: 'all 0.2s',
                            fontSize: '16px',
                            lineHeight: '1.6',
                            backgroundColor: readOnly ? '#f8fafc' : 'white',
                            color: '#1e293b'
                        }}
                    />
                </div>

                {/* Indicaciones */}
                <div>
                    <label style={{ fontWeight: '600', color: '#475569', marginBottom: '12px', display: 'block', fontSize: '14px' }}>
                        Indicaciones
                    </label>
                    <textarea
                        className="form-input"
                        value={data?.indications || ''}
                        onChange={(e) => handleFieldChange('indications', e.target.value)}
                        readOnly={readOnly}
                        rows={6}
                        placeholder={readOnly ? "Sin indicaciones" : "1. Colocar 6 atomizaciones 1 vez al día...\n2. Tomar una capsula..."}
                        style={{
                            width: '100%',
                            padding: '16px 20px',
                            border: '1.5px solid #e2e8f0',
                            borderRadius: '12px',
                            outline: 'none',
                            resize: 'vertical',
                            minHeight: '150px',
                            transition: 'all 0.2s',
                            fontSize: '16px',
                            lineHeight: '1.6',
                            backgroundColor: readOnly ? '#f8fafc' : 'white',
                            color: '#1e293b'
                        }}
                    />
                </div>
            </div>
            
            {!readOnly && (
                <div style={{ marginTop: '24px', padding: '12px 16px', backgroundColor: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#3b82f6' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
                    Posteriormente, estos datos se usarán para generar e imprimir la receta médica en formato PDF.
                </div>
            )}

        </div>
    );
}
