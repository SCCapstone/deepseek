import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loading from '../utility/Loading';
import Alert from '../utility/Alert';
import api from '../../lib/api';
import DefaultPFP from '../../assets/default-pfp.jpg';


function Comment({ commentData }) {
    const navigate = useNavigate();

    return (
        <div className='w-100 mb-3 p-2 rounded-lg bg-white d-flex flex-row justify-content-start align-items-center'>
            <img
                className='mr-2'
                src={commentData.user.profile_picture || DefaultPFP}
                style={{
                    width: '40px',
                    borderRadius: 1000,
                    cursor: 'pointer',
                }}
                onClick={() => {
                    navigate('/profile/' + commentData.user.username);
                }}
            />
            <div>
                <Link
                    to={'/profile/' + commentData.user.username}
                    className='m-0 text-muted'
                >@{commentData.user.username}</Link>
                <p className='m-0'>{commentData.body}</p>
            </div>
        </div>
    );
}


export default function EventComments({ eventId }) {
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
        <div className='container p-3 rounded-lg bg-light'>
            <h3 className='h3'>Comments</h3>
            <form className='d-flex flex-row mb-3' onSubmit={handleComment}>
                <input
                    className='form-control mr-1'
                    placeholder='COMMENT'
                    value={commentInput}
                    onChange={event => setCommentInput(event.target.value)}
                />
                <button disabled={commentInput.length === 0} className='btn btn-primary'>Comment</button>
            </form>
            {comments.length > 0 ?
                <div>
                    {comments.map((comment, i) => (
                        <Comment key={i} commentData={comment}/>
                    ))}
                </div>
            : <p className='my-3 p-3 text-center'>Nothing to see here!</p>}
        </div>
    );
}