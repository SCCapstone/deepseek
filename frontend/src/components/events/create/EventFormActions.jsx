// Event Form Actions Component
// Handles the action buttons (cancel/create) for the event form


import React from 'react';

import { useAppContext } from '../../../lib/context';

export default function EventFormActions({ onCancel, onSubmit, isFormValid, loading }) {
    const context = useAppContext();
    
    return (
        <div className='d-flex flex-row'>
            <button 
                type="button" 
                className="btn btn-secondary mr-1" 
                data-dismiss="modal" 
                onClick={onCancel}
                style={{
                    transition: 'background-color 0.2s ease, transform 0.1s ease',
                    backgroundColor: context.colorScheme.tertiaryBackground,
                    color: context.colorScheme.textColor
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = context.colorScheme.tertiaryBackground + '20';
                    e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = context.colorScheme.tertiaryBackground;
                    e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                Cancel
            </button>
            
            <button 
                type="button" 
                className="btn btn-primary"
                onClick={onSubmit}
                disabled={loading || !isFormValid}
                style={{
                    transition: 'background-color 0.2s ease, transform 0.1s ease',
                    backgroundColor: context.colorScheme.accentColor,
                    color: '#ffffff',
                    opacity: isFormValid ? 1 : 0.6,
                    cursor: isFormValid ? 'pointer' : 'not-allowed'
                }}
                onMouseOver={(e) => {
                    if (!loading && isFormValid) {
                        e.currentTarget.style.backgroundColor = context.colorScheme.accentColor + '20';
                        e.currentTarget.style.transform = 'scale(1.03)';
                    }
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = context.colorScheme.accentColor;
                    e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                {loading ? 'Saving...' : 'Create'}
            </button>
        </div>
    );
} 