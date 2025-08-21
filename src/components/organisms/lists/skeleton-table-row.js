import { Td, Tr } from '@base-framework/atoms';
import { Skeleton } from '../../atoms/skeleton.js';

/**
 * Creates a skeleton table row with animated placeholders.
 *
 * @param {object} props
 * @param {number} [props.columnCount=3] - Number of columns to create skeleton cells for
 * @param {function} [props.customCell] - Custom function to render skeleton cells
 * @param {string} [props.key] - Unique key for the row
 * @returns {object}
 */
export const SkeletonTableRow = ({ columnCount = 3, customCell, key }) =>
{
	const createSkeletonCell = (index) =>
	{
		if (customCell && typeof customCell === 'function')
		{
			return customCell(index);
		}

		// Default skeleton cell with varying widths for more realistic appearance
		const widths = ['w-3/4', 'w-1/2', 'w-full', 'w-2/3', 'w-5/6'];
		const width = widths[index % widths.length];

		return Td({ class: 'px-6 py-4' }, [
			Skeleton({ width, height: 'h-4' })
		]);
	};

	return Tr({
		class: 'border-b',
		key,
		children: Array.from({ length: columnCount }, (_, index) => createSkeletonCell(index))
	});
};

export default SkeletonTableRow;
