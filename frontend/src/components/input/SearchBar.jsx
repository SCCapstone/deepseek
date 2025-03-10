import { useState } from 'react';
import CustomTextInput from './CustomTextInput';
import Loading from '../Loading';


function SearchResults({ results }) {
    return (
        <div></div>
    );
}


export default function SearchBar({ className, ...props }) {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

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
            <CustomTextInput
                value={search}
                onChange={handleUpdateSearch}
                placeholder='SEARCH'
                className='rounded-lg'
                style={{
                    width: '400px',
                    backgroundColor: 'white',
                }}
            />
            {results ?
                <div className='position-absolute bottom-0 left-0 zindex-dropdown
                bg-white border rounded-lg shadow p-2 mt-1 w-100'>
                    {loading ? <Loading/> : <SearchResults results={results}/>}
                </div>
            : null}
        </div>
    );
}