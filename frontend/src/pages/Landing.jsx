// this is the landing page component
// it displays the landing page for the app

import React from "react";
import { useNavigate } from "react-router-dom";

import { useAppContext } from '../lib/context';
import CustomButton from '../components/input/CustomButton';
import { FaCalendarAlt } from "react-icons/fa";

export default function Landing() {
    const context = useAppContext();
    const navigate = useNavigate();

    return (
        <div style={{height: '100vh'}} className='d-flex align-items-center justify-content-center'>
            <div
                className='d-flex flex-column align-items-center p-4 shadow-sm'
                style={{
                    backgroundColor: context.colorScheme.backgroundColor,
                    color: context.colorScheme.textColor,
                    borderRadius: '8px',
                }}
            >
                <div className='d-flex align-items-center mb-3'>
                    <FaCalendarAlt className='mr-2' size={48} />
                    <h1 className='h1 mb-0'>CalendarMedia</h1>
                </div>
                <p className='mb-4'>Look at what other people are doing!</p>
                <div className='d-flex' style={{ gap: '1rem' }}>
                    <CustomButton text='Login' onClick={() => navigate('/login')}/>
                    <CustomButton 
                        text='Register' 
                        onClick={() => navigate('/register')} 
                        style={{ 
                            backgroundColor: context.colorScheme.tertiaryBackground, 
                            color: context.colorScheme.textColor,
                         }} 
                    />
                </div>
            </div>
        </div>
    );
}