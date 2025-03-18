import { useAppContext } from '../../lib/context';

export default function CustomTextarea({ value, onChange, ...props }) {
    const context = useAppContext();

    return (
        <div className='w-100' {...props}>
            <textarea
                className='w-100 p-2 border rounded'
                value={value}
                onChange={e => onChange(e.target.value)}
                style={{backgroundColor: context.colorScheme.secondaryBackground, color: context.colorScheme.textColor}}
            />
        </div>
    );
}