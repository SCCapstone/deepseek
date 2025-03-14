import CustomButton from '../input/CustomButton';


export default function Alert({ message, hideAlert }) {
    return (
        <div
            className='position-fixed w-100 d-flex flex-column justify-content-center align-items-center'
            style={{top: 0, left: 0, width: '100vh', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.4)'}}
        >
            <div
                className='p-3 d-flex flex-column align-items-center rounded-lg shadow-lg bg-white'
                style={{minWidth: '200px'}}
            >
                <h3 className='h3'>Alert</h3>
                <p>{message}</p>
                <CustomButton
                    text='Ok'
                    className='btn-danger'
                    onClick={hideAlert}
                />
            </div>
        </div>
    );
}