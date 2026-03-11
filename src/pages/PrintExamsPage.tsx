import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PrintExamsTemplate from '../components/medical-history/PrintExamsTemplate';
import api from '../api';
import { Loader2 } from 'lucide-react';

export default function PrintExamsPage() {
    const { patientId, recordId } = useParams<{ patientId: string; recordId: string }>();
    const [data, setData] = useState<any>(null);
    const [patient, setPatient] = useState<any>(null);
    const [catalog, setCatalog] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch record 
                const recordRes = await api.get(`/medical-records/${recordId}`);
                if (recordRes.data) {
                    setData(recordRes.data.data?.exams || {});
                    setPatient(recordRes.data.patient);
                }

                // Fetch catalog
                const catalogRes = await api.get('/catalogs/complementary-exams', {
                    params: { page: 1, limit: 1000 }
                });
                const fetchedItems = catalogRes.data.items || [];
                const catObj: any = {};
                fetchedItems.forEach((cat: any) => {
                    catObj[cat.name] = (cat.options || []).map((opt: any) => opt.name);
                });
                setCatalog(catObj);

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
            setTimeout(() => {
                window.print();
            }, 1000);
        }
    }, [loading, data, patient]);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
                <Loader2 className="animate-spin" size={48} color="#3b82f6" />
                <h2 style={{ marginTop: '16px', color: '#1e293b' }}>Preparando orden de exámenes...</h2>
            </div>
        );
    }

    if (!data || !patient) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Error: No se pudo cargar la información del registro.</div>;
    }

    return (
        <div className="print-page-container">
            <PrintExamsTemplate patient={patient} data={data} catalog={catalog} />
            
            <style>{`
                @media screen {
                    body { background-color: #f1f5f9 !important; }
                    .print-page-container {
                        margin: 20px auto;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        width: fit-content;
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
