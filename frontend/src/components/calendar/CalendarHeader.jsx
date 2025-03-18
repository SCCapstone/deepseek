// this contains the today button, the view button, and the arrow buttons
// manages all the hover effects for these controls

import React from 'react';

import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';

import { monthNames, views, getPreviousMonth, getNextMonth } from '../utility/componentUtils/calendarUtils';

import { useAppContext } from '../../lib/context';

export default function CalendarHeader({ selectedDate, onDateChange, view, onViewChange }) {
    const context = useAppContext();
    
    const styles = {
        calendarHeader: {
            color: context.colorScheme.textColor,
        },
        todayButton: {
            backgroundColor: context.colorScheme.accentColor,
            color: 'white',
            transition: 'background-color 0.2s ease, transform 0.1s ease',
        },
        viewButton: {
            backgroundColor: context.colorScheme.secondaryBackground,
            color: context.colorScheme.textColor,
            borderColor: context.colorScheme.borderColor,
            transition: 'background-color 0.2s ease',
        },
        arrow: {
            color: context.colorScheme.textColor,
        },
        arrowButton: {
            transition: 'background-color 0.2s ease',
        }
    };

    const handleTodayButtonHover = (e) => {
        e.currentTarget.style.backgroundColor = `${context.colorScheme.accentColor}cc`;
        e.currentTarget.style.transform = 'scale(1.02)';
    };

    const handleTodayButtonLeave = (e) => {
        e.currentTarget.style.backgroundColor = context.colorScheme.accentColor;
        e.currentTarget.style.transform = 'scale(1)';
    };

    const handleViewButtonHover = (e) => {
        e.currentTarget.style.backgroundColor = `${context.colorScheme.secondaryBackground}cc`;
    };

    const handleViewButtonLeave = (e) => {
        e.currentTarget.style.backgroundColor = context.colorScheme.secondaryBackground;
    };

    const handleArrowButtonHover = (e) => {
        e.currentTarget.style.backgroundColor = context.colorScheme.name === 'dark' 
            ? 'rgba(255,255,255,0.1)' 
            : 'rgba(0,0,0,0.1)';
    };

    const handleArrowButtonLeave = (e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
    };

    const handleDropdownItemHover = (e) => {
        e.currentTarget.style.backgroundColor = context.colorScheme.name === 'dark' 
            ? 'rgba(255, 255, 255, 0.15)' 
            : 'rgba(0, 0, 0, 0.1)';
    };

    const handleDropdownItemLeave = (e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
    };

    return (
        <div className='d-flex flex-row p-3' style={styles.calendarHeader}>
            <button
                onClick={() => onDateChange(new Date())}
                className='btn shadow-none mr-1'
                style={styles.todayButton}
                onMouseOver={handleTodayButtonHover}
                onMouseOut={handleTodayButtonLeave}
            >
                Today
            </button>
            
            <div className='dropdown'>
                <button
                    className='btn dropdown-toggle mr-1 shadow-none'
                    type='button'
                    id='dropdownMenuButton'
                    data-toggle='dropdown'
                    aria-haspopup='true'
                    aria-expanded='false'
                    style={styles.viewButton}
                    onMouseOver={handleViewButtonHover}
                    onMouseOut={handleViewButtonLeave}
                >
                    {views[view]}
                </button>
                
                <div 
                    className='dropdown-menu' 
                    aria-labelledby='dropdownMenuButton' 
                    style={{ backgroundColor: context.colorScheme.secondaryBackground }}
                >
                    {views.map((viewName, index) => (
                        <button 
                            key={index}
                            onClick={() => onViewChange(index)} 
                            className='dropdown-item' 
                            style={{ 
                                color: context.colorScheme.textColor,
                                transition: 'background-color 0.2s ease',
                            }}
                            onMouseOver={handleDropdownItemHover}
                            onMouseOut={handleDropdownItemLeave}
                        >
                            {viewName}
                        </button>
                    ))}
                </div>
            </div>
            
            <button
                onClick={() => onDateChange(getPreviousMonth(selectedDate))}
                className='btn d-flex justify-content-center align-items-center shadow-none'
                style={styles.arrowButton}
                onMouseOver={handleArrowButtonHover}
                onMouseOut={handleArrowButtonLeave}
            >
                <AiFillCaretLeft size={20} style={styles.arrow}/>
            </button>
            
            <button
                onClick={() => onDateChange(getNextMonth(selectedDate))}
                className='btn d-flex justify-content-center align-items-center shadow-none mr-1'
                style={styles.arrowButton}
                onMouseOver={handleArrowButtonHover}
                onMouseOut={handleArrowButtonLeave}
            >
                <AiFillCaretRight size={20} style={styles.arrow}/>
            </button>
            
            <h3 className='h3 mb-0'>
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </h3>
        </div>
    );
} 