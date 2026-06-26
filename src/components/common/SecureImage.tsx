import React, { useState, useEffect } from 'react';

// Caché en memoria para evitar descargar la misma imagen múltiples veces
const imageCache = new Map<string, string>();

interface SecureImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    fallbackSrc?: string;
}

export function SecureImage({ src, fallbackSrc, className, alt, ...props }: SecureImageProps) {
    const [objectUrl, setObjectUrl] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchImage = async () => {
            if (!src) {
                setIsLoading(false);
                return;
            }

            // Si no es una URL del backend (ej. un avatar genérico de ui-avatars), usarla directamente
            // Pero si es solo un ID (no tiene http ni /), asumimos que es un ID de drive.
            let fetchUrl = src;
            if (!src.includes('http') && !src.includes('/')) {
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                fetchUrl = `${baseUrl}/drive/file/${src}`;
            } else if (!src.includes('/drive/file/')) {
                setObjectUrl(src);
                setIsLoading(false);
                return;
            }

            // Si ya está en caché, usar la versión cacheada instantáneamente
            if (imageCache.has(fetchUrl)) {
                setObjectUrl(imageCache.get(fetchUrl)!);
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
                    throw new Error('Error fetching image');
                }

                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                
                imageCache.set(fetchUrl, blobUrl);

                if (isMounted) {
                    setObjectUrl(blobUrl);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching secure image:', error);
                if (isMounted) {
                    setHasError(true);
                    setIsLoading(false);
                }
            }
        };

        fetchImage();

        return () => {
            isMounted = false;
        };
    }, [src]);

    // Si hubo error o no hay src, mostrar fallback o nada
    if (hasError || (!objectUrl && !isLoading)) {
        return <img src={fallbackSrc || ''} alt={alt} className={className} {...props} />;
    }

    // Si está cargando, se puede mostrar un placeholder o mantener la estructura
    if (isLoading) {
        return <div className={`avatar-placeholder ${className || ''}`} style={{ backgroundColor: '#e2e8f0', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', display: 'inline-block' }} />;
    }

    return <img src={objectUrl || ''} alt={alt} className={className} {...props} />;
}
