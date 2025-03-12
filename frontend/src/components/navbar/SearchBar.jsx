import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import DefaultPFP from '../../assets/default-pfp.jpg';
import CustomTextInput from '../input/CustomTextInput';
import Loading from '../utility/Loading';
import Alert from '../utility/Alert';
import api from '../../lib/api';


function UserResult({ user, handleAddFriend }) {
    return (
        <div className='p-2 rounded-lg mb-2 bg-light d-flex flex-row justify-content-between align-items-center'>
            <div className='d-flex flex-row'>
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
            <button
                onClick={() => handleAddFriend(user.username)}
                className='btn btn-danger'
            >Add</button>
        </div>
    );
}


export default function SearchBar(props) {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const inputRef = useRef();

    const getData = async () => {
        if (search !== '' && search !== ' ') {
            setLoading(true);
            const { data, error: apiError } = await api.get('/search-user?q=' + search);
            setError(apiError);
            setResults(data);
            setLoading(false);
            setShowResults(true);
        }
        else {
            setShowResults(false);
            setResults(null);
        }
    }

    const handleAddFriend = async (username) => {
        const { data, error: apiError } = await api.post('/friends/add/' + username);
        setError(apiError);
        if (!error)
            setShowResults(false);
    }

    useEffect(() => {
        getData();
    }, [search]);

    return (
        <div className='position-relative' {...props}>
            <div
                style={{
                    position: 'relative',
                    zIndex: showResults ? 1020 : 0,
                }}
                className='d-flex flex-row border rounded-lg'
            >
                <input
                    type='text'
                    className='bg-white p-2 rounded-left'
                    style={{width: '400px'}}
                    placeholder='SEARCH'
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    ref={inputRef}
                    onFocus={() => setShowResults(true)}
                />
                <button
                    onClick={() => inputRef.current.focus()}
                    className='p-2 px-3 align-self-stretch d-flex flex-column align-items-center
                    justify-content-center bg-primary rounded-right'
                >
                    <FaSearch size={20} color='white'/>
                </button>
            </div>
            {showResults ?
                <>
                    {(results && results.length > 0) ?
                        <div
                            className='position-absolute bottom-0 left-0 zindex-dropdown
                            bg-white border rounded-lg shadow p-2 mt-3 w-100'
                            style={{
                                overflow: 'auto',
                                maxHeight: '400px',
                                zIndex: 1020,
                            }}
                        >
                            {results.map((result, i) => <UserResult key={i} user={result} handleAddFriend={handleAddFriend}/>)}
                        </div>
                    : null}
                    <div
                        onClick={() => {
                            setShowResults(false);
                        }}
                        className='position-fixed h-100 w-100'
                        style={{top: 0, left: 0, zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.2)'}}
                    ></div>
                </>
            : null}
        </div>
    );
}