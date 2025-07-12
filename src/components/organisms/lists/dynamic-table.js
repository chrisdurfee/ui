import { Div, On, Table } from '@base-framework/atoms';
import { DataTableBody } from '@base-framework/organisms';
import { DataTable } from './data-table.js';
import { CheckboxCol, HeaderCol, TableHeader } from './table-header.js';
export { CheckboxCol, HeaderCol, TableHeader };

/**
 * This will create the table body.
 *
 * @param {object} props
 * @returns {object}
 */
export const DynamicTableBody = (props) => (
	new DataTableBody({
		cache: 'list',
		loadMoreItems: props.loadMoreItems,
		offset: props.offset,
		limit: props.limit,
		key: props.key,
		tableData: props.tableData,
		items: props.items,
		rowItem: (row) => props.rowItem(row, props.selectRow),
		class: 'divide-y divide-border'
	})
);

/**
 * DynamicTable Component
 *
 * This will create a dynamic data table.
 *
 * @param {object} props
 * @property {function} [props.loadMoreItems] - A function to fetch/generate additional items.
 * @property {number} [props.offset] - The initial offset. Defaults to 0.
 * @property {number} [props.limit] - Number of items to load per batch. Defaults to 20.
 * @property {string} [props.class] - The class to add to the list.
 * @property {string} [props.key] - The key to use to identify the items.
 * @property {object} [props.tableData] - The table data.
 * @property {array} [props.rows] - The initial rows.
 * @property {function} [props.rowItem] - The row item.
 * @property {string} [props.containerClass] - The class to add to the scroll container.
 * @property {object|null} [props.emptyState] - The empty state to show when there are no items.
 * @returns {object}
 */
export class DynamicTable extends DataTable
{
	/**
	 * Renders the DataTable component.
	 *
	 * @returns {object}
	 */
	render()
	{
		// @ts-ignore
		const currentRows = this.rows;
		// @ts-ignore
		const border = this.border !== false ? 'border' : '';

		return Div({ class: 'w-full flex flex-auto flex-col' }, [
			On('hasItems', (hasItems) =>
			{
				// @ts-ignore
				return (hasItems === false && this.emptyState) ? this.emptyState() : null;
			}),
			Div({ class: `w-full rounded-md ${border} overflow-x-auto`, onSet: ['hasItems', { hidden: false }] }, [
				Table({ class: 'w-full' }, [
					// @ts-ignore
					this.headers && TableHeader({ headers: this.headers, sort: (key) => this.sortRows(key) }),
					// @ts-ignore
					this.customHeader ?? null,
					DynamicTableBody({
						// @ts-ignore
						loadMoreItems: this.loadMoreItems,
						// @ts-ignore
						offset: this.offset,
						// @ts-ignore
						limit: this.limit,
						// @ts-ignore
						class: this.class,
						// @ts-ignore
						tableData: this.tableData,
						// @ts-ignore
						key: this.key,
						items: currentRows,
						// @ts-ignore
						selectRow: this.selectRow.bind(this),
						// @ts-ignore
						rowItem: this.rowItem
					})
				])
			])
		]);
	}

	/**
	 * Refreshes the list.
	 *
	 * @returns {void}
	 */
	refresh()
	{
		// @ts-ignore
		this.list.refresh();
	}
}

export default DynamicTable;
