import React from 'react';

interface PrintMedicalHistoryTemplateProps {
    patient: any;
    data: any; // This will contain the full record data
}

const PrintMedicalHistoryTemplate: React.FC<PrintMedicalHistoryTemplateProps> = ({ patient, data }) => {
    const today = new Date().toLocaleDateString('es-ES');
    
    // Data normalization
    const pData = (patient?.patient || patient?.data || patient) || {};
    const patientName = `${pData.firstName || ''} ${pData.lastName || ''}`.trim() || pData.name || 'N/A';
    const patientId = pData.idNumber || pData.dni || 'N/A';
    const patientEmail = pData.email || 'N/A';
    const patientPhone = pData.phone || 'N/A';
    const birthDate = pData.birthDate ? new Date(pData.birthDate).toLocaleDateString('es-ES') : 'N/A';

    const emergency = data?.emergency || {};
    const family = data?.family || [];
    const vaccines = data?.vaccines || [];
    const risks = data?.risks || [];
    const labresults = data?.labresults || [];
    const diagnosis = data?.diagnosis || '';
    const tricologyFindings = data?.tricology?.observations || '';

    // Helper for table cells
    const Cell = ({ label, value, width, rowSpan, colSpan, height }: any) => (
        <td 
            rowSpan={rowSpan} 
            colSpan={colSpan} 
            style={{ 
                border: '1px solid #000', 
                padding: '2px 4px', 
                width: width, 
                height: height,
                verticalAlign: 'top',
                fontSize: '8px'
            }}
        >
            <div style={{ fontWeight: '800', textTransform: 'uppercase', fontSize: '7px', marginBottom: '1px' }}>{label}</div>
            <div style={{ fontWeight: '500', minHeight: '10px' }}>{value || ' '}</div>
        </td>
    );

    const HeaderCell = ({ children, colSpan }: any) => (
        <td 
            colSpan={colSpan} 
            style={{ 
                backgroundColor: '#000', 
                color: '#fff', 
                padding: '3px 6px', 
                fontWeight: '900', 
                fontSize: '9px',
                textTransform: 'uppercase'
            }}
        >
            {children}
        </td>
    );

    const ChecklistItem = ({ label, checked }: { label: string, checked: boolean }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '8px' }}>
            <div style={{ width: '8px', height: '8px', border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px' }}>
                {checked ? 'X' : ''}
            </div>
            <span>{label}</span>
        </div>
    );

    return (
        <div className="print-medical-history" style={{ 
            fontFamily: 'Arial, sans-serif',
            color: '#000',
            padding: '5mm',
            backgroundColor: 'white',
            width: '210mm',
            minHeight: '297mm',
            margin: '0 auto',
            boxSizing: 'border-box'
        }}>
            <h1 style={{ textAlign: 'center', fontSize: '16px', fontWeight: '900', margin: '0 0 10px 0' }}>HISTORIA CLÍNICA TRICOLOGÍA</h1>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
                <tbody>
                    {/* Row 1: Names and IDs */}
                    <tr>
                        <Cell label="APELLIDO PATERNO" value={pData.lastName?.split(' ')[0]} width="16%" />
                        <Cell label="APELLIDO MATERNO" value={pData.lastName?.split(' ')[1]} width="16%" />
                        <Cell label="NOMBRES" value={pData.firstName} width="20%" />
                        <Cell label="CÉDULA/PASAPORTE" value={patientId} width="16%" />
                        <Cell label="CORREO ELECTRÓNICO" value={patientEmail} width="18%" />
                        <Cell label="CELULAR" value={patientPhone} width="14%" />
                    </tr>
                    {/* Row 2: Location and Birth */}
                    <tr>
                        <Cell label="RESIDENCIA" value={pData.address} colSpan={1} />
                        <Cell label="PROVINCIA" value="" />
                        <Cell label="PAÍS" value="" />
                        <Cell label="FECHA DE NACIMIENTO" value={birthDate} />
                        <Cell label="NACIONALIDAD" value="" />
                        <Cell label="GRUPO CULTURAL" value="" />
                    </tr>
                    {/* Row 3: Misc */}
                    <tr>
                        <Cell label="ESCOLARIDAD" value="" />
                        <Cell label="OCUPACIÓN" value="" />
                        <Cell label="EMPRESA DONDE LABORA" colSpan={2} />
                        <Cell label="REFERIDO DE" colSpan={2} />
                    </tr>
                </tbody>
            </table>

            {/* Emergency Contacts */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
                <tbody>
                    <tr>
                        <Cell label="NOMBRE CONTACTO DE EMERGENCIA" value={emergency.name} width="35%" />
                        <Cell label="PARENTESCO" value={emergency.relation} width="15%" />
                        <Cell label="TELÉFONO" value={emergency.phone} width="15%" />
                        <Cell label="DIRECCIÓN" value={emergency.address} width="35%" />
                    </tr>
                </tbody>
            </table>

            {/* Antecedentes Personales */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
                <tbody>
                    <tr><HeaderCell colSpan={6}>ANTECEDENTES PERSONALES</HeaderCell></tr>
                    <tr>
                        <td colSpan={3} style={{ border: '1px solid #000', padding: '0' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <tbody>
                                    <tr>
                                        <Cell label="*GINECO - OBSTÉTRICOS" value=" " colSpan={2} />
                                        <Cell label="FECHA" value={today} />
                                        <Cell label="HORA" value="" />
                                        <Cell label="EDAD" value="" />
                                        <Cell label="SEXO" value={pData.gender === 'M' ? 'MASCULINO' : 'FEMENINO'} />
                                    </tr>
                                    <tr>
                                        <Cell label="MENARQUIA" value="" />
                                        <Cell label="FUNC. VITALES" value="" />
                                        <Cell label="PA" value="" />
                                        <Cell label="PULSO" value="" />
                                        <Cell label="T°" value="" />
                                        <Cell label="SAT02" value="" />
                                    </tr>
                                    <tr>
                                        <Cell label="ÚLTIMO MÉTODO PF" value="" />
                                        <Cell label="P. ACTUAL(kg)" value="" />
                                        <Cell label="TALLA(m)" value="" />
                                        <Cell label="BIOTIPO" value="" colSpan={3} />
                                    </tr>
                                    <tr>
                                        <Cell label="FECHA ÚLTIMO EMBARAZO" value="" colSpan={2} />
                                        <Cell label="ESTADO NUTRICIONAL" colSpan={4} value={
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <ChecklistItem label="NORMAL" checked={false} />
                                                <ChecklistItem label="BAJO" checked={false} />
                                                <ChecklistItem label="SOBREPESO" checked={false} />
                                                <ChecklistItem label="OBESA" checked={false} />
                                            </div>
                                        } />
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <Cell label="ENFERMEDAD ACTUAL" colSpan={3} value="" />
                    </tr>
                    <tr>
                        <Cell label="HALLAZGOS ÚLTIMO EXAMEN GINECOLÓGICO" colSpan={3} rowSpan={2} height="40px" />
                        <HeaderCell colSpan={3}>EXAMEN FÍSICO</HeaderCell>
                    </tr>
                    <tr>
                        <td colSpan={3} style={{ border: '1px solid #000', padding: '4px' }}>
                            <div style={{ fontSize: '7px', fontWeight: '800', marginBottom: '3px' }}>SIGNOS Y SÍNTOMAS DE ALARMA:</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                <ChecklistItem label="NINGUNO" checked={true} />
                                <ChecklistItem label="CEFALEA" checked={false} />
                                <ChecklistItem label="ESCOTOMAS" checked={false} />
                                <ChecklistItem label="TINNITUS" checked={false} />
                                <ChecklistItem label="EDEMA" checked={false} />
                                <ChecklistItem label="EPIGASTRALGIA" checked={false} />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <Cell label="SÍNTOMAS" colSpan={3} height="30px" />
                        <Cell label="ESTADO GENERAL" value="" />
                        <Cell label="ESTADO DE CONCIENCIA" value="" colSpan={2} />
                    </tr>
                </tbody>
            </table>

            {/* Pathological and Checklist */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0', border: '1px solid #000', marginBottom: '10px' }}>
                <div style={{ borderRight: '1px solid #000' }}>
                    <div style={{ backgroundColor: '#f0f0f0', padding: '2px 4px', fontSize: '8px', fontWeight: '800', borderBottom: '1px solid #000' }}>* PATOLÓGICOS</div>
                    <div style={{ padding: '4px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {['NINGUNO', 'DIABETES', 'HTA', 'CARDIACAS', 'ALERGIAS', 'ASMA', 'VITILIGO', 'QUELOIDES'].map(item => (
                            <ChecklistItem key={item} label={item} checked={false} />
                        ))}
                    </div>
                </div>
                <div>
                  <div style={{ backgroundColor: '#f0f0f0', padding: '2px 4px', fontSize: '8px', fontWeight: '800', borderBottom: '1px solid #000' }}>CHECKLIST ADICIONAL</div>
                  <div style={{ padding: '4px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3px' }}>
                     {['XANTELASMA', 'QUELOIDES', 'QUISTES', 'UMBRAL DOLOR', 'VITILIGO', 'PUSTULAS', 'QUEMADURAS'].map(item => (
                        <ChecklistItem key={item} label={item} checked={false} />
                     ))}
                  </div>
                </div>
            </div>

            {/* Family, Vaccines, Risks */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
                <tbody>
                    <tr>
                        <Cell label="ANTECEDENTES FAMILIARES" value={family.join(', ')} colSpan={3} />
                        <Cell label="VACUNAS RECIENTES" value={vaccines.join(', ')} colSpan={3} />
                    </tr>
                    <tr>
                        <Cell label="FACTORES Y CONDUCTAS DE RIESGO" value={risks.join(', ')} colSpan={6} />
                    </tr>
                </tbody>
            </table>

            {/* Tricology Findings */}
            <div style={{ border: '1px solid #000', marginBottom: '10px' }}>
                <div style={{ backgroundColor: '#000', color: '#fff', padding: '3px 6px', fontWeight: '900', fontSize: '9px' }}>HALLAZGOS EN TRICOLOGÍA</div>
                <div style={{ padding: '5px', minHeight: '40px', fontSize: '10px' }}>{tricologyFindings}</div>
            </div>

            {/* Resultados de Laboratorio e Imágenes */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
                <thead>
                    <tr><HeaderCell colSpan={4}>RESULTADOS DE LABORATORIO E IMÁGENES</HeaderCell></tr>
                    <tr style={{ backgroundColor: '#f0f0f0', fontSize: '7px', fontWeight: '800', textTransform: 'uppercase' }}>
                        <td style={{ border: '1px solid #000', padding: '2px 4px' }}>EXAMEN</td>
                        <td style={{ border: '1px solid #000', padding: '2px 4px' }}>VALOR/REF</td>
                        <td style={{ border: '1px solid #000', padding: '2px 4px' }}>FECHA</td>
                        <td style={{ border: '1px solid #000', padding: '2px 4px' }}>OBSERVACIONES</td>
                    </tr>
                </thead>
                <tbody>
                    {labresults.length > 0 ? labresults.map((res: any, idx: number) => (
                        <tr key={idx} style={{ fontSize: '8px' }}>
                            <td style={{ border: '1px solid #000', padding: '2px 4px' }}>{res.exam}</td>
                            <td style={{ border: '1px solid #000', padding: '2px 4px' }}>{res.value}</td>
                            <td style={{ border: '1px solid #000', padding: '2px 4px' }}>{res.date}</td>
                            <td style={{ border: '1px solid #000', padding: '2px 4px' }}>{res.observations}</td>
                        </tr>
                    )) : (
                        [1, 2].map(i => (
                            <tr key={i} style={{ height: '12px' }}>
                                <td style={{ border: '1px solid #000' }}></td>
                                <td style={{ border: '1px solid #000' }}></td>
                                <td style={{ border: '1px solid #000' }}></td>
                                <td style={{ border: '1px solid #000' }}></td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Diagnosis and Treatment */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
               <thead>
                  <tr>
                     <HeaderCell colSpan={2}>DIAGNÓSTICO/ACTIVIDAD</HeaderCell>
                     <HeaderCell width="15px">P</HeaderCell>
                     <HeaderCell width="15px">D</HeaderCell>
                     <HeaderCell width="15px">R</HeaderCell>
                     <HeaderCell width="60px">CÓD CIE</HeaderCell>
                  </tr>
               </thead>
               <tbody>
                    {Array.isArray(data?.diagnosis) && data.diagnosis.length > 0 ? data.diagnosis.map((diag: any, idx: number) => (
                    <tr key={idx} style={{ fontSize: '8px' }}>
                        <td colSpan={2} style={{ border: '1px solid #000', padding: '2px 4px' }}>{diag.description}</td>
                        <td style={{ border: '1px solid #000', textAlign: 'center' }}>{diag.p ? 'X' : ''}</td>
                        <td style={{ border: '1px solid #000', textAlign: 'center' }}>{diag.d ? 'X' : ''}</td>
                        <td style={{ border: '1px solid #000', textAlign: 'center' }}>{diag.r ? 'X' : ''}</td>
                        <td style={{ border: '1px solid #000', padding: '2px 4px' }}>{diag.cieCode}</td>
                    </tr>
                  )) : (
                    <tr>
                        <td colSpan={2} style={{ border: '1px solid #000', padding: '5px', minHeight: '30px', fontSize: '10px' }}>{diagnosis}</td>
                        <td style={{ border: '1px solid #000', textAlign: 'center' }}>X</td>
                        <td style={{ border: '1px solid #000' }}></td>
                        <td style={{ border: '1px solid #000' }}></td>
                        <td style={{ border: '1px solid #000' }}></td>
                    </tr>
                  )}
               </tbody>
            </table>

            {/* Exámenes Complementarios */}
            {data?.exams && (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
                    <thead>
                        <tr><HeaderCell colSpan={2}>EXÁMENES COMPLEMENTARIOS SOLICITADOS</HeaderCell></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ border: '1px solid #000', padding: '4px', width: '50%', verticalAlign: 'top' }}>
                                <div style={{ fontSize: '7px', fontWeight: '800', marginBottom: '2px' }}>EXÁMENES:</div>
                                <div style={{ fontSize: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                    {data.exams.options?.join(', ') || 'Ninguno'}
                                </div>
                            </td>
                            <td style={{ border: '1px solid #000', padding: '4px', width: '50%', verticalAlign: 'top' }}>
                                <div style={{ fontSize: '7px', fontWeight: '800', marginBottom: '2px' }}>OTROS / DIAGNÓSTICO:</div>
                                <div style={{ fontSize: '8px' }}>
                                    {data.exams.other && <p style={{ margin: '0 0 4px 0' }}><b>Otro:</b> {data.exams.other}</p>}
                                    {data.exams.diagnosis && <p style={{ margin: '0' }}><b>Dx:</b> {data.exams.diagnosis}</p>}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}

            {/* Footer Signatures */}
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ width: '250px' }}>
                    <div style={{ borderBottom: '1px solid #000', marginBottom: '5px' }}>{patientName}</div>
                    <div style={{ fontSize: '9px', fontWeight: '800' }}>APELLIDOS Y NOMBRES DEL PACIENTE</div>
                </div>
                <div style={{ textAlign: 'center', width: '200px' }}>
                    <div style={{ borderBottom: '1px solid #000', height: '40px', marginBottom: '5px' }}></div>
                    <div style={{ fontSize: '9px', fontWeight: '800' }}>SELLO Y FIRMA DEL MÉDICO</div>
                </div>
            </div>

            <style>{`
                @media print {
                    @page { size: A4; margin: 0; }
                    .print-medical-history { 
                        display: block !important;
                        visibility: visible !important;
                        width: 100% !important;
                        min-height: 297mm !important;
                        margin: 0 !important;
                        padding: 10mm !important;
                        box-sizing: border-box;
                    }
                }
            `}</style>
        </div>
    );
};

export default PrintMedicalHistoryTemplate;
