// FeaturesContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import attractionService from '../../services/attraction.service'
import { Attraction } from '../../models/attraction';


type FeaturesContextType = {
    features: Attraction[];
    isLoading: boolean,
    toggleFavorite: (id: number) => void;
    setCity: (city: string) => void;
    setKeyword: (keyword: string) => void;
    setSkipNextFetch: (skip: boolean) => void; 
    getAttractionById: (id: number) => Promise<{ attraction: Attraction; favorite: number; comments: Array<string> }>;
};

const FeaturesContext = createContext<FeaturesContextType | undefined>(undefined);

export const FeaturesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [features, setFeatures] = useState<Attraction[]>([]);
    const [city, setCity] = useState<string>('');
    const [keyword, setKeyword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [skipNextFetch, setSkipNextFetch] = useState<boolean>(false); 
    const location = useLocation();

    useEffect(() => {
        const fetchAttractions = async () => {
            if (skipNextFetch) {
                setSkipNextFetch(false); // 重置狀態
                return;
            }
            setIsLoading(true)
            try{
                const params = new URLSearchParams(location.search);
                const cityParam = params.get('city') || '';
                const keywordParam = params.get('keyword') || '';
                setCity(cityParam);
                setKeyword(keywordParam);
                const attractions = await attractionService.getAttraction(city, keyword);
                setFeatures(attractions);
            } catch (error) {
                console.error('Error fetching attraction:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAttractions();
    }, [location.search]);


    const toggleFavorite = (id: number) => {
        setFeatures((prevFeatures) =>
            prevFeatures.map((feature) =>
                feature.id === id ? { ...feature, favorite: feature.favorite ? 0 : 1 } : feature
            )
        );
    };

    const getAttractionById = async (id: number) => {
        const attractionData = await attractionService.getAttractionById(id);
        // 更新 features 狀態，確保 features 包含最新的收藏狀態
        setFeatures((prevFeatures) =>
            prevFeatures.map((feature) =>
                feature.id === id ? { ...feature, favorite: attractionData.favorite } : feature
            )
        );
        return attractionData;
    };

    return (
        <FeaturesContext.Provider value={{ features, isLoading, toggleFavorite, setCity, setKeyword, setSkipNextFetch, getAttractionById}}>
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
