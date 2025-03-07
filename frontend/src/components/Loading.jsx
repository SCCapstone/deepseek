
import LoadingGIF from '../assets/loading.gif';


export default function Loading({ className, ...props }) {
    return (
        <div
            className={'p-3 d-flex flex-column justify-content-start align-items-center ' + (className || '')}
            {...props}
        >
            <h3 className='h3 text-center'>Loading</h3>
            <img src={LoadingGIF} style={{width: '40px'}}/>
        </div>
    );
}