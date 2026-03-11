import React from 'react';
import { EXAMS_CATALOG } from './ComplementaryExamsForm';

interface PrintExamsTemplateProps {
    patient: any;
    data: {
        options: string[];
        other: string;
        diagnosis: string;
    };
}

const PrintExamsTemplate: React.FC<PrintExamsTemplateProps> = ({ patient, data }) => {
    const today = new Date().toLocaleDateString('es-ES');
    
    // Robust patient data extraction
    // It could be a simple User object or a MedicalRecord containing a patient
    const pData = (patient?.patient || patient?.data || patient) || {};
    
    console.log('PRINT TEMPLATE DATA:', { pData, patient, data });
    
    // Fallback fields for display
    const patientName = pData.firstName ? `${pData.firstName} ${pData.lastName || ''}`.toUpperCase() : (pData.name ? pData.name.toUpperCase() : 'N/A');
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

    const categories = Object.keys(EXAMS_CATALOG);
    
    // El objetivo es ocupar TODA la hoja A4 (210x297mm aprox)
    // Reducir de 5 a 4 columnas para ganar espacio horizontal y vertical
    // Aumentar interlineado y tamaños de fuente.
    
    return (
        <div id="print-exams-container" style={{ 
            fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            color: '#000',
            padding: '4mm 8mm',
            backgroundColor: 'white',
            width: '210mm',
            minHeight: '200mm', // Reducir más para que no fuerce página extra si no es necesario
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
                columnGap: '10px',
                width: '100%',
                flex: 1
            }}>
                {categories.map((catName) => (
                    <div key={catName} style={{ marginBottom: '6px', breakInside: 'avoid', display: 'inline-block', width: '100%' }}>
                        <div style={{ 
                            borderBottom: '1.2px solid #000',
                            fontSize: '9px', 
                            fontWeight: '900', 
                            paddingBottom: '1px',
                            marginBottom: '2px',
                            textTransform: 'uppercase'
                        }}>
                            {catName}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                            {EXAMS_CATALOG[catName as keyof typeof EXAMS_CATALOG].map((opt: string) => {
                                const isSelected = data.options.includes(opt);
                                return (
                                    <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '8px', lineHeight: '1.0' }}>
                                        <div style={{ 
                                            width: '8px', 
                                            height: '8px', 
                                            border: '0.8px solid #000', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            backgroundColor: isSelected ? '#eee' : 'transparent'
                                        }}>
                                            {isSelected && <span style={{ fontSize: '7px', fontWeight: '900' }}>X</span>}
                                        </div>
                                        <span style={{ 
                                            fontWeight: isSelected ? '800' : '500',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
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
                        <div style={{ border: '1.2px solid #000', height: '30px', padding: '4px', fontSize: '9px', borderRadius: '4px' }}>{data.other || ''}</div>
                    </div>
                    <div>
                        <div style={{ fontWeight: '900', fontSize: '9px', marginBottom: '2px' }}>DIAGNÓSTICO:</div>
                        <div style={{ border: '1.2px solid #000', height: '30px', padding: '4px', fontSize: '9px', borderRadius: '4px' }}>{data.diagnosis || ''}</div>
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

            <style>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    #print-exams-container {
                        display: block !important;
                        visibility: visible !important;
                        width: 210mm !important;
                        minHeight: '290mm' !important; // Un poco menos de A4 para evitar desbordes por redondeo
                        background-color: white !important;
                        margin: 0 !important;
                        padding: 3mm 6mm !important; // Padding mínimo
                        box-sizing: border-box;
                    }
                }
            `}</style>
        </div>
    );
};

export default PrintExamsTemplate;
