// Event Options Component
// Handles the checkbox options for an event (reminders, visibility)

import React from 'react';

import { useAppContext } from '../../../lib/context';

export default function EventOptions({ eventData, onUpdateField }) {
    const context = useAppContext();
    
    const checkboxStyle = {
        backgroundColor: context.colorScheme.secondaryBackground,
        color: context.colorScheme.textColor,
        borderColor: context.colorScheme.borderColor
    };
    
    return (
        <div className='d-flex flex-row'>
            <div className='form-control d-flex flex-row align-items-center mr-2' style={checkboxStyle}>
                <input
                    id='set-reminder'
                    type='checkbox'
                    className='mr-1'
                    checked={eventData.set_reminder}
                    onChange={() => onUpdateField('set_reminder', !eventData.set_reminder)}
                />
                <label className='m-0 w-100' htmlFor='set-reminder' style={{color: context.colorScheme.textColor}}>
                    Set reminder
                </label>
            </div>
            
            <div className='form-control d-flex flex-row align-items-center' style={checkboxStyle}>
                <input
                    id='public'
                    type='checkbox'
                    className='mr-1'
                    checked={eventData.public}
                    onChange={() => onUpdateField('public', !eventData.public)}
                />
                <label className='m-0 w-100' htmlFor='public' style={{color: context.colorScheme.textColor}}>
                    Public
                </label>
            </div>
        </div>
    );
} 