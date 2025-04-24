// this is the landing page component
// it displays the landing page for the app

import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAppContext } from '../lib/context';
import CustomButton from '../components/input/CustomButton';
import { FaCalendarAlt, FaGithub } from "react-icons/fa";

// Import images directly
import eventPageImage from "../assets/eventpage.png";
import mainPageImage from "../assets/mainpage.png";
import profilePageImage from "../assets/profilepage.png";

export default function Landing() {
    const context = useAppContext();
    const navigate = useNavigate();

    const videoId = "dQw4w9WgXcQ"; 
    const githubRepoUrl = "https://github.com/SCCapstone/deepseek";

    const jacobLinkedinUrl = "https://www.linkedin.com/in/jacob-robertson-067086334/";

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

            {/* Add styled horizontal line separator */}
            <hr style={{
                height: '1px', 
                backgroundColor: context.colorScheme.textColor, 
                border: 'none', 
                opacity: 0.75, 
                width: '80%', 
                margin: '3rem auto' 
            }} />

            {/* NEW: Row for Video and Why Use sections */}
            <div className="container mb-5">
                <div className="row justify-content-around align-items-center">
                    {/* Video Section Column */}
                    <div className="col-md-6">
                        <section className="text-center">
                            <h2>See CalendarMedia in Action!</h2>
                            <div className="ratio ratio-16x9 mt-3 shadow rounded" style={{maxWidth: '1200px', margin: '0 auto'}}>
                                <iframe 
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    title="CalendarMedia Demo Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    referrerPolicy="strict-origin-when-cross-origin" 
                                    allowFullScreen
                                    style={{border: '10px solid #000000'}}
                                >
                                </iframe>
                            </div>
                        </section>
                    </div>
                    
                    {/* Why Use Section Column */}
                    <div className="col-md-6">
                        <section className="text-center"> 
                            <h2>Why Use CalendarMedia?</h2>
                            <p className="mt-3">
                                Tired of missing out? CalendarMedia connects your calendar with your social life.
                                Discover events your friends are attending, share your own plans seamlessly,
                                and stay updated on what's happening around you. It's the easiest way to
                                coordinate and participate in activities together.
                            </p>
                        </section>
                    </div>
                </div>
            </div>

            {/* Add styled horizontal line separator (This was previously between Why Use and Features) */}
            <hr style={{
                height: '1px', 
                backgroundColor: "white", 
                border: 'none', 
                opacity: 0.75, 
                width: '80%', 
                margin: '3rem auto' 
            }} />

            <section className="container text-center mb-5">
                <h2>Features</h2>
                <div className="row mt-4 justify-content-center">
                    <div className="col-12 col-md-10 mb-4">
                         <img src={eventPageImage} alt="App Screenshot - Event Page" className="img-fluid shadow rounded mb-3" />
                         <h4>Discover Events</h4>
                         <p>See an event's details and chat with other users about it.</p>
                    </div>
                    <hr style={{
                        height: '1px',
                        backgroundColor: context.colorScheme.textColor,
                        border: 'none',
                        opacity: 0.75,
                        width: '100%',
                        margin: '3rem auto'
                    }} />
                     <div className="col-12 col-md-10 mb-4">
                         <img src={mainPageImage} alt="App Screenshot - Main Calendar Page" className="img-fluid shadow rounded mb-3" />
                         <h4>Plan Together</h4>
                         <p>Create events with your friends and see them on the same calendar.</p>
                    </div>
                    <hr style={{
                        height: '1px',
                        backgroundColor: context.colorScheme.textColor,
                        border: 'none',
                        opacity: 0.75,
                        width: '100%',
                        margin: '3rem auto'
                    }} />
                    <div className="col-12 col-md-10 mb-4">
                         <img src={profilePageImage} alt="App Screenshot - Profile Page" className="img-fluid shadow rounded mb-3" />
                         <h4>whoami</h4>
                         <p>View your profile and see your events, events you've liked, and your friends.</p>
                    </div>
                </div>
            </section>

            {/* Add styled horizontal line separator before About section */}
            <hr style={{
                height: '1px', 
                backgroundColor: "white", 
                border: 'none', 
                opacity: 0.75, 
                width: '80%', 
                margin: '3rem auto' 
            }} />

            {/* NEW: About Us Section */}
            <section className="container text-center mb-5">
                <h2>Meet the Team</h2>
                <p className="mt-3">
                    <a href={jacobLinkedinUrl} target="_blank" rel="noopener noreferrer" style={{ color: context.colorScheme.linkColor }}>Jacob Robertson</a> &bull;
                    Tristan Shillingford &bull; Ian Turner &bull; Joe Zelinsky &bull; Dominic Gaines
                </p>
            </section>

            {/* Footer comes after About Us */}
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