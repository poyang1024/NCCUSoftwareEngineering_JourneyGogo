// FeaturesContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Feature = {
    img: string;
    alt: string;
    title: string;
    star: string;
    favorite: number;
    address: string;
    phone: string;
    openingHours: { [key: string]: string };
    comments: string[];
    id: number;
};

type FeaturesContextType = {
    features: Feature[];
    toggleFavorite: (id: number) => void;
};

const FeaturesContext = createContext<FeaturesContextType | undefined>(undefined);

export const FeaturesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [features, setFeatures] = useState<Feature[]>([
        {
            img: 'https://lh3.googleusercontent.com/p/AF1QipNl0iR_cQkLHsnEWADmoxnJNxS-NG3n4BLFjMEY=s680-w680-h510',
            alt: '國立政治大學達賢圖書館',
            title: '國立政治大學達賢圖書館',
            star: "4.8",
            favorite: 1,
            address: '116841台北市文山區興隆路3段39號',
            phone: '0282377017',
            openingHours: {
                '星期日': '08:00-21:45',
                '星期一': '08:00-21:45',
                '星期二': '08:00-21:45',
                '星期三': '08:00-21:45',
                '星期四': '08:00-21:45',
                '星期五': '08:00-21:45',
                '星期六': '08:00-21:45',
            },
            comments: ['美色濃郁,設備新穎,環境式建築設計很有特色。校友推薦系我最愛,品酒會也常在此舉行。'],
            id: 1
        },
        {
            img: 'https://lh3.googleusercontent.com/p/AF1QipP2fr_21AVDATmxcSJuOtOYhe3vQStS9ZMO0kgS=s680-w680-h510',
            alt: '邀月茶坊Yaoyue Teahouse',
            title: '邀月茶坊Yaoyue Teahouse',
            star: '4.2',
            favorite: 0,
            address: '116841台北市文山區興隆路3段39號',
            phone: '0282377017',
            openingHours: {
                '星期日': '08:00-21:45',
                '星期一': '08:00-21:45',
                '星期二': '08:00-21:45',
                '星期三': '08:00-21:45',
                '星期四': '08:00-21:45',
                '星期五': '08:00-21:45',
                '星期六': '08:00-21:45',
            },
            comments: ['美色濃郁,設備新穎,環境式建築設計很有特色。校友推薦系我最愛,品酒會也常在此舉行。'],
            id: 2
        },
        {
            img: 'https://lh3.googleusercontent.com/p/AF1QipNL-OoanDrkbvxkjncRUJvvT7foRqzfTNW7N5Fu=s680-w680-h510',
            alt: 'Purrson Bistro 呼嚕小酒館',
            title: 'Purrson Bistro 呼嚕小酒館',
            star: '4.7',
            favorite: 0,
            address: '116841台北市文山區興隆路3段39號', // 添加地址
            phone: '0282377017', // 添加電話號碼
            openingHours: { // 添加營業時間
                '星期日': '08:00-21:45',
                '星期一': '08:00-21:45',
                '星期二': '08:00-21:45',
                '星期三': '08:00-21:45',
                '星期四': '08:00-21:45',
                '星期五': '08:00-21:45',
                '星期六': '08:00-21:45',
            },
            comments: ['美色濃郁,設備新穎,環境式建築設計很有特色。校友推薦系我最愛,品酒會也常在此舉行。'],
            id: 3
        },
        {
            img: 'https://lh3.googleusercontent.com/p/AF1QipOK0nqSD6sufCX3-WBekoP04MBW_h4KVeHojY1k=s680-w680-h510',
            alt: '木南公園',
            title: '木南公園',
            star: '3.9',
            favorite: 1,
            address: '116841台北市文山區興隆路3段39號', // 添加地址
            phone: '0282377017', // 添加電話號碼
            openingHours: { // 添加營業時間
                '星期日': '08:00-21:45',
                '星期一': '08:00-21:45',
                '星期二': '08:00-21:45',
                '星期三': '08:00-21:45',
                '星期四': '08:00-21:45',
                '星期五': '08:00-21:45',
                '星期六': '08:00-21:45',
            },
            comments: ['美色濃郁,設備新穎,環境式建築設計很有特色。校友推薦系我最愛,品酒會也常在此舉行。'],
            id: 4
        },
        {
            img: 'https://lh3.googleusercontent.com/p/AF1QipMaecM7vUdXbxNBMsCdjL31UN6a5Y773FGbuRY=s680-w680-h510',
            alt: 'Schumann’s BISTRO NO. 6 舒曼六號餐館 動物園政大店｜德國豬腳｜寵物友善',
            title: 'Schumann’s BISTRO NO. 6 舒曼六號餐館 動物園政大店｜德國豬腳｜寵物友善',
            star: '4.2',
            favorite: 1,
            address: '116841台北市文山區興隆路3段39號', // 添加地址
            phone: '0282377017', // 添加電話號碼
            openingHours: { // 添加營業時間
                '星期日': '08:00-21:45',
                '星期一': '08:00-21:45',
                '星期二': '08:00-21:45',
                '星期三': '08:00-21:45',
                '星期四': '08:00-21:45',
                '星期五': '08:00-21:45',
                '星期六': '08:00-21:45',
            },
            comments: ['美色濃郁,設備新穎,環境式建築設計很有特色。校友推薦系我最愛,品酒會也常在此舉行。'],
            id: 5
        },
        {
            img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
            alt: 'Juicy Bun Burger 就是棒 美式餐廳 政大店',
            title: 'Juicy Bun Burger 就是棒 美式餐廳 政大店',
            star: '4.4',
            favorite: 0,
            address: '116841台北市文山區興隆路3段39號', // 添加地址
            phone: '0282377017', // 添加電話號碼
            openingHours: { // 添加營業時間
                '星期日': '08:00-21:45',
                '星期一': '08:00-21:45',
                '星期二': '08:00-21:45',
                '星期三': '08:00-21:45',
                '星期四': '08:00-21:45',
                '星期五': '08:00-21:45',
                '星期六': '08:00-21:45',
            },
            comments: ['美色濃郁,設備新穎,環境式建築設計很有特色。校友推薦系我最愛,品酒會也常在此舉行。'],
            id: 6
        },
        {
            img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
            alt: '7Juicy Bun Burger 就是棒 美式餐廳 政大店',
            title: '7Juicy Bun Burger 就是棒 美式餐廳 政大店',
            star: '4.4',
            favorite: 1,
            address: '116841台北市文山區興隆路3段39號', // 添加地址
            phone: '0282377017', // 添加電話號碼
            openingHours: { // 添加營業時間
                '星期日': '08:00-21:45',
                '星期一': '08:00-21:45',
                '星期二': '08:00-21:45',
                '星期三': '08:00-21:45',
                '星期四': '08:00-21:45',
                '星期五': '08:00-21:45',
                '星期六': '08:00-21:45',
            },
            comments: ['美色濃郁,設備新穎,環境式建築設計很有特色。校友推薦系我最愛,品酒會也常在此舉行。'],
            id: 7
        },
        {
            img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
            alt: '8Juicy Bun Burger 就是棒 美式餐廳 政大店',
            title: '8Juicy Bun Burger 就是棒 美式餐廳 政大店',
            star: '4.4',
            favorite: 0,
            address: '116841台北市文山區興隆路3段39號', // 添加地址
            phone: '0282377017', // 添加電話號碼
            openingHours: { // 添加營業時間
                '星期日': '08:00-21:45',
                '星期一': '08:00-21:45',
                '星期二': '08:00-21:45',
                '星期三': '08:00-21:45',
                '星期四': '08:00-21:45',
                '星期五': '08:00-21:45',
                '星期六': '08:00-21:45',
            },
            comments: ['美色濃郁,設備新穎,環境式建築設計很有特色。校友推薦系我最愛,品酒會也常在此舉行。'],
            id: 8
        },
        {
            img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
            alt: '9Juicy Bun Burger 就是棒 美式餐廳 政大店',
            title: '9Juicy Bun Burger 就是棒 美式餐廳 政大店',
            star: '4.4',
            favorite: 1,
            address: '116841台北市文山區興隆路3段39號', // 添加地址
            phone: '0282377017', // 添加電話號碼
            openingHours: { // 添加營業時間
                '星期日': '08:00-21:45',
                '星期一': '08:00-21:45',
                '星期二': '08:00-21:45',
                '星期三': '08:00-21:45',
                '星期四': '08:00-21:45',
                '星期五': '08:00-21:45',
                '星期六': '08:00-21:45',
            },
            comments: ['美色濃郁,設備新穎,環境式建築設計很有特色。校友推薦系我最愛,品酒會也常在此舉行。'],
            id: 9
        },
        {
            img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
            alt: '10Juicy Bun Burger 就是棒 美式餐廳 政大店',
            title: '10Juicy Bun Burger 就是棒 美式餐廳 政大店',
            star: '4.4',
            favorite: 0,
            address: '116841台北市文山區興隆路3段39號', // 添加地址
            phone: '0282377017', // 添加電話號碼
            openingHours: { // 添加營業時間
                '星期日': '08:00-21:45',
                '星期一': '08:00-21:45',
                '星期二': '08:00-21:45',
                '星期三': '08:00-21:45',
                '星期四': '08:00-21:45',
                '星期五': '08:00-21:45',
                '星期六': '08:00-21:45',
            },
            comments: ['美色濃郁,設備新穎,環境式建築設計很有特色。校友推薦系我最愛,品酒會也常在此舉行。'],
            id: 10
        },
        {
            img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
            alt: '11Juicy Bun Burger 就是棒 美式餐廳 政大店',
            title: '11Juicy Bun Burger 就是棒 美式餐廳 政大店',
            star: '4.4',
            favorite: 0,
            address: '116841台北市文山區興隆路3段39號', // 添加地址
            phone: '0282377017', // 添加電話號碼
            openingHours: { // 添加營業時間
                '星期日': '08:00-21:45',
                '星期一': '08:00-21:45',
                '星期二': '08:00-21:45',
                '星期三': '08:00-21:45',
                '星期四': '08:00-21:45',
                '星期五': '08:00-21:45',
                '星期六': '08:00-21:45',
            },
            comments: ['美色濃郁,設備新穎,環境式建築設計很有特色。校友推薦系我最愛,品酒會也常在此舉行。'],
            id: 11
        },
        {
            img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
            alt: '12Juicy Bun Burger 就是棒 美式餐廳 政大店',
            title: '12Juicy Bun Burger 就是棒 美式餐廳 政大店',
            star: '4.4',
            favorite: 0,
            address: '116841台北市文山區興隆路3段39號', // 添加地址
            phone: '0282377017', // 添加電話號碼
            openingHours: { // 添加營業時間
                '星期日': '08:00-21:45',
                '星期一': '08:00-21:45',
                '星期二': '08:00-21:45',
                '星期三': '08:00-21:45',
                '星期四': '08:00-21:45',
                '星期五': '08:00-21:45',
                '星期六': '08:00-21:45',
            },
            comments: ['美色濃郁,設備新穎,環境式建築設計很有特色。校友推薦系我最愛,品酒會也常在此舉行。'],
            id: 12

        },
        {
            img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
            alt: '13Juicy Bun Burger 就是棒 美式餐廳 政大店',
            title: '13Juicy Bun Burger 就是棒 美式餐廳 政大店',
            star: '4.4',
            favorite: 1,
            address: '116841台北市文山區興隆路3段39號', // 添加地址
            phone: '0282377017', // 添加電話號碼
            openingHours: { // 添加營業時間
                '星期日': '08:00-21:45',
                '星期一': '08:00-21:45',
                '星期二': '08:00-21:45',
                '星期三': '08:00-21:45',
                '星期四': '08:00-21:45',
                '星期五': '08:00-21:45',
                '星期六': '08:00-21:45',
            },
            comments: ['美色濃郁,設備新穎,環境式建築設計很有特色。校友推薦系我最愛,品酒會也常在此舉行。'],
            id: 13

        },
        {
            img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
            alt: '14Juicy Bun Burger 就是棒 美式餐廳 政大店',
            title: '14Juicy Bun Burger 就是棒 美式餐廳 政大店',
            star: '4.4',
            favorite: 1,
            address: '116841台北市文山區興隆路3段39號', // 添加地址
            phone: '0282377017', // 添加電話號碼
            openingHours: { // 添加營業時間
                '星期日': '08:00-21:45',
                '星期一': '08:00-21:45',
                '星期二': '08:00-21:45',
                '星期三': '08:00-21:45',
                '星期四': '08:00-21:45',
                '星期五': '08:00-21:45',
                '星期六': '08:00-21:45',
            },
            comments: ['美色濃郁,設備新穎,環境式建築設計很有特色。校友推薦系我最愛,品酒會也常在此舉行。'],
            id: 14
        },
        {
            img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
            alt: '15Juicy Bun Burger 就是棒 美式餐廳 政大店',
            title: '15Juicy Bun Burger 就是棒 美式餐廳 政大店',
            star: '4.4',
            favorite: 0,
            address: '116841台北市文山區興隆路3段39號', // 添加地址
            phone: '0282377017', // 添加電話號碼
            openingHours: { // 添加營業時間
                '星期日': '08:00-21:45',
                '星期一': '08:00-21:45',
                '星期二': '08:00-21:45',
                '星期三': '08:00-21:45',
                '星期四': '08:00-21:45',
                '星期五': '08:00-21:45',
                '星期六': '08:00-21:45',
            },
            comments: ['美色濃郁,設備新穎,環境式建築設計很有特色。校友推薦系我最愛,品酒會也常在此舉行。'],
            id: 15
        },
        {
            img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
            alt: '16Juicy Bun Burger 就是棒 美式餐廳 政大店',
            title: '16Juicy Bun Burger 就是棒 美式餐廳 政大店',
            star: '4.4',
            favorite: 0,
            address: '116841台北市文山區興隆路3段39號', // 添加地址
            phone: '0282377017', // 添加電話號碼
            openingHours: { // 添加營業時間
                '星期日': '08:00-21:45',
                '星期一': '08:00-21:45',
                '星期二': '08:00-21:45',
                '星期三': '08:00-21:45',
                '星期四': '08:00-21:45',
                '星期五': '08:00-21:45',
                '星期六': '08:00-21:45',
            },
            comments: ['美色濃郁,設備新穎,環境式建築設計很有特色。校友推薦系我最愛,品酒會也常在此舉行。'],
            id: 16
        },
        {
            img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
            alt: '17Juicy Bun Burger 就是棒 美式餐廳 政大店',
            title: '17Juicy Bun Burger 就是棒 美式餐廳 政大店',
            star: '4.4',
            favorite: 0,
            address: '116841台北市文山區興隆路3段39號', // 添加地址
            phone: '0282377017', // 添加電話號碼
            openingHours: { // 添加營業時間
                '星期日': '08:00-21:45',
                '星期一': '08:00-21:45',
                '星期二': '08:00-21:45',
                '星期三': '08:00-21:45',
                '星期四': '08:00-21:45',
                '星期五': '08:00-21:45',
                '星期六': '08:00-21:45',
            },
            comments: ['美色濃郁,設備新穎,環境式建築設計很有特色。校友推薦系我最愛,品酒會也常在此舉行。'],
            id: 17
        },
        {
            img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
            alt: '18Juicy Bun Burger 就是棒 美式餐廳 政大店',
            title: '18Juicy Bun Burger 就是棒 美式餐廳 政大店',
            star: '4.4',
            favorite: 1,
            address: '116841台北市文山區興隆路3段39號', // 添加地址
            phone: '0282377017', // 添加電話號碼
            openingHours: { // 添加營業時間
                '星期日': '08:00-21:45',
                '星期一': '08:00-21:45',
                '星期二': '08:00-21:45',
                '星期三': '08:00-21:45',
                '星期四': '08:00-21:45',
                '星期五': '08:00-21:45',
                '星期六': '08:00-21:45',
            },
            comments: ['美色濃郁,設備新穎,環境式建築設計很有特色。校友推薦系我最愛,品酒會也常在此舉行。'],
            id: 18
        },
    ]);

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
