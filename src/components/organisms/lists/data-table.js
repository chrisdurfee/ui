import { Div, On, Table } from '@base-framework/atoms';
import { Component, Data } from '@base-framework/base';
import { DataTableBody } from './data-table-body.js';
import { SkeletonTableRow } from './skeleton-table-row.js';
import { CheckboxCol, HeaderCol, TableHeader } from './table-header.js';
export { CheckboxCol, HeaderCol, TableHeader };

/**
 * DataTable Component
 *
 * Manages data, filtering, pagination, and selection within a table.
 *
 * @param {object} props
 * @param {boolean|object} [props.skeleton] - Skeleton configuration. Can be true for default or object with { number: 5, row: customRowFunction }
 * @returns {object}
 */
export class DataTable extends Component
{
	/**
	 * Initializes component data.
	 *
	 * @returns {Data}
	 */
	setData()
	{
		// @ts-ignore
		let hasItems = this.rows && this.rows.length > 0;

		/**
		 * This will not set the empty state for dynamic data tables.
		 */
		// @ts-ignore
		if ((this.loadMoreItems || this.tableData) && !hasItems)
		{
			hasItems = null;
		}

		// Handle skeleton state
		// @ts-ignore
		const isSkeletonEnabled = this.skeleton && !hasItems;

		return new Data({
			selectedRows: [],
			// @ts-ignore
			hasItems: isSkeletonEnabled ? true : hasItems,
			selected: false,
			// @ts-ignore
			showSkeleton: isSkeletonEnabled
		});
	}

	/**
	 * This will toggle all selected rows.
	 *
	 * @returns {boolean}
	 */
	toggleAllSelectedRows()
	{
		// @ts-ignore
		const tableRows = this.list.getRows();
		// @ts-ignore
		const isSelected = this.data.selectedRows.length === tableRows.length;
		const selectedRows = isSelected ? [] : tableRows;
		// @ts-ignore
		this.data.selectedRows = selectedRows;

		// @ts-ignore
		this.updateSelected();
		// @ts-ignore
		this.updateTable(!isSelected);
		return isSelected;
	}

	/**
	 * This will update the selected state.
	 *
	 * @returns {void}
	 */
	updateSelected()
	{
		// @ts-ignore
		const selectedRows = this.data.get('selectedRows');
		// @ts-ignore
		this.data.selected = (selectedRows.length > 0);
	}

	/**
	 * Generates skeleton rows for the table.
	 *
	 * @returns {Array}
	 */
	generateSkeletonRows()
	{
		// @ts-ignore
		const skeletonConfig = this.skeleton;

		// Default skeleton configuration
		let skeletonCount = 5;
		let customRowFunction = null;

		// Handle skeleton configuration
		if (typeof skeletonConfig === 'object')
		{
			skeletonCount = skeletonConfig.number || 5;
			customRowFunction = skeletonConfig.row || null;
		}

		// Calculate column count from headers
		// @ts-ignore
		const columnCount = this.headers ? this.headers.length : 3;

		// Generate skeleton rows
		return Array.from({ length: skeletonCount }, (_, index) =>
		{
			if (customRowFunction && typeof customRowFunction === 'function')
			{
				return customRowFunction(index, columnCount);
			}

			return SkeletonTableRow({
				columnCount,
				key: `skeleton-${index}`
			});
		});
	}

	/**
	 * Removes skeleton rows and shows real content.
	 *
	 * @returns {void}
	 */
	removeSkeleton()
	{
		// @ts-ignore
		if (this.data.showSkeleton)
		{
			// @ts-ignore
			this.data.showSkeleton = false;
			// @ts-ignore
			const hasRealItems = this.rows && this.rows.length > 0;
			// @ts-ignore
			this.data.hasItems = hasRealItems;
		}
	}

	/**
	 * This will get the selected rows.
	 *
	 * @returns {Array<object>}
	 */
	getSelectedRows()
	{
		// @ts-ignore
		return this.data.get('selectedRows');
	}

	/**
	 * This will update the table rows.
	 *
	 * @protected
	 * @param {boolean} selected
	 * @returns {void}
	 */
	updateTable(selected)
	{
		// @ts-ignore
		const rows = this.list.getRows();
		rows.forEach(row => row.selected = selected);
		// @ts-ignore
		this.list.setRows(rows);
	}

	/**
	 * Handles row selection.
	 *
	 * @param {object} row
	 */
	selectRow(row)
	{
		const isSelected = row.selected ?? false;
		row.selected = !isSelected;

		// @ts-ignore
		const previouslySelected = this.data.get('selectedRows');
		const selectedRows = row.selected

			// This will add the row to the selected rows.
			? [...previouslySelected, row]

			// This will remove the row from the selected rows.
			: previouslySelected.filter(selected => selected !== row);

		// @ts-ignore
		this.data.selectedRows = selectedRows;
		// @ts-ignore
		this.updateSelected();
	}

	/**
	 * Renders the DataTable component.
	 *
	 * @returns {object}
	 */
	render()
	{
		// @ts-ignore
		const currentRows = this.data.get('showSkeleton') ? this.generateSkeletonRows() : this.rows;
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
					DataTableBody({
						// @ts-ignore
						key: this.key,
						rows: currentRows,
						// @ts-ignore
						selectRow: this.selectRow.bind(this),
						// @ts-ignore
						rowItem: this.rowItem,
						// @ts-ignore
						emptyState: this.emptyState
					})
				])
			])
		]);
	}

	/**
	 * This will remove items from the list.
	 *
	 * @public
	 * @param {array} items
	 * @returns {void}
	 */
	remove(items)
	{
		// @ts-ignore
		this.list.remove(items);
	}

	/**
	 * This will set the items in the list.
	 *
	 * @public
	 * @param {array} rows
	 * @returns {void}
	 */
	setRows(rows)
	{
		// Remove skeleton when setting real rows
		this.removeSkeleton();

		// @ts-ignore
		this.list.setRows(rows);
	}

	/**
	 * This will append items to the list.
	 *
	 * @public
	 * @param {array|object} items
	 * @returns {void}
	 */
	append(items)
	{
		// Remove skeleton when appending real items
		this.removeSkeleton();

		// @ts-ignore
		this.list.append(items);
	}

	/**
	 * This will mingle the new items with the old items.
	 *
	 * @public
	 * @param {Array<Object>} newItems
	 * @param {boolean} withDelete
	 * @returns {void}
	 */
	mingle(newItems, withDelete = false)
	{
		// @ts-ignore
		this.list.mingle(newItems, withDelete);
	}

	/**
	 * This will prepend items to the list.
	 *
	 * @public
	 * @param {array|object} items
	 * @returns {void}
	 */
	prepend(items)
	{
		// Remove skeleton when prepending real items
		this.removeSkeleton();

		// @ts-ignore
		this.list.prepend(items);
	}

	/**
	 * This will remove the selected rows.
	 *
	 * @returns {void}
	 */
	beforeDestroy()
	{
		// @ts-ignore
		this.data.selectedRows = [];
	}
}
