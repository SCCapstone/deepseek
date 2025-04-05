// this is the event header component
// it displays the event details at the top of the event page

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaLocationArrow, FaClock, FaInfoCircle, FaBell } from 'react-icons/fa';
import Loading from '../utility/Loading';
import Alert from '../utility/Alert';
import api from '../../lib/api';
import { formatDate, formatTimeRange, formatDateTime } from '../utility/componentUtils/dateUtils';
import { useAppContext } from '../../lib/context';
import CustomButton from '../input/CustomButton';
import LikeButton from '../input/LikeButton';

export default function EventHeader({ eventId, onEditClick }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [eventData, setEventData] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [likeError, setLikeError] = useState(null);

    const context = useAppContext();

    const getData = async () => {
        setLoading(true);
        setError(null);
        setLikeError(null);
        const { data, error: apiError } = await api.get('/get-event/' + eventId);
        if (data) {
            setEventData(data);
            setIsLiked(data.liked_by_current_user);
            setLikeCount(data.like_count);
        }
        setError(apiError);
        setLoading(false);
    }

    useEffect(() => {
        if (eventId) {
            getData();
        }
    }, [eventId]);

    const handleLikeToggle = async () => {
        setLikeError(null);
        const originalIsLiked = isLiked;
        const originalLikeCount = likeCount;

        const newIsLiked = !isLiked;
        const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
        setIsLiked(newIsLiked);
        setLikeCount(newLikeCount);

        const endpoint = newIsLiked ? `/event/${eventId}/like` : `/event/${eventId}/unlike`;
        const { error: likeApiError } = await api.post(endpoint);

        if (likeApiError) {
            setLikeError(likeApiError);
            setIsLiked(originalIsLiked);
            setLikeCount(originalLikeCount);
        }
    };

    const handleEditClick = () => {
        if (onEditClick) {
            onEditClick();
        } else {
            console.error("onEditClick prop not provided to EventHeader");
        }
    };

    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>
    if (loading) return <Loading/>
    if (!eventData) return null;

    const formattedDate = formatDate(eventData.date);
    const formattedTime = eventData.start_time && eventData.end_time 
        ? formatTimeRange(eventData.start_time, eventData.end_time)
        : null;

    return (
        <div className='container p-3 rounded-lg' style={{ backgroundColor: context.colorScheme.tertiaryBackground, position: 'relative', paddingBottom: '3rem' }}>
            {likeError && <Alert message={likeError} type="danger" hideAlert={() => setLikeError(null)} className="mb-2" />}
            <div className='mb-2'>
                <div>
                    <h3 className='h3 m-0' style={{color: context.colorScheme.textColor}}>{eventData.title}</h3>
                    {eventData.user?.username && (
                        <p className='m-0' style={{color: context.colorScheme.secondaryText, fontSize: '0.9rem'}}>
                            Created by: @{eventData.user.username}
                        </p>
                    )}
                </div>
            </div>

            {context.user?.username === eventData.user?.username && (
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem', 
                }}>
                    <CustomButton
                        style={{ backgroundColor: context.colorScheme.accentColor }}
                        text='Edit event'
                        onClick={handleEditClick}
                    />
                </div>
            )}
            
            {/* Date/Time Info */}
            <div className='mb-3 d-flex align-items-center'>
                <FaClock size={16} className="mr-2" style={{color: context.colorScheme.textColor}} />
                <p className='m-0' style={{color: context.colorScheme.textColor}}>
                    {formattedDate}
                    {formattedTime && <span> at {formattedTime}</span>}
                </p>
            </div>
            
            {eventData.location && (
                <div className='d-flex flex-row align-items-center mb-3'>
                    <FaLocationArrow size={16} className='mr-2' style={{color: context.colorScheme.textColor}}/>
                    <p className='m-0' style={{color: context.colorScheme.textColor}}>{eventData.location}</p>
                </div>
            )}
            
            {eventData.description && (
                <div className='d-flex flex-row align-items-start mb-3'>
                    <FaInfoCircle size={16} className='mr-2 mt-1' style={{color: context.colorScheme.textColor}}/>
                    <p className='m-0' style={{color: context.colorScheme.textColor}}>{eventData.description}</p>
                </div>
            )}
            
            {eventData.set_reminder && (
                <div className='d-flex flex-row align-items-start mb-3'>
                    <FaBell size={16} className='mr-2 mt-1' style={{color: context.colorScheme.textColor}}/>
                    <p className='m-0' style={{color: context.colorScheme.textColor}}>You have set a reminder for this event</p>
                </div>
            )}

            <div
                style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                }}
            >
                <LikeButton
                    isLiked={isLiked}
                    likeCount={likeCount}
                    onClick={handleLikeToggle}
                />
            </div>
        </div>
    );
}