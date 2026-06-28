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
        // 1. Load Active Specialty with MIGRATION for nested objects
        const saved = localStorage.getItem('activeSpecialty');
        let initialActive: Specialty | null = null;
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // MIGRATION: If it's the old nested format { specialty: { ... } }, flatten it
                initialActive = parsed.specialty ? parsed.specialty : parsed;
                setActiveSpecialtyState(initialActive);
                
                // Update storage if it was nested
                if (parsed.specialty) {
                    localStorage.setItem('activeSpecialty', JSON.stringify(initialActive));
                }
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
                    // MIGRATION: Always ensure availableSpecialties is flat and has an ID
                    const specialties = parsedUser.specialties.map((s: any) => {
                        const flat = s.specialty || s;
                        // Ensure it has an id (fallback to specialtyId if using old nested structure)
                        if (!flat.id && s.specialtyId) flat.id = s.specialtyId;
                        return flat;
                    });

                    setAvailableSpecialties(specialties);

                    // Auto-select first if none active
                    if (!initialActive && specialties.length > 0) {
                        const first = specialties[0];
                        setActiveSpecialtyState(first);
                        localStorage.setItem('activeSpecialty', JSON.stringify(first));
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
        // ENSURE we only save flat objects
        const flatSpecialty = (specialty as any)?.specialty ? (specialty as any).specialty : specialty;
        setActiveSpecialtyState(flatSpecialty);
        if (flatSpecialty) {
            localStorage.setItem('activeSpecialty', JSON.stringify(flatSpecialty));
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
    
    // Add a helper for components to get the ID safely
    const getActiveSpecialtyId = () => {
        if (!context.activeSpecialty) return null;
        return (context.activeSpecialty as any).id || (context.activeSpecialty as any).specialty?.id;
    };

    return { ...context, getActiveSpecialtyId };
};
