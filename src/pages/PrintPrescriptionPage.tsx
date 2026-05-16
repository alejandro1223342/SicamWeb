import { useState, useEffect } from 'react';
import PrintMedicalPrescriptionTemplate from '../components/medical-history/PrintMedicalPrescriptionTemplate';
import { Loader2 } from 'lucide-react';

export default function PrintPrescriptionPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPrintData = () => {
            try {
                const storedData = sessionStorage.getItem('temp_prescription_print');
                if (storedData) {
                    setData(JSON.parse(storedData));
                    // Opcionalmente podemos limpiar el storage después de leer
                    // sessionStorage.removeItem('temp_prescription_print');
                }
            } catch (error) {
                console.error('Error parsing print data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadPrintData();
    }, []);

    useEffect(() => {
        if (!loading && data) {
            setTimeout(() => window.print(), 1000);
        }
    }, [loading, data]);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
                <Loader2 className="animate-spin" size={48} color="#3b82f6" />
                <h2 style={{ marginTop: '16px' }}>Preparando receta para impresión...</h2>
            </div>
        );
    }

    if (!data || !data.patient) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
                <h2>Error al cargar información de la receta.</h2>
                <p>Por favor, regrese a la historia clínica y vuelva a presionar "Imprimir Receta".</p>
                <button 
                    onClick={() => window.close()} 
                    style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '5px' }}
                >
                    Cerrar pestaña
                </button>
            </div>
        );
    }

    return (
        <div className="print-page-container">
            {/* The PrintMedicalPrescriptionTemplate will naturally override global @page rules since we gave it a specific @page prescriptionPage */}
            <PrintMedicalPrescriptionTemplate 
                patient={data.patient} 
                data={data.data} 
            />
            <style>{`
                @media screen {
                    body { background-color: #f1f5f9; }
                    .print-page-container { 
                        margin: 20px auto; 
                        width: fit-content; 
                        background: white; 
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    }
                    /* Ensure the template is visible on screen for the preview */
                    #prescription-print-root {
                        display: block !important;
                        position: relative !important;
                    }
                }
                @media print {
                    @page { 
                        size: landscape; 
                        margin: 0; 
                    }
                    html, body { margin: 0; padding: 0; background: white; }
                    * { visibility: visible !important; }
                    #prescription-print-root {
                        display: block !important;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 297mm;
                        height: 210mm;
                        margin: 0;
                        padding: 0;
                    }
                }
            `}</style>
        </div>
    );
}
