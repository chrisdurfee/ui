import { Div, Table } from '@base-framework/atoms';
import { Atom } from '@base-framework/base';
import { ScrollableTableBody } from '@base-framework/organisms';
import { DataTable } from './data-table.js';
import { CheckboxCol, HeaderCol, TableHeader } from './table-header.js';
export { CheckboxCol, HeaderCol, TableHeader };

/**
 * ScrollableDataTable Component
 *
 * This will create a scrollable data table.
 *
 * @param {object} props
 * @property {HTMLElement} [props.scrollContainer] - The container element for scroll events. Defaults to window.
 * @property {function} [props.loadMoreItems] - A function to fetch/generate additional items.
 * @property {number} [props.offset] - The initial offset. Defaults to 0.
 * @property {number} [props.limit] - Number of items to load per batch. Defaults to 20.
 * @property {string} [props.class] - The class to add to the list.
 * @property {string} [props.key] - The key to use to identify the items.
 * @property {array} [props.rows] - The initial rows.
 * @property {function} [props.rowItem] - The row item.
 * @property {string} [props.containerClass] - The class to add to the scroll container.
 * @returns {object}
 */
export const ScrollableDataTable = Atom((props) => (
	new DataTable(
	{
		/**
		 * Renders the DataTable component.
		 *
		 * @returns {object}
		 */
		render()
		{
			// @ts-ignore
			const currentRows = props.rows;
			// @ts-ignore
			const border = this.border !== false ? 'border' : '';

			return Div({ class: 'w-full' }, [
				Div({ class: `w-full rounded-md ${border} overflow-x-auto` }, [
					Table({ class: 'w-full' }, [
						// @ts-ignore
						props.headers && TableHeader({ headers: props.headers, sort: (key) => this.sortRows(key) }),
						// @ts-ignore
						props.customHeader ?? null,
						new ScrollableTableBody({
							scrollContainer: props.scrollContainer,
							loadMoreItems: props.loadMoreItems,
							offset: props.offset,
							limit: props.limit,
							class: props.class,
							containerClass: props.containerClass ?? '',
							data: props.data,
							// @ts-ignore
							key: props.key,
							items: currentRows,
							// @ts-ignore
							selectRow: this.selectRow.bind(this),
							// @ts-ignore
							rowItem: props.rowItem
						})
					])
				])
			]);
		}
	})
));

export default ScrollableDataTable;
