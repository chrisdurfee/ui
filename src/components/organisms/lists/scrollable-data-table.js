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
 * @property {string} [props.xhrMethod='all'] - The method name to call on data.xhr.
 * @property {string} [props.cache] - The table cache identifier.
 * @property {object|null} [props.emptyState] - The empty state to show when there are no items.
 * @property {boolean|object} [props.skeleton] - Skeleton configuration. Can be true for default or object with { number: 5, row: customRowFunction }
 * @returns {object}
 */
export const ScrollableDataTable = Atom((props) => (
	new ScrollableTable(
	{
		// @ts-ignore
		cache: props.cache ?? 'list',
		// @ts-ignore
		tableData: props.data,
		// @ts-ignore
		scrollContainer: props.scrollContainer,
		// @ts-ignore
		loadMoreItems: props.loadMoreItems,
		// @ts-ignore
		offset: props.offset,
		// @ts-ignore
		limit: props.limit,
		// @ts-ignore
		class: props.class,
		// @ts-ignore
		key: props.key,
		// @ts-ignore
		rows: props.rows,
		// @ts-ignore
		rowItem: props.rowItem,
		// @ts-ignore
		headers: props.headers,
		// @ts-ignore
		customHeader: props.customHeader,
		// @ts-ignore
		border: props.border,
		// @ts-ignore
		xhrMethod: props.xhrMethod,
		// @ts-ignore
		emptyState: props.emptyState,
		// @ts-ignore
		skeleton: props.skeleton,
	})
));

export default ScrollableDataTable;
