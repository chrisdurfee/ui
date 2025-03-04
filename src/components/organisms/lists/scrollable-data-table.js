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
 * @returns {object}
 */
export const ScrollableDataTable = Atom((props) =>
{
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
			const currentRows = this.rows;
			// @ts-ignore
			const border = this.border !== false ? 'border' : '';

			return Div({ class: 'w-full' }, [
				Div({ class: `w-full rounded-md ${border} overflow-x-auto` }, [
					Table({ class: 'w-full' }, [
						// @ts-ignore
						this.headers && TableHeader({ headers: this.headers, sort: (key) => this.sortRows(key) }),
						// @ts-ignore
						this.customHeader ?? null,
						ScrollableTableBody({
							scrollContainer: props.scrollContainer,
							loadMoreItems: props.loadMoreItems,
							offset: props.offset,
							limit: props.limit,
							containerClass: props.containerClass ?? '',
							data: props.data,
							// @ts-ignore
							key: this.key,
							rows: currentRows,
							// @ts-ignore
							selectRow: this.selectRow.bind(this),
							// @ts-ignore
							rowItem: this.rowItem
						})
					])
				])
			]);
		}
	})
});

export default ScrollableDataTable;
