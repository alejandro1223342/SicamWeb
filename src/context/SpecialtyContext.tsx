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
    refreshSpecialties: () => void;
}

const SpecialtyContext = createContext<SpecialtyContextType | undefined>(undefined);

export const SpecialtyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeSpecialty, setActiveSpecialtyState] = useState<Specialty | null>(null);
    const [availableSpecialties, setAvailableSpecialties] = useState<Specialty[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = () => {
        // 1. Load Active Specialty
        const saved = localStorage.getItem('activeSpecialty');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setActiveSpecialtyState(parsed);
            } catch (e) {
                console.error('Error parsing activeSpecialty', e);
            }
        }

        // 2. Load Available Specialties from User
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                if (parsedUser.role === 'MEDICO' && parsedUser.specialties) {
                    const specialties = parsedUser.specialties;
                    setAvailableSpecialties(specialties);

                    // Auto-select first if none active
                    if (!saved && specialties.length > 0) {
                        setActiveSpecialtyState(specialties[0]);
                        localStorage.setItem('activeSpecialty', JSON.stringify(specialties[0]));
                    }
                } else {
                    setAvailableSpecialties([]);
                }
            } catch (e) {
                console.error('Error parsing user data for specialties', e);
            }
        } else {
            setAvailableSpecialties([]);
            setActiveSpecialtyState(null);
        }
        setIsLoading(false);
    };

    // Persist active specialty in localStorage AND initialize available specialties
    useEffect(() => {
        loadData();
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
            isLoading,
            refreshSpecialties: loadData
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
