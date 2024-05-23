// FeaturesContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import attractionService from '../../services/attraction.service'
import { Attraction } from '../../models/attraction';

const fffff = await attractionService.getAttraction();
console.log(fffff)

type FeaturesContextType = {
    features: Attraction[];
    toggleFavorite: (id: number) => void;
    setCity: (city: string) => void;
    setKeyword: (keyword: string) => void;
};

const FeaturesContext = createContext<FeaturesContextType | undefined>(undefined);

export const FeaturesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [features, setFeatures] = useState<Attraction[]>([ ]);
    const [city, setCity] = useState<string>('');
    const [keyword, setKeyword] = useState<string>('');

    useEffect(() => {
        const fetchAttractions = async () => {
            const attractions = await attractionService.getAttraction(city, keyword);
            setFeatures(attractions);
        };

        fetchAttractions();
    }, [city, keyword]);


    const toggleFavorite = (id: number) => {
        setFeatures((prevFeatures) =>
            prevFeatures.map((feature) =>
                feature.id === id ? { ...feature, favorite: feature.favorite ? 0 : 1 } : feature
            )
        );
    };

    return (
        <FeaturesContext.Provider value={{ features, toggleFavorite, setCity, setKeyword }}>
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
