import { useAppContext } from '../../../lib/context';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/api';
import { useState } from 'react';

export default function NotificationItem({ item, onNotificationUpdate }) {
    const context = useAppContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clearing, setClearing] = useState(false);

    const handleEventClick = () => {
        if (['event_invite', 'event_update', 'event_reminder'].includes(item.type)) {
            if (item.event_id) {
                navigate(`/events/${item.event_id}`);
            } else {
                console.warn("NotificationItem: Event ID missing for event type:", item.type);
            }
        }
    };

    const handleClearNotification = async () => {
        setClearing(true);
        const url = `/events/notifications/clear/${item.id}`;
        const { error: apiError } = await api.post(url);
        if (apiError) {
            setError(apiError.message || 'Failed to clear notification.');
            setClearing(false);
        } else {
            onNotificationUpdate();
            setClearing(false);
        }
    };

    const handleFriendRequest = async (accept) => {
        setLoading(true);
        setError(null);
        if (accept) {
            const url = `/friends/request/add/${item.friend_id}`;
            const { error: apiError } = await api.post(url);
            if (apiError) {
                setError(apiError.message || 'Failed to accept friend request.');
                setLoading(false);
            } else {
                onNotificationUpdate();
                setLoading(false);
            }
        } else {
            const url = `/friends/request/remove/${item.friend_id}`;
            const { error: apiError } = await api.post(url);
            if (apiError) {
                setError(apiError.message || 'Failed to reject friend request.');
                setLoading(false);
            } else {
                onNotificationUpdate();
                setLoading(false);
            }
        }
    };

    const isClickable = ['event_invite', 'event_update', 'event_reminder'].includes(item.type);

    const baseStyle = {
        backgroundColor: context.colorScheme.tertiaryBackground,
    };

    const clickableStyle = isClickable ? { cursor: 'pointer' } : {};

    return (
        <div
            className={`p-3 rounded-lg mb-2 w-100 d-flex justify-content-between align-items-start`}
            style={{ ...baseStyle }}
        >
            <div
                style={isClickable ? clickableStyle : {}}
                onClick={isClickable ? handleEventClick : null}
                className="flex-grow-1 mr-2"
            >
                <p className="m-0">{item.message}</p>
                {item.type === 'friend_request' && (
                    <div className="mt-2 d-flex justify-content-end align-items-center">
                        {error && <p className="text-danger mr-2 mb-0 small" style={{ flexGrow: 1 }}>{error}</p>}
                        <button 
                            className="btn btn-sm btn-success mr-2" 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFriendRequest(true);
                            }}
                            disabled={loading}
                            style={{backgroundColor: context.colorScheme.success, color: 'white', border: 'none'}}
                        >
                            {loading ? '...' : 'Accept'}
                        </button>
                        <button 
                            className="btn btn-sm btn-danger" 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFriendRequest(false);
                            }}
                            disabled={loading}
                            style={{backgroundColor: context.colorScheme.danger, color: 'white', border: 'none'}}
                        >
                            {loading ? '...' : 'Deny'}
                        </button>
                    </div>
                )}
            </div>
            {item.type !== 'friend_request' && (
                <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClearNotification();
                    }}
                    disabled={clearing || loading}
                    style={{ lineHeight: '1', padding: '0.2rem 0.4rem' }}
                    aria-label="Clear notification"
                >
                    {clearing ? '...' : '×'}
                </button>
            )}
        </div>
    );
} 