import React from 'react';

export const EXAMS_CATALOG = {
    "AUTOINMUNIDAD": [
        "AC. ANTI DNA", "AC. ANTI. CENTRÓMERO", "AC. ANTI. MITOCONDRIALES", "ANA (AC. ANTINUCLEARES)", 
        "ANCA C (ANTI-PR3)", "ANCA P (ANTI-MPO)", "ANTI-JO", "ANTI-LA (SSB)", "ANTI-RNP", 
        "ANTI-RO (SSA)", "ANTI-SM", "ANTI. MÚSCULO LISO", "CARDIOPLINA IGG", "CARDIOPLINA IGM", 
        "CCP (CITRULINADO)", "COMPLEMENTO C3", "COMPLEMENTO C4", "FOSFOLIPÍDO IGG", "FOSFOLIPÍDO IGM"
    ],
    "BACTERIOLOGÍA": [
        "ANTIBIOGRAMA (POR CULTIVO)", "BACILOSCOPIA (BK)", "CULTIVO (OTRAS MUESTRAS)", "CULTIVO DE EXUDADO FARINGEO", 
        "CULTIVO DE SECRECION VAGINAL", "FROTIS / TINCION GRAM", "KOH (MICROSCOPICO)", "UROCULTIVO"
    ],
    "BIOLOGÍA MOLECULAR": [
        "HPV (VIRUS PAPILOMA HUMANO)", "MYCOBACTERIUM TUBERCULOSIS (PCR)", "SARS-COV-2 (RT-PCR)"
    ],
    "CITOLOGÍA / HISTOPATOLOGÍA": [
        "BIOPSIA (POR ÓRGANO)", "CITOLOGÍA CERVICO-VAGINAL", "CITOLOGÍA LIQUIDOS CORPORALES"
    ],
    "DROGAS DE ABUSO": [
        "ANFETAMINAS", "BENZODIAZEPINAS", "COCAINA", "MARIHUANA"
    ],
    "HEMATOLOGÍA": [
        "BIOMETRÍA HEMÁTICA", "GRUPO SANGUÍNEO Y FACTOR RH", "VELOCIDAD DE SEDIMENTACIÓN (VSG)",
        "TIEMPO DE PROTROMBINA (TP)", "TIEMPO DE TROMBOPLASTINA (TTP)", "RETICULOCITOS"
    ],
    "QUÍMICA SANGUÍNEA": [
        "GLUCOSA EN AYUNAS", "UREA", "CREATININA", "ÁCIDO ÚRICO", "COLESTEROL TOTAL", 
        "COLESTEROL HDL", "COLESTEROL LDL", "TRIGLICÉRIDOS", "BILIRRUBINAS", "TGO / AST", 
        "TGP / ALT", "FOSFATASA ALCALINA", "PROTEÍNAS TOTALES", "ALBÚMINA", "HEMOGLOBINA GLICOSILADA"
    ],
    "HORMONAS / MARCADORES": [
        "TSH", "T3 LIBRE", "T4 LIBRE", "PSA TOTAL", "PSA LIBRE", "PROLACTINA",
        "ESTRADIOL", "PROGESTERONA", "TESTOSTERONA", "BETA-HCG"
    ],
    "SEROLOGÍA": [
        "VDRL / RPR", "VIH (ELISA)", "HELICOBACTER PYLORI", "HEPATITIS A", "HEPATITIS B", "HEPATITIS C"
    ],
    "ORINA Y HECES": [
        "ELEMENTAL Y MICROSCÓPICO DE ORINA (EMO)", "PRUEBA DE EMBARAZO EN ORINA",
        "COPROPARASITARIO SIMPLE", "SANGRE OCULTA EN HECES", "POLIMORFONUCLEARES EN HECES"
    ]
};

interface PrintExamsTemplateProps {
    patient: any;
    data: {
        options: string[];
        other: string;
        diagnosis: string;
        treatment?: string;
    };
    catalog?: any;
}

