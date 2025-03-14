export default function CustomButton({ onClick, text, type, className, ...props }) {
    return (
        <button onClick={onClick} className={`btn btn-primary ` + (className || '')} {...props}>
            {text}
        </button>
    );
}