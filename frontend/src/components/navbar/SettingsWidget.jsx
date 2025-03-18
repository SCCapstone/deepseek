// this is the settings widget component
// it displays the settings widget for the navbar

import { useState } from 'react';

import { FaCog } from 'react-icons/fa';

import SettingsWindow from './SettingsWindow';
import AppearanceWindow from './AppearanceWindow';

import { useAppContext } from '../../lib/context';


export default function SettingsWidget({ className }) {
    const [showMenu, setShowMenu] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showAppearance, setShowAppearance] = useState(false);
    const context = useAppContext();

    const [isAppearanceHovered, setIsAppearanceHovered] = useState(false);
    const [isSettingsHovered, setIsSettingsHovered] = useState(false);
    const [isIconHovered, setIsIconHovered] = useState(false);

    return (
        <>
            <div className={'position-relative '+(className || '')}>
                <FaCog 
                    size={24} 
                    color={context.colorScheme.textColor} 
                    onClick={() => setShowMenu(true)} 
                    style={{
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        transform: isIconHovered ? 'scale(1.15)' : 'scale(1)',
                        boxShadow: isIconHovered ? `0 0 8px ${context.colorScheme.accentColor}40` : 'none',
                        borderRadius: '50%'
                    }}
                    onMouseEnter={() => setIsIconHovered(true)}
                    onMouseLeave={() => setIsIconHovered(false)}
                />
                {showMenu ?
                    <>
                        <div
                            className='position-absolute mt-4 rounded-lg
                            d-flex flex-column align-items-center border overflow-hidden'
                            style={{right: 0, width: '160px', zIndex: 1020, backgroundColor: context.colorScheme.secondaryBackground,
                                border: `1px solid ${context.colorScheme.borderColor}`}}
                        >
                            <button
                                className='p-2 border-0 w-100 text-center'
                                style={{
                                    color: context.colorScheme.textColor,
                                    backgroundColor: context.colorScheme.tertiaryBackground,
                                    transition: 'background-color 0.2s ease, transform 0.1s ease, color 0.2s ease',
                                    cursor: 'pointer',
                                }}
                                onMouseOver={(e) => {
                                    setIsAppearanceHovered(true);
                                    e.currentTarget.style.backgroundColor = context.colorScheme.accentColor;
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseOut={(e) => {
                                    setIsAppearanceHovered(false);
                                    e.currentTarget.style.backgroundColor = context.colorScheme.tertiaryBackground;
                                    e.currentTarget.style.color = context.colorScheme.textColor;
                                }}
                                onClick={() => {
                                    setShowMenu(false);
                                    setShowAppearance(true);
                                }}
                            >Appearance</button>
                            <div className='w-100' style={{height: 1, backgroundColor: context.colorScheme.borderColor}}></div>
                            <button
                                onClick={() => {
                                    setShowMenu(false);
                                    setShowSettings(true);
                                }}
                                className='p-2 w-100 text-center border-0'
                                style={{
                                    color: context.colorScheme.textColor,
                                    backgroundColor: context.colorScheme.tertiaryBackground,
                                    transition: 'background-color 0.2s ease',
                                    cursor: 'pointer',
                                }}
                                onMouseOver={(e) => {
                                    setIsSettingsHovered(true);
                                    e.currentTarget.style.backgroundColor = context.colorScheme.accentColor;
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseOut={(e) => {
                                    setIsSettingsHovered(false);
                                    e.currentTarget.style.backgroundColor = context.colorScheme.tertiaryBackground;
                                    e.currentTarget.style.color = context.colorScheme.textColor;
                                }}
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