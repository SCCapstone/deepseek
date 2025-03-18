import { useAppContext } from '../../lib/context';

export default function CustomTextInput({ value, onChange, placeholder, type, ...props }) {
    const context = useAppContext();

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
                style={{backgroundColor: context.colorScheme.secondaryBackground, color: context.colorScheme.textColor}}
            />
        </div>
    );
}