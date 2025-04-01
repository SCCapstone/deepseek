import { useAppContext } from '../../lib/context';

export default function CustomTextarea({ value, onChange, style: incomingStyle = {}, ...props }) {
    const context = useAppContext();

    const defaultTextareaStyle = {
        backgroundColor: context.colorScheme.tertiaryBackground,
        color: context.colorScheme.textColor,
        border: 'none',
    };

    const mergedTextareaStyle = { ...defaultTextareaStyle, ...incomingStyle };

    return (
        <div className='w-100' {...props}>
            <textarea
                className='w-100 p-2 rounded'
                value={value}
                onChange={e => onChange(e.target.value)}
                style={mergedTextareaStyle}
            />
        </div>
    );
}