import React from 'react';
import { useAppContext } from '../../lib/context';

export default function Modal({ showModal, hideModal, children }) {
    if (!showModal) return null;
    const context = useAppContext();
    const handleModalContainerClick = (e) => {
        // Prevent clicks within the modal content from closing the modal
        e.stopPropagation();
    };

    return (
        <div 
            className="position-fixed d-flex justify-content-center align-items-center"
            style={{
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1050,
            }}
            onClick={hideModal}
        >
            <div 
                className="modal-content rounded shadow"
                style={{
                    width: '600px',
                    maxWidth: '90%',
                    maxHeight: '90%',
                    overflow: 'auto',
                    zIndex: 1051,
                    backgroundColor: context.colorScheme.secondaryBackground,
                }}
                onClick={handleModalContainerClick}
            >
                {children}
            </div>
        </div>
    );
}