const PrintExamsTemplate: React.FC<PrintExamsTemplateProps> = ({ patient, data, catalog }) => {
    const today = new Date().toLocaleDateString('es-ES');
    
    // Use dynamic catalog if provided, otherwise fallback to static
    const activeCatalog = catalog && Object.keys(catalog).length > 0 ? catalog : EXAMS_CATALOG;
    
    // Safety check for data
    const safeData = data || { options: [], other: '', diagnosis: '' };
    const selectedOptions = safeData.options || [];

    // Robust patient data extraction
    const pData = (patient?.patient || patient?.data || patient) || {};
    
    // Fallback fields for display
    const patientName = pData.firstName ? `${pData.firstName} ${pData.lastName || ''}`.trim().toUpperCase() : (pData.name ? pData.name.toUpperCase() : 'N/A');
    const patientId = pData.idNumber || pData.dni || pData.identification || 'N/A';
    const patientPhone = pData.phone || pData.phoneNumber || pData.cellphone || 'N/A';
    
    const getAge = (birthDate: any) => {
        if (!birthDate) return 'N/A';
        try {
            const birth = new Date(birthDate);
            if (isNaN(birth.getTime())) return 'N/A';
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            return age;
        } catch (e) { return 'N/A'; }
    };
    const patientAge = getAge(pData.birthDate);

    const categories = Object.keys(activeCatalog);
    
    return (
        <div className="print-exams-container print-only-content" style={{ 
            fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            color: '#000',
            padding: '4mm 8mm',
            backgroundColor: 'white',
            width: '210mm',
            minHeight: '200mm', 
            margin: '0 auto',
            fontSize: '9.5px',
            lineHeight: '1.0',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px', borderBottom: '1.5px solid #000', paddingBottom: '4px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#000', textTransform: 'uppercase' }}>EXÁMENES COMPLEMENTARIOS SOLICITADOS</h1>
                </div>
                <div style={{ textAlign: 'right', fontSize: '9px' }}>
                    <div style={{ fontWeight: 'bold' }}>sicam-web</div>
                    <div>FECHA: {today}</div>
                </div>
            </div>

            {/* Patient Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr 0.6fr 1.1fr', gap: '10px', marginBottom: '6px', padding: '4px', border: '1.2px solid #000' }}>
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '8px', color: '#666' }}>PACIENTE</div>
                    <div style={{ fontWeight: '800', fontSize: '10px', borderBottom: '1px solid #eee' }}>{patientName}</div>
                </div>
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '8px', color: '#666' }}>IDENTIFICACIÓN</div>
                    <div style={{ fontWeight: '800', fontSize: '10px', borderBottom: '1px solid #eee' }}>{patientId}</div>
                </div>
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '8px', color: '#666' }}>EDAD</div>
                    <div style={{ fontWeight: '800', fontSize: '10px', borderBottom: '1px solid #eee' }}>{patientAge} años</div>
                </div>
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '8px', color: '#666' }}>TELÉFONO</div>
                    <div style={{ fontWeight: '800', fontSize: '10px', borderBottom: '1px solid #eee' }}>{patientPhone}</div>
                </div>
            </div>

            {/* Info Bar */}
            <div style={{ backgroundColor: '#f8f9fa', border: '1.2px solid #000', padding: '2px', textAlign: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: '900', fontSize: '10px' }}>INFORMACIÓN AL PACIENTE AL Nº 096 355 6003 - 099 566 3314</span>
            </div>

            {/* Grid of Exams */}
            <div style={{ 
                columnCount: 4, 
                columnGap: '8px',
                width: '100%',
                flex: 1,
                fontSize: '8px'
            }}>
                {categories.map((catName) => (
                    <div key={catName} style={{ marginBottom: '4px', breakInside: 'avoid' }}>
                        <div style={{ 
                            borderBottom: '1.2px solid #000',
                            fontSize: '8.5px', 
                            fontWeight: '900', 
                            paddingBottom: '0.5px',
                            marginBottom: '1.5px',
                            textTransform: 'uppercase'
                        }}>
                            {catName}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                            {activeCatalog[catName as keyof typeof activeCatalog].map((opt: string) => {
                                // Búsqueda insensible a mayúsculas/minúsculas
                                const isSelected = selectedOptions.some(sel => sel.trim().toUpperCase() === opt.trim().toUpperCase());
                                return (
                                    <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '7.5px', lineHeight: '1.0' }}>
                                        <div style={{ 
                                            width: '7px', 
                                            height: '7px', 
                                            border: '0.8px solid #000', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            backgroundColor: isSelected ? '#eee' : 'transparent'
                                        }}>
                                            {isSelected && <span style={{ fontSize: '6px', fontWeight: '900' }}>X</span>}
                                        </div>
                                        <span style={{ 
                                            fontWeight: isSelected ? '800' : '500',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {opt}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Section */}
            <div style={{ marginTop: '6px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '8px' }}>
                    <div>
                        <div style={{ fontWeight: '900', fontSize: '9px', marginBottom: '2px' }}>OTROS:</div>
                        <div style={{ border: '1.2px solid #000', height: '30px', padding: '4px', fontSize: '9px', borderRadius: '4px' }}>{safeData.other || ''}</div>
                    </div>
                    <div>
                        <div style={{ fontWeight: '900', fontSize: '9px', marginBottom: '2px' }}>DIAGNÓSTICO:</div>
                        <div style={{ border: '1.2px solid #000', height: '30px', padding: '4px', fontSize: '9px', borderRadius: '4px' }}>{safeData.diagnosis || ''}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '6px', paddingTop: '6px' }}>
                    <div style={{ fontSize: '8px', color: '#666' }}>
                        SICAM - Sistema Integral de Control y Atención Médica
                    </div>
                    <div style={{ textAlign: 'center', minWidth: '180px' }}>
                        <div style={{ borderTop: '1.5px solid #000', paddingTop: '2px', fontWeight: '900', fontSize: '9px' }}>
                            FIRMA DEL MÉDICO
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintExamsTemplate;
