import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import DefaultPFP from '../../assets/default-pfp.jpg';
import CustomTextInput from './CustomTextInput';
import Loading from '../Loading';
import api from '../../lib/api';


function UserResult({ user }) {
    return (
        <div className='p-2 rounded-lg mb-2 bg-light d-flex flex-row justify-content-start align-items-center'>
            <button className='mr-2' style={{outline: 'none'}}>
                <img
                    src={user.profile_picture || DefaultPFP}
                    style={{
                        width: '40px',
                        borderRadius: 1000,
                    }}
                />
            </button>
            <div className='d-flex flex-column'>
                {(user.name && user.name !== '') ?
                    <p className='m-0 font-weight-bold'>{user.name}</p>
                : null}
                <p className='m-0 text-muted'>@{user.username}</p>
            </div>
        </div>
    );
}


function SearchResults({ results }) {
    return (
        <div>
            {results.map((result, i) => <UserResult key={i} user={result}/>)}
        </div>
    );
}


export default function SearchBar({ className, ...props }) {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);
    const inputRef = useRef();

    const getData = async () => {
        if (search !== '' && search !== ' ') {
            setLoading(true);
            const { data, error: apiError } = await api.get('/search-user?q=' + search);
            setError(apiError);
            setResults(data);
            setLoading(false);
        }
        else {
            setResults(null);
        }
    }

    useEffect(() => {
        getData();
    }, [search]);

    return (
        <div className={'position-relative '+(className || '')} {...props}>
            <div className='d-flex flex-row border rounded-lg overflow-hidden'>
                <input
                    type='text'
                    className='bg-white p-2 rounded-left'
                    style={{width: '400px'}}
                    placeholder='SEARCH'
                    value={search}
                    onChange={event => setSearch(event.target.value)}
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
            {(results && results.length > 0) ?
                <div className='position-absolute bottom-0 left-0 zindex-dropdown
                bg-white border rounded-lg shadow p-2 mt-3 w-100'>
                    <SearchResults results={results}/>
                </div>
            : null}
        </div>
    );
}