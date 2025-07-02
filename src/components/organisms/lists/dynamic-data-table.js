import { Atom } from '@base-framework/base';
import DynamicTable from './dynamic-table.js';
import { CheckboxCol, HeaderCol, TableHeader } from './table-header.js';
export { CheckboxCol, HeaderCol, TableHeader };

/**
 * DynamicDataTable Component
 *
 * This will create a dynamic data table.
 *
 * @param {object} props
 * @property {function} [props.loadMoreItems] - A function to fetch/generate additional items.
 * @property {number} [props.offset] - The initial offset. Defaults to 0.
 * @property {number} [props.limit] - Number of items to load per batch. Defaults to 20.
 * @property {string} [props.class] - The class to add to the list.
 * @property {string} [props.key] - The key to use to identify the items.
 * @property {array} [props.rows] - The initial rows.
 * @property {function} [props.rowItem] - The row item.
 * @property {array} [props.headers] - The table headers.
 * @property {object} [props.customHeader] - The custom header.
 * @property {function} [props.selectRow] - The function to select a row.
 * @property {string} [props.border] - The border to add to the table.
 * @property {object} [props.data] - The table data.
 * @property {string} [props.cache] - The table cache identifier.
 * @returns {object}
 */
export const DynamicDataTable = Atom((props) => (
	new DynamicTable(
	{
		cache: props.cache ?? 'list',
		tableData: props.data,
		loadMoreItems: props.loadMoreItems,
		offset: props.offset,
		limit: props.limit,
		class: props.class,
		key: props.key,
		rows: props.rows,
		rowItem: props.rowItem,
		headers: props.headers,
		customHeader: props.customHeader,
		border: props.border
	})
));

export default DynamicDataTable;
