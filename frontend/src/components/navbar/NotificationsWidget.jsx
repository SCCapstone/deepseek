import { useState, useEffect } from 'react';
import { FaBell } from "react-icons/fa";
import Loading from '../utility/Loading';
import Alert from '../utility/Alert';
import api from '../../lib/api';
import { useAppContext } from '../../lib/context';

function Notification({ item }) {
    const context = useAppContext();
    return (
        <div className='p-3 rounded-lg mb-2 w-100' style={{backgroundColor: context.colorScheme.tertiaryBackground}}>
            {item.message}
        </div>
    );
}


export default function NotificationsWidget({ className }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const context = useAppContext();
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
            <div className='position-relative' onClick={() => setShowNotifications(true)} style={{cursor: 'pointer'}}>
                <FaBell
                    size={24}
                    color={context.colorScheme.textColor}
                />
                {(notifications && notifications.length > 0) ?
                    <div
                        className='position-absolute w-100 h-100 d-flex justify-content-center align-items-center'
                        style={{top: 0, left: 0}}
                    >
                        <p className='m-0 text-white' style={{fontSize: 10}}>{notifications.length}</p>
                    </div>
                : null}
            </div>
            {showNotifications ?
                <>
                    <div
                        className='position-absolute mt-4 p-2   rounded-lg
                        d-flex flex-column align-items-center border'
                        style={{right: 0, width: '280px', maxHeight: '400px', zIndex: 1020, backgroundColor: context.colorScheme.secondaryBackground}}
                    >
                        {loading ? <Loading/> :
                            <>
                                {notifications.length > 0 ?
                                    <>
                                        <div className='w-100' style={{overflowY: 'auto'}}>
                                            {notifications.map((item, i) => (
                                                <Notification key={i} item={item}/>
                                            ))}
                                        </div>
                                        <div className='pt-2 w-100'>
                                            <button
                                                onClick={handleClearNotifications}
                                                className='w-100 btn border'
                                                style={{backgroundColor: context.colorScheme.danger, color: context.colorScheme.textColor}}
                                            >Clear</button>
                                        </div>
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