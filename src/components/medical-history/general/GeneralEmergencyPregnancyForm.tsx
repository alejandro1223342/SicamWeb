
interface PregnancyData {
    gestations: string;
    births: string;
    abortions: string;
    cesareans: string;
    lastMenstruationDate: string;
    gestationalWeeks: string;
    fetalMovement: string;
    fetalHeartRate: string;
    brokenMembranes: string;
    brokenMembranesTime: string;
    uterineHeight: string;
    presentation: string;
    dilation: string;
    effacement: string;
    station: string;
    usefulPelvis: string;
    vaginalBleeding: string;
    contractions: string;
    observations: string;
}

interface GeneralEmergencyPregnancyFormProps {
    data: PregnancyData;
    onChange: (data: PregnancyData) => void;
    readOnly?: boolean;
}

export default function GeneralEmergencyPregnancyForm({ data, onChange, readOnly = false }: GeneralEmergencyPregnancyFormProps) {
    const isObject = (val: any) => val !== null && typeof val === 'object' && !Array.isArray(val);
    
    const safeData: PregnancyData = {
        gestations: '',
        births: '',
        abortions: '',
        cesareans: '',
        lastMenstruationDate: '',
        gestationalWeeks: '',
        fetalMovement: '',
        fetalHeartRate: '',
        brokenMembranes: '',
        brokenMembranesTime: '',
        uterineHeight: '',
        presentation: '',
        dilation: '',
        effacement: '',
        station: '',
        usefulPelvis: '',
        vaginalBleeding: '',
        contractions: '',
        observations: '',
        ...(isObject(data) ? data : {})
    };

    const handleChange = (field: keyof PregnancyData, value: string) => {
        if (readOnly) return;
        onChange({ ...safeData, [field]: value });
    };

    const handleNumericUpdate = (field: keyof PregnancyData, value: string) => {
        if (readOnly) return;
        const cleanValue = value.replace(/[^0-9]/g, '');
        handleChange(field, cleanValue);
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1.5px solid #e2e8f0',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s',
        backgroundColor: readOnly ? '#f8fafc' : 'white',
        color: '#334155'
    };

    const labelStyle = {
        fontSize: '11px',
        fontWeight: '700',
        color: '#475569',
        marginBottom: '6px',
        display: 'block',
        textTransform: 'none' as const
    };

    const RadioGroup = ({ 
        label, 
        field, 
        value 
    }: { 
        label: string, 
        field: keyof PregnancyData, 
        value: string 
    }) => {
        const handleRadioClick = (val: string) => {
            if (readOnly) return;
            // Allow deselecting if clicking the already selected value
            handleChange(field, value === val ? '' : val);
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>{label}</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                        <input 
                            type="radio" 
                            name={field} 
                            value="SI" 
                            checked={value === 'SI'} 
                            onClick={() => handleRadioClick('SI')}
                            onChange={() => {}} // Controlled by onClick for deselecting logic
                            disabled={readOnly}
                            style={{ cursor: 'pointer' }}
                        /> SI
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                        <input 
                            type="radio" 
                            name={field} 
                            value="NO" 
                            checked={value === 'NO'} 
                            onClick={() => handleRadioClick('NO')}
                            onChange={() => {}} // Controlled by onClick for deselecting logic
                            disabled={readOnly}
                            style={{ cursor: 'pointer' }}
                        /> NO
                    </label>
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* ROW 1: BASIC OBSTETRICS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div>
                    <label style={labelStyle}>Gestas(*)</label>
                    <input
                        style={inputStyle}
                        value={safeData.gestations}
                        onChange={(e) => handleNumericUpdate('gestations', e.target.value)}
                        placeholder="Ej: 2"
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>partos(*)</label>
                    <input
                        style={inputStyle}
                        value={safeData.births}
                        onChange={(e) => handleNumericUpdate('births', e.target.value)}
                        placeholder="Ej: 1"
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Abortos(*)</label>
                    <input
                        style={inputStyle}
                        value={safeData.abortions}
                        onChange={(e) => handleNumericUpdate('abortions', e.target.value)}
                        placeholder="Ej: 0"
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Cesareas(*)</label>
                    <input
                        style={inputStyle}
                        value={safeData.cesareans}
                        onChange={(e) => handleNumericUpdate('cesareans', e.target.value)}
                        placeholder="Ej: 1"
                        disabled={readOnly}
                    />
                </div>
            </div>

            {/* ROW 2: LAST MENSTRUATION AND WEEKS */}
            <div style={{ display: 'grid', gridTemplateColumns: '4fr 5fr 3fr', gap: '16px' }}>
                <div>
                    <label style={labelStyle}>Fecha ultima menstruación(*)</label>
                    <input
                        type="date"
                        style={inputStyle}
                        value={safeData.lastMenstruationDate}
                        onChange={(e) => handleChange('lastMenstruationDate', e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Semanas gestación(*)</label>
                    <input
                        style={inputStyle}
                        value={safeData.gestationalWeeks}
                        onChange={(e) => handleChange('gestationalWeeks', e.target.value)}
                        placeholder="Ej: 38.5 sem"
                        disabled={readOnly}
                    />
                </div>
                <RadioGroup label="Movimiento fetal(*)" field="fetalMovement" value={safeData.fetalMovement} />
            </div>

            {/* ROW 3: FETAL MONITORING AND MEMBRANES */}
            <div style={{ display: 'grid', gridTemplateColumns: '4fr 3fr 5fr', gap: '16px' }}>
                <div>
                    <label style={labelStyle}>Frecuencia c. fetal(*)</label>
                    <input
                        style={inputStyle}
                        value={safeData.fetalHeartRate}
                        onChange={(e) => handleChange('fetalHeartRate', e.target.value)}
                        placeholder="Ej: 145 lpm"
                        disabled={readOnly}
                    />
                </div>
                <RadioGroup label="Membranas rotas(*)" field="brokenMembranes" value={safeData.brokenMembranes} />
                <div>
                    <label style={labelStyle}>Tiempo(*)</label>
                    <input
                        style={inputStyle}
                        value={safeData.brokenMembranesTime}
                        onChange={(e) => handleChange('brokenMembranesTime', e.target.value)}
                        placeholder="Ej: 4 horas"
                        disabled={readOnly}
                    />
                </div>
            </div>

            {/* ROW 4: PHYSICAL EXAM 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div>
                    <label style={labelStyle}>Altura uterina(*)</label>
                    <input
                        style={inputStyle}
                        value={safeData.uterineHeight}
                        onChange={(e) => handleChange('uterineHeight', e.target.value)}
                        placeholder="Ej: 34 cm"
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Presentación(*)</label>
                    <input
                        style={inputStyle}
                        value={safeData.presentation}
                        onChange={(e) => handleChange('presentation', e.target.value)}
                        placeholder="Ej: Cefálica"
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Dilatación(*)</label>
                    <input
                        style={inputStyle}
                        value={safeData.dilation}
                        onChange={(e) => handleChange('dilation', e.target.value)}
                        placeholder="Ej: 4 cm"
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Borramiento(*)</label>
                    <input
                        style={inputStyle}
                        value={safeData.effacement}
                        onChange={(e) => handleChange('effacement', e.target.value)}
                        placeholder="Ej: 80%"
                        disabled={readOnly}
                    />
                </div>
            </div>

            {/* ROW 5: PHYSICAL EXAM 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '4fr 3fr 5fr', gap: '16px' }}>
                <div>
                    <label style={labelStyle}>Plano(*)</label>
                    <input
                        style={inputStyle}
                        value={safeData.station}
                        onChange={(e) => handleChange('station', e.target.value)}
                        placeholder="Ej: I plano"
                        disabled={readOnly}
                    />
                </div>
                <RadioGroup label="Pelvis util(*)" field="usefulPelvis" value={safeData.usefulPelvis} />
                <RadioGroup label="Sangrado vaginal(*)" field="vaginalBleeding" value={safeData.vaginalBleeding} />
            </div>

            {/* ROW 6: CONTRACTIONS */}
            <div>
                <label style={labelStyle}>Contracciones(*)</label>
                <input
                    style={inputStyle}
                    value={safeData.contractions}
                    onChange={(e) => handleChange('contractions', e.target.value)}
                    placeholder="Ej: 3/10 min, dur: 45s"
                    disabled={readOnly}
                />
            </div>

            {/* ROW 7: OBSERVATION */}
            <div>
                <label style={labelStyle}>Observación(*)</label>
                <textarea
                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                    value={safeData.observations}
                    onChange={(e) => handleChange('observations', e.target.value)}
                    placeholder="Detalle hallazgos específicos analizados en el examen..."
                    disabled={readOnly}
                />
            </div>
        </div>
    );
}
