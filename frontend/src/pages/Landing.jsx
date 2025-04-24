// this is the landing page component
// it displays the landing page for the app

import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAppContext } from '../lib/context';
import CustomButton from '../components/input/CustomButton';
import { FaCalendarAlt } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

export default function Landing() {
    const context = useAppContext();
    const navigate = useNavigate();

    // Placeholder URLs - Replace these with your actual URLs
    const videoPlaceholderUrl = "https://via.placeholder.com/640x360.png?text=Final+Demo+Video";
    const screenshot1Url = "https://via.placeholder.com/400x300.png?text=App+Screenshot+1";
    const screenshot2Url = "https://via.placeholder.com/400x300.png?text=App+Screenshot+2";
    const githubRepoUrl = "https://github.com/your-username/your-repo"; // Replace with your repo URL

    return (
        <div style={{
            backgroundColor: context.colorScheme.backgroundColor,
            color: context.colorScheme.textColor,
            minHeight: '100vh'
        }} className='d-flex flex-column align-items-center pt-5 pb-5'>

            <header className='d-flex flex-column align-items-center p-4 text-center mb-5'>
                <div className='d-flex align-items-center mb-3'>
                    <FaCalendarAlt className='me-2' size={48} />
                    <h1 className='h1 mb-0'>CalendarMedia</h1>
                </div>
                <p className='lead mb-4'>Look at what other people are doing!</p>
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
            </header>

            <section className="container text-center mb-5">
                <h2>See CalendarMedia in Action!</h2>
                <div className="mt-3" style={{maxWidth: '640px', margin: '0 auto'}}>
                    <img src={videoPlaceholderUrl} alt="App Demo Video Placeholder" className="img-fluid shadow rounded" />
                </div>
            </section>

            <section className="container text-center mb-5" style={{ maxWidth: '700px' }}>
                <h2>Why Use CalendarMedia?</h2>
                <p className="mt-3">
                    Tired of missing out? CalendarMedia connects your calendar with your social life.
                    Discover events your friends are attending, share your own plans seamlessly,
                    and stay updated on what's happening around you. It's the easiest way to
                    coordinate and participate in activities together.
                </p>
            </section>

            <section className="container text-center mb-5">
                <h2>Features</h2>
                <div className="row mt-4 justify-content-center">
                    <div className="col-md-5 mb-4">
                         <img src={screenshot1Url} alt="App Screenshot 1" className="img-fluid shadow rounded mb-3" />
                         <h4>Discover Events</h4>
                         <p>See a feed of events created by or liked by your friends.</p>
                    </div>
                     <div className="col-md-5 mb-4">
                         <img src={screenshot2Url} alt="App Screenshot 2" className="img-fluid shadow rounded mb-3" />
                         <h4>Plan Together</h4>
                         <p>Easily create and share your own events with friends.</p>
                    </div>
                </div>
            </section>

            <footer className="container text-center mt-5 pt-4 border-top" style={{borderColor: context.colorScheme.secondaryColor + ' !important'}}>
                <p>
                    <a href={githubRepoUrl} target="_blank" rel="noopener noreferrer" style={{ color: context.colorScheme.linkColor }}>
                        <FaGithub size={24} className="me-1" /> GitHub Repository
                    </a>
                </p>
                <p className="text-muted small">&copy; {new Date().getFullYear()} CalendarMedia. All rights reserved.</p>
            </footer>
        </div>
    );
}