// Search Input Component
// Renders the search input field and search button with hover effects


import React from 'react';
import { FaSearch } from 'react-icons/fa';

import { useAppContext } from '../../../lib/context';

export default function SearchInput({ value, onChange, onFocus, inputRef }) {
    const context = useAppContext();
    const [isIconHovered, setIsIconHovered] = React.useState(false);
    
    return (
        <div className='d-flex flex-row border rounded-lg'>
            <input
                type='text'
                className='p-2 rounded-left border-0'
                style={{
                    width: '400px', 
                    backgroundColor: context.colorScheme.secondaryBackground, 
                    color: context.colorScheme.textColor
                }}
                placeholder='SEARCH'
                value={value}
                onChange={e => onChange(e.target.value)}
                ref={inputRef}
                onFocus={onFocus}
            />
            
            <button
                onClick={() => inputRef.current.focus()}
                className='p-2 px-3 align-self-stretch d-flex flex-column align-items-center
                justify-content-center rounded-right border-0'
                style={{
                    backgroundColor: isIconHovered ? 
                        `${context.colorScheme.accentColor}dd` : 
                        context.colorScheme.accentColor,
                    transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={() => setIsIconHovered(true)}
                onMouseLeave={() => setIsIconHovered(false)}
            >
                <FaSearch size={20} color={'white'}/>
            </button>
        </div>
    );
} 