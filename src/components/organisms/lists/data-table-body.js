import { TableBody } from '@base-framework/organisms';
import { CheckboxCol, HeaderCol, TableHeader } from './table-header.js';
export { CheckboxCol, HeaderCol, TableHeader };

/**
 * This will create the table body.
 *
 * @param {object} props
 * @returns {object}
 */
export const DataTableBody = ({ key, rows, selectRow, rowItem, emptyState }) => (
	new TableBody({
		cache: 'list',
		key,
		items: rows,
		rowItem: (row) => rowItem(row, selectRow),
		class: 'divide-y divide-border',
		emptyState
	})
);
