export default function EventCard({ event }) {
    return (
        <div className='p-2 mb-3 shadow-sm rounded-lg border'>
            <div className='font-weight-bold'>
                {event.title}
            </div>
            <div>
                {event.description}
            </div>
            <div>
                {(new Date(event.start_time)).toLocaleTimeString()
                + ' - ' + (new Date(event.end_time)).toLocaleTimeString()}
            </div>
        </div>
    );
}