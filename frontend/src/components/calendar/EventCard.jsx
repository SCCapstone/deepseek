import { useAppContext } from '../../lib/context';


export default function EventCard({ event, onClick }) {
    const context = useAppContext();

    const styles = {
        text: {
            color: context.colorScheme.textColor,
        }
    }

    return (
        <div onClick={onClick} className='p-2 mb-3 shadow-sm rounded-lg border w-100'>
            <div className='font-weight-bold' style={styles.text}>
                {event.title}
            </div>
            <div style={styles.text}>
                {event.description}
            </div>
            <div style={styles.text}>
                {event.formattedTime}
            </div>
        </div>
    );
}