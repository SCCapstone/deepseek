import { useAppContext } from '../lib/context';


export default function EventCard({ event }) {
    const context = useAppContext();

    const styles = {
        text: {
            color: context.colorScheme.textColor,
        }
    }

    return (
        <div className='p-2 mb-3 shadow-sm rounded-lg border'>
            <div className='font-weight-bold' style={styles.text}>
                {event.title}
            </div>
            <div style={styles.text}>
                {event.description}
            </div>
            <div style={styles.text}>
                {(new Date(event.start_time)).toLocaleTimeString()
                + ' - ' + (new Date(event.end_time)).toLocaleTimeString()}
            </div>
        </div>
    );
}