import { useParams } from 'react-router-dom';
import EventHeader from '../components/events/EventHeader';
import EventComments from '../components/events/EventComments';


export default function Event() {
    const { id } = useParams();
    return (
        <div className='w-100' style={{overflowY: 'auto'}}>
            <div className='my-3'>
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