// Event Details Component
// Handles the title, location, and description inputs for an event

import React from 'react';

import CustomTextInput from '../../input/CustomTextInput';
import CustomTextarea from '../../input/CustomTextarea';

import { useAppContext } from '../../../lib/context';

export default function EventDetails({ eventData, onUpdateField }) {
    const context = useAppContext();
    
    return (
        <>
            <label htmlFor='title' className='m-0' style={{color: context.colorScheme.textColor}}>Title</label>
            <CustomTextInput
                id='title'
                placeholder='TITLE'
                className='mb-3'
                value={eventData.title}
                onChange={text => onUpdateField('title', text)}
            />
            
            <label htmlFor='location' className='m-0' style={{color: context.colorScheme.textColor}}>Location</label>
            <CustomTextInput
                id='location'
                placeholder='LOCATION'
                className='mb-3'
                value={eventData.location}
                onChange={text => onUpdateField('location', text)}
            />
            
            <label htmlFor='description' className='m-0' style={{color: context.colorScheme.textColor}}>Description</label>
            <CustomTextarea
                id='description'
                className='mb-3'
                value={eventData.description}
                onChange={text => onUpdateField('description', text)}
            />
        </>
    );
} 