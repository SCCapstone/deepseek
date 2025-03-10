export default function Modal({ showModal, hideModal, children }) {
    if (!showModal) return null;
    
    return (
        <div
            className='p-5 position-fixed w-100 d-flex flex-column justify-content-center align-items-center'
            style={{
                top: 0,
                left: 0,
                width: '100vh',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
            }}
            onClick={hideModal}
        >
            <div
                className='w-100 d-flex flex-column justify-content-start align-items-center
                p-3 bg-white rounded-lg'
                style={{
                    minWidth: '600px',
                    maxWidth: '900px',
                    maxHeight: '90%',
                    overflowY: 'auto',
                }}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}