import { useAppContext } from '../../lib/context';
import { FaTimes, FaMoon, FaSun } from 'react-icons/fa';

export default function AppearanceWindow({ showWindow, hideWindow }) {
    const { theme, toggleTheme } = useAppContext();

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
                    className="bg-white rounded-lg shadow p-4"
                    style={{ width: '400px', maxWidth: '90%' }}
                    onClick={handleContainerClick}
                >
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="m-0 font-weight-bold">Appearance</h5>
                        <button
                            className="btn p-0 border-0"
                            onClick={hideWindow}
                        >
                            <FaTimes size={20} color="black" />
                        </button>
                    </div>

                    <p className="mb-3">Choose your preferred theme:</p>

                    <div className="d-flex flex-row justify-content-around">
                        <div 
                            className={`d-flex flex-column align-items-center p-3 rounded-lg ${theme === 'light' ? 'bg-primary text-white' : 'bg-light'}`}
                            onClick={() => {
                                if (theme !== 'light') toggleTheme();
                            }}
                            style={{ cursor: 'pointer', width: '45%' }}
                        >
                            <FaSun size={24} className="mb-2" />
                            <span>Light Mode</span>
                        </div>
                        
                        <div 
                            className={`d-flex flex-column align-items-center p-3 rounded-lg ${theme === 'dark' ? 'bg-primary text-white' : 'bg-light'}`}
                            onClick={() => {
                                if (theme !== 'dark') toggleTheme();
                            }}
                            style={{ cursor: 'pointer', width: '45%' }}
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