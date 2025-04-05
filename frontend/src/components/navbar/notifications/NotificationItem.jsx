import { useAppContext } from '../../../lib/context';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/api';
import { useState } from 'react';

export default function NotificationItem({ item, onNotificationUpdate }) {
    const context = useAppContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleEventClick = () => {
        if (item.type === 'event_invite' || item.type === 'event_update' || item.type === 'event_reminder') {
            if (item.event_id) {
                navigate(`/events/${item.event_id}`);
            } else {
                console.warn("NotificationItem: Event ID missing for event type:", item.type);
            }
        }
    };

    const handleFriendRequest = async (accept) => {
        setLoading(true);
        setError(null);
        const url = `/friends/requests/${item.sender_id}/${accept ? 'accept' : 'reject'}`;
        const { error: apiError } = await api.post(url);
        if (apiError) {
            setError(apiError.message || 'Failed to process friend request.');
            setLoading(false);
        } else {
            if (onNotificationUpdate) {
                onNotificationUpdate();
            }
        }
    };

    const isClickable = item.type === 'event_invite' || item.type === 'event_update' || item.type === 'event_reminder';

    // Define base style
    const baseStyle = {
        backgroundColor: context.colorScheme.tertiaryBackground,
    };

    // Define conditional style for cursor
    const clickableStyle = isClickable ? { cursor: 'pointer' } : {};

    return (
        <div
            className={`p-3 rounded-lg mb-2 w-100`}
            style={{ ...baseStyle, ...clickableStyle }}
            onClick={isClickable ? handleEventClick : null}
        >
            <p className="m-0">{item.message}</p>
            {item.type === 'friend_request' && (
                <div className="mt-2 d-flex justify-content-end">
                    {error && <p className="text-danger mr-2 small">{error}</p>}
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
    );
} 