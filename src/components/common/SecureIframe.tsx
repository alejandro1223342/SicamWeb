import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface SecureIframeProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
    src: string;
}

const iframeCache = new Map<string, string>();

export const SecureIframe: React.FC<SecureIframeProps> = ({ src, className, ...props }) => {
    const [objectUrl, setObjectUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadIframe = async () => {
            if (!src) {
                setIsLoading(false);
                return;
            }

            let fetchUrl = src;
            if (!src.includes('http') && !src.includes('/')) {
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                fetchUrl = `${baseUrl}/drive/file/${src}`;
            } else if (!src.includes('/drive/file/')) {
                setObjectUrl(src);
                setIsLoading(false);
                return;
            }

            if (iframeCache.has(fetchUrl)) {
                setObjectUrl(iframeCache.get(fetchUrl)!);
                setIsLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(fetchUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Error fetching document');
                }

                const blob = await response.blob();
                const pdfBlob = new Blob([blob], { type: 'application/pdf' });
                const blobUrl = URL.createObjectURL(pdfBlob);
                
                iframeCache.set(fetchUrl, blobUrl);

                if (isMounted) {
                    setObjectUrl(blobUrl);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error loading secure iframe:', error);
                if (isMounted) {
                    setHasError(true);
                    setIsLoading(false);
                }
            }
        };

        loadIframe();

        return () => {
            isMounted = false;
        };
    }, [src]);

    if (isLoading) {
        return (
            <div className={`flex items-center justify-center bg-slate-100 ${className || ''}`} style={props.style || { width: '100%', height: '100%', minHeight: '300px' }}>
                <Loader2 className="animate-spin text-primary" size={32} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    if (hasError || !objectUrl) {
        return (
            <div className={`flex items-center justify-center bg-red-50 text-red-500 ${className || ''}`} style={props.style || { width: '100%', height: '100%', minHeight: '300px' }}>
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Error cargando el documento PDF</span>
            </div>
        );
    }

    return <iframe src={objectUrl} className={className} {...props} />;
};
