// this is the notifications widget component
// it displays the notifications widget for the navbar

import { useState, useEffect } from 'react';
import { FaBell } from "react-icons/fa";

import Loading from '../../utility/Loading'; // Adjusted path
import Alert from '../../utility/Alert'; // Adjusted path
import NotificationItem from './NotificationItem'; // Adjusted path

import api from '../../../lib/api'; // Adjusted path
import { useAppContext } from '../../../lib/context'; // Adjusted path


export default function NotificationsWidgetContainer({ className }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isIconHovered, setIsIconHovered] = useState(false);
    const context = useAppContext();

    const getData = async () => {
        setLoading(true);
        setError(null); // Clear previous errors
        // Ensure API endpoint is correct
        const { data, error: apiError } = await api.get('/events/notifications'); 
        if (apiError) {
            setError(apiError.message || 'Failed to fetch notifications');
            setNotifications([]); // Set to empty array on error?
        } else {
            setNotifications(data || []); // Ensure data is an array
        }
        setLoading(false);
    }

    // Fetch data when the dropdown is shown
    useEffect(() => {
        if (showNotifications) {
            getData();
        }
    }, [showNotifications]);

    // Fetch initial count (optional, maybe only fetch when opened)
    useEffect(() => {
         // Fetch only count initially?
         // Or rely on push notifications/SSE for real-time count?
         // For now, let's fetch full data once when component mounts to get initial count
         getData(); 
    }, []);

    const handleClearNotifications = async () => {
        setLoading(true);
        // Ensure API endpoint is correct
        const { error: apiError } = await api.post('/events/notifications/clear');
        if (apiError) {
            setError(apiError.message || 'Failed to clear notifications');
            setLoading(false);
        } else {
            // Optimistically clear or refetch
            setNotifications([]);
            setShowNotifications(false);
            // No need to setLoading(false) here if setShowNotifications triggers re-render without loading state
        }
        // setLoading(false); // May not be needed if setShowNotifications closes the dropdown
    }

    const toggleNotifications = () => {
        setShowNotifications(prev => !prev);
    }

    // Calculate unread count (assuming API returns all notifications)
    // Or API could return the count directly
    const unreadCount = notifications ? notifications.filter(n => !n.is_read).length : 0;

    return (
        <div className={'position-relative '+(className || '')}>
            {/* Bell Icon Trigger */}
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
                        {notifications.length} { /* Or use unreadCount */}
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
                                        <div className='w-100 px-1' style={{overflowY: 'auto', maxHeight: '350px'}}> {/* Limit height for scroll */}
                                            {notifications.map((item) => (
                                                // Pass getData function down as a prop
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