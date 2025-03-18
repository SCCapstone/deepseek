// this is the event comments component
// it displays the comments for an event, below the event details

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loading from '../utility/Loading';
import Alert from '../utility/Alert';
import api from '../../lib/api';
import DefaultPFP from '../../assets/default-pfp.jpg';
import { useAppContext } from '../../lib/context';
import { FaPaperPlane } from 'react-icons/fa';


function Comment({ commentData }) {
    const context = useAppContext();

    return (
        <div className='w-100 mb-3 p-2 rounded-lg d-flex flex-row justify-content-start align-items-center' style={{backgroundColor: context.colorScheme.tertiaryBackground}}>
            <Link to={'/profile/' + commentData.user.username}>
                <img
                    className='mr-2'
                    src={commentData.user.profile_picture || DefaultPFP}
                    style={{
                        width: '40px',
                        borderRadius: 1000,
                        cursor: 'pointer',
                    }}
                />
            </Link>
            <div>
                <Link
                    to={'/profile/' + commentData.user.username}
                    className='m-0 text-muted'
                    style={{color: context.colorScheme.textColor}}
                >@{commentData.user.username}</Link>
                <p className='m-0' style={{color: context.colorScheme.textColor}}>{commentData.body}</p>
            </div>
        </div>
    );
}


export default function EventComments({ eventId }) {
    const context = useAppContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState(null);
    const [commentInput, setCommentInput] = useState('');

    const getData = async () => {
        setLoading(true);
        const { data, error: apiError } = await api.get('/get-event-comments/' + eventId);
        setError(apiError);
        if (data) {
            data.reverse();
            setComments(data);
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    const handleComment = async (event) => {
        event.preventDefault();
        const commentData = { body: commentInput }
        setLoading(true);
        const { data, error: apiError } = await api.post('/add-event-comment/' + eventId, commentData);
        setError(apiError);
        if (!apiError) {
            getData();
            setCommentInput('');
        }
    }

    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>
    if (loading) return <Loading/>

    return (
        <div className='container p-3 rounded-lg' style={{backgroundColor: context.colorScheme.secondaryBackground}}>
            <h3 className='h3' style={{color: context.colorScheme.textColor}}>Comments</h3>
            <form className='d-flex flex-row mb-3' onSubmit={handleComment}>
                <input
                    className='form-control mr-1'
                    placeholder='COMMENT'
                    value={commentInput}
                    onChange={event => setCommentInput(event.target.value)}
                    style={{
                        backgroundColor: context.colorScheme.tertiaryBackground,
                        border: 'none',
                        color: context.colorScheme.textColor
                    }}
                />
                <button 
                    disabled={commentInput.length === 0}
                    onClick={handleComment} 
                    className='btn btn-primary d-flex justify-content-center align-items-center'
                    style={{
                        transition: 'background-color 0.2s ease, transform 0.1s ease',
                        backgroundColor: context.colorScheme.accentColor,
                        cursor: commentInput.length === 0 ? 'not-allowed' : 'pointer',
                        border: 'none',
                    }}
                    onMouseOver={(e) => {
                        if (commentInput.length > 0) {
                            e.currentTarget.style.backgroundColor = `${context.colorScheme.accentColor}cc`;
                            e.currentTarget.style.transform = 'scale(1.03)';
                        }
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = context.colorScheme.accentColor;
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    <FaPaperPlane/>
                </button>
            </form>
            {comments.length > 0 ?
                <div>
                    {comments.map((comment, i) => (
                        <div 
                            key={i}
                            className='d-flex p-2 mb-2 align-items-center'
                            style={{
                                backgroundColor: context.colorScheme.tertiaryBackground,
                                borderRadius: '8px',
                                transition: 'background-color 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = context.colorScheme.name === 'dark' 
                                    ? `${context.colorScheme.tertiaryBackground}cc` 
                                    : `${context.colorScheme.tertiaryBackground}ee`;
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = context.colorScheme.tertiaryBackground;
                            }}
                        >
                            <Comment commentData={comment}/>
                        </div>
                    ))}
                </div>
            : <p className='my-3 p-3 text-center' style={{color: context.colorScheme.secondaryText}}>Nothing to see here!</p>}
        </div>
    );
}