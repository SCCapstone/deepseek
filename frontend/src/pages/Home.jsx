import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div style={{height: '100vh'}} className='d-flex justify-content-center align-items-center'>
            <div className='d-flex flex-column align-items-center'>
                <h1 className='h1'>CalendarMedia</h1>
                <p>Look at what other people are doing!</p>
                <div>
                    <Link className='btn btn-primary mr-3' to='/login'>Login</Link>
                    <Link className='btn btn-secondary' to='/register'>Register</Link>
                </div>
            </div>
        </div>
    );
}