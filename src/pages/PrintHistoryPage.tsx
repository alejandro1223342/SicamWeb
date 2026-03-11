import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PrintMedicalHistoryTemplate from '../components/medical-history/PrintMedicalHistoryTemplate';
import api from '../api';
import { Loader2 } from 'lucide-react';

export default function PrintHistoryPage() {
    const { patientId, recordId } = useParams<{ patientId: string; recordId: string }>();
    const [data, setData] = useState<any>(null);
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/medical-records/${recordId}`);
                if (response.data) {
                    setData(response.data.data);
                    setPatient(response.data.patient);
                }
            } catch (error) {
                console.error('Error fetching print data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (recordId) fetchData();
    }, [recordId]);

    useEffect(() => {
        if (!loading && data && patient) {
            // Give it a tiny bit of time to render
            setTimeout(() => {
                window.print();
                // Optional: window.close(); // might be annoying if they want to see it first
            }, 1000);
        }
    }, [loading, data, patient]);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
                <Loader2 className="animate-spin" size={48} color="#3b82f6" />
                <h2 style={{ marginTop: '16px', color: '#1e293b' }}>Preparando documento para impresión...</h2>
            </div>
        );
    }

    if (!data || !patient) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Error: No se pudo cargar la información del registro.</div>;
    }

    return (
        <div className="print-page-container">
            <PrintMedicalHistoryTemplate patient={patient} data={data} />
            
            <style>{`
                @media screen {
                    body { background-color: #f1f5f9 !important; }
                    .print-page-container {
                        margin: 20px auto;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        width: fit-content;
                        background: white;
                    }
                }
                @media print {
                    @page { margin: 0; size: A4; }
                    html, body, #root { 
                        margin: 0 !important; 
                        padding: 0 !important; 
                        height: auto !important;
                        min-height: auto !important;
                        background: white !important;
                        visibility: visible !important;
                    }
                    /* Aggressive override for global visibility: hidden */
                    * { 
                        visibility: visible !important; 
                        overflow: visible !important;
                    }
                    .print-page-container {
                        margin: 0 !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                        width: 210mm !important;
                    }
                }
            `}</style>
        </div>
    );
}
