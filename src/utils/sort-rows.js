/**
 * Matches ISO-like date strings (e.g. 2024-01-31 or 2024-01-31T10:00:00Z).
 *
 * @type {RegExp}
 */
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

/**
 * Shared collator for string comparisons. Numeric collation keeps
 * "item 2" before "item 10".
 *
 * @type {Intl.Collator}
 */
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

/**
 * This will check if a value is empty for sorting purposes.
 *
 * @param {*} value
 * @returns {boolean}
 */
const isEmptyValue = (value) =>
{
	return (value === null || value === undefined || value === '' || (typeof value === 'number' && Number.isNaN(value)));
};

/**
 * This will check if a string is a finite numeric string.
 *
 * @param {string} value
 * @returns {boolean}
 */
const isNumericString = (value) =>
{
	return (value.trim() !== '' && Number.isFinite(Number(value)));
};

/**
 * This will get a value from a row by key. Dot paths
 * (e.g. "user.name") are supported.
 *
 * @param {object} row
 * @param {string} key
 * @returns {*}
 */
export const getSortValue = (row, key) =>
{
	if (!row || typeof row !== 'object')
	{
		return undefined;
	}

	if (key in row || typeof key !== 'string' || key.indexOf('.') === -1)
	{
		return row[key];
	}

	return key.split('.').reduce((value, part) => (value && typeof value === 'object') ? value[part] : undefined, row);
};

/**
 * This will convert a value to a comparable primitive.
 *
 * @param {*} value
 * @returns {{type: string, value: *}}
 */
const normalize = (value) =>
{
	if (value instanceof Date)
	{
		return { type: 'number', value: value.getTime() };
	}

	const type = typeof value;
	if (type === 'number' || type === 'bigint')
	{
		return { type: 'number', value: Number(value) };
	}

	if (type === 'boolean')
	{
		return { type: 'number', value: value ? 1 : 0 };
	}

	if (type === 'string')
	{
		if (isNumericString(value))
		{
			return { type: 'number', value: Number(value) };
		}

		if (ISO_DATE_PATTERN.test(value))
		{
			const time = Date.parse(value);
			if (!Number.isNaN(time))
			{
				return { type: 'number', value: time };
			}
		}

		return { type: 'string', value };
	}

	return { type: 'string', value: String(value) };
};

/**
 * This will compare two values in ascending order. Numbers,
 * numeric strings, dates, ISO date strings and booleans are
 * compared numerically; everything else uses a locale aware
 * string comparison. Empty values (null, undefined, '', NaN)
 * are reported as equal to each other.
 *
 * @param {*} a
 * @param {*} b
 * @returns {number}
 */
export const compareValues = (a, b) =>
{
	const left = normalize(a);
	const right = normalize(b);

	if (left.type === 'number' && right.type === 'number')
	{
		return (left.value === right.value) ? 0 : ((left.value < right.value) ? -1 : 1);
	}

	return collator.compare(String(left.value), String(right.value));
};

/**
 * This will return a new array of rows sorted by the key.
 *
 * The sort is stable (rows with equal values keep their
 * current order) and empty values are always placed last,
 * regardless of the direction. The original array is not
 * modified.
 *
 * @param {Array<object>} rows
 * @param {string} key
 * @param {string} [direction='asc'] - 'asc' or 'desc'
 * @returns {Array<object>}
 */
export const sortRows = (rows, key, direction = 'asc') =>
{
	if (!Array.isArray(rows))
	{
		return [];
	}

	const modifier = (direction === 'desc') ? -1 : 1;
	const indexed = rows.map((row, index) => ({ row, index, value: getSortValue(row, key) }));

	indexed.sort((a, b) =>
	{
		const aEmpty = isEmptyValue(a.value);
		const bEmpty = isEmptyValue(b.value);
		if (aEmpty || bEmpty)
		{
			if (aEmpty && bEmpty)
			{
				return a.index - b.index;
			}

			return aEmpty ? 1 : -1;
		}

		const result = compareValues(a.value, b.value) * modifier;
		return (result !== 0) ? result : (a.index - b.index);
	});

	return indexed.map((item) => item.row);
};

/**
 * This will get the next sort direction for a key.
 *
 * Sorting a new key starts ascending; sorting the same
 * key again toggles the direction.
 *
 * @param {string|null} currentKey
 * @param {string|null} currentDirection
 * @param {string} key
 * @returns {string}
 */
export const getNextSortDirection = (currentKey, currentDirection, key) =>
{
	if (currentKey !== key)
	{
		return 'asc';
	}

	return (currentDirection === 'asc') ? 'desc' : 'asc';
};
