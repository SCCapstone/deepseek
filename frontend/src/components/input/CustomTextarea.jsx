export default function CustomTextarea({ value, onChange, ...props }) {
    return (
        <div className='w-100' {...props}>
            <textarea
                className='w-100 p-2 border rounded'
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    );
}