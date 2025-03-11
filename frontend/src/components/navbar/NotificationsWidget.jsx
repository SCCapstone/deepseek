import { useState, useEffect } from 'react';
import { FaBell } from "react-icons/fa";
import Loading from '../Loading';
import Alert from '../Alert';
import api from '../../lib/api';


function Notification({ item }) {
    return (
        <div className='p-3 bg-light rounded-lg mb-2'>
            {item.message}
        </div>
    );
}


export default function NotificationsWidget({ className }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const getData = async () => {
        setLoading(true);
        const { data, error: apiError } = await api.get('/events/notifications');
        setError(apiError);
        setNotifications(data);
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, [showNotifications]);

    const handleClearNotifications = async () => {
        setLoading(true);
        const { data, error: apiError } = await api.post('/events/notifications/clear');
        setError(apiError);
        setShowNotifications(false);
        setLoading(false);
    }

    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>

    return (
        <div className={'position-relative '+(className || '')}>
            <FaBell
                size={24}
                color='black'
                style={{cursor: 'pointer'}}
                onClick={() => setShowNotifications(true)}
            />
            {showNotifications ?
                <>
                    <div
                        className='position-absolute mt-4 p-2 bg-white shadow rounded-lg
                        d-flex flex-column align-items-center border'
                        style={{right: 0, width: '280px', zIndex: 1020}}
                    >
                        {loading ? <Loading/> :
                            <>
                                {notifications.length > 0 ?
                                    <>
                                        {notifications.map((item, i) => (
                                            <Notification key={i} item={item}/>
                                        ))}
                                        <button
                                            onClick={handleClearNotifications}
                                            className='w-100 btn border bg-danger text-white'
                                        >Clear</button>
                                    </>
                                :
                                    <p className='p-3 m-0'>Nothing to see here!</p>
                                }
                            </>
                        }
                    </div>
                    <div
                        className='position-fixed w-100 h-100'
                        style={{top: 0, left: 0, zIndex: 1000}}
                        onClick={() => setShowNotifications(false)}
                    ></div>
                </>
            : null}
        </div>
    );
}