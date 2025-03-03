import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import api from '../lib/api';
import { useAppContext } from '../lib/context';

const EventFeed = () => {
    const { colorScheme } = useAppContext();  // Get theme colors

    const styles = {
        page: { minHeight: '100vh', backgroundColor: colorScheme.backgroundColor },
        section: { backgroundColor: colorScheme.accentColor, padding: '20px', borderRadius: '10px' },
        sectionTitle: { color: colorScheme.textColor, fontSize: '24px', fontWeight: 'bold' },
        eventCard: { backgroundColor: colorScheme.backgroundColor, padding: '15px', borderRadius: '10px', boxShadow: '0px 2px 5px rgba(0,0,0,0.1)', marginBottom: '15px', color: colorScheme.textColor },
        creatorPfp: { width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' },
        input: { backgroundColor: colorScheme.backgroundColor, color: colorScheme.textColor },
    };

    const [events, setEvents] = useState([]);
    const [eventType, setEventType] = useState('user');  // 'user' or 'friend'
    const [editingEventId, setEditingEventId] = useState(null);
    const [editedEvent, setEditedEvent] = useState({});
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function getCreatorData(creatorId) {
        const { data, error } = await api.get(`/get-user/${creatorId}`);
        return error ? null : data;
    }

    async function getData() {
        setLoading(true);
        let response;
        if (eventType === 'user') response = await api.get('/get-events');
        else response = await api.get('/get-friends-events');

        if (response.error) {
            console.error('Error fetching events:', response.error);
            setError(response.error);
        } else {
            const eventsWithCreators = await Promise.all(response.data.map(async (event) => {
                const creatorData = await getCreatorData(event.user_id);
                return { ...event, creator: creatorData || { name: 'Unknown', username: 'No Username', profile_picture: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png' } };
            }));
            setEvents(eventsWithCreators);
        }
        setLoading(false);
    }

    useEffect(() => {
        async function fetchData() { await getData(); }
        fetchData();
    }, [eventType]);

    const formatDate = (isoString) => new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date(isoString));

    const handleEditEvent = (event) => {
        setEditedEvent(event);
        setEditingEventId(event.id);
    };

    const handleSaveEvent = async (eventId) => {
        if (!editedEvent.title.trim()) {
            alert('Title cannot be empty.');
            return;
        }
        const { error } = await api.post(`/update-event/${eventId}`, {
            title: editedEvent.title,
        });
        if (!error) {
            setEditingEventId(null);
            getData();
        } else {
            setError(error);
        }
    };

    const handleCancelEventEdit = () => {
        setEditingEventId(null);
    };

    const handleSaveComment = async (eventId) => {
        if (!comment.trim()) {
            alert('Please enter a valid comment.');
            return;
        }
        const { error } = await api.post(`/add-event-comment/${eventId}`, { body: comment });
        if (!error) {
            setComment('');
            setEditingCommentId(null);
            getData();
        }
    };

    return (
        <div style={styles.page}>
            <NavBar />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button className={`btn ${eventType === 'user' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setEventType('user'); getData(); }} style={{ marginRight: '10px' }}>
                    My Events
                </button>
                <button className={`btn ${eventType === 'friend' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setEventType('friend'); getData(); }}>
                    Friends' Events
                </button>
            </div>

            {loading ? (
                <p style={{ color: colorScheme.textColor }}>Loading...</p>
            ) : (
                <div className='container'>
                    <div className='p-3 shadow rounded-lg mt-5' style={styles.section}>
                        <h1 className='h1' style={styles.sectionTitle}>Upcoming Events</h1>
                        {events.length > 0 ? (
                            events.map(event => (
                                <div key={event.id} className='p-3 shadow rounded-lg' style={styles.eventCard}>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <h2>{event.title}</h2>
                                        <img src={event.creator?.profile_picture} alt='Creator' style={styles.creatorPfp} />
                                    </div>
                                    <p style={{ fontSize: '16px' }}>{formatDate(event.start_time)}</p>
                                    <p><strong>Location:</strong> {event.location || 'Not specified'}</p>
                                    <p><strong>Username:</strong> {event.creator?.username || 'No Username'}</p>
                                    <p>{event.description}</p>

                                    {editingEventId !== event.id ? (
                                        <button className='btn btn-primary' onClick={() => handleEditEvent(event)}>Edit Event</button>
                                    ) : (
                                        <div>
                                            <input type='text' className='form-control mb-2' value={editedEvent.title} onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })} />
                                            <button className='btn btn-success me-2' onClick={() => handleSaveEvent(event.id)}>Save</button>
                                            <button className='btn btn-secondary' onClick={handleCancelEventEdit}>Cancel</button>
                                        </div>
                                    )}

                                    {editingCommentId !== event.id ? (
                                        <button className='btn btn-primary mt-2' onClick={() => setEditingCommentId(event.id)}>Add a Comment</button>
                                    ) : (
                                        <div className='mt-2'>
                                            <input type='text' className='form-control mb-2' value={comment} onChange={(e) => setComment(e.target.value)} />
                                            <button className='btn btn-success me-2' onClick={() => handleSaveComment(event.id)}>Post</button>
                                            <button className='btn btn-secondary' onClick={() => setEditingCommentId(null)}>Cancel</button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p style={{ color: colorScheme.textColor }}>No events available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventFeed;
