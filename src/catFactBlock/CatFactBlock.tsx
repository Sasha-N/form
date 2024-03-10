import React, { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

const CatFactBlock: React.FC = () => {
    const { data: fact, isLoading, refetch } = useQuery({
        queryKey: ['catFact'],
        queryFn: () => fetch('https://catfact.ninja/fact').then((res) => res.json())
    });

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleInput = () => {
        if (textareaRef.current) {
            const text = textareaRef.current.value;
            const index = text.indexOf(' ') !== -1 ? text.indexOf(' ') + 1 : text.length;
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(index, index);
            console.log(index);
        }
    };

    const handleClick = () => {
        refetch();
        handleInput();
    };

    return (
        <div>
            <button onClick={handleClick} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Get Cat Fact'}
            </button>
            <textarea ref={textareaRef} value={fact?.fact} />
        </div>
    );
}

export default CatFactBlock;