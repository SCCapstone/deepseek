import { useParams } from 'react-router-dom';
import EventHeader from '../components/events/EventHeader';
import EventComments from '../components/events/EventComments';
import { useAppContext } from '../lib/context';

export default function Event() {
    const { id } = useParams();
    const context = useAppContext();

    return (
        <div 
            className='w-100 h-100' 
            style={{
                overflowY: 'auto', 
                backgroundColor: context.colorScheme.backgroundColor, 
                color: context.colorScheme.textColor,
                height: 'calc(100vh - 48px)' // Adjust for navbar height
            }}
        >
            <div
                className='container my-3 w-100 rounded
                d-flex flex-column justify-content-start align-items-stretch'
                style={{backgroundColor: context.colorScheme.secondaryBackground}}
            >
                <div className='mb-3'>
                    <EventHeader eventId={id}/>
                </div>
                <div className='mb-3'>
                    <EventComments eventId={id}/>
                </div>
            </div>
        </div>
    );
}