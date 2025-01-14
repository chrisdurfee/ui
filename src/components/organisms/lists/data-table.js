import { Div, Table } from '@base-framework/atoms';
import { Data, Jot } from '@base-framework/base';
import { DataTableBody } from './data-table-body.js';
import { CheckboxCol, HeaderCol, TableHeader } from './table-header.js';
export { CheckboxCol, HeaderCol, TableHeader };

/**
 * DataTable Component
 *
 * Manages data, filtering, pagination, and selection within a table.
 *
 * @param {object} props
 * @returns {object}
 */
export const DataTable = Jot(
{
    /**
     * Initializes component data.
     *
     * @returns {Data}
     */
    setData()
    {
        return new Data({
            selectedRows: [],
            selected: false
        });
    },

    /**
     * This will toggle all selected rows.
     *
     * @returns {boolean}
     */
    toggleAllSelectedRows()
    {
        // @ts-ignore
        const tableRows = this.table.getRows();
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
    },

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
    },

    /**
     * This will get the selected rows.
     *
     * @returns {Array<object>}
     */
    getSelectedRows()
    {
        // @ts-ignore
        return this.data.get('selectedRows');
    },

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
        const rows = this.table.getRows();
        rows.forEach(row => row.selected = selected);
        // @ts-ignore
        this.table.setRows(rows);
    },

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
    },

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
                    DataTableBody({
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
    },

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
        this.table.remove(items);
    },

    /**
     * This will set the items in the list.
     *
     * @public
     * @param {array} rows
     * @returns {void}
     */
    setRows(rows)
    {
        // @ts-ignore
        this.table.setRows(rows);
    },

    /**
     * This will append items to the list.
     *
     * @public
     * @param {array|object} items
     * @returns {void}
     */
    append(items)
    {
        // @ts-ignore
        this.table.append(items);
    },

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
        this.table.mingle(newItems, withDelete);
    },

    /**
     * This will prepend items to the list.
     *
     * @public
     * @param {array|object} items
     * @returns {void}
     */
    prepend(items)
    {
        // @ts-ignore
        this.table.prepend(items);
    },

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
});
