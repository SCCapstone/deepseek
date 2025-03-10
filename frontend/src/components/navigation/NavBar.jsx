import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../lib/context';
import SearchBar from '../input/SearchBar';
import DefaultPFP from '../../assets/default-pfp.jpg';


export default function NavBar() {
    const context = useAppContext();
    const { pathname } = useLocation();
    if (pathname === '/' || pathname === '/login' || pathname === '/register')
        return null;

    const styles = {
        header: {
            backgroundColor: context.colorScheme.accentColor,
        },
        link: {
            color: context.colorScheme.textColor,
        },
        themeIcon: {
            color: context.colorScheme.textColor,
        },
    }

    return (
        <header
            className='d-flex flex-row p-2 align-items-center justify-content-between'
            style={styles.header}>
            <div className='d-flex flex-row'>
                <Link style={styles.link} to='/calendar' className='p-2 mr-3 font-weight-bold'>CalendarMedia</Link>
                <SearchBar className='mr-3'/>
                <Link style={styles.link} to='/create-event' className='btn btn-primary'>Create event</Link>
            </div>
            <div className='d-flex flex-row'>
                <Link to='/profile'>
                        <img
                            style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 1000,
                        }}
                        src={DefaultPFP}
                    />
                </Link>
            </div>
        </header>
    );
};