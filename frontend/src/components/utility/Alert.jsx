import CustomButton from '../input/CustomButton';

import { useAppContext } from '../../lib/context';

export default function Alert({ message, hideAlert }) {
    const context = useAppContext();

    return (
        <div
            className='position-fixed w-100 d-flex flex-column justify-content-center align-items-center'
            style={{top: 0, left: 0, width: '100vh', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 1040}}
        >
            <div
                className='p-3 d-flex flex-column align-items-center rounded-lg shadow-lg'
                style={{minWidth: '200px', backgroundColor: context.colorScheme.secondaryBackground}}
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