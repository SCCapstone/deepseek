import { useAppContext } from '../../lib/context';
import { FaTimes, FaMoon, FaSun } from 'react-icons/fa';
import { useState } from 'react';

export default function AppearanceWindow({ showWindow, hideWindow }) {
    const context = useAppContext();
    const [isLightHovered, setIsLightHovered] = useState(false);
    const [isDarkHovered, setIsDarkHovered] = useState(false);

    if (!showWindow) return null;

    const handleContainerClick = (e) => {
        // Stop propagation to prevent closing other modals unintentionally
        e.stopPropagation();
    };

    return (
        <>
            <div
                className="position-fixed d-flex justify-content-center align-items-center"
                style={{
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1030,
                }}
                onClick={hideWindow}
            >
                <div
                    className="rounded-lg shadow p-4"
                    style={{ 
                        width: '400px', 
                        maxWidth: '90%',
                        backgroundColor: context.colorScheme.secondaryBackground,
                        color: context.colorScheme.textColor 
                    }}
                    onClick={handleContainerClick}
                >
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="m-0 font-weight-bold" style={{color: context.colorScheme.textColor}}>Appearance</h5>
                        <button
                            className="btn p-0 border-0"
                            onClick={hideWindow}
                            style={{ backgroundColor: 'transparent' }}
                        >
                            <FaTimes size={20} style={{color: context.colorScheme.textColor}} />
                        </button>
                    </div>

                    <p className="mb-3" style={{color: context.colorScheme.textColor}}>Choose your preferred theme:</p>

                    <div className="d-flex flex-row justify-content-around">
                        <div 
                            className={`d-flex flex-column align-items-center p-3 rounded-lg`}
                            onClick={() => {
                                if (context.colorScheme.name !== 'light') context.toggleColorScheme();
                            }}
                            onMouseEnter={() => setIsLightHovered(true)}
                            onMouseLeave={() => setIsLightHovered(false)}
                            style={{ 
                                cursor: 'pointer', 
                                width: '45%',
                                backgroundColor: context.colorScheme.name === 'light' 
                                    ? context.colorScheme.accentColor 
                                    : isLightHovered 
                                        ? '#ffffff' // Darker shade for hover in light mode
                                        : '#e9ecef',
                                color: context.colorScheme.name === 'dark' 
                                    ? '#212529' 
                                    : '#f8f9fa'
                            }}
                        >
                            <FaSun size={24} className="mb-2" />
                            <span>Light Mode</span>
                        </div>
                        
                        <div 
                            className={`d-flex flex-column align-items-center p-3 rounded-lg`}
                            onClick={() => {
                                if (context.colorScheme.name !== 'dark') context.toggleColorScheme();
                            }}
                            onMouseEnter={() => setIsDarkHovered(true)}
                            onMouseLeave={() => setIsDarkHovered(false)}
                            style={{ 
                                cursor: 'pointer', 
                                width: '45%',
                                backgroundColor: context.colorScheme.name === 'dark' 
                                    ? context.colorScheme.accentColor 
                                    : isDarkHovered 
                                        ? '#121212' // Darker shade for hover in dark mode
                                        : '#2d2d2d',
                                color: context.colorScheme.name === 'light' 
                                    ? '#f8f9fa' 
                                    : '#212529'
                            }}
                        >
                            <FaMoon size={24} className="mb-2" />
                            <span>Dark Mode</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 