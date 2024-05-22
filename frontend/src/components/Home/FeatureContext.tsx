// FeaturesContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import attractionService from '../../services/attraction.service'
import { Attraction } from '../../models/attraction';

const fffff = await attractionService.getAttraction();
console.log(fffff)

// type Attraction = {
//     id: number
//     name: string
//     tag: string
//     city?: string
//     address?: string
//     url?: string
//     rating?: number
//     comment_amount?: number
//     phone?: string
//     pic_url?: string
//     business_hour?:string
//     favorite?:number
//     comments?: string[]
// };

type FeaturesContextType = {
    features: Attraction[];
    toggleFavorite: (id: number) => void;
};

const FeaturesContext = createContext<FeaturesContextType | undefined>(undefined);

export const FeaturesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [features, setFeatures] = useState<Attraction[]>([ ]);

    useEffect(() => {
        const fetchAttractions = async () => {
            const attractions = await attractionService.getAttraction();
            setFeatures(attractions);
        };

        fetchAttractions();
    }, []);


    const toggleFavorite = (id: number) => {
        setFeatures((prevFeatures) =>
            prevFeatures.map((feature) =>
                feature.id === id ? { ...feature, favorite: feature.favorite ? 0 : 1 } : feature
            )
        );
    };

    return (
        <FeaturesContext.Provider value={{ features, toggleFavorite }}>
            {children}
        </FeaturesContext.Provider>
    );
};

export const useFeatures = (): FeaturesContextType => {
    const context = useContext(FeaturesContext);
    if (!context) {
        throw new Error('useFeatures must be used within a FeaturesProvider');
    }
    return context;
};
