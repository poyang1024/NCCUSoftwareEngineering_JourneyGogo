import styled from "styled-components";
import React from 'react'

interface CardProps {
    className?: string;
    children: React.ReactNode;
}

const Ctn = ({ className, children }: CardProps) => {
    return <div className={className}>{children}</div>;
}


const CustomCard = styled(Ctn)`
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1),
    0 15px 30px rgba(0, 0, 0, 0.1),
    15px 0 30px rgba(0, 0, 0, 0.1),
    -15px 0 30px rgba(0, 0, 0, 0.1);
    background-color: #FFFFFF;
    padding: 5.5rem;
    border-radius: 12px;
    height: 75vh; // when use 100, it will generate scrollbar
    display: flex;
    flex-direction: row;
    gap:2rem
`;


export default CustomCard