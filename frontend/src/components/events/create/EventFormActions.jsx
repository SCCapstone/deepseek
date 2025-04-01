// Event Form Actions Component
// Handles the action buttons (cancel/create) for the event form


import React from 'react';

import { useAppContext } from '../../../lib/context';
import CustomButton from '../../input/CustomButton'; // Import CustomButton

export default function EventFormActions({ onCancel, onSubmit, isFormValid, loading, submitText }) {
    const context = useAppContext();
    
    return (
        <div className='d-flex flex-row'>
            {/* Cancel Button using CustomButton */}
            <CustomButton 
                text="Cancel"
                onClick={onCancel}
                className="mr-1" // Add margin right
                style={{
                    backgroundColor: context.colorScheme.tertiaryBackground,
                    color: context.colorScheme.textColor,
                    // Keep existing transition if needed, CustomButton might handle hover effects
                }}
                // CustomButton already handles hover effects, but you could override if necessary
            />
            
            {/* Submit Button using CustomButton */}
            <CustomButton 
                text={loading ? 'Saving...' : submitText}
                onClick={onSubmit}
                disabled={loading || !isFormValid}
                style={{
                    // CustomButton uses accentColor by default, so no need to set it unless overriding
                    // backgroundColor: context.colorScheme.accentColor, 
                    color: '#ffffff', // Explicitly set text color if different from CustomButton default
                    opacity: isFormValid ? 1 : 0.6,
                    cursor: isFormValid ? 'pointer' : 'not-allowed',
                    // Keep existing transition if needed
                }}
                // CustomButton handles its own hover effects based on enabled/disabled state
            />
        </div>
    );
} 