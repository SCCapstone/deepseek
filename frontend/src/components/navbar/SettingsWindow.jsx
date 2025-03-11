import { useState, useEffect } from 'react';
import CustomButton from '../input/CustomButton';
import CustomTextInput from '../input/CustomTextInput';
import Modal from '../Modal';
import Loading from '../Loading';
import Alert from '../Alert';


export default function SettingsWindow({ showWindow, hideWindow }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [settingsData, setSettingsData] = useState(null);

    const getData = async () => {

    }

    useEffect(() => {
        getData();
    }, []);

    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>

    return (
        <Modal showModal={showWindow} hideModal={hideWindow}>
            {loading ? <Loading/> :
                <>
                    <div className='w-100 d-flex flex-row justify-content-between align-items-center mb-3'>
                        <h3 className='h3 m-0'>Settings</h3>
                        <div className='d-flex flex-row'>
                            <CustomButton
                                text='Cancel'
                                className='btn-danger mr-1'
                                onClick={hideWindow}
                                />
                            <CustomButton
                                text='Save'
                                onClick={hideWindow}
                                />
                        </div>
                    </div>
                </>
            }
        </Modal>
    );
}