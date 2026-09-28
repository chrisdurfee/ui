import { describe, expect, it } from 'vitest';
import { DataTable } from '../../src/components/organisms/lists/data-table.js';
import { compareValues, getNextSortDirection, sortRows } from '../../src/utils/sort-rows.js';

const names = (rows) => rows.map((row) => row.name);

describe('sortRows', () =>
{
	it('sorts strings with locale and numeric collation', () =>
	{
		const rows = [{ name: 'item 10' }, { name: 'Item 2' }, { name: 'apple' }];
		expect(names(sortRows(rows, 'name'))).toEqual(['apple', 'Item 2', 'item 10']);
		expect(names(sortRows(rows, 'name', 'desc'))).toEqual(['item 10', 'Item 2', 'apple']);
	});

	it('sorts numbers and numeric strings numerically', () =>
	{
		const rows = [{ name: 'a', v: 10 }, { name: 'b', v: 2 }, { name: 'c', v: '33' }, { name: 'd', v: -1 }];
		expect(names(sortRows(rows, 'v'))).toEqual(['d', 'b', 'a', 'c']);
		expect(names(sortRows(rows, 'v', 'desc'))).toEqual(['c', 'a', 'b', 'd']);
	});

	it('sorts dates and ISO date strings chronologically', () =>
	{
		const rows = [
			{ name: 'a', d: new Date('2024-03-01') },
			{ name: 'b', d: new Date('2023-01-01') },
			{ name: 'c', d: new Date('2025-06-01') }
		];
		expect(names(sortRows(rows, 'd'))).toEqual(['b', 'a', 'c']);

		const strings = [
			{ name: 'a', d: '2024-03-01T10:00:00Z' },
			{ name: 'b', d: '2024-03-01T09:00:00Z' },
			{ name: 'c', d: '2023-12-31' }
		];
		expect(names(sortRows(strings, 'd'))).toEqual(['c', 'b', 'a']);
	});

	it('places empty values last in both directions', () =>
	{
		const rows = [{ name: 'a', v: null }, { name: 'b', v: 2 }, { name: 'c' }, { name: 'd', v: 1 }, { name: 'e', v: '' }];
		expect(names(sortRows(rows, 'v'))).toEqual(['d', 'b', 'a', 'c', 'e']);
		expect(names(sortRows(rows, 'v', 'desc'))).toEqual(['b', 'd', 'a', 'c', 'e']);
	});

	it('is stable for equal values in both directions', () =>
	{
		const rows = [{ name: 'a', v: 1 }, { name: 'b', v: 1 }, { name: 'c', v: 0 }, { name: 'd', v: 1 }];
		expect(names(sortRows(rows, 'v'))).toEqual(['c', 'a', 'b', 'd']);
		expect(names(sortRows(rows, 'v', 'desc'))).toEqual(['a', 'b', 'd', 'c']);
	});

	it('supports dot paths and does not mutate the input', () =>
	{
		const rows = [{ name: 'a', user: { age: 30 } }, { name: 'b', user: { age: 20 } }];
		const copy = [...rows];
		expect(names(sortRows(rows, 'user.age'))).toEqual(['b', 'a']);
		expect(rows).toEqual(copy);
	});

	it('returns an empty array for invalid rows', () =>
	{
		// @ts-ignore
		expect(sortRows(null, 'name')).toEqual([]);
	});

	it('compares mixed types as strings', () =>
	{
		expect(compareValues('b', 1)).toBeGreaterThan(0);
		expect(compareValues(true, false)).toBe(1);
	});
});

describe('getNextSortDirection', () =>
{
	it('starts ascending and toggles on the same key', () =>
	{
		expect(getNextSortDirection(null, null, 'name')).toBe('asc');
		expect(getNextSortDirection('name', 'asc', 'name')).toBe('desc');
		expect(getNextSortDirection('name', 'desc', 'name')).toBe('asc');
		expect(getNextSortDirection('name', 'asc', 'age')).toBe('asc');
	});
});

describe('DataTable.sortRows', () =>
{
	/**
	 * Creates a table-like object with a fake list.
	 *
	 * @param {Array<object>} rows
	 * @returns {object}
	 */
	const createTable = (rows) =>
	{
		const list = {
			rows,
			getRows()
			{
				return this.rows;
			},
			setRows(next)
			{
				this.rows = next;
			}
		};

		return { list, sortRows: DataTable.prototype.sortRows };
	};

	it('sorts the list rows and toggles the direction', () =>
	{
		const table = createTable([{ id: 1, name: 'b' }, { id: 2, name: 'a' }, { id: 3, name: 'c' }]);

		table.sortRows('name');
		expect(names(table.list.rows)).toEqual(['a', 'b', 'c']);

		table.sortRows('name');
		expect(names(table.list.rows)).toEqual(['c', 'b', 'a']);

		table.sortRows('id');
		expect(table.list.rows.map((row) => row.id)).toEqual([1, 2, 3]);
	});

	it('exists on the table classes that use sortable headers', async () =>
	{
		const { ScrollableTable } = await import('../../src/components/organisms/lists/scrollable-table.js');
		const { DynamicTable } = await import('../../src/components/organisms/lists/dynamic-table.js');
		expect(typeof ScrollableTable.prototype.sortRows).toBe('function');
		expect(typeof DynamicTable.prototype.sortRows).toBe('function');
	});

	it('does nothing without a list', () =>
	{
		const table = { sortRows: DataTable.prototype.sortRows };
		expect(() => table.sortRows('name')).not.toThrow();
	});
});
