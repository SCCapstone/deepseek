import { useAppContext } from '../../lib/context';

export default function CustomButton({ onClick, text, type, className, ...props }) {
    const context = useAppContext();
    return (
        <button onClick={onClick} className={`btn btn-primary` + (className || '')} {...props}
        onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.03)';
        }}
        onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
        }}
        style={{
            backgroundColor: context.colorScheme.accentColor,
            color: 'white',
            border: 'none',
        }}
        >
            {text}
        </button>
    );
}