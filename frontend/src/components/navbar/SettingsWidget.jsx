import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';
import SettingsWindow from './SettingsWindow';
import AppearanceWindow from './AppearanceWindow';


export default function SettingsWidget({ className }) {
    const [showMenu, setShowMenu] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showAppearance, setShowAppearance] = useState(false);

    return (
        <>
            <div className={'position-relative '+(className || '')}>
                <FaCog size={24} color='black' onClick={() => setShowMenu(true)} style={{cursor: 'pointer'}}/>
                {showMenu ?
                    <>
                        <div
                            className='position-absolute mt-4 bg-white shadow rounded-lg
                            d-flex flex-column align-items-center border overflow-hidden'
                            style={{right: 0, width: '160px', zIndex: 1020}}
                        >
                            <button
                                className='p-2 border-0 w-100 text-dark text-center'
                                onClick={() => {
                                    setShowMenu(false);
                                    setShowAppearance(true);
                                }}
                            >Appearance</button>
                            <div className='w-100' style={{height: 1, backgroundColor: '#ccc'}}></div>
                            <button
                                onClick={() => {
                                    setShowMenu(false);
                                    setShowSettings(true);
                                }}
                                style={{outline: 'none'}}
                                className='p-2 w-100 text-dark text-center border-0'
                            >Settings</button>
                        </div>
                        <div
                            className='position-fixed w-100 h-100'
                            style={{top: 0, left: 0, zIndex: 1000}}
                            onClick={() => setShowMenu(false)}
                        ></div>
                    </>
                : null}
            </div>
            <SettingsWindow showWindow={showSettings} hideWindow={() => setShowSettings(false)}/>
            <AppearanceWindow showWindow={showAppearance} hideWindow={() => setShowAppearance(false)}/>
        </>
    );
}