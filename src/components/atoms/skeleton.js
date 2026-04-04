import { Div } from '@base-framework/atoms';

/**
 * Creates a generic skeleton element that can be used as a placeholder.
 *
 * @param {object} props
 * @returns {object}
 */
export const Skeleton = ({ class: className, shape = 'rectangle', width = 'w-full', height = 'h-4'}) =>
{
	const rounded = className?.includes('rounded')? className.match(/rounded-(\w+)/)?.[1] : 'md';
	const shapeClass = shape === 'circle' ? 'rounded-full' : `rounded-${rounded}`;

	return Div({
		class: `bg-muted animate-pulse ${width} ${height} ${shapeClass} ${className || ''}`
	});
};

export default Skeleton;