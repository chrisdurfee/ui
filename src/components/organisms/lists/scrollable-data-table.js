import { Div, Table } from '@base-framework/atoms';
import { ScrollableTableBody } from '@base-framework/organisms';
import { DataTable } from './data-table.js';
import { CheckboxCol, HeaderCol, TableHeader } from './table-header.js';
export { CheckboxCol, HeaderCol, TableHeader };

/**
 * ScrollableDataTable Component
 *
 * Manages data, filtering, pagination, and selection within a table.
 *
 * @param {object} props
 * @returns {object}
 */
export class ScrollableDataTable extends DataTable
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
}
