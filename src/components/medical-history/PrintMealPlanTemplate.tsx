import React from 'react';

interface PrintMealPlanTemplateProps {
    patient: any;
    data: any;
}

const PrintMealPlanTemplate: React.FC<PrintMealPlanTemplateProps> = ({ patient, data }) => {
    const mealPlan = data?.mealPlan || {};
    const summary = mealPlan.summary || {};
    const details = mealPlan.details || [];
    const recommendations = mealPlan.recommendations || '';

    const pData = (patient?.patient || patient?.data || patient) || {};
    const patientName = `${pData.firstName || ''} ${pData.lastName || ''}`.trim() || 'N/A';

    const cellStyle: React.CSSProperties = {
        border: '1px solid #000',
        padding: '4px 3px',
        fontSize: '8px',
        textAlign: 'center',
        wordBreak: 'break-word',
        lineHeight: '1.1'
    };

    const headerCellStyle: React.CSSProperties = {
        ...cellStyle,
        fontWeight: 'bold',
        backgroundColor: '#f1f5f9',
        fontSize: '8px',
        textTransform: 'uppercase'
    };

    return (
        <div style={{ padding: '8mm', fontFamily: 'Arial, sans-serif', color: '#000', backgroundColor: 'white', maxWidth: '100%', margin: '0 auto' }}>
            {/* Cabecera Antropométrica */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', tableLayout: 'fixed' }}>
                <tbody>
                    <tr>
                        <td style={headerCellStyle} width="25%">Nombre</td>
                        <td style={headerCellStyle} width="10%">Talla</td>
                        <td style={headerCellStyle} width="15%">Peso actual</td>
                        <td style={headerCellStyle} width="15%">Peso min-max</td>
                        <td style={headerCellStyle} width="15%">Peso ideal</td>
                        <td style={headerCellStyle} width="10%">IMC</td>
                    </tr>
                    <tr>
                        <td style={{ ...cellStyle, fontWeight: 'bold', textTransform: 'uppercase', fontSize: '9px' }}>{patientName}</td>
                        <td style={cellStyle}>{summary.height} cm</td>
                        <td style={cellStyle}>{summary.currentWeight} kg</td>
                        <td style={cellStyle}>{summary.minWeight && summary.maxWeight ? `${summary.minWeight} - ${summary.maxWeight} kg` : '-'}</td>
                        <td style={cellStyle}>{summary.idealWeight} kg</td>
                        <td style={cellStyle}>{summary.bmi}</td>
                    </tr>
                    <tr>
                        <td style={headerCellStyle}>Calorías recomendadas</td>
                        <td style={headerCellStyle} colSpan={2}>Obesidad</td>
                        <td style={headerCellStyle} colSpan={3}>Fecha de próximo control</td>
                    </tr>
                    <tr>
                        <td style={{ ...cellStyle, fontSize: '10px', fontWeight: 'bold', color: '#166534' }}>{summary.recommendedCalories} kcal</td>
                        <td style={cellStyle} colSpan={2}>{summary.obesityType}</td>
                        <td style={cellStyle} colSpan={3}>{summary.nextControlDate}</td>
                    </tr>
                </tbody>
            </table>

            {/* Menú Principal */}
            <div style={{ backgroundColor: '#000', color: '#fff', padding: '4px', textAlign: 'center', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase', marginBottom: '0' }}>
                Menú Planificado
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', tableLayout: 'fixed' }}>
                <thead>
                    <tr>
                        <td style={{ ...headerCellStyle, width: '10%' }}>Tiempos</td>
                        <td style={{ ...headerCellStyle, width: '7%' }}>Horario</td>
                        <td style={{ ...headerCellStyle, width: '15%' }}>Grupos Alimento</td>
                        <td style={headerCellStyle}>Opción 1</td>
                        <td style={headerCellStyle}>Opción 2</td>
                        <td style={headerCellStyle}>Opción 3</td>
                        <td style={headerCellStyle}>Opción 4</td>
                        <td style={headerCellStyle}>Opción 5</td>
                    </tr>
                </thead>
                <tbody>
                    {details.length > 0 ? details.map((detail: any, idx: number) => (
                        <tr key={idx}>
                            <td style={{ ...cellStyle, fontWeight: 'bold', backgroundColor: '#f8fafc' }}>{detail.mealTime}</td>
                            <td style={cellStyle}>{detail.schedule}</td>
                            <td style={{ ...cellStyle, fontSize: '7px', textAlign: 'left', padding: '3px' }}>{detail.foodGroups?.join(', ')}</td>
                            <td style={{ ...cellStyle, textAlign: 'left', fontSize: '8px' }}>{detail.menu1}</td>
                            <td style={{ ...cellStyle, textAlign: 'left', fontSize: '8px' }}>{detail.menu2}</td>
                            <td style={{ ...cellStyle, textAlign: 'left', fontSize: '8px' }}>{detail.menu3}</td>
                            <td style={{ ...cellStyle, textAlign: 'left', fontSize: '8px' }}>{detail.menu4}</td>
                            <td style={{ ...cellStyle, textAlign: 'left', fontSize: '8px' }}>{detail.menu5}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={8} style={{ ...cellStyle, padding: '20px', color: '#94a3b8' }}>No hay registros en el plan de alimentación.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Recomendaciones Generales */}
            <div style={{ border: '1.5px solid #000', marginBottom: '20px' }}>
                <div style={{ backgroundColor: '#e2e8f0', fontWeight: 'bold', fontSize: '10px', textAlign: 'center', borderBottom: '1.5px solid #000', padding: '5px', textTransform: 'uppercase' }}>
                    Recomendaciones Generales Nutricionales
                </div>
                <div style={{ padding: '10px', fontSize: '9px', lineHeight: '1.4', textAlign: 'justify', whiteSpace: 'pre-wrap', minHeight: '60px' }}>
                    {recommendations}
                </div>
            </div>

            {/* Tabla de Intercambios Completa */}
            <div style={{ backgroundColor: '#000', color: '#fff', padding: '4px', textAlign: 'center', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase', marginBottom: '0' }}>
                Tabla de Intercambios Referencial
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', border: '1px solid #000', fontSize: '7.5px' }}>
                {/* Columna 1: Carbohidratos y Verduras */}
                <div style={{ borderRight: '1px solid #000' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', backgroundColor: '#cfe2f3', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #000' }}>
                        <div style={{ padding: '2px', borderRight: '1px solid #000' }}>CARBOHIDRATOS (80 KCAL)</div>
                        <div style={{ padding: '2px' }}>MEDIDA</div>
                    </div>
                    {[
                        ['ARROZ, FIDEO (COCIDOS)', '1/2 taza'],
                        ['MOTE, GRANOS TIERNOS', '1/2 taza'],
                        ['PAN INTEGRAL O CENTENO', '1/2 unidad'],
                        ['CORNFLAKES NATURALES', '3/4 taza'],
                        ['GRANOS SECOS (Frijol...)', '1/4 taza'],
                        ['ZANAHORIA, BLANCA, YUCA', '1/2 taza'],
                        ['TOSTADAS', '2 un. peq.'],
                        ['BIZCOCHOS', '2 un. peq.'],
                        ['GALLETAS', '4 un. peq.'],
                        ['PAPA O CHOCLO (cocidos)', '1 un. med.'],
                        ['MADURO O VERDE', '1/4 un. med.'],
                        ['MAÍZ TOSTADO', '3 cucharadas'],
                        ['CHOCHOS', '2 cucharadas'],
                        ['HARINAS O CEREALES', '2 cucharadas'],
                        ['TORTILLAS DE MAÍZ', '1 un. med.'],
                    ].map(([item, measure], i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', borderBottom: i === 14 ? '1px solid #000' : 'none' }}>
                            <div style={{ padding: '1px 3px', borderRight: '1px solid #000' }}>{item}</div>
                            <div style={{ padding: '1px 3px', textAlign: 'center' }}>{measure}</div>
                        </div>
                    ))}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', backgroundColor: '#cfe2f3', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #000' }}>
                        <div style={{ padding: '2px', borderRight: '1px solid #000' }}>VERDURAS (25 KCAL)</div>
                        <div style={{ padding: '2px' }}>MEDIDA</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr' }}>
                        <div style={{ padding: '1px 3px', borderRight: '1px solid #000' }}>VERDURAS COCIDAS</div>
                        <div style={{ padding: '1px 3px', textAlign: 'center' }}>1/2 taza</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr' }}>
                        <div style={{ padding: '1px 3px', borderRight: '1px solid #000' }}>VERDURAS CRUDAS</div>
                        <div style={{ padding: '1px 3px', textAlign: 'center' }}>1 taza</div>
                    </div>
                </div>

                {/* Columna 2: Carnes, Lácteos y Grasas */}
                <div style={{ borderRight: '1px solid #000' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', backgroundColor: '#cfe2f3', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #000' }}>
                        <div style={{ padding: '2px', borderRight: '1px solid #000' }}>CARNES (60 KCAL)</div>
                        <div style={{ padding: '2px' }}>MEDIDA</div>
                    </div>
                    {[
                        ['CARNE (pollo, pescado...)', '1 onza'],
                        ['QUESO (descremado)', '1 onza'],
                        ['HUEVO (Máx. 3 v/día)', '1 unidad'],
                        ['Camarones pequeños', '6 unidades'],
                    ].map(([item, measure], i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr' }}>
                            <div style={{ padding: '1px 3px', borderRight: '1px solid #000' }}>{item}</div>
                            <div style={{ padding: '1px 3px', textAlign: 'center' }}>{measure}</div>
                        </div>
                    ))}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', backgroundColor: '#cfe2f3', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #000', borderTop: '1px solid #000' }}>
                        <div style={{ padding: '2px', borderRight: '1px solid #000' }}>LÁCTEOS (120 KCAL)</div>
                        <div style={{ padding: '2px' }}>MEDIDA</div>
                    </div>
                    {[
                        ['LECHE DESCREMADA', '1 taza'],
                        ['YOGURT NAT. DESCR.', '1 taza'],
                        ['LECHE POLVO DESCR.', '2 cdas'],
                        ['LECHE EVAPORADA', '1/2 taza'],
                    ].map(([item, measure], i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr' }}>
                            <div style={{ padding: '1px 3px', borderRight: '1px solid #000' }}>{item}</div>
                            <div style={{ padding: '1px 3px', textAlign: 'center' }}>{measure}</div>
                        </div>
                    ))}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', backgroundColor: '#cfe2f3', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #000', borderTop: '1px solid #000' }}>
                        <div style={{ padding: '2px', borderRight: '1px solid #000' }}>GRASAS (45 KCAL)</div>
                        <div style={{ padding: '2px' }}>MEDIDA</div>
                    </div>
                    {[
                        ['ACEITE / MARGARINA', '1 cdta'],
                        ['CREMA DE LECHE', '2 cdtas'],
                        ['AGUACATE', '1/4 un. med.'],
                        ['ACEITUNAS', '6 unidades'],
                        ['MANÍ', '10 un. peq.'],
                        ['NUECES', '3 un. peq.'],
                    ].map(([item, measure], i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr' }}>
                            <div style={{ padding: '1px 3px', borderRight: '1px solid #000' }}>{item}</div>
                            <div style={{ padding: '1px 3px', textAlign: 'center' }}>{measure}</div>
                        </div>
                    ))}
                </div>

                {/* Columna 3: Frutas */}
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', backgroundColor: '#cfe2f3', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #000' }}>
                        <div style={{ padding: '2px', borderRight: '1px solid #000' }}>FRUTAS (60 KCAL)</div>
                        <div style={{ padding: '2px' }}>MEDIDA</div>
                    </div>
                    {[
                        ['FRUTA AL NATURAL', '1 unidad'],
                        ['FRUTA PICADA', '1 taza'],
                        ['JUGOS PUROS', '1/2 taza'],
                        ['JUGOS CON AGUA', '1 taza'],
                        ['FRUTA EN COMPOTA', '1/2 taza'],
                        ['GUINEO', '1/2 un. grande'],
                        ['ZAPOTE, CHIRIMOYA', '1/2 taza'],
                        ['MORA, PIÑA', '2/3 taza'],
                        ['MANDARINA / DURAZNO', '1 un. med.'],
                        ['MELÓN / SANDÍA', '1 taza'],
                        ['PAPAYA / GUANÁBANA', '1 taza'],
                    ].map(([item, measure], i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr' }}>
                            <div style={{ padding: '1px 3px', borderRight: '1px solid #000' }}>{item}</div>
                            <div style={{ padding: '1px 3px', textAlign: 'center' }}>{measure}</div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @media print {
                    @page { size: A4; margin: 4mm; }
                    body { margin: 0; background: #fff !important; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            `}</style>
        </div>
    );
};

export default PrintMealPlanTemplate;
