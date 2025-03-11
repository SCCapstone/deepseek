import { useState, useRef } from 'react';
import CustomTextInput from './CustomTextInput';
import Loading from '../Loading';
import { FaSearch } from 'react-icons/fa';


function SearchResults({ results }) {
    return (
        <div></div>
    );
}


export default function SearchBar({ className, ...props }) {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const inputRef = useRef();

    const handleUpdateSearch = async (text) => {
        setSearch(text);
        if (text == '') {
            setResults(null);
        }
        else {
            setResults([]);
        }
    }

    return (
        <div className={'position-relative '+(className || '')} {...props}>
            <div className='d-flex flex-row border rounded-lg overflow-hidden'>
                <input
                    type='text'
                    className='bg-white p-2 rounded-left'
                    style={{width: '400px'}}
                    placeholder='SEARCH'
                    value={search}
                    onChange={event => handleUpdateSearch(event.target.value)}
                    ref={inputRef}
                />
                <button
                    onClick={() => inputRef.current.focus()}
                    className='p-2 px-3 align-self-stretch d-flex flex-column align-items-center
                    justify-content-center bg-primary'
                >
                    <FaSearch size={20} color='white'/>
                </button>
            </div>
            {results ?
                <div className='position-absolute bottom-0 left-0 zindex-dropdown
                bg-white border rounded-lg shadow p-2 mt-1 w-100'>
                    {loading ? <Loading/> : <SearchResults results={results}/>}
                </div>
            : null}
        </div>
    );
}