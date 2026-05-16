import type { MedicalPrescriptionData } from './MedicalPrescriptionForm';

interface PrintMedicalPrescriptionTemplateProps {
    patient: any;
    data: MedicalPrescriptionData;
}

const PrintMedicalPrescriptionTemplate = ({ patient, data }: PrintMedicalPrescriptionTemplateProps) => {
    const today = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
    
    // Data normalization
    const pData = (patient?.patient || patient?.data || patient) || {};
    const patientName = `${pData.firstName || ''} ${pData.lastName || ''}`.trim() || pData.name || '';
    
    // Calculate Age
    const getAge = (birthDate: any) => {
        if (!birthDate) return '';
        try {
            const birth = new Date(birthDate);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
            return age;
        } catch (e) { return ''; }
    };
    const patientAge = getAge(pData.birthDate);

    // Format CIE-10
    const cie10String = Array.isArray(data?.cie10) 
        ? data.cie10.map((c: any) => c.code).join(', ') 
        : (data?.cie10 || '');

    // Split text by newlines and add numbers if needed, or just preserve white spaces

    const PrescriptionHalf = ({ type }: { type: 'rp' | 'indications' }) => {
        return (
            <div style={{ 
                width: '50%', 
                padding: '10mm', 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                position: 'relative',
                boxSizing: 'border-box'
            }}>
                {/* Header */}
                <div style={{ position: 'relative', textAlign: 'center', marginBottom: '30px', minHeight: '110px' }}>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                        <div style={{ fontFamily: 'Georgia, serif', color: '#bca17a', fontSize: '28px', letterSpacing: '4px', marginBottom: '2px', fontWeight: 'normal' }}>
                            AUREO
                        </div>
                        <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#999', marginBottom: '10px' }}>
                            AESTHETICS
                        </div>
                        <div style={{ fontFamily: '"Brush Script MT", "Snell Roundhand", cursive', fontSize: '22px', color: '#7bc8cc', marginBottom: '5px' }}>
                            Dra. Maria Fernanda Terán L
                        </div>
                        <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#555', lineHeight: '1.2' }}>
                            MEDICINA ESTÉTICA - REGENERATIVA<br/>
                            Y ANTIENVEJECIMIENTO
                        </div>
                    </div>
                    
                    {/* Número de folio arriba a la derecha */}
                    <div style={{ position: 'absolute', top: '15px', right: 0, width: '130px', textAlign: 'right', fontSize: '12px', color: '#444' }}>
                        <div style={{ color: '#e53e3e', fontSize: '18px', fontWeight: 'bold' }}>
                            No <span style={{ color: '#e53e3e' }}>{data?.prescriptionNumber ? String(data.prescriptionNumber).padStart(6, '0') : '000000'}</span>
                        </div>
                    </div>

                    {/* Fecha y Edad abajo a la derecha (alineado con Medicina Estetica) */}
                    <div style={{ position: 'absolute', bottom: '-20px', right: 0, width: '130px', textAlign: 'right', fontSize: '12px', color: '#444' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: '8px' }}>
                            <span style={{ fontSize: '10px', marginRight: '5px' }}>Fecha:</span> 
                            <span style={{ borderBottom: '1px dashed #888', paddingBottom: '2px', minWidth: '80px', display: 'inline-block', textAlign: 'center' }}>{today}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                            <span style={{ fontSize: '10px', marginRight: '5px' }}>Edad:</span> 
                            <span style={{ borderBottom: '1px dashed #888', paddingBottom: '2px', minWidth: '80px', display: 'inline-block', textAlign: 'center' }}>{patientAge ? `${patientAge} años` : ''}</span>
                        </div>
                    </div>
                </div>

                {/* Patient Info */}
                <div style={{ fontSize: '12px', color: '#333', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '8px' }}>
                        <span style={{ width: '60px', color: '#666' }}>Paciente:</span>
                        <div style={{ flex: 1, borderBottom: '1px dotted #888', paddingBottom: '2px', fontWeight: 'bold' }}>{patientName}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '8px' }}>
                        <span style={{ width: '60px', color: '#666' }}>CIE 10:</span>
                        <div style={{ flex: 1, borderBottom: '1px dotted #888', paddingBottom: '2px' }}>{cie10String}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ width: '60px', color: '#666' }}>Alergias:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ fontSize: '10px' }}>SI</span>
                                <div style={{ width: '12px', height: '12px', border: '1px solid #666', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                                    {data?.hasAllergies ? 'X' : ''}
                                </div>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ fontSize: '10px' }}>NO</span>
                                <div style={{ width: '12px', height: '12px', border: '1px solid #666', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                                    {!data?.hasAllergies ? 'X' : ''}
                                </div>
                            </label>
                        </div>
                        <div style={{ flex: 1, borderBottom: '1px dotted #888', marginLeft: '10px', minHeight: '16px' }}>
                            {data?.hasAllergies ? data.allergiesDetails : ''}
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div style={{ flex: 1, padding: '10px 0', fontSize: '14px', color: '#1a1a1a', lineHeight: '1.6' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '15px', color: '#555' }}>
                        {type === 'rp' ? 'Rp,' : 'Indicaciones,'}
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif', color: '#1a1e5a' }}>
                        {type === 'rp' ? data?.medications : data?.indications}
                    </div>
                </div>

                {/* Footer */}
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '9px', color: '#666' }}>
                    <div style={{ width: '30%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                            <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#7bc8cc', color: 'white', borderRadius: '50%', textAlign: 'center', lineHeight: '12px' }}>✆</span>
                            0967150801
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                            <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#7bc8cc', color: 'white', borderRadius: '2px', textAlign: 'center', lineHeight: '12px' }}>IG</span>
                            dra_mafernandateran
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#7bc8cc', color: 'white', borderRadius: '50%', textAlign: 'center', lineHeight: '12px' }}>W</span>
                            www.aureoaesthetics.com
                        </div>
                    </div>
                    
                    <div style={{ width: '30%', textAlign: 'center', paddingBottom: '5px' }}>
                        {/* Placeholder for Signature if needed, or just leave blank for physical signing */}
                        <div style={{ fontFamily: '"Brush Script MT", "Snell Roundhand", cursive', fontSize: '24px', color: '#1a1e5a', opacity: 0.8, height: '30px' }}>
                            {/* M. Fernanda Terán L. */}
                        </div>
                    </div>
                    
                    <div style={{ width: '35%', textAlign: 'right', color: '#888' }}>
                        <div style={{ color: '#7bc8cc', fontWeight: 'bold', fontSize: '10px' }}>Hospital de Clínicas</div>
                        <div style={{ color: '#7bc8cc', fontWeight: 'bold', fontSize: '10px', marginBottom: '3px' }}>METROPOLITANA</div>
                        <div>Consultorio 314</div>
                        <div>Av. Galo Plaza 1704</div>
                        <div>Parque Ciudad Blanca</div>
                        <div style={{ fontSize: '8px' }}>IBARRA - ECUADOR</div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div id="prescription-print-root" style={{ 
            fontFamily: 'Arial, sans-serif',
            backgroundColor: 'white',
            width: '297mm', // A4 Landscape width
            height: '210mm', // A4 Landscape height
            margin: '0 auto',
            boxSizing: 'border-box',
            display: 'none' // Hidden by default, shown during print
        }}>
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                {/* Left side: Rp */}
                <PrescriptionHalf type="rp" />
                
                {/* Dotted line middle fold */}
                <div style={{ borderLeft: '1px dashed #e2e8f0', height: '100%' }}></div>
                
                {/* Right side: Indications */}
                <PrescriptionHalf type="indications" />
            </div>

            <style>{`
                @media print {
                    @page prescriptionPage { 
                        size: 297mm 210mm; /* A4 Landscape */
                        margin: 0; 
                    }
                    body * {
                        visibility: hidden;
                    }
                    #prescription-print-root, #prescription-print-root * {
                        visibility: visible;
                    }
                    #prescription-print-root {
                        display: block !important;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 297mm;
                        height: 210mm;
                        margin: 0;
                        padding: 0;
                        page: prescriptionPage;
                    }
                }
            `}</style>
        </div>
    );
};

export default PrintMedicalPrescriptionTemplate;
