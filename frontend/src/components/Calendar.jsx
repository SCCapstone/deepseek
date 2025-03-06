import {
    useState,
} from 'react';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import { useAppContext } from '../lib/context';


const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const views = [
    'Month',
    'Week',
    'Day',
];

export default function Calendar({ onChange, selectedDate }) {
    const today = new Date();
    const context = useAppContext();
    const [view, setView] = useState(0);

    const styles = {
        calendarHeader: {
            color: context.colorScheme.textColor,
        },
        calendar: {

        },
        arrow: {
            color: context.colorScheme.textColor,
        },
        weekDays: {
            color: context.colorScheme.textColor,
            backgroundColor: context.colorScheme.accentColor,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
        },
        calendarGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
        },
        day: {
            color: context.colorScheme.textColor,
        }
    }

    function lastMonth() {
        const newDate = new Date(selectedDate);
        newDate.setMonth(selectedDate.getMonth() - 1);
        newDate.setDate(1);
        onChange(newDate);
    }

    function nextMonth() {
        const newDate = new Date(selectedDate);
        newDate.setMonth(selectedDate.getMonth() + 1);
        newDate.setDate(1);
        onChange(newDate);
    }

    // getting the Sunday of the first week of the month
    let startDate = new Date(selectedDate);
    while ((startDate.getMonth() == selectedDate.getMonth()
            && startDate.getDate() > 1) || (startDate.getDay() > 0)) {
        startDate.setDate(startDate.getDate() - 1);
    }

    // continuing to get weeks until we get the whole month
    let days = [];
    let current = new Date(startDate);
    while (true) {
        if ((current.getMonth() > selectedDate.getMonth()
            && current.getFullYear() === selectedDate.getFullYear())
            || current.getFullYear() > selectedDate.getFullYear())
            break
        for (let i=0; i<7; i++) {
            days.push({date: new Date(current)});
            current.setDate(current.getDate() + 1);
        }
    }

    return (
        <div className='d-flex flex-column w-100 h-100'>
            <div className='d-flex flex-row p-3' style={styles.calendarHeader}>
                <button
                    onClick={() => onChange(new Date())}
                    className='btn btn-primary shadow-none mr-1'>
                    Today</button>
                    <div className='dropdown'>
                        <button
                            className='btn btn-secondary dropdown-toggle mr-1 shadow-none'
                            type='button'
                            id='dropdownMenuButton'
                            data-toggle='dropdown'
                            aria-haspopup='true'
                            aria-expanded='false'>
                            {views[view]}</button>
                        <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
                            <button onClick={() => setView(0)} className='dropdown-item'>Month</button>
                            <button onClick={() => setView(1)} className='dropdown-item'>Week</button>
                            <button onClick={() => setView(2)} className='dropdown-item'>Day</button>
                        </div>
                    </div>
                <button
                    onClick={lastMonth}
                    className='btn d-flex justify-content-center align-items-center shadow-none'>
                    <AiFillCaretLeft size={20} style={styles.arrow}/>
                </button>
                <button
                    onClick={nextMonth}
                    className='btn d-flex justify-content-center align-items-center shadow-none mr-1'>
                    <AiFillCaretRight size={20} style={styles.arrow}/>
                </button>
                <h3 className='h3 mb-0'>{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h3>
            </div>
            <div style={styles.calendar} className='h-100 d-flex flex-column'>
                <div style={styles.weekDays}>
                    <div className='d-flex justify-content-center align-items-center p-1'>
                        <p className='mb-0'>Sunday</p>
                    </div>
                    <div className='d-flex justify-content-center align-items-center p-1'>
                        <p className='mb-0'>Monday</p>
                    </div>
                    <div className='d-flex justify-content-center align-items-center p-1'>
                        <p className='mb-0'>Tuesday</p>
                    </div>
                    <div className='d-flex justify-content-center align-items-center p-1'>
                        <p className='mb-0'>Wednesday</p>
                    </div>
                    <div className='d-flex justify-content-center align-items-center p-1'>
                        <p className='mb-0'>Thursday</p>
                    </div>
                    <div className='d-flex justify-content-center align-items-center p-1'>
                        <p className='mb-0'>Friday</p>
                    </div>
                    <div className='d-flex justify-content-center align-items-center p-1'>
                        <p className='mb-0'>Saturday</p>
                    </div>
                </div>
                <div style={styles.calendarGrid} className='flex-grow-1'>
                    {days.map((day, i) =>
                        <div
                            key={i}
                            style={styles.day}
                            className={'border p-1 ' +
                            (selectedDate.toDateString() === day.date.toDateString() ?
                                'bg-primary' : day.date.toDateString() === today.toDateString() ?
                                'bg-secondary' : null)}
                            onClick={() => onChange(day.date)}>
                            {day.date.getDate()}</div>
                    )}
                </div>
            </div>
        </div>
    );
}