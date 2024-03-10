import React from 'react';
import { useQuery } from '@tanstack/react-query';

const CatFactBlock: React.FC = () => {
    const { data: fact, isLoading, refetch } = useQuery({
        queryKey: ['catFact'],
        queryFn: () => fetch('https://catfact.ninja/fact').then((res) => res.json())
    });


    const handleClick = () => {
        refetch();
    };

    return (
        <div>
            <button onClick={handleClick} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Get Cat Fact'}
            </button>
            <input type="text" value={fact?.fact} readOnly />
        </div>
    );
}

export default CatFactBlock;