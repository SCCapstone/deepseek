/**
 * Custom hook for search functionality
 * Handles search API calls, result management, and UI state
 */

import { useState, useEffect, useRef } from 'react';
import api from '../../../lib/api';

export default function searchUtils() {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const inputRef = useRef();
    
    // Search for users with the current search term
    const performSearch = async () => {
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
    };
    
    // Add a user as a friend
    const handleAddFriend = async (username) => {
        const { data, error: apiError } = await api.post('/friends/add/' + username);
        setError(apiError);
        if (!error) {
            setShowResults(false);
        }
    };
    
    // Update search whenever query changes
    useEffect(() => {
        performSearch();
    }, [search]);
    
    // Public methods
    const updateSearch = (value) => setSearch(value);
    const hideResults = () => setShowResults(false);
    const showSearchResults = () => setShowResults(true);
    
    return {
        search,
        results,
        loading,
        error,
        setError,
        showResults,
        inputRef,
        updateSearch,
        hideResults,
        showSearchResults,
        handleAddFriend
    };
} 