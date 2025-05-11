import { Atom } from '@base-framework/base';
import { ScrollableTable } from './scrollable-table.js';
import { CheckboxCol, HeaderCol, TableHeader } from './table-header.js';
export { CheckboxCol, HeaderCol, TableHeader };

/**
 * ScrollableDataTable Component
 *
 * This will create a scrollable data table.
 *
 * @param {object} props
 * @property {HTMLElement} [props.scrollContainer] - The container element for scroll events. Defaults to globalThis.
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
export const ScrollableDataTable = Atom((props) => (
	new ScrollableTable(
	{
		cache: props.cache ?? 'list',
		tableData: props.data,
		scrollContainer: props.scrollContainer,
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

export default ScrollableDataTable;
