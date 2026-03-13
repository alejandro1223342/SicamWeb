import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PrintMealPlanTemplate from '../components/medical-history/PrintMealPlanTemplate';
import api from '../api';
import { Loader2 } from 'lucide-react';

export default function PrintMealPlanPage() {
    const { recordId } = useParams<{ patientId: string; recordId: string }>();
    const [data, setData] = useState<any>(null);
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/medical-records/${recordId}`);
                if (response.data) {
                    setData(response.data.data || {});
                    setPatient(response.data.patient || response.data.data?.patient);
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
            // Wait for styles and content to be ready
            setTimeout(() => {
                window.print();
            }, 1000);
        }
    }, [loading, data, patient]);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
                <Loader2 className="animate-spin" size={48} color="#10b981" />
                <h2 style={{ marginTop: '16px', color: '#1e293b' }}>Generando plan alimentario...</h2>
            </div>
        );
    }

    if (!data || !patient) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Error al cargar información del plan.</div>;
    }

    return (
        <div className="print-meal-plan-container">
            <PrintMealPlanTemplate patient={patient} data={data} />
            <style>{`
                @media screen {
                    body { background-color: #f1f5f9; }
                    .print-meal-plan-container { 
                        margin: 20px auto; 
                        width: 210mm; 
                        background: white; 
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        min-height: 297mm;
                        padding: 10mm;
                    }
                }
                @media print {
                    @page { margin: 0; size: A4; }
                    html, body, #root { 
                        margin: 0 !important; 
                        padding: 0 !important; 
                        background: white !important;
                        visibility: visible !important;
                        height: auto !important;
                    }
                    /* Force everything inside print-meal-plan-container to be visible */
                    .print-meal-plan-container, .print-meal-plan-container * {
                        visibility: visible !important;
                    }
                    .print-meal-plan-container { 
                        width: 210mm !important; 
                        margin: 0 !important; 
                        padding: 10mm !important;
                        box-shadow: none !important;
                        display: block !important;
                        position: relative !important;
                    }
                    /* Ensure background colors are printed */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>
        </div>
    );
}
