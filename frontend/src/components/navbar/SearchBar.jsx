// Search Bar Component
// Top-level search component for finding users


import React from 'react';

import SearchInput from './search/SearchInput';
import SearchResults from './search/SearchResults';

import useSearch from '../utility/componentUtils/searchUtils';

export default function SearchBar(props) {
    const { 
        search, 
        results, 
        showResults, 
        inputRef,
        updateSearch,
        hideResults,
        showSearchResults,
        handleAddFriend
    } = useSearch();
    
    return (
        <div className='position-relative' {...props}>
            <div
                style={{
                    position: 'relative',
                    zIndex: showResults ? 1020 : 0,
                }}
            >
                <SearchInput 
                    value={search}
                    onChange={updateSearch}
                    onFocus={showSearchResults}
                    inputRef={inputRef}
                />
            </div>
            
            <SearchResults 
                results={results}
                onAddFriend={handleAddFriend}
                onHideResults={hideResults}
                visible={showResults}
            />
        </div>
    );
}