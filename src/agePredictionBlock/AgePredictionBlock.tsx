import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

const AgePredictionBlock: React.FC = () => {
    const [name, setName] = useState('');
    const { data: age, isLoading, refetch } = useQuery({
        queryKey: ['agePrediction', name],
        queryFn: async () => fetch(`https://api.agify.io/?name=` + name).then((res) => res.json())
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        refetch();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={name} onChange={handleChange} />
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Predict Age'}
            </button>
            {age && <span className='predict'>Age Prediction: {age.age}</span>}
        </form>
    );
}

export default AgePredictionBlock;