import { useState, useEffect } from 'react';


export default function CreateEvent({ hideEditor }) {
    return (
        <div className='w-100 d-flex flex-column'>
            <div className='w-100 d-flex flex-row justify-content-between align-items-center'>
                <h3 className='h3 m-0'>Create event</h3>
                <div className='d-flex flex-row'>
                    <button className='btn btn-danger mr-1' onClick={hideEditor}>Cancel</button>
                    <button className='btn btn-primary'>Save</button>
                </div>
            </div>
        </div>
    );
}