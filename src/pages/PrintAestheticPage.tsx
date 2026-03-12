import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PrintAestheticHistoryTemplate from '../components/medical-history/PrintAestheticHistoryTemplate';
import api from '../api';
import { Loader2 } from 'lucide-react';

export default function PrintAestheticPage() {
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
            setTimeout(() => window.print(), 1000);
        }
    }, [loading, data, patient]);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
                <Loader2 className="animate-spin" size={48} color="#3b82f6" />
                <h2 style={{ marginTop: '16px' }}>Preparando documento para impresión...</h2>
            </div>
        );
    }

    if (!data || !patient) return <div style={{ padding: '40px', textAlign: 'center' }}>Error al cargar información.</div>;

    return (
        <div className="print-page-container">
            <PrintAestheticHistoryTemplate patient={patient} data={data} />
            <style>{`
                @media screen {
                    body { background-color: #f1f5f9; }
                    .print-page-container { margin: 20px auto; width: fit-content; background: white; }
                }
                @media print {
                    @page { margin: 0; size: A4; }
                    html, body { margin: 0; padding: 0; background: white; }
                    * { visibility: visible !important; }
                }
            `}</style>
        </div>
    );
}
