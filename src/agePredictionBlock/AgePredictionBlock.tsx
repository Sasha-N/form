import React, { useState, useRef, useEffect } from 'react';
import { useQuery, QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

const AgePredictionBlock: React.FC = () => {
    const [name, setName] = useState('');
    const nameRef = useRef<string>(name);
    const [lastSubmittedName, setLastSubmittedName] = useState('');
    nameRef.current = name;

    const { data: age, isLoading, refetch, isFetching } = useQuery({
        queryKey: ['agePrediction', name],
        queryFn: async () => fetch(`https://api.agify.io/?name=` + nameRef.current)
            .then((res) => {
                const data = res.json();
                if (nameRef.current !== name || nameRef.current === '') {
                    throw new Error('Request canceled');
                }
                return data;
            }
            ),
        enabled: !!name,
        refetchInterval: false,
        refetchOnWindowFocus: false
    });

    let timerId: NodeJS.Timeout;

    useEffect(() => {
        if (isFetching && name) {
            queryClient.cancelQueries({ queryKey: ['agePrediction'] });
        }
    }, [name, isFetching]);

       const timerRef = useRef<NodeJS.Timeout | null>(null);
       const lastRequestTimeRef = useRef<number | null>(null);

       const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
        clearTimeout(timerRef.current!);
        timerRef.current = setTimeout(() => {
            if (event.target.value.trim() !== '' && event.target.value !== lastSubmittedName) {
                setLastSubmittedName(event.target.value);
                lastRequestTimeRef.current = Date.now();
                refetch();
            }
        }, 3000);
    };


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        clearTimeout(timerId);
        if (name.trim() !== '' && name !== lastSubmittedName) {
            setLastSubmittedName(name);
            refetch();
        }
    };

    return (
        <QueryClientProvider client={queryClient}>
            <form onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={handleChange} />
                <button type="submit" disabled={isLoading || !name}>
                    {isLoading ? 'Loading...' : 'Predict Age'}
                </button>
                <span className='predict'>Age Prediction: {age && age.age}</span>
            </form>
        </QueryClientProvider>
    );
}

export default AgePredictionBlock;