import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSpecialty } from '../context/SpecialtyContext';

export default function SpecialtySync() {
    const { specialtyId } = useParams<{ specialtyId: string }>();
    const { activeSpecialty, setActiveSpecialty, availableSpecialties } = useSpecialty();

    useEffect(() => {
        if (specialtyId && availableSpecialties.length > 0) {
            // Only update if it's different to avoid loops
            if (activeSpecialty?.id !== specialtyId) {
                const matched = availableSpecialties.find(s => s.id === specialtyId);
                if (matched) {
                    console.log('SpecialtySync: URL change detected, updating context to:', matched.name);
                    setActiveSpecialty(matched);
                }
            }
        }
    }, [specialtyId, availableSpecialties, activeSpecialty, setActiveSpecialty]);

    return null;
}
