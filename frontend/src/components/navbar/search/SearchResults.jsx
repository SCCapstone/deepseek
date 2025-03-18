// Search Results Component
// Displays a list of search results with a backdrop overlay

import React from 'react';

import { useAppContext } from '../../../lib/context';

export default function SearchResults({ results, onAddFriend, onHideResults, visible }) {
    const context = useAppContext();
    
    if (!visible || !results || results.length === 0) return null;
    
    return (
        <>
            <div
                className='position-absolute bottom-0 left-0 zindex-dropdown
                border rounded-lg shadow p-2 mt-3 w-100'
                style={{
                    overflow: 'auto',
                    maxHeight: '400px',
                    zIndex: 1020,
                    backgroundColor: context.colorScheme.secondaryBackground,
                    color: context.colorScheme.textColor,
                }}
            >
                {results.map((result, i) => (
                    <UserResult
                        key={i}
                        user={result}
                        handleAddFriend={onAddFriend}
                        hideResults={onHideResults}
                    />
                ))}
            </div>
            
            {/* Backdrop overlay */}
            <div
                onClick={onHideResults}
                className='position-fixed h-100 w-100'
                style={{
                    top: 0, 
                    left: 0, 
                    zIndex: 1000, 
                    backgroundColor: 'rgba(0, 0, 0, 0.2)'
                }}
            />
        </>
    );
}

/**
 * User Result Component
 * Displays a single user search result with profile image and add friend button
 */
function UserResult({ user, handleAddFriend, hideResults }) {
    const navigate = React.useCallback(() => {}, []); // Mocked for this example
    const context = useAppContext();
    
    const handleNavigateToProfile = () => {
        hideResults();
        navigate('/profile/' + user.username);
    };
    
    return (
        <div 
            className='p-2 rounded-lg mb-2 d-flex flex-row justify-content-between align-items-center'
            style={{
                backgroundColor: context.colorScheme.tertiaryBackground, 
                color: context.colorScheme.textColor
            }}
        >
            <div
                className='flex-grow-1 d-flex flex-row align-items-center'
                onClick={handleNavigateToProfile}
                style={{cursor: 'pointer'}}
            >
                <img
                    className='mr-2'
                    src={user.profile_picture || 'DefaultPFP'}
                    style={{
                        width: '40px',
                        borderRadius: 1000,
                    }}
                    alt={user.username}
                />
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
                style={{
                    backgroundColor: context.colorScheme.accentColor, 
                    border: 'none'
                }}
            >
                Add
            </button>
        </div>
    );
} 