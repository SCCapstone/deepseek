
import LoadingGIF from '../assets/loading.gif';


export default function Loading() {
    return (
        <div className='d-flex flex-column justify-content-start align-items-center'>
            <h3 className='h3 text-center'>Loading</h3>
            <img src={LoadingGIF} style={{width: '40px'}}/>
        </div>
    );
}