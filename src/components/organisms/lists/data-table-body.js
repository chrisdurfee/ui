import { TableBody } from '@base-framework/organisms';
import { CheckboxCol, HeaderCol, TableHeader } from './table-header.js';
export { CheckboxCol, HeaderCol, TableHeader };

/**
 * This will create the table body.
 *
 * The empty state is not passed to the table body. DataTable renders
 * it outside the table, so passing it here would show it twice.
 *
 * @param {object} props
 * @returns {object}
 */
export const DataTableBody = ({ key, rows, selectRow, rowItem, skeleton, columnCount }) => (
	new TableBody({
		cache: 'list',
		key,
		items: rows,
		rowItem: (row) => rowItem(row, selectRow),
		class: 'divide-y divide-border',
		skeleton,
		columnCount
	})
);
