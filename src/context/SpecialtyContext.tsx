import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Specialty {
    id: string;
    name: string;
    description: string;
}

interface SpecialtyContextType {
    activeSpecialty: Specialty | null;
    setActiveSpecialty: (specialty: Specialty | null) => void;
    availableSpecialties: Specialty[];
    setAvailableSpecialties: (specialties: Specialty[]) => void;
    isLoading: boolean;
}

const SpecialtyContext = createContext<SpecialtyContextType | undefined>(undefined);

export const SpecialtyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeSpecialty, setActiveSpecialtyState] = useState<Specialty | null>(null);
    const [availableSpecialties, setAvailableSpecialties] = useState<Specialty[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Persist active specialty in localStorage
    useEffect(() => {
        const saved = localStorage.getItem('activeSpecialty');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setActiveSpecialtyState(parsed);
            } catch (e) {
                console.error('Error parsing activeSpecialty', e);
            }
        }
        setIsLoading(false);
    }, []);

    const setActiveSpecialty = (specialty: Specialty | null) => {
        setActiveSpecialtyState(specialty);
        if (specialty) {
            localStorage.setItem('activeSpecialty', JSON.stringify(specialty));
        } else {
            localStorage.removeItem('activeSpecialty');
        }
    };

    return (
        <SpecialtyContext.Provider value={{
            activeSpecialty,
            setActiveSpecialty,
            availableSpecialties,
            setAvailableSpecialties,
            isLoading
        }}>
            {children}
        </SpecialtyContext.Provider>
    );
};

export const useSpecialty = () => {
    const context = useContext(SpecialtyContext);
    if (context === undefined) {
        throw new Error('useSpecialty must be used within a SpecialtyProvider');
    }
    return context;
};
