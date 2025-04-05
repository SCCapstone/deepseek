// this is the notifications widget component
// it displays the notifications widget for the navbar

import { useState, useEffect } from 'react';
import { FaBell } from "react-icons/fa";

import Loading from '../../utility/Loading';
import Alert from '../../utility/Alert';
import NotificationItem from './NotificationItem';

import api from '../../../lib/api';
import { useAppContext } from '../../../lib/context';


export default function NotificationsWidgetContainer({ className }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isIconHovered, setIsIconHovered] = useState(false);
    const context = useAppContext();

    const getData = async () => {
        setLoading(true);
        setError(null);
        const { data, error: apiError } = await api.get('/events/notifications'); 
        if (apiError) {
            setError(apiError.message || 'Failed to fetch notifications');
            setNotifications([]);
        } else {
            setNotifications(data || []);
        }
        setLoading(false);
    }

    // Fetch data when the dropdown is shown
    useEffect(() => {
        if (showNotifications) {
            getData();
        }
    }, [showNotifications]);

    useEffect(() => {
         getData(); 
    }, []);

    const handleClearNotifications = async () => {
        setLoading(true);
        const { error: apiError } = await api.post('/events/notifications/clear');
        if (apiError) {
            setError(apiError.message || 'Failed to clear notifications');
            setLoading(false);
        } else {
            setNotifications([]);
            setShowNotifications(false);
        }
    }

    const toggleNotifications = () => {
        setShowNotifications(prev => !prev);
    }

    return (
        <div className={'position-relative '+(className || '')}>
            <div 
                className='position-relative' 
                onClick={toggleNotifications} 
                onMouseEnter={() => setIsIconHovered(true)}
                onMouseLeave={() => setIsIconHovered(false)}
                style={{cursor: 'pointer'}} 
                aria-label="Toggle Notifications"
                aria-expanded={showNotifications}
                role="button"
            >
                <FaBell
                    size={24}
                    color={context.colorScheme.textColor}
                    style={{
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        transform: isIconHovered ? 'scale(1.15)' : 'scale(1)',
                        boxShadow: isIconHovered ? `0 0 8px ${context.colorScheme.accentColor}40` : 'none',
                        borderRadius: '50%'
                    }}
                    
                />
                {(notifications && notifications.length > 0) ? 
                    <div
                        className='position-absolute d-flex justify-content-center align-items-center'
                        style={{
                            top: '-5px', 
                            right: '-8px',
                            backgroundColor: context.colorScheme.danger || 'red',
                            color: 'white',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            fontSize: '10px',
                            fontWeight: 'bold'
                        }}
                    >
                        {notifications.length}
                    </div>
                : null}
            </div>

            {showNotifications ?
                <>
                     <div
                        className='position-fixed w-100 h-100'
                        style={{top: 0, left: 0, zIndex: 1000}}
                        onClick={() => setShowNotifications(false)}
                        aria-hidden="true"
                    ></div>
                    
                    <div
                        className='position-absolute mt-3 p-2 rounded-lg shadow-lg'
                        style={{
                            right: 0, 
                            width: '320px',
                            maxHeight: '450px', 
                            zIndex: 1020, 
                            backgroundColor: context.colorScheme.secondaryBackground,
                            borderColor: context.colorScheme.borderColor
                        }}
                        role="dialog" 
                        aria-labelledby="notifications-heading"
                    >
                         <h5 id="notifications-heading" className="px-2 pb-2 pt-1 m-0">Notifications</h5>
                         {error && <div className="px-2"><Alert message={error} type="danger" hideAlert={() => setError(null)}/></div>}
                         {loading ? <div className="d-flex justify-content-center p-5"><Loading/></div> :
                            <>
                                {notifications && notifications.length > 0 ?
                                    <>
                                        <div className='w-100 px-1' style={{overflowY: 'auto', maxHeight: '350px'}}>
                                            {notifications.map((item) => (
                                                <NotificationItem
                                                    key={item.id}
                                                    item={item}
                                                    onNotificationUpdate={getData}
                                                />
                                            ))}
                                        </div>
                                        <div className='pt-2 px-1 w-100'>
                                            <button
                                                onClick={handleClearNotifications}
                                                className='w-100 btn btn-sm'
                                                style={{
                                                    backgroundColor: context.colorScheme.danger, 
                                                    color: 'white',
                                                    border: 'none'
                                                }}
                                                disabled={loading}
                                            >Clear All</button>
                                        </div>
                                    </>
                                :
                                    <p className='p-3 m-0 text-center text-muted'>Nothing new here!</p>
                                }
                            </>
                        }
                    </div>
                   
                </>
            : null}
        </div>
    );
} 