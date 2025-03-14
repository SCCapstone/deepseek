export default function CustomTextInput({ value, onChange, placeholder, type, ...props }) {
    return (
        <div
            className='d-flex flex-column justify-content-start align-items center rounded-lg'
            {...props}
        >
            <input
                className='w-100 p-2 border rounded-lg'
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );
}