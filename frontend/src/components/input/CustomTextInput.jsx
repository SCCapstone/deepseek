import { useAppContext } from '../../lib/context';

export default function CustomTextInput({ value, onChange, placeholder, type, style: incomingStyle = {}, ...props }) {
    const context = useAppContext();

    const defaultInputStyle = {
        backgroundColor: context.colorScheme.tertiaryBackground,
        color: context.colorScheme.textColor,
        border: 'none',
    };

    const mergedInputStyle = { ...defaultInputStyle, ...incomingStyle };

    return (
        <div
            className='d-flex flex-column justify-content-start align-items center rounded-lg'
            {...props}
        >
            <input
                className='w-100 p-2 rounded-lg'
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                style={mergedInputStyle}
            />
        </div>
    );
}