// Event Date and Time Component
// Handles the date, start time, and end time inputs for an event

import React from 'react';

import { useAppContext } from '../../../lib/context';

export default function EventDateTime({ eventData, onUpdateField }) {
    const context = useAppContext();
    
    const inputStyle = {
        backgroundColor: context.colorScheme.tertiaryBackground,
        color: context.colorScheme.textColor,
        border: 'none',
    };
    
    return (
        <div className='d-flex flex-row justify-content-start align-items-center mb-3'>
            <div
                className='mr-3'
                style={{
                    maxWidth: '200px',
                }}
            >
                <label htmlFor='date' className='m-0' style={{color: context.colorScheme.textColor}}>Date</label>
                <input
                    id='date'
                    type='date'
                    value={eventData.date}
                    required
                    onChange={event => onUpdateField('date', event.target.value)}
                    className='form-control'
                    style={inputStyle}
                />
            </div>
            
            <div className='d-flex flex-column align-items-start mr-3'>
                <label htmlFor='start-time' className='m-0' style={{color: context.colorScheme.textColor}}>Start time</label>
                <input
                    id='start-time'
                    type='time'
                    className='form-control'
                    value={eventData.start_time}
                    onChange={event => onUpdateField('start_time', event.target.value)}
                    style={inputStyle}
                />
            </div>
            
            <div className='d-flex flex-column align-items-start'>
                <label htmlFor='end-time' className='m-0' style={{color: context.colorScheme.textColor}}>End time</label>
                <input
                    id='end-time'
                    type='time'
                    className='form-control'
                    disabled={eventData.start_time === ''}
                    required={!(eventData.start_time === '')}
                    value={eventData.start_time === '' ? '' : eventData.end_time}
                    onChange={event => onUpdateField('end_time', event.target.value)}
                    style={inputStyle}
                />
            </div>
        </div>
    );
} 