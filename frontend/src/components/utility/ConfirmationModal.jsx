import CustomButton from '../input/CustomButton';
import Modal from './Modal';

import { useAppContext } from '../../lib/context';

export default function ConfirmationModal({ 
    showModal, 
    hideModal, 
    onConfirm, 
    message,
    confirmText = 'Confirm', 
    cancelText = 'Cancel',
}) {
    const context = useAppContext();

    const handleConfirm = () => {
        onConfirm();
        hideModal();
    };

    return (
        <Modal showModal={showModal} hideModal={hideModal}>
            <div className='w-100 d-flex flex-column p-4 rounded shadow-lg'>
                <h4 className='h4 mb-3 text-center'>Confirmation</h4>
                <p className='text-center mb-4'>{message}</p>
                <div className='d-flex justify-content-end' style={{ gap: '0.75rem' }}>
                    <CustomButton
                        text={cancelText}
                        onClick={hideModal}
                        style={{ backgroundColor: context.colorScheme.tertiaryBackground, color: context.colorScheme.textColor }} 
                    />
                    <CustomButton
                        text={confirmText}
                        onClick={handleConfirm}
                        style={{ backgroundColor: context.colorScheme.danger, color: 'white' }} 
                    />
                </div>
            </div>
        </Modal>
    );
} 