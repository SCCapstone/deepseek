// this is the event header component
// it displays the event details at the top of the event page

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaLocationArrow, FaClock, FaInfoCircle, FaBell } from 'react-icons/fa';
import Loading from '../utility/Loading';
import Alert from '../utility/Alert';
import ConfirmationModal from '../utility/ConfirmationModal';
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
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const context = useAppContext();
    const navigate = useNavigate();

    const getData = async () => {
        setLoading(true);
        setError(null);
        setLikeError(null);
        setDeleteError(null);
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

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        setDeleteLoading(true);
        setDeleteError(null);
        try {
            const { error: deleteApiError } = await api.post(`/delete-event/${eventId}`);
            if (deleteApiError) {
                throw new Error(deleteApiError);
            }
            navigate('/calendar'); 
        } catch (err) {
            setDeleteError(err.message || 'Failed to delete event. Please try again.');
        } finally {
            setDeleteLoading(false);
        }
    };

    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>
    if (deleteError) return <Alert message={deleteError} hideAlert={() => setDeleteError(null)} />
    if (loading || deleteLoading) return <Loading/>
    if (!eventData) return null;

    const formattedDate = formatDate(eventData.date);
    const formattedTime = eventData.start_time && eventData.end_time 
        ? formatTimeRange(eventData.start_time, eventData.end_time)
        : null;

    return (
        <>
            <ConfirmationModal
                showModal={showDeleteConfirm}
                hideModal={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                message="Are you sure you want to delete this event? This action cannot be undone."
                confirmText="Delete Event"
                confirmButtonClass="btn-danger"
            />
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
                        display: 'flex',
                        gap: '0.5rem'
                    }}>
                        <CustomButton
                            style={{ backgroundColor: context.colorScheme.accentColor, color: 'white' }}
                            text='Edit event'
                            onClick={handleEditClick}
                            disabled={deleteLoading}
                        />
                        <CustomButton
                            style={{ backgroundColor: context.colorScheme.danger, color: 'white' }}
                            text={deleteLoading ? 'Deleting...' : 'Delete event'}
                            onClick={handleDeleteClick}
                            disabled={deleteLoading}
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
                        disabled={deleteLoading}
                    />
                </div>
            </div>
        </>
    );
}