import { useAppContext } from '../../lib/context';

export default function CustomButton({ onClick, text, type, className, style: incomingStyle = {}, ...props }) {
    const context = useAppContext();

    const defaultStyle = {
        backgroundColor: context.colorScheme.accentColor,
        color: 'white',
        border: 'none',
        transition: 'transform 0.1s ease',
    };

    const mergedStyle = { ...defaultStyle, ...incomingStyle };

    return (
        <button onClick={onClick} className={`btn btn-primary ${className || ''}`} {...props}
        onMouseOver={(e) => {
            if (!props.disabled) {
                e.currentTarget.style.transform = 'scale(1.03)';
            }
        }}
        onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
        }}
        style={mergedStyle}
        >
            {text}
        </button>
    );
}